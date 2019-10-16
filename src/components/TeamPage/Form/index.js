import React from "react";
import { gql } from "apollo-boost";
import { withRouter } from "react-router-dom";
import { Query } from "react-apollo";
import Form from "./form";
import { Typography } from "@material-ui/core";
import { Redirect } from "react-router";
import { RollbarContext } from "../../../rollbar-context";

const GET_USER_QUERY = gql`
  query userRequest($id: ID!) {
    user(id: $id) {
      id
      email
      firstName
      lastName
    }
  }
`;

function UserDetails(props) {
  const rollbar = React.useContext(RollbarContext);

  return props.id ? (
    <Query query={GET_USER_QUERY} variables={{ id: props.id }}>
      {({ loading, error, data }) => {
        if (loading) return <p>Loading...</p>;
        if (error) {
          rollbar.error(error);
          return <Redirect to="/error" />;
        }

        let user = data.user;
        return (
          <div>
            <Typography component="h6" variant="h5" color="textSecondary">
              {user.firstName}
            </Typography>
            <Form data={user} handleClose={props.handleClose} />
          </div>
        );
      }}
    </Query>
  ) : (
    <div>
      <Typography component="h6" variant="h5" color="textSecondary">
        Add Manager
      </Typography>
      <Form handleClose={props.handleClose} />
    </div>
  );
}

export default withRouter(UserDetails);
