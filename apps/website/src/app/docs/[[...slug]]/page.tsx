import { source, getPageImage } from '../../../../source';
import type { Metadata } from 'next';
import {
    DocsPage,
    DocsBody,
    DocsTitle,
    DocsDescription,
} from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { Contributors } from '../../../components/Contributors';
import { HookIndex } from '../../../components/HookIndex';
import { HookReferenceMeta } from '../../../components/HookReferenceMeta';
import {
    PublicTypeReference,
    type PublicTypeReferenceGroup,
} from '../../../components/PublicTypeReference';
import { MDXContent } from '@content-collections/mdx/react';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Pre, CodeBlock } from 'fumadocs-ui/components/codeblock';

type HookPageData = {
    title: string;
    canonicalName?: string | null;
    canonicalEntrypoint?:
        | 'rooks'
        | 'rooks/experimental'
        | 'rooks/temporal'
        | null;
    canonicalStatus?: 'stable' | 'experimental' | 'deprecated' | null;
    canonicalAliases?: string[];
    signature?: string | null;
    publicTypes?: PublicTypeReferenceGroup[];
};

export default async function Page(props: {
    params: Promise<{ slug?: string[] }>;
}) {
    const params = await props.params;
    const page = source.getPage(params.slug);

    if (!page) {
        notFound();
    }

    const hookData = page.data as HookPageData;

    // Add project components and static code-block rendering to MDX.
    const mdxComponents = Object.assign({}, defaultMdxComponents, {
        Contributors,
        HookIndex,
        PublicTypeReference: () => (
            <PublicTypeReference groups={hookData.publicTypes ?? []} />
        ),
        // @ts-ignore - Type mismatch but works at runtime
        pre: ({ ref: _ref, ...props }) => (
            <CodeBlock {...props}>
                <Pre>{props.children}</Pre>
            </CodeBlock>
        ),
    });

    const isCanonicalHookPage =
        page.slugs[0] === 'hooks' &&
        page.slugs.length === 2 &&
        hookData.canonicalName !== null &&
        hookData.canonicalName !== undefined &&
        hookData.canonicalEntrypoint !== null &&
        hookData.canonicalEntrypoint !== undefined &&
        hookData.canonicalStatus !== null &&
        hookData.canonicalStatus !== undefined;

    return (
        <DocsPage toc={page.data.toc} full={page.data.full}>
            <DocsTitle>{page.data.title}</DocsTitle>
            <DocsDescription>{page.data.description}</DocsDescription>
            <DocsBody>
                {isCanonicalHookPage ? (
                    <HookReferenceMeta
                        name={hookData.canonicalName!}
                        entrypoint={hookData.canonicalEntrypoint!}
                        status={hookData.canonicalStatus!}
                        aliases={hookData.canonicalAliases}
                        signature={hookData.signature ?? undefined}
                    />
                ) : null}
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
        openGraph: {
            images: getPageImage(page).url,
        },
        twitter: {
            card: 'summary_large_image',
            images: getPageImage(page).url,
        },
    } satisfies Metadata;
}
