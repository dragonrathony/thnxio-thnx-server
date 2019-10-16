import React from "react";
import { Redirect } from "react-router-dom";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import ContentLoader from "react-content-loader";
import Typography from "@material-ui/core/Typography";
import LoadingSpinner from "../LoadingSpinner";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { RollbarContext } from "../../rollbar-context";
const useStyles = makeStyles(theme => ({
  title: {
    color: "#333d51",
    fontWeight: 900
  }
}));

function OrganisationTitle(props) {
  const classes = useStyles();
  const rollbar = React.useContext(RollbarContext);

  return (
    <Query
      query={gql`
        {
          account {
            id
            name
          }
        }
      `}
    >
      {({ loading, error, data }) => {
        if (loading)
          return (
            <ContentLoader
              height={25}
              width={500}
              speed={2}
              primaryColor="#f7fafc"
              secondaryColor="#edf2f7"
            >
              <rect x="420" y="8" rx="4" ry="4" width="80" height="12" />
            </ContentLoader>
          );
        if (error) {
          rollbar.error(error);
          return <Redirect to="/error" />;
        }

        return (
          <Typography className={classes.title} component="h1" variant="h4">
            {data.account.name}
          </Typography>
        );
      }}
    </Query>
  );
}
export default OrganisationTitle;
