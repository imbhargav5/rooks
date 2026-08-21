type HookReferenceMetaProps = {
  name: string;
  entrypoint: 'rooks' | 'rooks/experimental' | 'rooks/temporal';
  status: 'stable' | 'experimental' | 'deprecated';
  aliases?: string[];
  signature?: string;
};

function statusClass(status: HookReferenceMetaProps['status']) {
  switch (status) {
    case 'experimental':
      return 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300';
    case 'deprecated':
      return 'border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300';
    default:
      return 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';
  }
}

export function HookReferenceMeta({
  name,
  entrypoint,
  status,
  aliases = [],
  signature,
}: HookReferenceMetaProps) {
  return (
    <aside
      aria-label={`${name} package metadata`}
      className="not-prose mb-8 space-y-4 rounded-lg border border-fd-border bg-fd-card p-4"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full border px-2 py-0.5 text-xs font-medium ${statusClass(status)}`}
        >
          {status}
        </span>
        <code className="rounded border border-fd-border bg-fd-muted px-2 py-1 text-xs">
          {entrypoint}
        </code>
        {aliases.map((alias) => (
          <span
            key={alias}
            className="rounded-full border border-fd-border px-2 py-0.5 text-xs text-fd-muted-foreground"
          >
            alias: <code>{alias}</code>
          </span>
        ))}
      </div>

      <div>
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-fd-muted-foreground">
          Import
        </p>
        <pre className="overflow-x-auto rounded-md bg-fd-muted p-3 text-sm">
          <code>{`import { ${name} } from "${entrypoint}";`}</code>
        </pre>
      </div>

      {signature ? (
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-fd-muted-foreground">
            TypeScript signature
          </p>
          <pre className="overflow-x-auto rounded-md bg-fd-muted p-3 text-sm">
            <code>{signature}</code>
          </pre>
        </div>
      ) : null}

      {status === 'experimental' ? (
        <p className="text-sm text-amber-800 dark:text-amber-200">
          This hook can change in a minor release. Review the{' '}
          <a
            className="underline underline-offset-4"
            href="/docs/guides/experimental-hooks"
          >
            experimental hooks guide
          </a>{' '}
          before production use.
        </p>
      ) : null}

      {status === 'deprecated' ? (
        <p className="text-sm text-red-800 dark:text-red-200">
          This hook is deprecated. Follow the migration guidance on this page.
        </p>
      ) : null}
    </aside>
  );
}
