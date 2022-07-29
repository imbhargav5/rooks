import { MDXRemoteSerializeResult } from "next-mdx-remote";
import fs from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import pkgDir from "pkg-dir";
import { Container, Grid, Spacer } from "@nextui-org/react";
import { MDXRenderer } from "../../components/MDXRenderer";
import { mdxSerialize } from "../../utils/mdxSerialize";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

type PostPageProps = {
  frontMatter: {
    title: string;
  };
  slug: string;
  mdxSource: MDXRemoteSerializeResult<
    Record<string, unknown>,
    Record<string, string>
  >;
};

type Params = {
  params: {
    slug: string;
  };
};

const getStaticProps = async ({ params }: Params) => {
  const websitePath = await pkgDir(__dirname);
  const projectPath = path.join(websitePath as string, "../../");
  const docsPath = path.join(projectPath, "data/docs");
  const { slug } = params;
  const { frontMatter, mdxSource } = await mdxSerialize(
    path.join(docsPath, slug + ".md")
  );

  return {
    props: {
      frontMatter,
      slug,
      mdxSource,
    },
  };
};

const PostPage = ({ frontMatter: { title }, mdxSource }: PostPageProps) => {
  return (
    <Grid.Container>
      <Grid xs={3}></Grid>
      <Grid xs={6}>
        <Container>
          <Spacer y={5} />
          <h1 className="title">{title}</h1>
          <MDXRenderer mdxSource={mdxSource} />
          <Spacer y={5} />
        </Container>
      </Grid>
      <Grid xs={3} lg></Grid>
    </Grid.Container>
  );
};

const getStaticPaths = async () => {
  const websitePath = await pkgDir(__dirname);
  const projectPath = path.join(websitePath as string, "../../");
  const files = fs.readdirSync(path.join(projectPath, "data/docs"));
  const paths = files.map((filename) => ({
    params: {
      slug: filename.replace(".md", ""),
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export { getStaticProps, getStaticPaths };
export default PostPage;
