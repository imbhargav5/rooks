import React, { useState, useEffect } from "react";
import { storiesOf } from "@storybook/react";
import useIsomorphicEffect from "@rooks/use-isomorphic-effect";
import README from "@rooks/use-isomorphic-effect/README.md";

function IsomorphicEffectDemo() {
  useIsomorphicEffect(() => {
    alert(
      "This runs useEffect on the server and useLayoutEffect on the client"
    );
  }, []);
  return null;
}
storiesOf("useIsomorphicEffect", module)
  .addParameters({
    readme: {
      sidebar: README
    }
  })
  .add("basic example", () => <IsomorphicEffectDemo />);
