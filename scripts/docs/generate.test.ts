import assert from "node:assert/strict";
import test from "node:test";
import { buildDocumentationManifest } from "./manifest";
import {
  HOOKS_ZONE_END,
  HOOKS_ZONE_START,
  renderHooksZone,
  replaceGeneratedZone,
} from "./generate";

test("replaces only the README hook catalog zone", () => {
  const source = `Before\n${HOOKS_ZONE_START}\nold\n${HOOKS_ZONE_END}\nAfter\n`;
  const result = replaceGeneratedZone(source, "new catalog\n");
  assert.equal(
    result,
    `Before\n${HOOKS_ZONE_START}\n\nnew catalog\n\n${HOOKS_ZONE_END}\nAfter\n`
  );
});

test("renders canonical counts and aliases from the shared manifest", () => {
  const generated = renderHooksZone(buildDocumentationManifest());
  assert.match(generated, /147 canonical hook implementations/);
  assert.match(generated, /`useObjectState`/);
  assert.match(generated, /`rooks\/temporal`/);
});
