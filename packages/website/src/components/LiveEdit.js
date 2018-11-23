import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { space, width, fontSize, color, fontWeight } from "styled-system";
import { Box, Flex } from "rebass";
import styled, { createGlobalStyle } from "styled-components";
import { ScopeContext } from "../utils/contexts";

const StyledLiveError = styled(LiveError)`
  ${space}
  ${width}
  ${color}
  ${fontSize}
  ${fontWeight}
  border-radius: 4px;
`;

const LiveEdit = ({ noInline, code, scope = {} }) => {
  return (
    <ScopeContext.Consumer>
      {contextScope => (
        <LiveProvider
          code={code}
          noInline={noInline}
          scope={{
            useState,
            useRef,
            useEffect,
            useLayoutEffect,
            ...scope,
            ...contextScope
          }}
        >
          <Flex>
            <Box width={[1 / 2]} mx={2}>
              <LiveEditor />
            </Box>
            <Box
              width={[1 / 2]}
              p={2}
              mx={2}
              bg="lightgray"
              style={{ position: "relative" }}
            >
              <LivePreview />
            </Box>
          </Flex>
          <StyledLiveError
            bg="red"
            color="white"
            m={2}
            p={2}
            fontWeight="bold"
          />
        </LiveProvider>
      )}
    </ScopeContext.Consumer>
  );
};

export default LiveEdit;
