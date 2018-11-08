import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import useCounter from "@react-hooks.org/use-counter";

const LiveEdit = ({ noInline, code, scope = {} }) => {
  return (
    <LiveProvider
      code={code}
      noInline={noInline}
      scope={{
        ...scope,
        useCounter
      }}
    >
      <LiveEditor />
      <LiveError />
      <LivePreview />
    </LiveProvider>
  );
};

export default LiveEdit;
