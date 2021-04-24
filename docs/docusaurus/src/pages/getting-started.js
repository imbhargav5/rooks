import React from 'react';
import GettingStartedContent from '../../docs/getting-started.md';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './page.module.css';

function GettingStarted(props) {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      title={`${siteConfig.title} - Getting Started`}
      description="Get up and running with Rooks"
    >
      <main className={styles.section}>
        <div className={styles.container}>
          <GettingStartedContent />
        </div>
      </main>
    </Layout>
  );
}

export default GettingStarted;
