import { Col, Row } from "@nextui-org/react";
import { Container } from "@nextui-org/react";
import Image from "next/image";

export const Footer = () => {
  return (
    <Container
      fluid
      css={{
        backgroundColor: "#f5f5f5",
      }}
    >
      <Container
        lg
        css={{
          paddingTop: 48,
          paddingBottom: 180,
          paddingLeft: 16,
          paddingRight: 16,
        }}
      >
        <Row gap={1}>
          <Col
            as="span"
            css={{
              width: "auto",
            }}
          >
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://vercel.com?utm_source=rooks&utm_campaign=oss"
            >
              <Image
                layout="intrinsic"
                src="/images/powered-by-vercel.svg"
                alt="Powered by vercel"
                width="200px"
                height="60px"
              />
            </a>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};
