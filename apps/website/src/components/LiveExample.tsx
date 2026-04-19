'use client';

import { Sandpack } from '@codesandbox/sandpack-react';
import type { SandpackProps } from '@codesandbox/sandpack-react';

type LiveExampleProps = {
    code: string;
    deps?: Record<string, string>;
    height?: number;
    showConsole?: boolean;
    template?: SandpackProps['template'];
    lang?: 'jsx' | 'tsx';
};

const DEFAULT_DEPS: Record<string, string> = {
    react: '^19.0.0',
    'react-dom': '^19.0.0',
    'react-is': '^19.0.0',
    rooks: 'latest',
};

export function LiveExample({
    code,
    deps,
    height = 360,
    showConsole,
    template,
    lang = 'jsx',
}: LiveExampleProps) {
    const safeCode = typeof code === 'string' ? code : '';
    const consoleAuto =
        showConsole ?? /\bconsole\.(log|warn|error|info|debug)\b/.test(safeCode);
    const resolvedTemplate = template ?? (lang === 'tsx' ? 'react-ts' : 'react');
    const entryFile = lang === 'tsx' ? '/App.tsx' : '/App.js';

    return (
        <div className="my-4 text-sm">
            {/* @ts-ignore - Sandpack JSX typing mismatch under React 19 */}
            <Sandpack
                template={resolvedTemplate}
                files={{ [entryFile]: safeCode }}
                theme="dark"
                options={{
                    showLineNumbers: true,
                    editorHeight: height,
                    editorWidthPercentage: 55,
                    showConsoleButton: consoleAuto,
                    showConsole: consoleAuto,
                }}
                customSetup={{
                    dependencies: { ...DEFAULT_DEPS, ...deps },
                }}
            />
        </div>
    );
}
