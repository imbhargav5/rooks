import React, { lazy } from "react";
import { ScopeContext } from "../utils/contexts";
import { createCache, createResource } from "react-cache";
import capitalize from "lodash.capitalize";

const cache = createCache();

const PackageResource = createResource(hookName => import(`./${hookName}`));

export default function({ hookName, ...rest }) {
  let hookModule = PackageResource.read(cache, hookName);
  hookModule = hookModule.default || hookModule;
  const hookKey = `use${hookName
    .split("-")
    .map(capitalize)
    .join("")}`;
  const scope = { [hookKey]: hookModule };
  return <ScopeContext.Provider value={scope} {...rest} />;
}
