import React from "react";
import { storiesOf } from "@storybook/react";
import useModal, { ModalProvider, useToggle } from "@rooks/use-modal";
import README from "@rooks/use-modal/README.md";

const modalStyle = {
  display: 'flex',
  width: '90%',
  border: '5px solid #000000',
  borderRadius: 10,
  margin: 20,
  padding: 20,
  justifyContent: 'center',
  alignItems: 'center'
}

const DemoBasic = () => {
  const [toggle, opened] = useModal();

  return (
    <>
      <p>Click on the button to toggle modal on/off.</p>
      <p>useModal hook takes care of all the state and logic.</p>
      <p><strong>Make sure to wrap your application inside ModalProvider before using this hook.</strong></p>
      <button onClick={toggle}>Toggle modal</button>
      {opened && (
        <div style={modalStyle}>
          <button onClick={() => toggle(false)}>Close</button>
        </div>
      )}
    </>
  );
}

const DemoNested = () => {
  const [toggle, opened] = useModal('main');

  return (
    <>
      {opened && (
        <div style={modalStyle}>
          <button onClick={toggle}>Close</button>
        </div>
      )}
    </>
  );
}

const ToggleButton = () => {
  const toggleMain = useToggle('main');

  return (
    <>
      <p>Click on the button to toggle modal located anywhere in component tree.</p>
      <p>useToggle hook returns toggle method for specified modal registered with useModal hook.</p>
      <p><strong>Make sure to pass the id to useModal hook so you can reference modal.</strong></p>
      <button onClick={toggleMain}>Toggle nested modal</button>
    </>
  )
}

storiesOf("useModal", module)
  .addParameters({
    readme: {
      sidebar: README
    }
  })
  .add("basic example", () => (
    <ModalProvider>
      <DemoBasic />
    </ModalProvider>
  ))
  .add("toggle example", () => (
    <ModalProvider>
      <ToggleButton />
      <DemoNested />
    </ModalProvider>
  ));
