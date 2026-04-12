import { source, getPageImage } from '../../../../../source';
import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';
import { generate } from 'fumadocs-ui/og';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const revalidate = false;

const logoData = readFileSync(join(process.cwd(), 'public/rooks-logo.png'));
const logoBase64 = `data:image/png;base64,${logoData.toString('base64')}`;

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ slug: string[] }> },
) {
    const { slug } = await params;
    const page = source.getPage(slug.slice(0, -1));
    if (!page) notFound();

    return new ImageResponse(
        generate({
            title: page.data.title,
            description: page.data.description,
            site: 'Rooks',
            icon: (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={logoBase64}
                    alt="Rooks logo"
                    width={60}
                    height={32}
                    style={{ objectFit: 'contain' }}
                />
            ),
        }),
        { width: 1200, height: 630 },
    );
}

export function generateStaticParams() {
    return source.getPages().map((page) => ({
        slug: getPageImage(page).segments,
    }));
}
