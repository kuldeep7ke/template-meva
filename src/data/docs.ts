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
    title: 'Template Activation & License Key Verification',
    category: 'Activation',
    excerpt: 'Learn how to activate your premium license key, verify your custom domain, and remove trial restrictions and footer credit locks.',
    readingTime: '3 min read',
    updatedAt: '2026-09-22',
    steps: [
      {
        stepNumber: 1,
        title: 'Locate Your License Key',
        content: 'When you purchase a Premium template from our store or Gumroad, your unique License Key is sent to your purchase email and displayed on your order confirmation page. It looks like: `MEVA-XXXX-XXXX-XXXX`.',
        tip: 'Check your spam or promotions folder if you do not see the receipt email within 5 minutes.'
      },
      {
        stepNumber: 2,
        title: 'Open Blogger Layout & License Widget',
        content: 'Navigate to your Blogger Dashboard > click "Layout" on the left menu. Look at the top or bottom for the widget named "⚙️ Theme Activation / License". Click "Edit".',
        tip: 'In some templates, the license key is inserted via Theme > Edit HTML inside the <script id="meva-license"> tag.'
      },
      {
        stepNumber: 3,
        title: 'Paste License Key & Save',
        content: 'Paste your License Key into the input box and click "Save". Your template will instantly connect to our Cloudflare edge licensing server to validate your domain and unlock full features.',
        codeSnippet: `// Or inside Theme -> Edit HTML:
<script type="text/javascript">
  /*<![CDATA[*/
  const MEVA_LICENSE_CONFIG = {
    licenseKey: "MEVA-YOUR-PURCHASED-KEY",
    autoUpdate: true
  };
  /*]]>*/
</script>`
      },
      {
        stepNumber: 4,
        title: 'Remove or Customize Footer Credits',
        content: 'Once activated, trial watermark protections are automatically disabled. You can now edit the copyright text and links in the "Footer Copyright" widget in your Layout panel without triggering redirects.',
        tip: 'If you are using the Free Trial version, footer credits must remain untouched, otherwise the anti-piracy script redirects visitors to the /unlicensed notice page.'
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
        content: 'If you are using a Free Trial version and altered or deleted the footer copyright attribution links, the integrity check triggers an automatic redirect to the /unlicensed page. To resolve this, restore the original footer credit widget or purchase an official Premium License Key to unlock 100% white-label freedom.',
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
