import { defineCollection, defineConfig } from "@content-collections/core";
import {
  frontmatterSchema,
  metaSchema,
  transformMDX,
} from "@fumadocs/content-collections/configuration";
import { z } from "zod";
import {
  ENTRYPOINTS,
  HOOK_STATUSES,
  getHookManifest,
  getPublicTypeReference,
} from "../../scripts/docs/manifest";

const docsSchema = frontmatterSchema.extend({
  content: z.string(),
  entrypoint: z.enum(ENTRYPOINTS).optional(),
  status: z.enum(HOOK_STATUSES).optional(),
  aliases: z.array(z.string()).default([]),
  related: z.array(z.string()).default([]),
});

const docs = defineCollection({
  name: "docs",
  directory: "content/docs",
  include: "**/*.mdx",
  schema: docsSchema,
  transform: async (document, context) => {
    const transformed = await transformMDX(document, context);
    const hook = getHookManifest(document.title);
    const publicTypes =
      document._meta.path === "reference/entrypoints-and-compatibility"
        ? getPublicTypeReference().map((group) => ({
            entrypoint: group.entrypoint,
            types: group.types.map((item) => ({
              name: item.name,
              sourceModule: item.sourceModule,
            })),
          }))
        : [];

    return {
      ...transformed,
      canonicalName: hook?.name ?? null,
      canonicalEntrypoint: hook?.entrypoint ?? null,
      canonicalStatus: hook?.status ?? null,
      canonicalAliases: hook?.aliases ?? [],
      signature: hook?.signature ?? null,
      publicTypes,
    };
  },
});

const metas = defineCollection({
  name: "meta",
  directory: "content/docs",
  include: "**/meta.json",
  parser: "json",
  schema: metaSchema,
});

export default defineConfig({
  content: [docs, metas],
});
