import React, { useState, useEffect } from "react";
import { storiesOf } from "@storybook/react";
import useOnline from "@rooks/use-online";
let README;

// case sensitive macos nonsense
try {
  README = require("@rooks/use-online/README.md");
  README = README.default || README;
} catch (err) {
  README = require("@rooks/use-online/readme.md");
  README = README.default || README;
}

storiesOf("useOnline", module)
  .addParameters({
    readme: {
      sidebar: README
    }
  })
  .add("basic example", () => <OnlineDemo />);

function OnlineDemo() {
  const isOnline = useOnline();
  return <p>Online status - {isOnline.toString()}</p>;
}
