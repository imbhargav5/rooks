import React, { ReactNode } from "react";

type Props = Readonly<{ [key: string]: unknown } & { children: ReactNode }>;

export class ErrorBoundary extends React.Component<
  Props,
  {
    error: Error | null;
  }
> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { error: error };
  }

  componentDidCatch(error: Error) {
    console.log("caught error", error.message);
  }

  render() {
    if (this.state.error) {
      return <div data-testid="error">{this.state.error.message}</div>;
    }

    return this.props.children;
  }
}
