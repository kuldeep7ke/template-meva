# TemplateMeva — Blogger XML Developer Integration Guide

For theme developers integrating a Google Blogger (Blogspot) XML template with the
TemplateMeva store and its licensing server.

> **Read this before writing any code.** An earlier version of this guide
> documented a **client-side** anti-piracy script: a `MEVA-` prefix check and a
> footer-element inspector that redirected to `/unlicensed`. **That script is not
> in the shipped product** — `meva-license-key`, `meva-credit`, `meva-link`,
> `meva-footer` and `indexOf('MEVA-')` all return zero occurrences in
> `blogger-llianmeva-template/template/product/`. It is gone, and for good
> reason: a prefix check is bypassed by pasting any string that begins with the
> right four characters. Do not re-add it. Everything below is the real,
> server-side design.

---

## 1. How licensing actually works

The serial is not checked on the buyer's page. It is **bound to the buyer's
domain on the server**, once, and from then on the page only proves *which domain
it is on*.

```
  1.  Buyer purchases.  The server issues a serial:  AB12C-34DEF-56789-0ABCD-EF012
                        (25 hex characters, five groups of five, no prefix)

  2.  Buyer pastes one line into the Licence Activation gadget on their blog:
                          you@example.com AB12C-34DEF-56789-0ABCD-EF012

  3.  On the next page load the guard reads that paste and makes EXACTLY ONE
      server call:   POST /?action=redeem     body: { serial, email, domain, templateId }
      The serial travels in a JSON body, never in a URL. It happens once per
      serial, guarded by sessionStorage.

  4.  From then on, every page load makes:
      GET  /?action=validate&templateId=<id>&domain=<hostname>[&footer=<fp>]
      templateId + domain. Nothing else. No serial. No email.

  5.  The server escalates gradually rather than cutting off at once:
          first site  -> allow
          then        -> warn1 (day 0) -> warn2 -> warn3 -> block
      `valid` stays true even while blocked: the site works, the notice grows.
```

**The trial also runs on the server clock.** A brand-new blog seen for the first
time is given a 7-day trial created server-side. Clearing `localStorage` cannot
move `trialEndsAt` — which is the entire reason the trial is not a local
timestamp.

### Why the domain is the credential

Because the thing being sold is a *site*, not a key. A key can be copied to a
million blogs. A domain cannot. Binding the licence to the domain — and deriving
the blog id from Blogger's own public feed rather than from anything the page
says — is what makes a serial worth buying.

---

## 2. The contract for your template

Four constants, at the top of your guard script:

```js
var API_URL     = 'https://meva-licence-api.kuldeep7ke.workers.dev';
var AUTHOR_URL  = '<your store>/unlicensed';        // see §5 — domain undecided
var TEMPLATE_ID = 'your-repo-name';                 // MUST equal your repo name
var COUNTDOWN   = 60;
```

`TEMPLATE_ID` **must equal your repository name.** The server's template registry
keys on it. A template id it does not recognise validates as nothing.

### 2.1 The serial carrier

A hidden-by-CSS gadget in the off-canvas. Its **HTML Content** box is the carrier:

```xml
<b:section id='Licence Activation' maxwidgets='1' showaddelement='no'>
  <b:widget id='HTML22' locked='false' title='Licence Activation' type='HTML'>
    <b:includable id='main'>
      <div class='lic-hint'>Paste your licence here: you@example.com AB12C-34DEF-56789-0ABCD-EF012</div>
    </b:includable>
  </b:widget>
</b:section>
```

```css
#HTML22 { display: none; }
body#layout #HTML22 { display: block; }   /* visible only in Blogger's Layout editor */
```

Two rules that are easy to get wrong and both fail silently:

- **Do not put Blogger's `hidden` attribute on the widget.** The guard reads the
  paste from the *rendered* page; a hidden widget never renders, so activation
  never fires and nothing tells you why.
- **Do not rename `#HTML22`.** The reader selects `#HTML22 .widget-content`.

### 2.2 Reading the paste

```js
function readPastedLicence() {
  var el = document.querySelector('#HTML22 .widget-content');
  if (!el) { return null; }
  var t = el.textContent || '';
  // email is OPTIONAL; the serial alone on the line works
  var m = t.match(/([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})?[ \t]*([0-9A-Fa-f]{5}(-[0-9A-Fa-f]{5}){4})/);
  if (!m) { return null; }
  return { email: (m[1] || '').trim(), serial: (m[2] || '').toUpperCase() };
}
```

The regex is deliberately forgiving about the email and strict about the serial.
Serial groups are `[0-9A-Fa-f]` only — `G` through `Z` never appear.

### 2.3 Redeem, once, and only from the owner's own screen

```js
fetch(API_URL + '?action=redeem', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({
    serial: pasted.serial,
    email:  pasted.email,
    domain: location.hostname,
    templateId: TEMPLATE_ID
  })
});
```

**Gate it to your dashboard before anything else.** The body carries the buyer's
serial *and* their email, so the audience matters more than the payload:

```js
function initLicenceGadget() {
  if (document.body.id !== 'layout') { return; }   // owner screen only
  var pasted = readPastedLicence();
  if (!pasted) { return; }
  // ...
}
```

