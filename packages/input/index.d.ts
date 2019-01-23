import { ChangeEvent } from "react";

type Options = {
  validate: (
    nextValue: string | number,
    currentValue: string | number
  ) => boolean;
};
export default function useInput(
  initialValue: string | number,
  opts?: Options
): {
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};
