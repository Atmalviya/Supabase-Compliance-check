'use client';
import { Component } from 'react';
import Button from './ui/Button';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Something went wrong
          </h2>
          <Button
            onClick={() => window.location.reload()}
            variant="primary"
          >
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
} 