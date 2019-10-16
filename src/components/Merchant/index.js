import React from "react";
import { gql } from "apollo-boost";
import { withRouter } from "react-router-dom";
import ContentLoader from "react-content-loader";
import Form from "./Detail";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Page from "../Page";
import { Query } from "react-apollo";
import { Redirect } from "react-router";
import { RollbarContext } from "../../rollbar-context";
const _ = require("lodash");

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    background: "#374359",
    height: "100vh",
    overflow: "auto",
    flexDirection: "column"
  },
  paper: {
    margin: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(2)
  },
  formContainer: {
    padding: theme.spacing(3, 5)
  },
  strong: {
    fontWeight: 600
  }
}));
function UpdateAccountPage(props) {
  const classes = useStyles();
  const rollbar = React.useContext(RollbarContext);
  return (
    <Query
      query={gql`
        query Account {
          account {
            id
            name
            code
            unitThnxPrice
            bsb
            accountNo
            abn
            primaryEmail
            accountUsers {
              user {
                id
                firstName
                lastName
                email
              }
            }
            addresses {
              id
              address1
              address2
              city
              state
              postcode
              latitude
              longitude
            }
          }
        }
      `}
    >
      {({ loading, error, data }) => {
        if (loading)
          return (
            <Page title="Account Details">
              <Paper className={classes.paper} elevation={0}>
                <ContentLoader
                  height={75}
                  width={300}
                  speed={2}
                  primaryColor="#f7fafc"
                  secondaryColor="#edf2f7"
                >
                  <rect x="10" y="10" rx="5" ry="5" width="290" height="15" />
                  <rect x="10" y="35" rx="5" ry="5" width="290" height="15" />
                  <rect x="110" y="60" rx="5" ry="5" width="80" height="15" />
                </ContentLoader>
              </Paper>
            </Page>
          );

        if (error) {
          console.log(error);
          rollbar.error(error);
          return <Redirect to="/error" />;
        }

        let merchant = data && _.cloneDeep(data.account);
        merchant.user =
          merchant.accountUsers.length > 0 && merchant.accountUsers[0].user;
        merchant.address =
          merchant.addresses.length > 0 && merchant.addresses[0];
        return (
          <Page title="Account Details">
            <Paper className={classes.paper} elevation={0}>
              <Form data={merchant} handleCreate={props.handleCreate} />
            </Paper>
          </Page>
        );
      }}
    </Query>
  );
}

export default withRouter(UpdateAccountPage);
