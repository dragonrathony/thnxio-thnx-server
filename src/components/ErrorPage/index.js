import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { Helmet } from "react-helmet";
import { Query } from "react-apollo";
import { Typography, Paper } from "@material-ui/core";
import gql from "graphql-tag";
import Page from "../Page";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    background: "#F7FAFC"
  },
  appBarSpacer: theme.mixins.toolbar,
  pageContent: {
    flex: 1,
    height: "100vh",
    overflow: "auto",
    display: "flex",
    flexDirection: "column"
  },
  content: {
    flex: "1 0 auto"
  },
  container: {
    paddingBottom: theme.spacing(4)
  },
  appTitle: {
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: 10
  },

  paper: {
    padding: theme.spacing(2),
    margin: theme.spacing(4),
    display: "flex",
    flex: 1,
    overflow: "auto",
    flexDirection: "column",
    paddingBottom: "100px !important",
    background: "#fff"
  }
}));

export default function ErrorPage(props) {
  const classes = useStyles();

  return (
    <Query
      query={gql`
        query IsUserLoggedIn {
          roles @client
          isLoggedIn @client
        }
      `}
    >
      {({ loading, error, data }) => {
        if (loading) return null;
        if (error) return null;

        let loggedIn = data.isLoggedIn;

        return loggedIn ? (
          <Page title="Not Found">
            <Paper className={classes.paper} elevation={0}>
              <Typography component="h2" variant="h5">
                An error occurred.
              </Typography>
            </Paper>
          </Page>
        ) : (
          <div className={classes.root}>
            <Helmet title={props.title} />
            <CssBaseline />
            <div className={classes.pageContent}>
              <main className={classes.content}>
                <div className={clsx(classes.appBarSpacer, classes.appTitle)} />
                <Container maxWidth="lg" className={classes.container}>
                  <Paper className={classes.paper} elevation={0}>
                    <Typography component="h2" variant="h5">
                      An error occurred.
                    </Typography>
                  </Paper>
                </Container>
              </main>
            </div>
          </div>
        );
      }}
    </Query>
  );
}
