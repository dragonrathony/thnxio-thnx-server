import React from "react";
import { withRouter } from "react-router-dom";
import Form from "./form";
import { Helmet } from "react-helmet";

function ResetPasswordPage(props) {
  return (
    <div>
      <Helmet title="Reset Password" />
      <Form />
    </div>
  );
}

export default withRouter(ResetPasswordPage);
