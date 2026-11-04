import { Component } from "react";
import "./ErrorBoundary.css";

/**
 * Shows a fallback instead of a blank page when a child throws while
 * rendering. Pass `resetKey` to clear the error when it changes (for example
 * when new data arrives), or `fallback` to replace the default message.
 */
class ErrorBoundary extends Component {
    state = { error: null };

    static getDerivedStateFromError(error) {
        return { error };
    }

    componentDidCatch(error, info) {
        console.error("Unexpected rendering error:", error, info.componentStack);
    }

    componentDidUpdate(prevProps) {
        if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
            this.setState({ error: null });
        }
    }

    render() {
        if (!this.state.error) return this.props.children;

        return this.props.fallback ?? (
            <div className="error-fallback" role="alert">
                <p>Something went wrong showing this.</p>
                <button type="button" onClick={() => this.setState({ error: null })}>
                    Try again
                </button>
            </div>
        );
    }
}

export default ErrorBoundary;
