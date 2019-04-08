import React, { useState, useEffect } from "react";
import { storiesOf } from "@storybook/react";
import useOnline from "@rooks/use-online";

storiesOf("useOnline", module).add("basic example", () => <OnlineDemo />);

function OnlineDemo() {
  const isOnline = useOnline();
  return <p>Online status - {isOnline.toString()}</p>;
}
