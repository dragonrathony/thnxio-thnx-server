import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import { Mutation, ApolloConsumer } from "react-apollo";
import { gql } from "apollo-boost";

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  menu: {
    width: 200
  },
  error: {
    color: theme.palette.error.main
  },
  nameContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  nameField: {
    width: 200
  }
}));

function UserForm(props) {
  const classes = useStyles();
  let { data } = props;

  return (
    <ApolloConsumer>
      {client => {
        return (
          <Mutation
            mutation={gql`
              mutation UserMutation(
                $firstName: String!
                $lastName: String!
                $email: String!
              ) {
                createThnxAdmin(
                  firstName: $firstName
                  lastName: $lastName
                  email: $email
                ) {
                  user {
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
                  errors
                }
              }
            `}
          >
            {(createThnxAdmin, { loading, error }) => {
              return (
                <Formik
                  initialValues={data}
                  validationSchema={Yup.object().shape({
                    email: Yup.string()
                      .email()
                      .required("Required"),
                    firstName: Yup.string().required("Required"),
                    lastName: Yup.string().required("Required")
                  })}
                  onSubmit={(values, actions) => {
                    // call mutation here
                    createThnxAdmin({
                      variables: {
                        firstName: values.firstName,
                        lastName: values.lastName,
                        email: values.email
                      }
                    })
                      .then(response => {
                        actions.setSubmitting(false);
                        let data =
                          response &&
                          response.data &&
                          response.data.createThnxAdmin;
                        if (data.user) {
                          let dataCache = client.readQuery({
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
                            `
                          });
                          // Add our accountUsers from the mutation to the end.
                          dataCache.accountUsers.push(data.user);
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
                                  last7DaysGivingActivity
                                  isAdmin
                                  lastSignInAt
                                  resetPasswordSentAt
                                }
                              }
                            `,
                            data: dataCache
                          });
                          props.handleClose();
                        } else {
                          actions.setErrors(data.errors);
                        }
                      })
                      .catch(error => {
                        console.log(error);
                        actions.setSubmitting(false);
                        actions.setErrors(
                          "Server error occurred. Please try again."
                        );
                      });
                  }}
                >
                  {props => {
                    const {
                      values,
                      touched,
                      errors,
                      isSubmitting,
                      handleChange,
                      handleBlur,
                      handleSubmit
                    } = props;

                    return (
                      <form
                        onSubmit={handleSubmit}
                        className={classes.form}
                        noValidate
                      >
                        <div className={classes.nameContainer}>
                          <TextField
                            margin="normal"
                            required
                            label="First Name"
                            name="firstName"
                            autoFocus
                            className={classes.nameField}
                            value={values.firstName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            helperText={
                              errors.firstName &&
                              touched.firstName &&
                              errors.firstName
                            }
                          />

                          <TextField
                            margin="normal"
                            required
                            label="Last Name"
                            name="lastName"
                            className={classes.nameField}
                            value={values.lastName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            helperText={
                              errors.lastName &&
                              touched.lastName &&
                              errors.lastName
                            }
                          />
                        </div>
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          label="Email"
                          name="email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          helperText={
                            errors.email && touched.email && errors.email
                          }
                        />
                        <div className={classes.error}>{errors[0]}</div>
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          color="primary"
                          className={classes.submit}
                          disabled={isSubmitting}
                        >
                          Save
                        </Button>
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

export default withRouter(UserForm);
