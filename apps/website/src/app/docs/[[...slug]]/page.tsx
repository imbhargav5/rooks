import { source } from '@/lib/source';
import type { Metadata } from 'next';
import {
    DocsPage,
    DocsBody,
    DocsTitle,
    DocsDescription,
} from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { Contributors } from '@/components/Contributors';
import { MDXContent } from '@content-collections/mdx/react';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import dynamic from 'next/dynamic';
import { ClientHighlight } from '@/components/ClientHighlight';
import { ClientHightlightWrapper } from '@/components/ClientHightlightWrapper';
import { Pre, CodeBlock } from 'fumadocs-ui/components/codeblock';



export default async function Page(props: {
    params: Promise<{ slug?: string[] }>;
}) {
    const params = await props.params;
    const page = source.getPage(params.slug);

    if (!page) {
        notFound();
    }

    // Add custom components to the MDX components
    const mdxComponents = Object.assign({}, defaultMdxComponents, {
        Contributors,
        // Code block rendering through ClientHighlight
        // @ts-ignore - Type mismatch but works at runtime
        pre: ({ ref: _ref, ...props }) => (
            <CodeBlock {...props}>
                <Pre>{props.children}</Pre>
            </CodeBlock>
        ),
    });

    return (
        <DocsPage toc={page.data.toc} full={page.data.full}>
            <DocsTitle>{page.data.title}</DocsTitle>
            <DocsDescription>{page.data.description}</DocsDescription>
            <DocsBody>
                <MDXContent
                    code={page.data.body}
                    // @ts-ignore - Type mismatch but works at runtime
                    components={mdxComponents}
                />
            </DocsBody>
        </DocsPage>
    );
}

export async function generateStaticParams() {
    return source.generateParams();
}

export async function generateMetadata(props: {
    params: Promise<{ slug?: string[] }>;
}) {
    const params = await props.params;
    const page = source.getPage(params.slug);

    if (!page) notFound();

    return {
        title: page.data.title,
        description: page.data.description,
    } satisfies Metadata;
}