import React, { useState, useReducer, useLayoutEffect } from "react";
import "styled-components/macro";
import useInterval from "@rooks/use-interval";

function reducer(state, action) {
  switch (action.type) {
    case "updatePosition":
      return {
        x: action.payload.xVelocity + state.x,
        y: action.payload.yVelocity + state.y
      };
    default:
      return state;
  }
}

function usePlayerPosition() {
  const [position, dispatcher] = useReducer(reducer, { x: 20, y: 20 });
  const xVelocity = 1;
  const yVelocity = 0;
  function updatePosition() {
    dispatcher({
      type: "updatePosition",
      payload: {
        xVelocity,
        yVelocity
      }
    });
  }

  useLayoutEffect(() => {
    function step() {
      updatePosition();
      window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }, []);

  return position;
}

function Player() {
  const position = usePlayerPosition();
  return (
    <div
      css={`
        position: absolute;
        left: 0;
        top: 0;
        transition: all 0.1s ease;
      `}
      style={{
        left: position.x,
        top: position.y
      }}
    >
      <div
        css={`
          border-radius: 50%;
          border: 1px solid grey;
          height: 75px;
          width: 75px;
          display: flex;
          align-items: center;
          justify-content: center;
        `}
      >
        <div
          css={`
            transform: rotateZ(41deg);
            height: 100%;
            width: 100%;
            font-size: 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
          `}
        >
          🚀
        </div>
      </div>
    </div>
  );
}

export default Player;
