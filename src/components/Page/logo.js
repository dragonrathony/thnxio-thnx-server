import React from "react";
import { gql } from "apollo-boost";
import { makeStyles } from "@material-ui/core/styles";
import { Query } from "react-apollo";

const useStyles = makeStyles(theme => ({
  brandContainer: {
    padding: "24px"
  }
}));
export default function CompanyLogo(props) {
  const classes = useStyles();
  return (
    <Query
      query={gql`
        {
          account {
            id
            name
            imageUrl
          }
        }
      `}
    >
      {({ loading, error, data }) => {
        if (loading) return null;

        if (error) {
          console.log(error);
        }

        return data.account && data.account.imageUrl ? (
          <div className={classes.brandContainer}>
            <img src={data.account.imageUrl} width="80%" alt="Logo" />
          </div>
        ) : (
          <div className={classes.brandContainer}>
            <img
              src={require("../../assets/img/thnx_white.png")}
              width="80%"
              alt="Logo"
            />
          </div>
        );
      }}
    </Query>
  );
}
