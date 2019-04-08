import React, { useState, useEffect } from "react";
import { storiesOf } from "@storybook/react";
import useNavigatorLanguage from "@rooks/use-navigator-language";

storiesOf("useNavigatorLanguage", module).add("basic example", () => (
  <NavigatorLanguageDemo />
));

function NavigatorLanguageDemo() {
  const language = useNavigatorLanguage();
  return <p>Language is {language}</p>;
}
