import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import { useState } from "react";
import { ScopeContext } from "../utils/contexts";

const LiveEdit = ({ noInline, code, scope = {} }) => {
  return (
    <ScopeContext.Consumer>
      {contextScope => (
        <LiveProvider
          code={code}
          noInline={noInline}
          scope={{
            ...scope,
            ...contextScope
          }}
        >
          <LiveEditor />
          <LiveError />
          <LivePreview />
        </LiveProvider>
      )}
    </ScopeContext.Consumer>
  );
};

export default LiveEdit;
