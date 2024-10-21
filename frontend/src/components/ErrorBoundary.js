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
    console.log('錯誤:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1 className="text-red-500 text-2xl">出現了錯誤。請檢查控制台以獲取更多信息。</h1>;
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;

