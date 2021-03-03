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
    },{
      src:"https://cdn.splitbee.io/sb.js",
      async: true
    }, {
      src: "https://cdn.jsdelivr.net/npm/@widgetbot/crate@3",
      async: true,
      defer: true,      
    }
  ],
  "favicon": "https://github.com/imbhargav5/rooks/raw/master/.github/assets/favicon-24x24.png",
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
        src: 'https://github.com/imbhargav5/rooks/raw/master/.github/assets/icon.png',
        href: '/', // Default to `siteConfig.baseUrl`.
        target: '_self', // By default, this value is calculated based on the `href` attribute (the external link will open in a new tab, all others in the current one).
      },
      "items": [
        {
          "to": "/docs/getting-started/",
          "label": "Getting Started",
          "position": "left"
        },
        {
          "to": "/docs/",
          "label": "Documentation",
          "position": "left"
        },
        {
          "href": "https://github.com/imbhargav5/rooks",
          "label": "Github",
          "position": "right"
        },
        {
          "href": "/docs/hooks-list/",
          "label": "Hooks List",
          "position": "left"
        },
        {
          "href": "/docs/motivation/",
          "label": "Motivation",
          "position": "right"
        },
        // {
        //   "to": "/help",
        //   "label": "Help",
        //   "position": "left"
        // },
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
//           {
//             html: `
//             <!-- Place this tag where you want the button to render. -->
// <a class="github-button" href="https://github.com/imbhargav5/rooks" data-icon="octicon-star" aria-label="Star imbhargav5/rooks on GitHub">Star</a>
//           `
//           },
          {
            html : `
            <a href="https://www.netlify.com">
              <img src="https://www.netlify.com/img/global/badges/netlify-color-accent.svg" alt="Deploys by Netlify" />
            </a>`
          },
          {
            html : `
           <a href="https://splitbee.io?ref=badge">
             <img src="https://splitbee-cdn.fra1.cdn.digitaloceanspaces.com/static/badge/splitbee-badge.svg" alt="Analytics by Splitbee.io" /> 
           </a>`
          }
        ]
      }],
      "copyright": "MIT© 2020 Bhargav Ponnapalli",
      "logo": { }
    },
    algolia: {
      apiKey: process.env.ALGOLIA_API_KEY,
      indexName: 'react-hooks',
      // Optional: see doc section bellow,
      contextual: true,
      // searchParameters: {
      //   facetFilters: ["type:$TYPE"]
      // }

      //... other Algolia params
    },
  }
}
