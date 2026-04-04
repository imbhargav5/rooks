import { RootProvider } from 'fumadocs-ui/provider/next';
import type { ReactNode } from 'react';
import { QueryProvider } from '../providers/QueryProvider';
import { BootSequence } from '../components/BootSequence';
import './globals.css';

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                // you can use Tailwind CSS too
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                }}
            >
                <BootSequence />
                <QueryProvider>
                    <RootProvider>{children}</RootProvider>
                </QueryProvider>
            </body>
        </html>
    );
}