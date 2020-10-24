import React from 'react';
import { storiesOf } from '@storybook/react';
import useUndoState from '@rooks/use-undo-state';
import README from '@rooks/use-undo-state/README.md';

const UndoStateDemo = () => {
    const [value, setValue, undo] = useUndoState(0)

    return (
        <div>
            <div>Current value: {value}</div>
            <button onClick={() => setValue(value + 1)}>
                Increment
            </button>
            <button onClick={undo}>
                Undo
            </button>
        </div>
    )
}

storiesOf('useUndoState', module)
    .addParameters({
        readme: {
            sidebar: README
        }
    })
    .add('basic example', () => <UndoStateDemo />);
