import React from "react";
import { withRouter } from "react-router-dom";
import Form from "./form";
import { Typography } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import { Helmet } from "react-helmet";

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
  error: {
    color: theme.palette.error.main
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
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
  title: {
    color: "#fff",
    marginBottom: 12
  },
  subtitle: {
    color: "#fff"
  },
  titleContainer: {
    textAlign: "left",
    marginTop: 24,
    marginBottom: 24,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  subtitleContainer: {
    textAlign: "center",
    marginTop: 24,
    marginBottom: 24
  },
  headerContainer: {
    display: "flex",
    justifyContent: "space-between"
  },
  strong: {
    fontWeight: 600
  },
  logoContainer: {
    display: "flex",
    justifyContent: "flex-end"
  },
  logo: {
    height: 225
  },
  nameContainer: {
    display: "flex",
    justifyContent: "space-between"
  }
}));
function CreateAccountPage(props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Helmet title="Sign Up" />
      <div className={classes.mainContent}>
        <Container maxWidth="lg" className={classes.headerContainer}>
          <div className={classes.titleContainer}>
            <Typography className={classes.title} component="h1" variant="h3">
              Welcome to the thnx! Corporate Hub
            </Typography>
            <Typography
              className={classes.subtitle}
              component="h2"
              variant="h5"
            >
              Create your account now and develop a gratitude culture
            </Typography>
          </div>
          <div className={classes.logoContainer}>
            <img
              src={require("../../../assets/img/logo.png")}
              className={classes.logo}
              alt="Thnx! Logo"
            />
          </div>
        </Container>
        <Container component="main" maxWidth="sm">
          <Paper className={classes.formContainer} elevation={0}>
            <Form />
          </Paper>
        </Container>
      </div>
    </div>
  );
}

export default withRouter(CreateAccountPage);
