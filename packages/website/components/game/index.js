import React, { Component } from "react";
import "styled-components/macro";
import Player from "./Player";

class Game extends Component {
  render() {
    return (
      <div
        css={`
          background: midnightblue;
          height: 500px;
          position: relative;
        `}
      >
        <Player />
      </div>
    );
  }
}

export default Game;
