import { MDXRemoteSerializeResult } from "next-mdx-remote";
import fs, { readFileSync } from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import pkgDir from "pkg-dir";
import { Container, Spacer, Text, styled } from "@nextui-org/react";
import { MDXRenderer } from "../../components/MDXRenderer";
import { mdxSerialize } from "../../utils/mdxSerialize";
import {
  FirstLevelHeadline,
  SecondLevelHeadline,
} from "../../components/Headings";
import { LeftSidebar, MainLayout, RightSidebar } from "../../components/Layout";
import lodash from "lodash";
import { ActiveLink } from "../../components/ActiveLink";
import { Footer } from "../../components/Footer";

const StyledLinkContainer = styled("div", {
  display: "block",
});

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
  hooksList: HooksList;
};

type HooksList = Array<{
  name: string;
  description: string;
  category: string;
}>;

type Params = {
  params: {
    slug: string;
  };
};

const emojiByCategory: { [key: string]: string } = {
  state: "❇️",
  effects: "🔥",
  navigator: "🚃",
  misc: "✨",
  form: "📝",
  events: "🚀",
  ui: "⚛️",
};

const getCategoryTitle = (category: string) => {
  const emoji = emojiByCategory[category] as string | undefined;
  return `${emoji ?? "✅"} ${
    category === "ui" ? "UI" : lodash.startCase(category)
  }`;
};

const PostPage = ({
  frontMatter: { title },
  mdxSource,
  hooksList,
}: PostPageProps) => {
  const hooksListByCategory = hooksList.reduce(
    (acc, { name, description, category }) => {
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push({ name, description, category });
      return acc;
    },
    {} as Record<string, HooksList>
  );

  const hooksListCategories = Object.keys(hooksListByCategory);

  return (
    <MainLayout>
      <LeftSidebar>
        {hooksListCategories.map((category) => (
          <div key={category}>
            <Text h3>{getCategoryTitle(category)}</Text>
            {hooksListByCategory[category].map(({ name }) => (
              <StyledLinkContainer key={name}>
                <ActiveLink href={`/docs/${name}`}>{name}</ActiveLink>
              </StyledLinkContainer>
            ))}
          </div>
        ))}
      </LeftSidebar>
      <div>
        <Container>
          <Spacer y={5} />
          <FirstLevelHeadline>{title}</FirstLevelHeadline>
          <MDXRenderer mdxSource={mdxSource} />
          <Spacer y={1} />
          <SecondLevelHeadline>Join the community!</SecondLevelHeadline>
          <Text>
            Join our discord server! You can click the floating discord icon at
            the bottom right of the screen and chat with us!
          </Text>
          <Spacer y={5} />
        </Container>
        <Footer />
      </div>
      <RightSidebar></RightSidebar>
    </MainLayout>
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

const getStaticProps = async ({ params }: Params) => {
  const websitePath = await pkgDir(__dirname);
  const projectPath = path.join(websitePath as string, "../../");
  const docsPath = path.join(projectPath, "data/docs");
  const hooksListPath = path.join(projectPath, `data/hooks-list.json`);
  const hooksList = JSON.parse(readFileSync(hooksListPath, "utf8"))
    .hooks as HooksList;
  const { slug } = params;
  const { frontMatter, mdxSource } = await mdxSerialize(
    path.join(docsPath, slug + ".md")
  );

  return {
    props: {
      frontMatter,
      slug,
      mdxSource,
      hooksList,
    },
  };
};

export { getStaticProps, getStaticPaths };
export default PostPage;
