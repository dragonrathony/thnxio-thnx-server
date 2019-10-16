import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import Loadable from "react-loadable";
import TeamPage from "./components/TeamPage";
import LeaderboardPage from "./components/LeaderboardPage";
import PaymentsPage from "./components/PaymentsPage";
import CreateAccountPage from "./components/Organisation/SignUp";
import UpdateAccountPage from "./components/Organisation";
import MicrosoftTeamsApp from "./components/MicrosoftTeamsApp";

import LoginPage from "./components/Account/Login";
import ResetPasswordPage from "./components/Account/ResetPassword";
import ForgotPasswordPage from "./components/Account/ForgotPassword";
import ConfirmAccountPage from "./components/Account/ConfirmAccount";

import MerchantLoginPage from "./components/Merchant/Login";
import CreateMerchantPage from "./components/Merchant/SignUp";
import MerchantPage from "./components/MerchantPage";
import UpdateMerchantPage from "./components/Merchant";
import TransactionPage from "./components/Merchant/Transaction";

import AdminMerchantPage from "./components/Admin/Merchants";
import AdminMerchantDetailPage from "./components/Admin/Merchants/Detail";

import PromotionPage from "./components/PromotionPage";
import PromotionLaunch from "./components/PromotionPage/launch";

import NotFoundPage from "./components/NotFoundPage";
import ErrorPage from "./components/ErrorPage";
import AppsPage from "./components/AppDownload";

import { Query } from "react-apollo";
import gql from "graphql-tag";
import ExternalMap from "./components/ExternalMap";
import RemittancePaymentPage from "./components/Merchant/Remittance";
import AdminRemittancePaymentPage from "./components/Admin/Remittance";

const _ = require("lodash");

const loadable = loader =>
  Loadable({
    loader,
    delay: false,
    loading: () => null
  });

const loadableRoutes = {
  // Default Pages
  "/login": {
    component: loadable(() => import("./components/Account/Login"))
  },
  "/merchant/login": {
    component: loadable(() => import("./components/Merchant/Login"))
  },
  "/team": {
    component: loadable(() => import("./components/TeamPage"))
  },
  "/leaderboard": {
    component: loadable(() => import("./components/LeaderboardPage"))
  },
  "/payments": {
    component: loadable(() => import("./components/PaymentsPage"))
  },
  "/createaccount": {
    component: loadable(() => import("./components/Organisation/SignUp"))
  },
  "/account": {
    component: loadable(() => import("./components/Organisation"))
  },
  "/reset_password": {
    component: loadable(() => import("./components/Account/ResetPassword"))
  },
  "/forgotme": {
    component: loadable(() => import("./components/Account/ForgotPassword"))
  },
  "/account_confirmed": {
    component: loadable(() => import("./components/Account/ConfirmAccount"))
  },
  "/merchants": {
    component: loadable(() => import("./components/MerchantPage"))
  },
  "/admin/merchants": {
    component: loadable(() => import("./components/Admin/Merchants"))
  },
  "/admin/remittance": {
    component: loadable(() => import("./components/Admin/Remittance"))
  },
  "/admin/merchants/:id": {
    component: loadable(() => import("./components/Admin/Merchants/Detail"))
  },
  "/merchant/transactions": {
    component: loadable(() => import("./components/Merchant/Transaction"))
  },
  "/merchant/payments": {
    component: loadable(() => import("./components/Merchant/Remittance"))
  },
  "/merchant/create": {
    component: loadable(() => import("./components/Merchant/SignUp"))
  },
  "/merchant": {
    component: loadable(() => import("./components/Merchant"))
  },
  "/promotion": {
    component: loadable(() => import("./components/PromotionPage"))
  },
  "/promotion/launch": {
    component: loadable(() => import("./components/PromotionPage/launch"))
  },
  "/ms-teams": {
    component: loadable(() => import("./components/MicrosoftTeamsApp"))
  },
};

class Routes extends React.Component {
  timeoutId = null;

  componentDidMount() {
    this.timeoutId = setTimeout(
      () =>
        Object.keys(loadableRoutes).forEach(path =>
          loadableRoutes[path].component.preload()
        ),
      5000 // load after 5 sec
    );
  }

  componentWillUnmount() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  render() {
    return (
      <Switch>
        <Route exact path="/" component={LoginPage} />
        <PrivateRoute
          exact
          path="/team"
          component={TeamPage}
          roles={["account_admin", "super_admin"]}
        />
        <PrivateRoute
          exact
          path="/leaderboard"
          component={LeaderboardPage}
          roles={["account_admin", "super_admin"]}
        />
        <PrivateRoute
          exact
          path="/payments"
          component={PaymentsPage}
          roles={["account_admin", "super_admin"]}
        />
        <Route exact path="/createaccount" component={CreateAccountPage} />
        <PrivateRoute
          exact
          path="/account"
          component={UpdateAccountPage}
          roles={["account_admin", "super_admin"]}
        />
        <Route
          exact
          path="/reset_password/:token"
          component={ResetPasswordPage}
        />
        <Route exact path="/account_confirmed" component={ConfirmAccountPage} />
        <Route exact path="/map" component={ExternalMap} />
        <Route exact path="/forgotme" component={ForgotPasswordPage} />
        <PrivateRoute
          exact
          path="/merchants"
          component={MerchantPage}
          roles={["account_admin", "super_admin"]}
        />
        <Route exact path="/merchant" component={MerchantLoginPage} />
        <Route exact path="/merchant/login" component={MerchantLoginPage} />
        <PrivateRoute
          exact
          path="/admin/merchants"
          component={AdminMerchantPage}
          roles={["super_admin"]}
        />
        <PrivateRoute
          exact
          path="/admin/remittance"
          component={AdminRemittancePaymentPage}
          roles={["super_admin"]}
        />
        <PrivateRoute
          exact
          path="/admin/merchant/:id"
          component={AdminMerchantDetailPage}
          roles={["super_admin"]}
        />
        <PrivateRoute
          exact
          path="/merchant/account"
          component={UpdateMerchantPage}
          roles={["merchant_admin"]}
        />
        <PrivateRoute
          exact
          path="/merchant/transactions"
          component={TransactionPage}
          roles={["merchant_admin"]}
        />
        <PrivateRoute
          exact
          path="/merchant/payments"
          component={RemittancePaymentPage}
          roles={["merchant_admin"]}
        />
        <Route exact path="/merchant/create" component={CreateMerchantPage} />
        <Route
          exact
          path="/promotion/:promo_code/:code"
          component={PromotionPage}
        />
        <Route exact path="/inspire2019" component={PromotionLaunch} />
        <Route exact path="/error" component={ErrorPage} />
        <Route exact path="/here/:code" component={AppsPage} />
        <Route exact path="/download-apps" component={AppsPage} />
        <Route path="/ms-teams" component={MicrosoftTeamsApp} />
        <Route component={NotFoundPage} />
      </Switch>
    );
  }
}

function PrivateRoute({ component: Component, roles, ...rest }) {
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

        let isAuthorized =
          !roles ||
          roles.length === 0 ||
          _.intersection(data.roles, roles).length > 0;

        return (
          <Route
            {...rest}
            render={props => {
              return loggedIn && isAuthorized ? (
                <Component {...props} />
              ) : (
                <Redirect
                  to={{
                    pathname: "/",
                    state: { from: props.location }
                  }}
                />
              );
            }}
          />
        );
      }}
    </Query>
  );
}

export { loadableRoutes };
export default Routes;
