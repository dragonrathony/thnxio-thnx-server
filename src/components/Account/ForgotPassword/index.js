import React from "react";
import { withRouter } from "react-router-dom";
import Form from "./form";
import { Helmet } from "react-helmet";

function ForgotPasswordPage(props) {
  return (
    <div>
      <Helmet title="Forgot Password" />
      <Form />
    </div>
  );
}

export default withRouter(ForgotPasswordPage);
