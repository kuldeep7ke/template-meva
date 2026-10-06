# TemplateMeva — Blogger XML Developer Integration Guide

For theme developers integrating a Google Blogger (Blogspot) XML template with the TemplateMeva store, the licensing check, and the `/unlicensed` notice flow.

---

## 1. How the trial and its enforcement work

Trial users may use the template freely as long as the footer attribution stays intact:

```html
<!-- Inside the Blogger XML footer area -->
<div id='meva-footer'>
  <p>Copyright &#169; <span id='current-year'>2026</span> <data:blog.title/>. All Rights Reserved.</p>
  <p id='meva-credit'>
    Distributed by <a href='https://templatemeva.com/' id='meva-link' rel='dofollow' target='_blank'>TemplateMeva</a>
  </p>
</div>
```

If that attribution is deleted, hidden, or its `href` is changed, the verification script redirects visitors to the store's notice page:

```
https://templatemeva.com/unlicensed?domain=<blog-host>&reason=<code>&template=<slug>
```

The notice page reads three query parameters:

| Param | Example | Purpose |
| :--- | :--- | :--- |
| `domain` | `usersblog.blogspot.com` | Displayed as the flagged blog |
| `reason` | `trial_expired`, `invalid_key`, `element_deleted`, `element_hidden`, `href_tampered` | Selects the headline and explanation |
| `template` | `spotlight` | Template slug shown in the notice |

The `element_*` codes and `href_tampered` all resolve to the attribution-removed message. An unrecognized or missing `reason` falls back to the generic trial-expired copy, so a malformed call still lands on a sensible page rather than a broken one.

---

## 2. Anti-tamper and license script

Add this before `</body>` in your trial XML. It is deliberately dependency-free and readable.

```xml
<script type='text/javascript'>
//<![CDATA[
(function() {
  window.addEventListener('DOMContentLoaded', function() {
    // 1. A valid key disables all enforcement
    var licenseWidget = document.getElementById('meva-license-key');
    var licenseKey = licenseWidget ? licenseWidget.innerText.trim() : '';

    if (licenseKey && licenseKey.toUpperCase().indexOf('MEVA-') === 0) {
      return; // Licensed copy: full white-label freedom
    }

    // 2. Trial attribution check
    function verifyAttribution() {
      var creditContainer = document.getElementById('meva-credit');
      var creditLink = document.getElementById('meva-link');
      var storeUrl = 'https://templatemeva.com/unlicensed';

      if (!creditContainer || !creditLink) {
        redirectToNotice(storeUrl, 'element_deleted');
        return;
      }

      var style = window.getComputedStyle(creditContainer);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0' || parseInt(style.height) === 0) {
        redirectToNotice(storeUrl, 'element_hidden');
        return;
      }

      var href = creditLink.getAttribute('href') || '';
      if (href.indexOf('templatemeva.com') === -1) {
        redirectToNotice(storeUrl, 'href_tampered');
        return;
      }
    }

    function redirectToNotice(base, reason) {
      var currentHost = window.location.hostname;

      // Never redirect inside the Blogger dashboard preview
      if (currentHost.indexOf('blogger.com') !== -1) return;

      // Replace 'spotlight' with this template's store slug
      var target = base
        + '?domain=' + encodeURIComponent(currentHost)
        + '&reason=' + reason
        + '&template=' + encodeURIComponent('spotlight');

      window.location.replace(target);
    }

    verifyAttribution();
    setInterval(verifyAttribution, 8000);
  });
})();
//]]>
</script>
```

### Before shipping, check these

- **Escape the href safely.** `getAttribute('href')` returns `null` on a malformed attribute; the version above falls back to an empty string so the comparison cannot throw.
- **Do not run enforcement on the store's own domain.** If you mirror a demo under your own domain that links back to the store, the check will pass on `href` but still fire on other rules. Guard with a hostname allowlist if you host mirrors.
- **The 8-second interval is not tamper-proof.** A determined user can disable timers or strip the script. Treat this as a deterrent that recovers revenue from casual removals, not as DRM.
- **Disclose the behavior.** Attribution requirements belong in the product page and trial terms, not just in code.

---

## 3. Premium license verification

1. Ship a license widget in the Blogger Layout:

   ```xml
   <b:section id='meva-license-section' maxwidgets='1' showaddelement='no'>
     <b:widget id='HTML999' locked='false' title='Theme License Key' type='HTML'>
       <b:includable id='main'>
         <div id='meva-license-key' style='display:none;'><data:content/></div>
       </b:includable>
     </b:widget>
   </b:section>
   ```

2. When the customer pastes their key (`MEVA-8941-K92X-2026`) into that widget:
   - the anti-tamper check detects the `MEVA-` prefix and exits early,
   - all trial limitations are bypassed,
   - footer text becomes fully editable with zero redirects.

This client-side prefix check is intentionally simple. For real enforcement, have the script verify the key against your licensing endpoint and only treat it as valid on a confirmed response — a prefix match alone can be forged.

The store's `/unlicensed` page has a matching key box that validates the `MEVA-XXXX-XXXX-XXXX` shape client-side. It is a UX affordance only; wire it to your licensing backend before launch.

---

## 4. Preparing demo blogs for the responsive preview

The store embeds demo blogs in an iframe at `/preview/:slug`, so the demo must be framable and must not serve a separate mobile theme.

1. **Enable HTTPS.** Blogger Dashboard > Settings > HTTPS: turn on both **HTTPS Availability** and **HTTPS Redirect**. Mixed content is blocked in framed previews.
2. **Force desktop rendering on mobile viewports.** Theme > Customize dropdown > **Mobile settings** > **Desktop** > Save. Blogger's legacy mobile template otherwise serves a fixed-width page that makes the 375px preview misleading.
3. **Add sample content.** Publish 4–6 posts tagged across a few labels (`Technology`, `Fashion`, `Editorial`, `Viral`) so sliders, mega menus, and in-feed ad slots populate during buyer demos.
4. **Verify framing.** Load the demo directly and confirm nothing sets `X-Frame-Options: DENY`. If the demo cannot be framed, the store shows a fallback overlay with a direct-open link — verify that path looks right for your brand.
5. **Point the store at it.** Set `liveDemoUrl` on the template, and add each concept's URL to that template's `demos[].demoUrl`.