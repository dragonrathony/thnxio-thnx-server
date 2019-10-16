import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import { Mutation, ApolloConsumer } from "react-apollo";
import RemoveIcon from "@material-ui/icons/Remove";
import gql from "graphql-tag";
import { Formik } from "formik";
import * as Yup from "yup";
import { RollbarContext } from "../../rollbar-context";

const useStyles = makeStyles(theme => ({
  more: {
    color: "#9FAEC0",
    "&:hover": {
      backgroundColor: "#F7FAFC"
    }
  },
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  qtyContainer: {
    padding: theme.spacing(4),
    justifyContent: "center"
  },
  inputField: {
    textAlign: "center",
    fontSize: 24,
    width: "100px"
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: 900
  },
  subtitle: {
    textAlign: "center",
    fontSize: 16,
    color: "#A6A6A6"
  },
  assignThnxContainer: {
    padding: 24
  },
  modal: {
    position: "absolute",
    width: 500,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: "none",
    borderRadius: "6px"
  }
}));

export default function AssignThnxModal(props) {
  const classes = useStyles();

  const rollbar = React.useContext(RollbarContext);

  function handleClose() {
    props.handleClose();
  }

  return (
    <ApolloConsumer>
      {client => {
        return (
          <React.Fragment>
            <Mutation
              mutation={gql`
                mutation AssignThnxMutation($userId: Int!, $qty: Int!) {
                  assignThnx(userId: $userId, qty: $qty) {
                    user {
                      id
                      firstName
                      lastName
                      email
                      thnxCredits
                    }
                    errors
                  }
                }
              `}
            >
              {(assignThnx, { loading, error }) => {
                return (
                  <Formik
                    initialValues={{ qty: props.qty }}
                    validationSchema={Yup.object().shape({
                      qty: Yup.string().required("Required")
                    })}
                    onSubmit={(values, actions) => {
                      // call mutation here
                      assignThnx({
                        variables: {
                          userId: parseInt(props.user.id),
                          qty: parseInt(values.qty)
                        }
                      }).then(
                        response => {
                          actions.setSubmitting(false);

                          try {
                            let dataCache = client.readQuery({
                              query: gql`
                                {
                                  accountUsers {
                                    id
                                    firstName
                                    lastName
                                    email
                                    thnxCredits
                                    isAdmin
                                  }
                                }
                              `
                            });
                            let user = response.data.assignThnx.user;
                            // Add our accountUsers from the mutation to the end.
                            let accountUser = dataCache.accountUsers.find(
                              u => u.id === user.id
                            );
                            dataCache.accountUsers[
                              dataCache.accountUsers.indexOf(accountUser)
                            ] = user;
                            // Write our data back to the cache.
                            client.writeQuery({
                              query: gql`
                                {
                                  accountUsers {
                                    id
                                    firstName
                                    lastName
                                    email
                                    thnxCredits
                                    isAdmin
                                  }
                                }
                              `,
                              data: dataCache
                            });
                            handleClose();

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
                      const {
                        values,
                        touched,
                        errors,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        setFieldValue
                      } = formProps;

                      console.log(errors);

                      return (
                        <form
                          onSubmit={handleSubmit}
                          className={classes.form}
                          noValidate
                        >
                          <div className={classes.assignThnxContainer}>
                            <div className={classes.title}>
                              Assign thnx! to {props.user.firstName}
                            </div>
                            <div className={classes.subtitle}>
                              {props.maxQty} available
                            </div>
                            <div className={classes.qtyContainer}>
                              <div className={classes.inputContainer}>
                                <RemoveIcon
                                  onClick={() =>
                                    setFieldValue("qty", values.qty - 1)
                                  }
                                />
                                <FormControl>
                                  <Input
                                    required
                                    name="qty"
                                    autoFocus
                                    type="number"
                                    className={classes.inputContainer}
                                    inputProps={{
                                      className: classes.inputField,
                                      min: "0",
                                      max: props.maxQty,
                                      step: "1"
                                    }}
                                    value={values.qty}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                  <FormHelperText>
                                    {errors.qty && touched.qty && errors.qty}
                                  </FormHelperText>
                                </FormControl>
                                <AddIcon
                                  onClick={() => {
                                    if (values.qty - props.qty < props.maxQty) {
                                      setFieldValue("qty", values.qty + 1);
                                    }
                                  }}
                                />
                              </div>
                              <div className={classes.subtitle}>
                                {values.qty - props.qty > 0 ? "+" : ""}
                                {values.qty - props.qty !== 0
                                  ? values.qty - props.qty
                                  : ""}
                              </div>
                            </div>
                            <Button
                              type="submit"
                              fullWidth
                              variant="contained"
                              color="primary"
                              onClick={handleSubmit}
                            >
                              Update
                            </Button>
                          </div>
                        </form>
                      );
                    }}
                  </Formik>
                );
              }}
            </Mutation>
          </React.Fragment>
        );
      }}
    </ApolloConsumer>
  );
}
