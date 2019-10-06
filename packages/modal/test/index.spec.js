/**
 * @jest-environment jsdom
 */
import React, { useEffect, useState } from "react";
import { render, fireEvent } from '@testing-library/react';
import useModal, { ModalProvider, useToggle } from "..";

const ModalComponent = ({ children }) => {
  const [opened, toggle] = useModal('main');

  return (
    <div>
      <button onClick={toggle}>Open</button>
      {opened && <div>Modal</div>}
      {children}
    </div>
  );
};

describe("useModal", () => {
  it("should be defined", () => {
    expect(useModal).toBeDefined();
    expect(ModalProvider).toBeDefined();
    expect(useToggle).toBeDefined();
  });

  it('should show modal when toggle is called', () => {
    const { getByText, queryByText, unmount } = render(
      <ModalProvider>
        <ModalComponent />
      </ModalProvider>
    );

    fireEvent.click(getByText('Open'));

    expect(queryByText('Modal')).toBeTruthy();

    unmount();
  });

  it('should hide modal when toggle is called twice', () => {
    const { getByText, queryByText, unmount } = render(
      <ModalProvider>
        <ModalComponent />
      </ModalProvider>
    );
    const button = getByText('Open');

    fireEvent.click(button);
    fireEvent.click(button);

    expect(queryByText('Modal')).toBeNull();

    unmount();
  });

  test('respects initial prop', () => {
    const Component = () => {
      const [opened] = useModal('main', true)

      return (
        <div>
          {opened && <div>Modal</div>}
        </div>
      );
    };
    const { queryByText, unmount } = render(
      <ModalProvider>
        <Component />
      </ModalProvider>
    );

    expect(queryByText('Modal')).toBeTruthy();

    unmount();
  });

  test('toggles correctly with shouldOpen argument', () => {
    const Component = () => {
      const [opened, toggle] = useModal('main', true)

      return (
        <div>
          <button onClick={() => toggle(true)}>Open</button>
          {opened && <div>Modal</div>}
        </div>
      );
    };
    const { getByText, queryByText, unmount } = render(
      <ModalProvider>
        <Component />
      </ModalProvider>
    );
    const button = getByText('Open');

    fireEvent.click(button);

    expect(queryByText('Modal')).toBeTruthy();

    unmount();
  });

  test('toggle modal from other component', () => {
    const Component = () => {
      const toggle = useToggle('main')

      useEffect(() => {
        if (typeof toggle === 'function') {
          toggle()
        }
      }, [toggle]);

      return null;
    };
    const { queryByText, unmount } = render(
      <ModalProvider>
        <ModalComponent>
          <Component />
        </ModalComponent>
      </ModalProvider>
    );

    expect(queryByText('Modal')).toBeTruthy();

    unmount();
  })

  it('should unregister modal when component unmounts', () => {
    let registration
    const Component = () => {
      const [mount, setMount] = useState(true)
      const toggle = useToggle('main')

      useEffect(() => {
        setMount(false)
      }, []);

      useEffect(() => {
        registration = toggle
      }, [toggle]);

      return mount ? <ModalComponent /> : null;
    };
    const { unmount } = render(
      <ModalProvider>
        <Component />
      </ModalProvider>
    );

    expect(registration).toBeUndefined();

    unmount();
  });
});
