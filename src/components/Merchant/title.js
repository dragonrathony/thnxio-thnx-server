import React from "react";
import { Redirect } from "react-router-dom";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import LoadingSpinner from "../LoadingSpinner";
import { Query } from "react-apollo";
import gql from "graphql-tag";
const useStyles = makeStyles(theme => ({
  title: {
    color: "#333d51",
    fontWeight: 900
  }
}));

function OrganisationTitle(props) {
  const classes = useStyles();

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
        if (loading) return <LoadingSpinner />;
        if (error) return <p>Error :(</p>;

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
