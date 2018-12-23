export default function useCounter(
  initialValue: number
): {
  value: number;
  increment: () => void;
  decrement: () => void;
  incrementBy: (amount: number) => void;
  decrementBy: (amount: number) => void;
  reset: () => void;
};
