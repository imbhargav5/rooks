import React, { lazy } from "react";
import { ScopeContext } from "../utils/contexts";
import { createCache, createResource } from "react-cache";
import hookMap from "../utils/hookMap";

const cache = createCache();

const PackageResource = createResource(hookName =>
  import(`../hooks/${hookName}`)
);

export default function({ hookName, ...rest }) {
  let hookModule = PackageResource.read(cache, hookName);
  hookModule = hookModule.default || hookModule;
  const scope = {
    [hookMap[hookName]]: hookModule
  };
  return <ScopeContext.Provider value={scope} {...rest} />;
}