Without that line this ships a real leak, and it is subtle. The paste has to sit
in the **rendered** page for the guard to read it, and Blogger's `hidden='true'`
attribute is what stops a widget rendering — so the carrier is deliberately
un-hidden, the serial is in the served HTML, and a redeem called from your
ordinary page-load path fires **for every visitor of the buyer's blog**. Each one
posts that buyer's email to your endpoint, once per session. `sessionStorage` caps
the repetition and does nothing about the audience, which is exactly why it reads
as defensible in review.

Once per serial, as well:

```js
var key = 'meva_redeemed_' + TEMPLATE_ID + '_' + pasted.serial;
try { if (sessionStorage.getItem(key) === '1') { return; } } catch (e) {}
// ... on a successful response:
try { sessionStorage.setItem(key, '1'); } catch (e) {}
```

Both together. The session key is not a substitute for the screen gate — it
answers "how often", and only the gate answers "by whom".

### 2.4 Validate, by domain only

```js
var url = API_URL + '?action=validate'
        + '&templateId=' + encodeURIComponent(TEMPLATE_ID)
        + '&domain='     + encodeURIComponent(location.hostname)
        + '&footer='     + encodeURIComponent(copyrightFingerprint());
```

`footer` is a bounded (512-char) fingerprint of your rendered copyright line, and
`credit=missing` reports that your trial tag is gone. Both help the server tell
"trial running" from "trial stripped", and both are non-identifying.

### 2.5 Escalation

Read the server's verdict and let the server own the outcome:

| Server says | Do |
|-------------|-----|
| `redirectUrl` present | `window.location.replace(data.redirectUrl)` |
| blocked, no redirect | show your own full-screen notice, then `AUTHOR_URL` after `COUNTDOWN` seconds |
| warn / trial | render the non-blocking notice, keep the site usable |

**Fail open on silence.** Block only on an explicit refusal. A network timeout
must not take a paying customer's site down — that failure mode is what
`blogger-license-system`'s fail-open policy exists to prevent.

---

## 3. Credential rules — not negotiable

The licensing model is sold on this, and the store's own gate
(`npm run registry` in `template-meva`) fails the build if any of these appear:

- The buyer's **email and serial must never** appear in the served page markup,
  the template XML, the URL of any request, or a `data-` attribute.
- `action=validate` carries **templateId, domain and the footer fingerprint
  only**. Never a serial, never an email.
- The only call that carries a serial is `action=redeem`, in a POST body — never
  in a URL, because URLs end up in logs and referrers.
- Do not introduce `BUYER_EMAIL_HERE`, `BUYER_SERIAL_HERE`, `data-email` or
  `data-serial`. They are rejected by review, not merely discouraged.
- Activation is **server-side**: the operator registers the domain against the
  licence. Never trust a client-side check.

---

## 4. Before you ship

- [ ] `TEMPLATE_ID` equals your repository name, exactly.
- [ ] Serial regex is `[0-9A-Fa-f]{5}(-[0-9A-Fa-f]{5}){4}`.
- [ ] `redeem` posts a JSON body and is guarded to once per serial.
- [ ] `redeem` only runs on the owner's dashboard (`document.body.id === 'layout'`), so a visitor's page load never sends that buyer's serial and email. This is the one that is easy to ship broken, because the carrier must stay in the *rendered* page for the guard to read it — see §2.3.
- [ ] `validate` sends `templateId` + `domain` + `footer` and nothing sensitive.
- [ ] The gadget is hidden by CSS, **not** by the Blogger `hidden` attribute.
- [ ] A network failure leaves the site working.
- [ ] Escalation is gradual, and the server's `redirectUrl` wins over yours.
- [ ] `AUTHOR_URL` points at the domain you actually serve from (§5).
- [ ] `X-Frame-Options` is not `DENY` on the demo blog, or `/preview/:slug` cannot frame it.

---

## 5. Open: which domain?

The shipped template has `AUTHOR_URL = 'https://mevatemplates.com/unlicensed'`
baked in. The storefront is configured as `https://templatemeva.com`. **These are
different domains and one of them is wrong.** Until that is settled, an unlicensed
blog redirects visitors somewhere that is not this store.

Fixing it means changing `AUTHOR_URL` in the shipped XML, which is a change to
`blogger-llianmeva-template` and needs its own change ID there — not an edit to
this repository.

---

## 6. Preparing demo blogs for the responsive preview

The store embeds demo blogs in an iframe at `/preview/:slug`, so a demo must be
framable and must not serve a separate mobile theme.

1. **Enable HTTPS.** Blogger Dashboard > Settings > HTTPS: turn on both **HTTPS
   Availability** and **HTTPS Redirect**. Mixed content is blocked in a framed
   preview.
2. **Force desktop rendering on mobile viewports.** Theme > Customize dropdown >
   **Mobile settings** > **Desktop** > Save. Blogger's legacy mobile template
   otherwise serves a fixed-width page that makes the 375px preview misleading.
3. **Add sample content.** Publish 4–6 posts tagged across a few labels so
   sliders, mega menus, and in-feed ad slots populate during buyer demos.
4. **Verify framing.** Load the demo directly and confirm nothing sets
   `X-Frame-Options: DENY`. If it cannot be framed, the store shows a fallback
   overlay with a direct-open link.
5. **Point the store at it.** Set `liveDemoUrl` on the template, and add each
   concept's URL to that template's `demos[].demoUrl`.
