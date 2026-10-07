import type { DocArticle } from '../types';

export const DOCS_ARTICLES: DocArticle[] = [
  {
    id: 'installation-guide',
    slug: 'installation',
    title: 'How to Install a Blogger Template (Complete Guide)',
    category: 'Installation',
    excerpt: 'Step-by-step walkthrough to extract, backup, and upload your TemplateMeva Blogger XML template without losing any blog posts or widgets.',
    readingTime: '4 min read',
    updatedAt: '2026-09-20',
    steps: [
      {
        stepNumber: 1,
        title: 'Extract the Downloaded ZIP File',
        content: 'After downloading the template package (7-Day Trial or Premium), extract the `.zip` archive on your computer. Inside you will find the main template file ending in `.xml` (e.g. `spotlight-template.xml`), alongside the documentation folder and demo content.',
        tip: 'Ensure you extract the ZIP first; do not upload the .zip file directly to Blogger.'
      },
      {
        stepNumber: 2,
        title: 'Backup Your Existing Blogger Theme',
        content: 'Before making any changes, always backup your current template. Go to your Blogger Dashboard > click "Theme" in the left sidebar > click the down arrow icon next to the "CUSTOMIZE" button > select "Backup" > click "Download".',
        tip: 'Keep this backup file safe in case you want to revert your previous design.'
      },
      {
        stepNumber: 3,
        title: 'Restore / Upload the New XML Template',
        content: 'In the same dropdown menu next to the "CUSTOMIZE" button, select "Restore" > click "Upload" > navigate to the extracted folder and select your `.xml` file. Wait a few seconds for Blogger to validate and apply the theme.',
        codeSnippet: `Blogger Dashboard -> Theme -> Dropdown (next to Customize) -> Restore -> Upload -> Select your-template.xml`
      },
      {
        stepNumber: 4,
        title: 'Configure Mobile Theme Settings',
        content: 'To ensure the responsive design functions perfectly on mobile devices: In Blogger Theme page > click the arrow dropdown > click "Mobile settings" > choose "Desktop" (or "Custom" if available) and click "Save". This tells Blogger not to override our responsive design with Google\'s legacy mobile template.',
        warning: 'If you skip this step, mobile visitors will see Blogger\'s old default mobile theme instead of the new design.'
      }
    ]
  },
  {
    id: 'activation-guide',
    slug: 'activation',
    title: 'Template Activation & Licence Verification',
    category: 'Activation',
    excerpt: 'Activate your lifetime licence in about thirty seconds: paste your serial into the Licence Activation gadget on your blog. Verification runs server-side against your blog.',
    readingTime: '3 min read',
    updatedAt: '2026-10-07',
    steps: [
      {
        stepNumber: 1,
        title: 'Find your serial',
        content: 'When you purchase a template, we send your serial to your purchase email. It is twenty-five hexadecimal characters in five groups of five, with no prefix and no letters outside A-F.',
        codeSnippet: 'AB12C-34DEF-56789-0ABCD-EF012',
        tip: 'Serials are not case-sensitive. They look similar to an order reference, so paste the whole thing rather than the nearest-looking string.'
      },
      {
        stepNumber: 2,
        title: 'Open the Licence Activation gadget',
        content: 'In your Blogger dashboard, click "Layout" in the left menu. Scroll to the Licence Activation gadget — it sits in the off-canvas area, and it is hidden on the published site by design, so you will only ever see it here. Click its pencil, then choose "Edit HTML".',
        tip: 'If you cannot find the gadget, it may be collapsed. Widen the Layout page or use the search in the dashboard rather than Theme > Edit HTML — pasting the serial into the theme source does nothing.'
      },
      {
        stepNumber: 3,
        title: 'Paste your serial',
        content: 'In the HTML Content box, paste your serial and nothing else, then save. Your serial is the only thing needed here — we already have your email and name on record from your purchase, and your blog\'s identity is read from your own site, so there is nothing for you to type twice.',
        codeSnippet: 'AB12C-34DEF-56789-0ABCD-EF012',
        tip: 'Paste the serial on its own. If you have an older note with your email written in front of it, the serial alone still works — just use the serial by itself.',
        warning: 'Do not add the widget\'s Blogger "hidden" attribute. The template reads your paste from the rendered page, and a hidden widget never renders — activation would silently never fire.'
      },
      {
        stepNumber: 4,
        title: 'Reload your blog',
        content: 'Reload your site once while you are still in your Blogger dashboard. The template sends your serial to our licensing server a single time, which binds the licence to your blog. From then on it verifies by your blog alone on each page load — there is nothing to re-upload and nothing to reinstall.',
        tip: 'The first reload after saving can take a couple of seconds: the template is talking to the server rather than checking a string locally.'
      },
      {
        stepNumber: 5,
        title: 'Remove or customise the footer credits',
        content: 'Once the licence is active, the trial restrictions and the footer credit check are both disabled. You can edit the copyright line and links freely without triggering a redirect.',
        warning: 'A licence is bound to ONE blog. Activating on a second blog needs its own serial — the same one will not unlock it, because each serial is generated for a single blog ID.'
      }
    ]
  },
  {
    id: 'customization-guide',
    slug: 'customization',
    title: 'Customizing Header, Logo, and Mega Menu',
    category: 'Customization',
    excerpt: 'Detailed instructions on uploading your custom logo, setting up favicon, and structuring multi-level dropdowns and mega menu tags.',
    readingTime: '5 min read',
    updatedAt: '2026-09-15',
    steps: [
      {
        stepNumber: 1,
        title: 'Upload Your Header Logo',
        content: 'Go to Blogger Dashboard > Layout > find the "Header / Logo" widget > click Edit. Choose "Upload image from computer" > select "Instead of title and description" > click Save.',
        tip: 'Recommended logo dimensions: 250px by 50px PNG or SVG with transparent background.'
      },
      {
        stepNumber: 2,
        title: 'Configuring the Main Menu & Dropdowns',
        content: 'In Layout > click Edit on the "Main Menu (LinkList)" widget. You can add regular links, sub-menus, and mega menus using standard formatting rules:',
        codeSnippet: `Single link: Home -> /
Dropdown parent: Features -> #
Sub-item 1: _Web Design -> /search/label/WebDesign
Sub-item 2: _SEO Tips -> /search/label/SEO
Mega Menu by Label: Mega -> mega:Technology`
      },
      {
        stepNumber: 3,
        title: 'Enabling Dark Mode Switcher',
        content: 'All our modern templates feature built-in Dark Mode. In Layout > find "Header Options" or "Theme Settings" widget > ensure the Dark Mode toggle is set to "Enabled".',
        tip: 'The theme remembers user preference automatically via localStorage.'
      }
    ]
  },
  {
    id: 'adsense-guide',
    slug: 'adsense',
    title: 'AdSense & Monetization Setup Guide',
    category: 'Customization',
    excerpt: 'Maximize your advertising earnings with pre-styled responsive ad slots for Google AdSense and affiliate networks.',
    readingTime: '4 min read',
    updatedAt: '2026-09-10',
    steps: [
      {
        stepNumber: 1,
        title: 'Header Banner (728x90 / Responsive)',
        content: 'Go to Blogger Layout > find the "Header Ad 728x90" widget. Paste your responsive AdSense display ad code or affiliate HTML banner and click Save.',
      },
      {
        stepNumber: 2,
        title: 'In-Article Auto Placements',
        content: 'Our templates come with built-in hooks for inserting ads below the article title, in the middle of long posts, and after the post content before comments. Simply paste your AdSense script into the "Post Middle Ad" widget.',
        tip: 'AdSense In-article ads blend naturally with article typography and yield the highest RPM.'
      }
    ]
  },
  {
    id: 'troubleshooting-guide',
    slug: 'troubleshooting',
    title: 'Troubleshooting & Frequently Asked Questions',
    category: 'Troubleshooting',
    excerpt: 'Quick fixes for common Blogger layout glitches, widget saving errors, and redirection issues.',
    readingTime: '4 min read',
    updatedAt: '2026-09-25',
    steps: [
      {
        stepNumber: 1,
        title: 'Error: "Your theme could not be saved"',
        content: 'This error occurs if you try pasting XML code with HTML special characters or if Blogger temporary server cache is locked. Solution: Always use Theme > Restore > Upload XML rather than copy-pasting code into the manual editor.',
        warning: 'Do not use manual copy-paste inside Edit HTML unless specifically instructed.'
      },
      {
        stepNumber: 2,
        title: 'Why is my blog redirecting to the Unlicensed page?',
        content: 'If you are using a Free Trial version and altered or deleted the footer copyright attribution links, the integrity check triggers an automatic redirect to the /unlicensed page. To resolve this, restore the original footer credit widget or activate to unlock 100% white-label freedom.',
        tip: 'Premium licenses provide full copyright freedom and zero redirects.'
      },
      {
        stepNumber: 3,
        title: 'Widgets or Menus Missing After Upload',
        content: 'If your newly uploaded template looks empty, make sure you have at least 3-4 published blog posts with Labels assigned (e.g. Technology, Fashion). Modern template widgets load content dynamically using Blogger labels.',
      }
    ]
  }
];
