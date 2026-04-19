'use client';

import dynamic from 'next/dynamic';
import type { ComponentProps } from 'react';

const LiveExampleInner = dynamic(
    () => import('./LiveExample').then((m) => m.LiveExample),
    {
        ssr: false,
        loading: () => (
            <div
                className="my-4 rounded border border-fd-border bg-fd-muted/40 p-4 text-sm text-fd-muted-foreground"
                style={{ minHeight: 360 }}
            >
                Loading interactive example…
            </div>
        ),
    },
);

export function LiveExampleClient(
    props: ComponentProps<typeof LiveExampleInner>,
) {
    return <LiveExampleInner {...props} />;
}
