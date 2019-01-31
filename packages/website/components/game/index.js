import React, { useRef } from "react";
import "styled-components/macro";
import Player from "./Player";

function Game() {
  const canvasRef = useRef();
  return (
    <div
      css={`
        background: midnightblue;
        height: 500px;
        position: relative;
      `}
    >
      <Player canvasRef={canvasRef} />
      <canvas
        ref={canvasRef}
        css={`
          height: 100%;
          width: 100%;
        `}
      />
    </div>
  );
}

export default Game;
