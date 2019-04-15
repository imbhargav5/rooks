import React, { useState, useEffect } from "react";
import { storiesOf } from "@storybook/react";
import useDidMount from "@rooks/use-did-mount";
import README from "@rooks/use-did-mount/README.md";

function MountedButton() {
  useDidMount(() => {
    alert("Mounted");
  });
  return null;
}

storiesOf("useDidMount", module)
  .addParameters({
    readme: {
      sidebar: README
    }
  })
  .add("basic example", () => <MountedButton />);
