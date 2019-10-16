import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import MicrosoftTeamsPage from "./MicrosoftTeamsPage";
import SignInPage from "./SignInPage";
import SignUpPage from "./SignUpPage";
import ErrorPage from "./ErrorPage";
import { Route, Redirect, Switch } from "react-router-dom";

const jwtDecode = require("jwt-decode");

const thnxTokenName = 'thnx.token';

const routes = {
  baseRoute: 'ms-teams',
  signIn: 'sign-in',
  signUp: 'sign-up',
  app: 'app',
  error: 'error'
};

const useStyles = makeStyles(theme => ({
  '@global': {
    'body': {
      background: theme.palette.background.light,
    }
  },
  root: {
    display: "flex",
    height: "100vh",
    justifyContent: "center"
  }
}));

const getDecodedToken = () => {
  const token = localStorage.getItem(thnxTokenName);
  if (!token) return null;
  return jwtDecode(token);
}

export default function MicrosoftTeamsApp(props) {
  const classes = useStyles();

  // First check that the user is logged in
  var token = getDecodedToken();
  const isLoggedIn = !!token;

  return (
    <div className={classes.root}>
      <Switch>
        <Route exact path={`/${routes.baseRoute}/${routes.signIn}`} render={() => <SignInPage {...props} routes={routes} />} />
        <Route exact path={`/${routes.baseRoute}/${routes.signUp}`} render={() => <SignUpPage {...props} routes={routes} />} />
        <Route exact path={`/${routes.baseRoute}/${routes.error}`} render={() => <ErrorPage {...props} routes={routes} />} />

        {/* Redirect from the base route to the /app route */}
        <Redirect exact from={`/${routes.baseRoute}`} to={`/${routes.baseRoute}/${routes.app}`} />

        {/* App Component */}
        <Route exact path={`/${routes.baseRoute}/${routes.app}`} render={
          () => isLoggedIn ? <MicrosoftTeamsPage {...props} routes={routes} /> : <Redirect to={`/${routes.baseRoute}/${routes.signIn}`} />
        } />

        <Redirect to={`/${routes.baseRoute}`} />
      </Switch>
    </div>
  );
}



