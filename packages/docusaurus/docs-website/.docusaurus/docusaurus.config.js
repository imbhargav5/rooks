export default {
  "title": "Rooks",
  "tagline": "Collection of React hooks ⚓ for everyone. ",
  "url": "https://react-hooks.org",
  "baseUrl": "/",
  "organizationName": "imbhargav5",
  "projectName": "rooks",
  "scripts": [
    "https://buttons.github.io/buttons.js"
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
          "path": "../docs",
          "sidebarPath": "/Users/bhargavponnapalli/opensource/rooks/packages/docusaurus/docs-website/sidebars.json"
        },
        "blog": {
          "path": "blog"
        },
        "theme": {
          "customCss": "/Users/bhargavponnapalli/opensource/rooks/packages/docusaurus/docs-website/src/css/customTheme.css"
        }
      }
    ]
  ],
  "plugins": [],
  "themeConfig": {
    "navbar": {
      "title": "Rooks",
      "logo": {
        "alt": "Site Logo",
        "src": "/img/rooks-logo.png",
        "href": "https://react-hooks.org/",
        "target": "_self"
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
          "label": "Version",
          "to": "docs",
          "position": "right",
          "items": [
            {
              "label": "v3.7.0",
              "to": "docs/",
              "activeBaseRegex": "docs/(?!3.5.0|v3.5.1|v3.6.0|v3.7.0|next)"
            },
            {
              "label": "v3.6.0",
              "to": "docs/v3.6.0/"
            },
            {
              "label": "v3.5.1",
              "to": "docs/v3.5.1/"
            },
            {
              "label": "3.5.0",
              "to": "docs/3.5.0/"
            },
            {
              "label": "Master/Unreleased",
              "to": "docs/next/",
              "activeBaseRegex": "docs/next/(?!support|team|resources)"
            }
          ]
        }
      ],
      "hideOnScroll": false
    },
    "image": "img/undraw_online.svg",
    "footer": {
      "links": [],
      "copyright": "MIT© 2020 Bhargav Ponnapalli",
      "logo": {},
      "style": "light"
    },
    "colorMode": {
      "defaultMode": "light",
      "disableSwitch": false,
      "respectPrefersColorScheme": false,
      "switchConfig": {
        "darkIcon": "🌜",
        "darkIconStyle": {},
        "lightIcon": "🌞",
        "lightIconStyle": {}
      }
    },
    "docs": {
      "versionPersistence": "localStorage"
    },
    "metadatas": [],
    "prism": {
      "additionalLanguages": []
    }
  },
  "onDuplicateRoutes": "warn",
  "themes": [],
  "titleDelimiter": "|",
  "noIndex": false
};