import React, { useRef, useState } from "react";
import styled from "styled-components/macro";
import { useInput, useKey } from "rooks";

function Title({ children }) {
  return (
    <h2
      css={`
        text-transform: none;
      `}
    >
      {children}
    </h2>
  );
}

function Description({ children }) {
  return (
    <p
      css={`
        text-transform: none;
      `}
    >
      {children}
    </p>
  );
}

function Form() {
  const inputRef = useRef();
  const [initialUsername, changeInitialUsername] = useState("imbhargav5");
  const usernameInput = useInput(initialUsername);
  useKey(
    [27],
    e => {
      e.preventDefault();
      changeInitialUsername(new String(""));
    },
    {
      eventTypes: ["keydown"],
      target: inputRef
    }
  );
  return (
    <div>
      <Title>{`{useInput}`}</Title>
      <Description>
        Type something. And then press enter to reset the input.
      </Description>
      <input
        ref={inputRef}
        css={`
          border: 1px solid black;
        `}
        {...usernameInput}
      />
    </div>
  );
}

const Demo = () => {
  return (
    <div>
      <Form />
    </div>
  );
};

export default Demo;
