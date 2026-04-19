'use client';

import { Sandpack } from '@codesandbox/sandpack-react';
import type { SandpackProps } from '@codesandbox/sandpack-react';

type LiveExampleProps = {
    code: string;
    deps?: Record<string, string>;
    height?: number;
    showConsole?: boolean;
    template?: SandpackProps['template'];
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
    template = 'react',
}: LiveExampleProps) {
    const safeCode = typeof code === 'string' ? code : '';
    const consoleAuto =
        showConsole ?? /\bconsole\.(log|warn|error|info|debug)\b/.test(safeCode);

    return (
        <div className="my-4 text-sm">
            {/* @ts-ignore - Sandpack JSX typing mismatch under React 19 */}
            <Sandpack
                template={template}
                files={{ '/App.js': safeCode }}
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
