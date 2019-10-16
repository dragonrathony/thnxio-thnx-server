import React from "react";
import { gql } from "apollo-boost";
import { withRouter } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { Helmet } from "react-helmet";
import { Formik } from "formik";
import * as Yup from "yup";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { Mutation, ApolloConsumer } from "react-apollo";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Logo from "../../Common/Logo";
import Footer from "../../Common/Footer";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    background: "#374359",
    height: "100vh",
    overflow: "auto",
    flexDirection: "column"
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    textAlign: "center"
  },
  formContainer: {
    padding: theme.spacing(3, 5)
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    color: "#fff"
  },
  subtitle: {
    color: "#fff",
    textAlign: "center",
    marginBottom: 12
  },
  mainContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
  error: {
    color: theme.palette.error.main
  },
  success: {
    color: theme.palette.primary.main
  }
}));

function ConirmAccountPage(props) {
  const classes = useStyles();
  const token = props.match.params.token;

  const [localValues, setLocalValues] = React.useState({
    showSuccess: false
  });

  const handleSuccessReset = showSuccess => {
    setLocalValues({ showSuccess: showSuccess });
  };

  return (
    <div>
      <Helmet title="ConfirmAccount" />
      <div className={classes.root}>
        <CssBaseline />
        <div className={classes.mainContent}>
          <Container component="main" maxWidth="sm">
            <Paper className={classes.formContainer} elevation={0}>
              <Logo size="small" />

              <div className={classes.success}>
                Your email has been confirmed. Thank you!
              </div>
            </Paper>
          </Container>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default withRouter(ConirmAccountPage);
