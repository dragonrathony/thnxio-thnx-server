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
import Footer from "../../Common/Footer";

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

function ForgotPasswordForm(props) {
  const classes = useStyles();
  const [localValues, setLocalValues] = React.useState({
    showSuccess: false
  });

  const handleSuccessReset = showSuccess => {
    setLocalValues({ showSuccess: showSuccess });
  };
  return (
    <ApolloConsumer>
      {client => {
        return (
          <Mutation
            mutation={gql`
              mutation ResetPasswordRequest($email: String!) {
                resetPasswordRequest(email: $email) {
                  success
                  errors
                }
              }
            `}
          >
            {(resetPasswordRequest, { loading, error }) => {
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
                            name: "",
                            firstName: "",
                            lastName: "",
                            email: ""
                          }}
                          validationSchema={Yup.object().shape({
                            email: Yup.string()
                              .email()
                              .required("Required")
                          })}
                          onSubmit={(values, actions) => {
                            // call mutation here
                            resetPasswordRequest({
                              variables: {
                                email: values.email
                              }
                            })
                              .then(response => {
                                handleSuccessReset(false);
                                actions.setSubmitting(false);
                                if (
                                  response &&
                                  response.data &&
                                  response.data.resetPasswordRequest &&
                                  response.data.resetPasswordRequest.success
                                ) {
                                  handleSuccessReset(true);
                                } else if (
                                  response &&
                                  response.data &&
                                  response.data.resetPasswordRequest.errors
                                ) {
                                  // We handle as if a success to not leak emails
                                  handleSuccessReset(true);
                                }
                              })
                              .catch(error => {
                                // We handle as if a success to not leak emails
                                handleSuccessReset(true);
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
                                  label="Email"
                                  name="email"
                                  value={values.email}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  helperText={
                                    errors.email &&
                                    touched.email &&
                                    errors.email
                                  }
                                />
                                {localValues.showSuccess ? (
                                  <div className={classes.success}>
                                    Thnx! Please check your email for password reset instructions.
                                  </div>
                                ) : (
                                  undefined
                                )}
                                <div className={classes.error}>{errors[0]}</div>
                                <Button
                                  type="submit"
                                  fullWidth
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

export default withRouter(ForgotPasswordForm);
