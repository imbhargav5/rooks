module.exports={
  "title": "Rooks",
  "tagline": "Collection of React hooks ⚓ for everyone. ",
  "url": "https://react-hooks.org",
  "baseUrl": "/",
  "organizationName": "imbhargav5",
  "projectName": "rooks",
  "scripts": [
    {
      src: "https://buttons.github.io/buttons.js",
      async: true,
      defer: true
    }
  ],
  "favicon": "/img/rooks-logo.png",
  "customFields": {
    "users": [
      {
        "caption": "User1",
        "image": "/img/undraw_open_source.svg",
        "infoLink": "https://www.facebook.com",
        "pinned": true
      }
    ],
    "repoUrl": "https://github.com/imbhargav5/rooks"
  },
  "onBrokenLinks": "log",
  "presets": [
    [
      "@docusaurus/preset-classic",
      {
        "docs": {
          "showLastUpdateAuthor": true,
          "showLastUpdateTime": true,
          "path": "docs",
          "sidebarPath": require.resolve("./sidebars.json")
        },
        "blog": {
          "path": "blog"
        },
        "theme": {
          "customCss": [require.resolve("./src/css/customTheme.css")]
        }
      }
    ]
  ],
  "plugins": [],
  "themeConfig": {
    "navbar": {
      "title": "Rooks",
      logo: {
        alt: 'Site Logo',
        src: '/img/rooks-logo.png',
        href: '/', // Default to `siteConfig.baseUrl`.
        target: '_self', // By default, this value is calculated based on the `href` attribute (the external link will open in a new tab, all others in the current one).
      },
      "items": [
        {
          "to": "docs/",
          "label": "Documentation",
          "position": "left"
        },
        {
          "href": "https://github.com/imbhargav5/rooks",
          "label": "Github",
          "position": "left"
        },
        {
          "href": "https://stories.react-hooks.org",
          "label": "Storybook",
          "position": "left"
        },
        {
          "to": "/help",
          "label": "Help",
          "position": "left"
        },
        {
          type: 'docsVersionDropdown',
          "position": "right",
          dropdownItemsBefore: [],
          dropdownItemsAfter: [{to: '/versions', label: 'All versions'}],
        }
      ]
    },
    "image": "img/undraw_online.svg",
    "footer": {
      "links": [ {
        // Label of the section of these links
        title: 'Docs',
        items: [
          {
            // Label of the link
            label: 'All in one',
            // Client-side routing, used for navigating within the website.
            // The baseUrl will be automatically prepended to this value.
            to: 'docs/',
          },
          {
            label: 'use-counter',
            to: 'docs/use-counter/',
          },
          {
            label: 'use-did-mount',
            to: 'docs/use-did-mount/',
          },
        ],
      },{
        // Label of the section of these links
        title: 'Community',
        items: [
          {
            // Label of the link
            label: 'Stack overflow',
            // Client-side routing, used for navigating within the website.
            // The baseUrl will be automatically prepended to this value.
            to: 'https://stackoverflow.com/questions/tagged/rooks',
          },
          {
            label: 'Project Chat',
            to: 'http://spectrum.chat/rooks',
          },
          {
            label: 'Twitter',
            to: 'https://twitter.com/imbhargav5',
          },
        ],
      }, {
        title: 'More',
        items: [
          {
            label: 'Github',
            to: 'https://github.com/imbhargav5/rooks',
          },
          {
            html: `
            <!-- Place this tag where you want the button to render. -->
<a class="github-button" href="https://github.com/imbhargav5/rooks" data-icon="octicon-star" aria-label="Star imbhargav5/rooks on GitHub">Star</a>
          `
          }
        ]
      }],
      "copyright": "MIT© 2020 Bhargav Ponnapalli",
      "logo": {}
    }
  }
}