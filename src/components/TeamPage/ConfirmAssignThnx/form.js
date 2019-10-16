import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Mutation, ApolloConsumer } from "react-apollo";
import gql from "graphql-tag";
import { Formik } from "formik";
import { Typography } from "@material-ui/core";
import { RollbarContext } from "../../../rollbar-context";

const useStyles = makeStyles(theme => ({
  nameContainer: {
    display: "flex",
    justifyContent: "space-between"
  },
  button: {
    margin: theme.spacing(1)
  }
}));

export default function ConfirmAssignForm(props) {
  const classes = useStyles();
  const rollbar = React.useContext(RollbarContext);

  return (
    <ApolloConsumer>
      {client => {
        return (
          <Mutation
            mutation={gql`
              mutation AssignThnxEvenlyMutation($userIds: [Int!]!) {
                assignThnxEvenly(userIds: $userIds) {
                  errors
                }
              }
            `}
          >
            {(assignThnxEvenly, { loading, error }) => {
              return (
                <Formik
                  onSubmit={(values, actions) => {
                    // call mutation here
                    assignThnxEvenly({
                      variables: {
                        userIds: props.users.map(user => parseInt(user.id))
                      }
                    }).then(
                      response => {
                        actions.setSubmitting(false);

                        try {
                          client.query({
                            query: gql`
                              {
                                accountUsers {
                                  id
                                  firstName
                                  lastName
                                  email
                                  thnxCredits
                                  last7DaysGivingActivity
                                  isAdmin
                                  lastSignInAt
                                  resetPasswordSentAt
                                }
                              }
                            `,
                            fetchPolicy: "network-only"
                          });

                          // refetch unassigned thnx
                          client.query({
                            query: gql`
                              {
                                unassignedThnx {
                                  id
                                }
                              }
                            `,
                            fetchPolicy: "network-only"
                          });
                          props.handleClose();
                        } catch (error) {
                          console.log(error);
                          rollbar.error(error);
                          actions.setSubmitting(false);
                          actions.setErrors({ qty: "An error occurred" });
                        }
                      },
                      error => {
                        rollbar.error(error);
                        actions.setSubmitting(false);
                        actions.setErrors(error);
                      }
                    );
                  }}
                >
                  {formProps => {
                    const { handleSubmit } = formProps;
                    let available = Math.floor(
                      props.availableThnx / props.users.length
                    );
                    let message =
                      props.users.length > 0
                        ? available === 0
                          ? "There is not enough thnx! to distribute evenly."
                          : `Confirming this action will assign ${available} thnx!
                    to ${props.users.length} members.`
                        : "No users selected";
                    return (
                      <form
                        onSubmit={handleSubmit}
                        className={classes.form}
                        noValidate
                      >
                        <Typography>{message}</Typography>

                        <div className={classes.nameContainer}>
                          <Button
                            variant="contained"
                            color="default"
                            fullWidth
                            onClick={props.handleClose}
                            className={classes.button}
                          >
                            Cancel
                          </Button>
                          {available > 0 && props.users.length > 0 ? (
                            <Button
                              fullWidth
                              type="submit"
                              variant="contained"
                              color="primary"
                              className={classes.button}
                            >
                              Assign thnx!
                            </Button>
                          ) : (
                            undefined
                          )}
                        </div>
                      </form>
                    );
                  }}
                </Formik>
              );
            }}
          </Mutation>
        );
      }}
    </ApolloConsumer>
  );
}
