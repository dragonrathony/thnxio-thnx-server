import React from "react";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { ApolloLink } from "apollo-link";
import { setContext } from "apollo-link-context";
import { BatchHttpLink } from "apollo-link-batch-http";
import { createUploadLink } from "apollo-upload-client";
import { BrowserRouter as Router } from "react-router-dom";
import { StripeProvider } from "react-stripe-elements";
import { Helmet } from "react-helmet";
import Rollbar from "rollbar";
import ErrorBoundary from "./components/ErrorBoundary";
import { RollbarContext } from "./rollbar-context";
import Routes from "./routes";
import "./App.css";
import Script from "react-load-script";

import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from "./theme";

var rollbar = new Rollbar({
  accessToken: process.env.REACT_APP_ROLLBAR_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    environment: process.env.REACT_APP_RAILS_ENV
  }
});

const jwtDecode = require("jwt-decode");
const cache = new InMemoryCache();

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("thnx.token");

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ""
    }
  };
});

const options = {
  uri: "/graphql"
};

const link = ApolloLink.split(
  operation => operation.getContext().hasUpload,
  createUploadLink(options),
  new BatchHttpLink(options)
);

const client = new ApolloClient({ cache, link: authLink.concat(link) });

let roles = [];
const token = localStorage.getItem("thnx.token");
if (token) {
  var decoded = jwtDecode(token);
  if (decoded) {
    roles = (decoded.roles && decoded.roles.map(role => role)) || [];
  }
}

const isLoggedIn = token && roles;

client.writeData({
  data: {
    roles: roles,
    isLoggedIn: isLoggedIn
  }
});
//{isLoggedIn ? <Redirect to="/team" /> : undefined}
//    <Script url="https://stagingaz.blob.core.windows.net/thnx-embedded-map/thnx-embedded-map.js" />
function App() {
  return (
    <RollbarContext.Provider value={rollbar}>
      <ErrorBoundary>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <Script url="https://maps.googleapis.com/maps/api/js?key=AIzaSyD6KWwywlg2RCoUXQ-dBdauv8JeRcwTeaI" />
          <StripeProvider apiKey={process.env.REACT_APP_STRIPE_API_KEY}>
            <ApolloProvider client={client}>
              <Router>
                <Helmet titleTemplate="thnx! %s" />
                {/* <DashboardPage/> */}
                {/* <LoginPage/> */}
                <Routes />
              </Router>
            </ApolloProvider>
          </StripeProvider>
        </MuiThemeProvider>
      </ErrorBoundary>
    </RollbarContext.Provider>
  );
}

export default App;
