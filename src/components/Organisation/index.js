import React from "react";
import { gql } from "apollo-boost";
import { withRouter } from "react-router-dom";
import ContentLoader from "react-content-loader";
import Form from "./form";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Page from "../Page";
import { Query } from "react-apollo";
import { Redirect } from "react-router";
import { RollbarContext } from "../../rollbar-context";

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
        {
          account {
            id
            name
            imageUrl
            abn
          }
        }
      `}
    >
      {({ loading, error, data }) => {
        if (loading)
          return (
            <Page title="Organisation Details">
              <Paper className={classes.paper}>
                <ContentLoader
                  height={50}
                  width={300}
                  speed={2}
                  primaryColor="#f7fafc"
                  secondaryColor="#edf2f7"
                >
                  <rect x="10" y="10" rx="5" ry="5" width="290" height="15" />
                  <rect x="110" y="35" rx="5" ry="5" width="80" height="15" />
                </ContentLoader>
              </Paper>
            </Page>
          );

        if (error) {
          console.log(error);
          rollbar.error(error);
          return <Redirect to="/error" />;
        }

        console.log(data);

        return (
          <Page title="thnx! Account Details">
            <Paper className={classes.paper} elevation={0}>
              <Form account={data.account} />
            </Paper>
          </Page>
        );
      }}
    </Query>
  );
}

export default withRouter(UpdateAccountPage);
