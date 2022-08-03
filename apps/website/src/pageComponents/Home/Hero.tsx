import { Container, Card, Row, Text } from "@nextui-org/react";

export const Hero = () => {
  return (
    <Container>
      <Card css={{ $$cardColor: "$colors$primary" }}>
        <Card.Body>
          <Row justify="center" align="center">
            <Text h6 size={15} color="white" css={{ m: 0 }}>
              Collection of React hooks ⚓ for everyone.
            </Text>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};
