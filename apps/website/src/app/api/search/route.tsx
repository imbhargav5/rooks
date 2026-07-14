import { createFromSource } from 'fumadocs-core/search/server';
import { source } from '../../../../source';

export const { GET } = createFromSource(source, {
  buildIndex(page) {
    const data = page.data as typeof page.data & {
      aliases?: string[];
    };
    const aliasKeywords = data.aliases?.length
      ? ` Aliases: ${data.aliases.join(', ')}.`
      : '';

    return {
      id: page.url,
      title: data.title,
      description: `${data.description ?? ''}${aliasKeywords}`,
      structuredData: data.structuredData,
      url: page.url,
    };
  },
});
