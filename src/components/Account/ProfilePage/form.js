import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import { Mutation, ApolloConsumer } from "react-apollo";
import { gql } from "apollo-boost";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

function equalTo(ref, msg) {
  return this.test({
    name: "equalTo",
    exclusive: false,
    message: msg || "Must match ${reference}", // eslint-disable-line no-template-curly-in-string
    params: {
      reference: ref.path
    },
    test: function(value) {
      return value === this.resolve(ref);
    }
  });
}

Yup.addMethod(Yup.string, "equalTo", equalTo);
const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    background: "#374359",
    height: "100vh",
    overflow: "auto",
    flexDirection: "column"
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  error: {
    color: theme.palette.error.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    textAlign: "center"
  },
  formContainer: {
    padding: theme.spacing(3, 5)
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    color: "#fff"
  },
  strong: {
    fontWeight: 600
  },
  nameContainer: {
    display: "flex",
    justifyContent: "space-between"
  }
}));

function UpdateUserForm(props) {
  const classes = useStyles();

  const [localValues, setLocalValues] = React.useState({
    showPassword: false
  });

  const handleClickShowPassword = () => {
    setLocalValues({ showPassword: !localValues.showPassword });
  };
  return (
    <ApolloConsumer>
      {client => {
        return (
          <Mutation
            mutation={gql`
              mutation UpdateUser(
                $id: ID!
                $firstName: String!
                $lastName: String!
                $email: String!
                $password: String
                $passwordConfirmation: String
              ) {
                updateUser(
                  id: $id
                  firstName: $firstName
                  lastName: $lastName
                  email: $email
                  password: $password
                  passwordConfirmation: $passwordConfirmation
                ) {
                  user {
                    id
                    firstName
                    lastName
                  }
                  errors
                }
              }
            `}
          >
            {(updateUser, { loading, error }) => {
              return (
                <Formik
                  initialValues={props.user}
                  validationSchema={Yup.object().shape({
                    email: Yup.string()
                      .email()
                      .required("Required"),
                    firstName: Yup.string().required("Required"),
                    lastName: Yup.string().required("Required"),
                    passwordConfirmation: Yup.string().equalTo(
                      Yup.ref("password")
                    )
                  })}
                  onSubmit={(values, actions) => {
                    // call mutation here
                    updateUser({
                      variables: {
                        id: props.user.id,
                        firstName: values.firstName,
                        lastName: values.lastName,
                        email: values.email,
                        password: values.password,
                        passwordConfirmation: values.passwordConfirmation
                      }
                    })
                      .then(response => {
                        actions.setSubmitting(false);
                        let data = response.data.updateUser;
                        if (data && data.errors) {
                          actions.setErrors(data.errors);
                        } else {
                          props.handleClose();
                        }
                      })
                      .catch(error => {
                        console.log(error);
                        actions.setSubmitting(false);
                        actions.setErrors([
                          "Server error occured. Please try again"
                        ]);
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
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          name="password"
                          label="Your password"
                          type={localValues.showPassword ? "text" : "password"}
                          id="password"
                          autoComplete="current-password"
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          helperText={
                            errors.password &&
                            touched.password &&
                            errors.password
                          }
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  edge="end"
                                  aria-label="Toggle password visibility"
                                  onClick={handleClickShowPassword}
                                >
                                  {localValues.showPassword ? (
                                    <Visibility />
                                  ) : (
                                    <VisibilityOff />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                        />
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          name="passwordConfirmation"
                          label="Confirm your password"
                          type={localValues.showPassword ? "text" : "password"}
                          id="passwordConfirmation"
                          autoComplete="current-password"
                          value={values.passwordConfirmation}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          helperText={
                            errors.passwordConfirmation &&
                            touched.passwordConfirmation &&
                            errors.passwordConfirmation
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
                          Update
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

export default withRouter(UpdateUserForm);
