import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';
import HomeSandbox from '../../docs/home-sandbox.md';
import GettingStarted from '../../docs/getting-started.md';

const features = [
  {
    content: (
      <p>
        Rooks is extremely well documented with{' '}
        <strong>use-cases and examples</strong> described thoroughly.
      </p>
    ),
    image: (
      <svg
        className="w-24 h-24"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        ></path>
      </svg>
    ),
    imageAlign: 'top',
    title: 'Well Documented',
  },
  {
    content: (
      <p>
        Rooks comes with a plethora of hooks that can help you scaffold an app
        very quickly. You can select cherry-pick the hooks you want or grab the
        whole library. It's really upto you.
      </p>
    ),
    image: (
      <svg
        className="w-24 h-24"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 9l4-4 4 4m0 6l-4 4-4-4"
        ></path>
      </svg>
    ),
    imageAlign: 'top',
    title: 'Choose your hooks',
  },
  {
    content: (
      <p>ESM, CommonJS or UMD. All platforms and codebases are supported.</p>
    ),
    image: (
      <svg
        className="w-24 h-24"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        ></path>
      </svg>
    ),
    imageAlign: 'top',
    title: 'Supports ESM',
  },
  {
    content: (
      <p>
        Hooks in the Rooks library are very <strong>versatile</strong> and easy
        to customise at the same time.
      </p>
    ),
    image: (
      <svg
        className="w-24 h-24"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        ></path>
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        ></path>
      </svg>
    ),
    imageAlign: 'top',
    title: 'Flexible',
  },
];

const otherLibraries = [
  // {
  //   content: 'Official React bindings for Redux',
  //   title: 'React-Redux',
  //   link: 'https://react-redux.js.org',
  //   image: (
  //     <svg
  //       xmlns="http://www.w3.org/2000/svg"
  //       ariaHidden="true"
  //       data-icon="external-link-square-alt"
  //       data-prefix="fas"
  //       viewBox="0 0 448 512"
  //     >
  //       <path d="M448 80v352c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V80c0-26.51 21.49-48 48-48h352c26.51 0 48 21.49 48 48zm-88 16H248.029c-21.313 0-32.08 25.861-16.971 40.971l31.984 31.987L67.515 364.485c-4.686 4.686-4.686 12.284 0 16.971l31.029 31.029c4.687 4.686 12.285 4.686 16.971 0l195.526-195.526 31.988 31.991C358.058 263.977 384 253.425 384 231.979V120c0-13.255-10.745-24-24-24z" />
  //     </svg>
  //   )
  // },
  // {
  //   content:
  //     'The official, opinionated, batteries-included toolset for efficient Redux development',
  //   title: 'Redux Toolkit',
  //   link: 'https://redux-toolkit.js.org',
  //   image: (
  //     <svg
  //       xmlns="http://www.w3.org/2000/svg"
  //       aria-hidden="true"
  //       data-icon="external-link-square-alt"
  //       data-prefix="fas"
  //       viewBox="0 0 448 512"
  //     >
  //       <path d="M448 80v352c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V80c0-26.51 21.49-48 48-48h352c26.51 0 48 21.49 48 48zm-88 16H248.029c-21.313 0-32.08 25.861-16.971 40.971l31.984 31.987L67.515 364.485c-4.686 4.686-4.686 12.284 0 16.971l31.029 31.029c4.687 4.686 12.285 4.686 16.971 0l195.526-195.526 31.988 31.991C358.058 263.977 384 253.425 384 231.979V120c0-13.255-10.745-24-24-24z" />
  //     </svg>
  //   )
  // }
];

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      title={`${siteConfig.title} - A super awesome collection of hooks for your React apps.`}
      description="A super awesome collection of hooks for your React apps."
    >
      <header className={classnames('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={classnames(
                'button button--secondary button--lg',
                styles.getStarted
              )}
              to={useBaseUrl('docs/getting-started')}
            >
              Get Started
            </Link>
            <Link
              className={classnames(
                'button button--secondary button--lg',
                styles.getStarted
              )}
              to={useBaseUrl('docs/useMouse')}
            >
              Checkout useMouse
            </Link>
            <Link
              className={classnames(
                'button button--secondary button--lg',
                styles.getStarted
              )}
              to={useBaseUrl('docs/useDidMount')}
            >
              Checkout useDidMount
            </Link>
          </div>
          <div className={styles.homeSandbox}>
            <HomeSandbox />
          </div>
        </div>
      </header>

      <main>
        {features && features.length && (
          <section className={styles.features}>
            <div className={classnames('container', styles.featureBlock)}>
              <div className="row">
                {features.map(({ image, title, content }, idx) => (
                  <div key={idx} className={classnames('col', styles.feature)}>
                    {image && (
                      <div
                        className={`text--center grid place-items-center ${styles.blockImage}`}
                      >
                        {image}
                      </div>
                    )}
                    <h2 className={`text--center ${styles.featureTitle}`}>
                      {title}
                    </h2>
                    <div className={styles.featureContent}>{content}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
        {otherLibraries && otherLibraries.length ? (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                <div className="col">
                  <h2 className={`text--center ${styles.secondTitle}`}>
                    Other Libraries from the Rooks Team
                  </h2>
                </div>
              </div>
              <div className="row">
                {otherLibraries.map(({ image, title, content, link }, idx) => (
                  <div
                    key={idx}
                    className={classnames('col col--6', styles.feature)}
                  >
                    <h2 className="text--center">
                      <a href={link} className={styles.featureAnchor}>
                        {title}
                        {image}
                      </a>
                    </h2>
                    <p className="text--center">{content}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>
    </Layout>
  );
}

export default Home;
