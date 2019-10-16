import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import { Mutation, ApolloConsumer } from "react-apollo";
import { gql } from "apollo-boost";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Logo from "../../Common/Logo";
import { InputAdornment, IconButton } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Footer from "../../Common/Footer";
const jwtDecode = require("jwt-decode");
const _ = require("lodash");
Yup.addMethod(Yup.mixed, "sameAs", function(ref, message) {
  return this.test("sameAs", message, function(value) {
    let other = this.resolve(ref);

    return !other || !value || value === other;
  });
});

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
  subtitle: {
    color: "#fff",
    textAlign: "center",
    marginBottom: 12
  },
  mainContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
  error: {
    color: theme.palette.error.main
  },
  success: {
    color: theme.palette.primary.main
  }
}));

function ResetPasswordForm(props) {
  // Clear token to make sure there is no logged in user
  localStorage.removeItem("thnx.token");

  const classes = useStyles();
  const [localValues, setLocalValues] = React.useState({
    showSuccess: false,
    showPassword: false
  });

  const token = props.match.params.token;
  const handleClickShowPassword = () => {
    setLocalValues({ showPassword: !localValues.showPassword });
  };
  let handleLogin = () => {
    props.history.push("/team");
  };

  return (
    <ApolloConsumer>
      {client => {
        return (
          <Mutation
            mutation={gql`
              mutation ResetPasswordRequest(
                $password: String!
                $passwordConfirm: String!
                $token: String!
              ) {
                resetPassword(
                  password: $password
                  passwordConfirmation: $passwordConfirm
                  resetPasswordToken: $token
                ) {
                  token
                  userId
                  errors
                }
              }
            `}
          >
            {(resetPassword, { loading, error }) => {
              return (
                <div className={classes.root}>
                  <CssBaseline />
                  <div className={classes.mainContent}>
                    <Container component="main" maxWidth="sm">
                      <Typography
                        className={classes.subtitle}
                        component="h2"
                        variant="h5"
                      >
                        Let's reset your thnx! password
                      </Typography>
                      <Paper className={classes.formContainer} elevation={0}>
                        <Logo />
                        <Formik
                          initialValues={{
                            passwordConfirm: "",
                            password: ""
                          }}
                          validationSchema={Yup.object().shape({
                            password: Yup.string()
                              .min(6, "Password needs at least 6 characters")
                              .required("Required"),
                            passwordConfirm: Yup.string().oneOf(
                              [Yup.ref("password"), null],
                              "Passwords must match"
                            )
                          })}
                          onSubmit={(values, actions) => {
                            // call mutation here
                            resetPassword({
                              variables: {
                                password: values.password,
                                passwordConfirm: values.passwordConfirm,
                                token: token
                              }
                            })
                              .then(response => {
                                actions.setSubmitting(false);
                                if (
                                  response &&
                                  response.data &&
                                  response.data.resetPassword &&
                                  response.data.resetPassword.token
                                ) {
                                  let token = response.data.resetPassword.token;
                                  var decoded = jwtDecode(token);
                                  let roles =
                                    (decoded.roles &&
                                      decoded.roles.map(role => role)) ||
                                    [];
                                  let isAuthorized =
                                    roles.length > 0 &&
                                    _.intersection(
                                      ["super_admin", "account_admin"],
                                      roles
                                    ).length > 0;

                                  if (!isAuthorized) {
                                    props.history.push("/download-apps");
                                  } else {
                                    // set token in local storage
                                    localStorage.setItem("thnx.token", token);
                                    // set some local data via client
                                    client.writeData({
                                      data: {
                                        roles: roles,
                                        isLoggedIn: true
                                      }
                                    });
                                    handleLogin();
                                  }
                                } else if (
                                  response &&
                                  response.data &&
                                  response.data.resetPassword.errors
                                ) {
                                  actions.setErrors(
                                    response.data.resetPassword.errors
                                  );
                                }
                              })
                              .catch(error => {
                                console.log(error);
                                actions.setErrors([
                                  "Error occurred. Please try again later."
                                ]);
                                actions.setSubmitting(false);
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
                                <TextField
                                  margin="normal"
                                  required
                                  fullWidth
                                  label="Password"
                                  name="password"
                                  value={values.password}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  type={
                                    localValues.showPassword
                                      ? "text"
                                      : "password"
                                  }
                                  helperText={
                                    errors.password &&
                                    touched.password &&
                                    errors.password
                                  }
                                  InputProps={{
                                    inputProps: { tabIndex: 1 },
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
                                  label="Confirm Password"
                                  name="passwordConfirm"
                                  value={values.passwordConfirm}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  type="password"
                                  helperText={
                                    errors.passwordConfirm &&
                                    touched.passwordConfirm &&
                                    errors.passwordConfirm
                                  }
                                  InputProps={{
                                    inputProps: { tabIndex: 2 }
                                  }}
                                />
                                <div className={classes.error}>{errors[0]}</div>
                                <Button
                                  type="submit"
                                  fullWidth
                                  tabIndex="3"
                                  variant="contained"
                                  color="primary"
                                  className={classes.submit}
                                  disabled={isSubmitting}
                                >
                                  Reset Password
                                </Button>
                              </form>
                            );
                          }}
                        </Formik>
                      </Paper>
                    </Container>
                  </div>
                  <Footer />
                </div>
              );
            }}
          </Mutation>
        );
      }}
    </ApolloConsumer>
  );
}

export default withRouter(ResetPasswordForm);
