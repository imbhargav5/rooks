import { ChangeEvent } from "react";

type Options = {
  validate: (nextValue: string) => boolean;
};
export default function useInput(
  initialValue: string,
  opts?: Options
): {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};
