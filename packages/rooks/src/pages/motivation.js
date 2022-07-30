import React from 'react';
import MotivationContent from '../../docs/motivation.md';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './page.module.css';

function Motivation(props) {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      title={`${siteConfig.title} - Motivation`}
      description="Why did I build rooks?"
    >
      <main className={styles.section}>
        <div className={styles.container}>
          <MotivationContent />
        </div>
      </main>
    </Layout>
  );
}

export default Motivation;
