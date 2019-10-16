import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { Helmet } from "react-helmet";
import PageFooter from "./footer";
import Menu from "./menu";
import Header from "./header";
import { Query, ApolloConsumer } from "react-apollo";
import gql from "graphql-tag";
import UpdateProfile from "../Account/ProfilePage";
import { Redirect } from "react-router";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    background: "#F7FAFC",
    minHeight: "100vh"
  },
  appBarSpacer: theme.mixins.toolbar,
  menuBarSpacer: {},
  pageContent: {
    flex: 1,
    //height: "100vh",
    //overflow: "auto",
    marginLeft: "240px",
    display: "flex",
    flexDirection: "column"
  },
  content: {
    flex: "1 0 auto"
  },
  container: {
    paddingBottom: theme.spacing(2)
  },
  appTitle: {
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: 10
  }
}));

export default function Page(props) {
  const classes = useStyles();
  const [loggedOut, setLoggedOut] = React.useState(false);
  const [open, setOpen] = React.useState(true);

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [openProfile, setProfileOpen] = React.useState(false);
  const handleOpen = id => {
    setProfileOpen(true);
  };

  const handleClose = () => {
    setProfileOpen(false);
  };
  let handleLogout = (client, roles) => {
    localStorage.clear();
    client && client.resetStore();
    setLoggedOut(true);
  };
  return loggedOut ||
    !localStorage.getItem("thnx.token") ||
    localStorage.getItem("thnx.token") === null ? (
    <Redirect to="/" />
  ) : (
    <ApolloConsumer>
      {client => (
        <Query
          query={gql`
            query IsUserLoggedIn {
              roles @client
              isLoggedIn @client
            }
          `}
        >
          {({ data, loading, error }) => {
            if (error) return null;
            if (loading) return null;

            return (
              <div className={classes.root}>
                <Helmet title={props.title} />
                <CssBaseline />
                <Header
                  open
                  onProfileClicked={handleOpen}
                  onLogoutClicked={() => handleLogout(client)}
                  title={props.title}
                />
                <Menu
                  open={open}
                  handleDrawerClose={handleDrawerClose}
                  onLogoutClicked={() => handleLogout(client)}
                  data={data}
                />
                <UpdateProfile open={openProfile} handleClose={handleClose} />
                <div className={classes.pageContent}>
                  <main className={classes.content}>
                    <div
                      className={clsx(classes.appBarSpacer, classes.appTitle)}
                    />
                    <Container maxWidth="lg" className={classes.container}>
                      {props.children}
                    </Container>
                  </main>
                  <PageFooter />
                </div>
              </div>
            );
          }}
        </Query>
      )}
    </ApolloConsumer>
  );
}
