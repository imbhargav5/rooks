import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useReducer,
  useMutationEffect,
  useImperativeMethods,
  useCallback,
  useMemo
} from "react";
import { space, width, fontSize, color, fontWeight } from "styled-system";
import { Box, Flex } from "rebass";
import styled, { createGlobalStyle } from "styled-components";
import { ScopeContext } from "../utils/contexts";

const PlaygroundHeading = styled.h1`
  ${space}
  text-align: center;
  color: black;
  font-family: "Source Code Pro", monospace;
`;

const Playground = styled(Box)`
  border-radius: 2px;
  background-color: ${props => props.theme.colors.blue3};
`;

const StyledLiveError = styled(LiveError)`
  ${space}
  ${width}
  ${color}
  ${fontSize}
  ${fontWeight}
  border-radius: 4px;
`;

const StyledLiveEditor = styled(LiveEditor)`
  overflow-x: auto;
  border-radius: 2px;
`;
const StyledLivePreviewContainer = styled(Box)`
  overflow-x: auto;
  border-radius: 2px;
`;

const StyledLivePreview = styled(LivePreview)`
  white-space: normal;
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
            useReducer,
            useMutationEffect,
            useImperativeMethods,
            useCallback,
            useMemo,
            ...scope,
            ...contextScope
          }}
        >
          <Playground p={3}>
            <PlaygroundHeading bg="transparent">Playground</PlaygroundHeading>
            <Flex>
              <Box width={[1 / 2]}>
                <StyledLiveEditor />
              </Box>
              <StyledLivePreviewContainer
                width={[1 / 2]}
                p={2}
                ml={2}
                bg="lightgray"
                style={{ position: "relative" }}
              >
                <StyledLivePreview />
              </StyledLivePreviewContainer>
            </Flex>
            <StyledLiveError
              bg="red"
              color="white"
              m={2}
              p={2}
              fontWeight="bold"
            />
          </Playground>
        </LiveProvider>
      )}
    </ScopeContext.Consumer>
  );
};

export default LiveEdit;
