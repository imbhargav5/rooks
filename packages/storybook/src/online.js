import React, { useState, useEffect } from "react";
import { storiesOf } from "@storybook/react";
import useOnline from "@rooks/use-online";
import README from "@rooks/use-online/README.md";

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
