import React, { useState, useEffect } from "react";
import { storiesOf } from "@storybook/react";
import useNavigatorLanguage from "@rooks/use-navigator-language";
import README from "@rooks/use-navigator-language/README.md";

storiesOf("useNavigatorLanguage", module)
  .addParameters({
    readme: {
      sidebar: README
    }
  })
  .add("basic example", () => <NavigatorLanguageDemo />);

function NavigatorLanguageDemo() {
  const language = useNavigatorLanguage();
  return <p>Language is {language}</p>;
}
