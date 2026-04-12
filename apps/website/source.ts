import { allDocs, allMetas } from 'content-collections';
import { loader } from 'fumadocs-core/source';
import { createMDXSource } from '@fumadocs/content-collections';
import { icons } from 'lucide-react'
import { createElement } from 'react';
import type { InferPageType } from 'fumadocs-core/source';

export const source = loader({
    baseUrl: '/docs',
    source: createMDXSource(allDocs, allMetas),
    icon(icon) {
        if (!icon) {
            return;
        }
        if (icon in icons) {
            return createElement(icons[icon as keyof typeof icons]);
        }
        return;
    }
});

export function getPageImage(page: InferPageType<typeof source>) {
    const segments = [...page.slugs, 'image.png'];
    return {
        segments,
        url: `/og/docs/${segments.join('/')}`,
    };
}