import { Text } from "@nextui-org/react";
import { Container } from "@nextui-org/react";
import { Hero } from "../pageComponents/Home/Hero";
import Contributors from "../components/CONTRIBUTORS.md";

const Home = () => {
  return (
    <Container lg>
      <Text
        h1
        css={{
          textGradient: "45deg, $blue600 -20%, $pink600 50%",
        }}
      >
        Rooks
      </Text>
      <Hero />
      <Contributors />
    </Container>
  );
};

export default Home;
