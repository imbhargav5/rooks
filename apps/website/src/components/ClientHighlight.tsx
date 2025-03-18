'use client';

import { Highlight, themes } from 'prism-react-renderer';
import { Sandpack } from '@codesandbox/sandpack-react';

type ClientHighlightProps = {
    code: string;
    language: string;
};

export function ClientHighlight({ code, language }: ClientHighlightProps) {
    // If language is javascript or jsx, render Sandpack
    if (language === 'javascript' || language === 'jsx') {
        // Check if code contains console statements
        const hasConsoleStatements = !!code.match(/console\./gm);

        return (
            <div className="my-4">
                <div className="text-sm">
                    <div style={{ fontSize: '11.5px' }}>
                        {/* @ts-ignore - Type mismatch but works at runtime */}
                        <Sandpack
                            template="react"
                            files={{
                                "/App.js": code,
                            }}
                            theme="dark"
                            options={{
                                showLineNumbers: true,
                                editorHeight: 350,
                                editorWidthPercentage: 60,
                                showConsoleButton: hasConsoleStatements,
                                showConsole: hasConsoleStatements,
                            }}
                            customSetup={{
                                dependencies: {
                                    react: "^19.0.0",
                                    "react-dom": "^19.0.0",
                                    "react-is": "^19.0.0",
                                    rooks: "latest",
                                    random: "latest",
                                    "styled-components": "latest",
                                    "framer-motion": "latest",
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }

    // For all other languages, render Highlight
    return (
        <Highlight
            theme={themes.dracula}
            code={code}
            language={language as any}
        >
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre className={className} style={style}>
                    {tokens.map((line, i) => (
                        <div key={i} {...getLineProps({ line, key: i })}>
                            {line.map((token, key) => (
                                <span key={key} {...getTokenProps({ token, key })} />
                            ))}
                        </div>
                    ))}
                </pre>
            )}
        </Highlight>
    );
} 