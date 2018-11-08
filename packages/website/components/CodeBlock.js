import React from "react";
import styled from "styled-components";

import "../utils/prismTemplateString";
import { Editor } from "react-live";

import { Note } from "./Note";

const CodeBlock = styled(p => {
  const language = (p.language || "clike").toLowerCase().trim();

  return <Editor {...p} language={language} />;
}).attrs({
  contentEditable: false
})`
  font-size: 0.8rem;
  font-weight: 300;
  white-space: pre-wrap;
  border-radius: 3px;
  box-shadow: 1px 1px 20px rgba(20, 20, 20, 0.27);
  margin: 35px 0;
  overflow-x: hidden;
  ${Note} & {
    margin: 20px 0;
  }
`;

export default CodeBlock;
