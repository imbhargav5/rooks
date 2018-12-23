type State = {
  index: number;
  item: any;
  setIndex: (number) => void;
  setItem: (any) => void;
};

export default function useSelect(list: [any], initialIndex?: number): State;
