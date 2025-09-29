import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <h2 className="text-xl font-bold text-red-700 mb-2">Something went wrong</h2>
          <p className="text-red-600">Please try refreshing the page or logging in again.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;