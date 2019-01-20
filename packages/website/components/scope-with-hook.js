import React, { lazy } from "react";
import { ScopeContext } from "../utils/contexts";
import capitalize from "lodash.capitalize";

export default function({ hookName, hookMap, ...rest }) {
  // let hookModule = PackageResource.read(hookName);
  // hookModule = hookModule.default || hookModule;
  const scope = {
    ...hookMap
  };
  return <ScopeContext.Provider value={scope} {...rest} />;
}
