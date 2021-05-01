import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './page.module.css';
import List from '../../docs/list-of-hooks.md';

function HooksList() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      title={`${siteConfig.title} - Hooks list`}
      description="Here is a list of all the hooks that you can use"
    >
      <main className={styles.section}>
        <div className={styles.container}>
          <List />
        </div>
      </main>
    </Layout>
  );
}

export default HooksList;
