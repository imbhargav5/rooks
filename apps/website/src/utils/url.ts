
import urlJoin from 'url-join';
export function getUrl(path: string) {
    return urlJoin(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000', path);
}

