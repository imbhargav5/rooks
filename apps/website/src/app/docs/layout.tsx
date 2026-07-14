import { source } from '../../../source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { baseOptions } from '../../app/layout.config';
import './docs.css';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      sidebar={{ defaultOpenLevel: 0 }}
      {...baseOptions}
    >
      {children}
    </DocsLayout>
  );
}
