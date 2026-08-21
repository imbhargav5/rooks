import { source } from '../../source';

type HookPageData = {
  title: string;
  description?: string;
  canonicalName?: string | null;
  canonicalEntrypoint?: 'rooks' | 'rooks/experimental' | 'rooks/temporal' | null;
  canonicalStatus?: 'stable' | 'experimental' | 'deprecated' | null;
  canonicalAliases?: string[];
  _meta?: {
    filePath?: string;
  };
};

type HookIndexItem = {
  name: string;
  description: string;
  entrypoint: NonNullable<HookPageData['canonicalEntrypoint']>;
  status: NonNullable<HookPageData['canonicalStatus']>;
  aliases: string[];
  category: string;
  url: string;
};

const categoryOrder = [
  'animation',
  'browser',
  'dev',
  'events',
  'form',
  'keyboard',
  'lifecycle',
  'mouse',
  'performance',
  'state',
  'state-history',
  'ui',
  'utilities',
  'viewport',
  'experimental',
  'temporal',
];

const categoryLabels: Record<string, string> = {
  animation: 'Animation & Timing',
  browser: 'Browser APIs',
  dev: 'Development & Debugging',
  events: 'Event Handling',
  experimental: 'Experimental Hooks',
  form: 'Form & File Handling',
  keyboard: 'Keyboard & Input',
  lifecycle: 'Lifecycle & Effects',
  mouse: 'Mouse & Touch',
  performance: 'Performance & Optimization',
  state: 'State Management',
  'state-history': 'State History & Time Travel',
  temporal: 'Temporal Hooks',
  ui: 'UI & Layout',
  utilities: 'Utilities & Refs',
  viewport: 'Window & Viewport',
};

function categoryLabel(category: string) {
  return categoryLabels[category] ?? category;
}

function categoryFromFilePath(filePath?: string) {
  return filePath?.match(/^hooks\/\(([^)]+)\)\//)?.[1];
}

function statusClass(status: HookIndexItem['status']) {
  switch (status) {
    case 'experimental':
      return 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300';
    case 'deprecated':
      return 'border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300';
    default:
      return 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';
  }
}

function getHookIndexItems(): HookIndexItem[] {
  return source
    .getPages()
    .flatMap((page) => {
      if (page.slugs.length !== 2 || page.slugs[0] !== 'hooks') {
        return [];
      }

      const data = page.data as HookPageData;
      const category = categoryFromFilePath(data._meta?.filePath);

      if (
        !data.canonicalName ||
        !data.canonicalEntrypoint ||
        !data.canonicalStatus ||
        !category
      ) {
        return [];
      }

      return [
        {
          name: data.canonicalName,
          description: data.description ?? '',
          entrypoint: data.canonicalEntrypoint,
          status: data.canonicalStatus,
          aliases: data.canonicalAliases ?? [],
          category,
          url: page.url,
        },
      ];
    })
    .sort((left, right) => left.name.localeCompare(right.name));
}

export function HookIndex() {
  const items = getHookIndexItems();
  const aliasCount = items.reduce(
    (count, item) => count + item.aliases.length,
    0,
  );
  const grouped = items.reduce<Map<string, HookIndexItem[]>>(
    (groups, item) => {
      const categoryItems = groups.get(item.category) ?? [];
      categoryItems.push(item);
      groups.set(item.category, categoryItems);
      return groups;
    },
    new Map(),
  );
  const categories = [...grouped.keys()].sort((left, right) => {
    const leftIndex = categoryOrder.indexOf(left);
    const rightIndex = categoryOrder.indexOf(right);

    if (leftIndex === -1 && rightIndex === -1) {
      return left.localeCompare(right);
    }
    if (leftIndex === -1) return 1;
    if (rightIndex === -1) return -1;
    return leftIndex - rightIndex;
  });

  return (
    <div className="not-prose space-y-10">
      <p className="rounded-lg border border-fd-border bg-fd-card p-4 text-sm text-fd-muted-foreground">
        <strong className="text-fd-foreground">{items.length}</strong> canonical
        hook implementations and{' '}
        <strong className="text-fd-foreground">{aliasCount}</strong> supported
        aliases, derived from the current package exports.
      </p>
      {categories.map((category) => {
        const hooks = grouped.get(category) ?? [];

        return (
          <section key={category} aria-labelledby={`category-${category}`}>
            <div className="mb-4 flex items-baseline justify-between gap-4">
              <h2
                id={`category-${category}`}
                className="text-xl font-semibold tracking-tight"
              >
                {categoryLabel(category)}
              </h2>
              <span className="text-sm text-fd-muted-foreground">
                {hooks.length} {hooks.length === 1 ? 'hook' : 'hooks'}
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {hooks.map((hook) => (
                <a
                  key={hook.name}
                  href={hook.url}
                  className="rounded-lg border border-fd-border bg-fd-card p-4 transition-colors hover:bg-fd-accent/50"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-semibold">{hook.name}</span>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-xs font-medium ${statusClass(hook.status)}`}
                    >
                      {hook.status}
                    </span>
                    <span className="rounded-full border border-fd-border px-2 py-0.5 font-mono text-xs text-fd-muted-foreground">
                      {hook.entrypoint}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-fd-muted-foreground">
                    {hook.description}
                  </p>
                  {hook.aliases.length > 0 ? (
                    <p className="mt-2 text-xs text-fd-muted-foreground">
                      Also exported as{' '}
                      {hook.aliases.map((alias) => (
                        <code key={alias} className="font-mono">
                          {alias}
                        </code>
                      ))}
                    </p>
                  ) : null}
                </a>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
