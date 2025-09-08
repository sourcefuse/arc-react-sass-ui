import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <h2 className="text-xl font-bold text-red-600">
              Something went wrong.
            </h2>
            <p className="text-gray-600">
              Please refresh the page or try again later.
            </p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
