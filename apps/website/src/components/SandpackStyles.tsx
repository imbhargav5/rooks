'use client';

import { getSandpackCssText } from '@codesandbox/sandpack-react';
import { useMemo } from 'react';

export function SandpackStyles() {
    const css = useMemo(() => getSandpackCssText(), []);
    return (
        <style
            id="sandpack-css"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: css }}
        />
    );
}
