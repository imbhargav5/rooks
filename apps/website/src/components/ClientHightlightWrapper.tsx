'use client';
import dynamic from "next/dynamic";
import { ComponentProps } from "react";

const ClientHighlight = dynamic(
    () => import('./ClientHighlight').then(mod => mod.ClientHighlight),
    { ssr: false }
);


export function ClientHightlightWrapper(props: ComponentProps<typeof ClientHighlight>) {
    return <ClientHighlight {...props} />;
}
