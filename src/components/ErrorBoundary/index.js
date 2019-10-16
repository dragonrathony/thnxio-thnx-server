import React from "react";
import { RollbarContext } from "../../rollbar-context";
import { Redirect } from "react-router";

export default class ErrorBoundary extends React.Component {
  static contextType = RollbarContext;
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // update state so next render will show error screen
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // log to rollbar
    this.context.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      // return redirect
      return <Redirect to="/error" />;
    }

    return this.props.children;
  }
}
