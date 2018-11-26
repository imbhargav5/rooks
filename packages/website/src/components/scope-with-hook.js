import React, { lazy } from "react";
import { ScopeContext } from "../utils/contexts";
import { unstable_createResource as createResource } from "react-cache";
import capitalize from "lodash.capitalize";

const PackageResource = createResource(hookName =>
  import(`../hooks/${hookName}`)
);

export default function({ hookName, ...rest }) {
  let hookModule = PackageResource.read(hookName);
  hookModule = hookModule.default || hookModule;
  const hookKey = `use${hookName
    .split("-")
    .map(capitalize)
    .join("")}`;
  const scope = { [hookKey]: hookModule };
  return <ScopeContext.Provider value={scope} {...rest} />;
}
