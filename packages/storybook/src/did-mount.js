import React, { useState, useEffect } from "react";
import { storiesOf } from "@storybook/react";
import useDidMount from "@rooks/use-did-mount";

function MountedButton() {
  useDidMount(() => {
    alert("Mounted");
  });
  return null;
}

storiesOf("useDidMount", module).add("basic example", () => <MountedButton />);
