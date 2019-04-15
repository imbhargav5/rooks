import React, { useState, useEffect } from "react";
import { storiesOf } from "@storybook/react";
import README from "../../../README.md";
import RooksReadme from "rooks/README.md";

storiesOf("Welcome! 🎉🎉", module)
  .addParameters({
    readme: {
      content: README,
      sidebar: RooksReadme
    }
  })
  .add("basic example", () => null);
