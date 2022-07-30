import { Spacer } from "@nextui-org/react";
import { Container, styled } from "@nextui-org/react";
import path from "path";
import pkgDir from "pkg-dir";
import { readFileSync } from "fs";
import Image from "next/image";
import {
  FirstLevelHeadline,
  SecondLevelHeadline,
} from "../components/Headings";

const StyledImage = styled(Image, {
  borderRadius: "$rounded",
  height: "90px",
  width: "90px",
  border: "1px solid $primary",
});

const StyledGrid = styled("div", {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))",
  gridColumnGap: "16px",
  gridRowGap: "16px",
  paddingTop: "16px",
  paddingBottom: "16px",
});

const ImageContainer = styled("div", {
  border: "2px solid $primary",
  borderRadius: "$rounded",
  display: "flex",
  placeItems: "center",
  placeContent: "center",
  height: 92,
  width: 92,
  padding: 0,
});

function getPathFromUrl(url: string): string {
  return url.split(/[?#]/)[0];
}

type Contributor = {
  login: string;
  name: string;
  avatar_url: string;
  profile: string;
  contributions: string[];
};

type HomeProps = {
  contributors: Contributor[];
};

const Home = ({ contributors }: HomeProps) => {
  return (
    <Container lg>
      <FirstLevelHeadline>Rooks</FirstLevelHeadline>
      <Spacer y={1} />
      <SecondLevelHeadline> Contributors </SecondLevelHeadline>
      <StyledGrid>
        {contributors.map(contributor => (
          <ImageContainer key={contributor.login}>
            <StyledImage
              src={getPathFromUrl(contributor.avatar_url)}
              layout="fixed"
              height="90px"
              width="90px"
              alt={contributor.name}
            />
          </ImageContainer>
        ))}
      </StyledGrid>
    </Container>
  );
};

export async function getStaticProps() {
  const websitePath = await pkgDir(__dirname);
  const projectPath = path.join(websitePath as string, "../../../");
  const allContributors = JSON.parse(
    readFileSync(path.join(projectPath, ".all-contributorsrc"), "utf-8")
  );

  return {
    props: {
      contributors: allContributors.contributors as Contributor[],
    },
  };
}

export default Home;
