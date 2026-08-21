export type PublicTypeReferenceGroup = {
  entrypoint: 'rooks' | 'rooks/experimental' | 'rooks/temporal';
  types: Array<{
    name: string;
    sourceModule: string;
  }>;
};

export function PublicTypeReference({
  groups,
}: {
  groups: PublicTypeReferenceGroup[];
}) {
  const count = groups.reduce((total, group) => total + group.types.length, 0);

  return (
    <div className="not-prose space-y-5">
      <p className="rounded-lg border border-fd-border bg-fd-card p-4 text-sm text-fd-muted-foreground">
        <strong className="text-fd-foreground">{count}</strong> explicitly
        exported types are importable from the current package entrypoints.
      </p>

      {groups.map((group) => (
        <section key={group.entrypoint}>
          <h3 className="mb-3 font-mono text-base font-semibold">
            {group.entrypoint}
          </h3>
          <ul className="grid gap-2 sm:grid-cols-2">
            {group.types.map((type) => (
              <li
                key={type.name}
                className="rounded-md border border-fd-border bg-fd-card px-3 py-2"
              >
                <code className="font-mono text-sm">{type.name}</code>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
