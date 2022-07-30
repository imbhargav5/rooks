import { Text } from "@nextui-org/react";
import { ComponentProps } from "react";

/*

background-color: #FA8BFF;
background-image: linear-gradient(45deg, #FA8BFF 0%, #2BD2FF 52%, #2BFF88 90%);
background-color: #FBDA61;
background-image: linear-gradient(45deg, #FBDA61 0%, #FF5ACD 100%);
background-color: #FF3CAC;
background-image: linear-gradient(225deg, #FF3CAC 0%, #784BA0 50%, #2B86C5 100%);
background-color: #FEE140;
background-image: linear-gradient(90deg, #FEE140 0%, #FA709A 100%);
background-color: #21D4FD;
background-image: linear-gradient(19deg, #21D4FD 0%, #B721FF 100%);
background-color: #85FFBD;
background-image: linear-gradient(45deg, #85FFBD 0%, #FFFB7D 100%);
background-color: #4158D0;
background-image: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);
background-color: #FF9A8B;
background-image: linear-gradient(90deg, #FF9A8B 0%, #FF6A88 55%, #FF99AC 100%);

background-color: #FFE53B;
background-image: linear-gradient(147deg, #FFE53B 0%, #FF2525 74%);

*/

export const FirstLevelHeadline = ({
  h1,
  css,
  children,
  ...props
}: ComponentProps<typeof Text>) => {
  return (
    <Text
      h1={h1 ?? true}
      css={{
        lineHeight: "2",
        fontSize: "$xl7",
        textGradient: "19deg, #21D4FD 0%, #B721FF 100%",
        userSelect: "none",
        ...css,
      }}
      as="h1"
      {...props}
    >
      {children}
    </Text>
  );
};

export const SecondLevelHeadline = ({
  h2,
  css,
  children,
  ...props
}: ComponentProps<typeof Text>) => {
  return (
    <Text
      h2={h2 ?? true}
      css={{
        lineHeight: "1.3",
        fontSize: "$xl5",
        fontWeight: "$normal",
        textTransform: "lowercase",
        userSelect: "none",
        ...css,
      }}
      as="h2"
      {...props}
    >
      {children}
    </Text>
  );
};
export const ThirdLevelHeadlineOverline = ({
  h3,
  css,
  children,
  ...props
}: ComponentProps<typeof Text>) => {
  return (
    <Text
      h3={h3 ?? true}
      css={{
        lineHeight: "1.4",
        fontSize: "$md",
        fontWeight: "$bold",
        textTransform: "uppercase",
        userSelect: "none",
        color: "$green700",
        ...css,
      }}
      as="h3"
      {...props}
    >
      {children}
    </Text>
  );
};

export const ThirdLevelHeadline = ({
  h3,
  css,
  children,
  ...props
}: ComponentProps<typeof Text>) => {
  return (
    <Text
      h3={h3 ?? true}
      css={{
        lineHeight: "1.7",
        fontSize: "$xl2",
        fontWeight: "$bold",
        letterSpacing: "$tighter",
        userSelect: "none",
        ...css,
      }}
      as="h3"
      {...props}
    >
      {children}
    </Text>
  );
};
