import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import { Mutation, ApolloConsumer } from "react-apollo";
import { gql } from "apollo-boost";
import { CssBaseline } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import { Helmet } from "react-helmet";

const jwtDecode = require("jwt-decode");

const useStyles = makeStyles(theme => ({
  // palette: {
  //   type: "dark"
  // },
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
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  formContainer: {
    padding: theme.spacing(3, 5)
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    color: "#fff"
  },
  title: {
    color: "#fff",
    marginBottom: 12
  },
  subtitle: {
    color: "#fff"
  },
  error: {
    color: theme.palette.error.main
  },
  titleContainer: {
    textAlign: "left",
    marginTop: 24,
    marginBottom: 24,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  subtitleContainer: {
    textAlign: "center",
    marginTop: 24,
    marginBottom: 24
  },
  headerContainer: {
    display: "flex",
    justifyContent: "space-between"
  },
  mainContent: {},
  footer: {
    padding: theme.spacing(2),
    marginTop: "auto",
    textAlign: "center",
    backgroundColor: "#F7FAFC",
    color: "#718096"
  },
  strong: {
    fontWeight: 600
  },
  logoContainer: {
    display: "flex",
    justifyContent: "flex-end"
  },
  logo: {
    height: 225
  }
}));

function LoginPage(props) {
  const classes = useStyles();

  const [localValues, setLocalValues] = React.useState({
    showPassword: false
  });

  const handleClickShowPassword = () => {
    setLocalValues({ showPassword: !localValues.showPassword });
  };

  let handleLogin = () => {
    props.history.push("/merchant/account");
  };

  return (
    <ApolloConsumer>
      {client => (
        <Mutation
          mutation={gql`
            mutation LoginUserMutation($email: String!, $password: String!) {
              login(email: $email, password: $password) {
                userId
                token
                errors
              }
            }
          `}
        >
          {login => (
            <div className={classes.root}>
              <Helmet title="Login" />
              <CssBaseline />
              <div className={classes.mainContent}>
                <Container maxWidth="lg" className={classes.headerContainer}>
                  <div className={classes.titleContainer}>
                    <Typography
                      className={classes.title}
                      component="h1"
                      variant="h3"
                    >
                      Welcome to the thnx! Merchant Hub
                    </Typography>
                    <Typography
                      className={classes.subtitle}
                      component="h2"
                      variant="h5"
                    >
                      Sign in to view your transactions, invoices and activity
                    </Typography>
                  </div>
                  <div className={classes.logoContainer}>
                    <img
                      src={require("../../../assets/img/logo.png")}
                      className={classes.logo}
                      alt="logo"
                    />
                  </div>
                </Container>
                <Container component="main" maxWidth="sm">
                  <Paper className={classes.formContainer} elevation={0}>
                    <Formik
                      initialValues={{ email: "", password: "" }}
                      validationSchema={Yup.object().shape({
                        email: Yup.string()
                          .email()
                          .required("Required"),
                        password: Yup.string().required("Required")
                      })}
                      onSubmit={(values, { setSubmitting, setErrors }) => {
                        // call mutation here
                        localStorage.clear();
                        client && client.resetStore();

                        login({
                          variables: {
                            email: values.email,
                            password: values.password
                          }
                        })
                          .then(response => {
                            let data = response.data;
                            setSubmitting(false);
                            if (data.login && data.login.token) {
                              let token = data.login.token;
                              var decoded = jwtDecode(token);

                              let roles =
                                (decoded.roles &&
                                  decoded.roles.map(role => role)) ||
                                [];
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
                            } else if (data.login && data.login.errors) {
                              // need to show an error message below
                              setErrors(data.login.errors);
                            } else {
                              setErrors([
                                "Login failed. Please check your credentials and try again."
                              ]);
                            }
                          })
                          .catch(error => {
                            console.log(error);
                            setErrors([
                              "Error occurred. Please try again later."
                            ]);
                            setSubmitting(false);
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
                        console.log(errors);
                        return (
                          <form
                            onSubmit={handleSubmit}
                            className={classes.form}
                            noValidate
                          >
                            <TextField
                              variant="outlined"
                              margin="normal"
                              required
                              fullWidth
                              label="Your email address"
                              name="email"
                              autoFocus
                              value={values.email}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              helperText={
                                errors.email && touched.email && errors.email
                              }
                            />

                            <TextField
                              variant="outlined"
                              margin="normal"
                              required
                              fullWidth
                              name="password"
                              label="Your password"
                              type={
                                localValues.showPassword ? "text" : "password"
                              }
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
                            <FormControlLabel
                              control={
                                <Checkbox value="remember" color="primary" />
                              }
                              label="Remember me"
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
                              Login
                            </Button>
                            <Grid container>
                              <Grid item xs>
                                <RouterLink
                                  to={"/forgotme"}
                                  className={classes.link}
                                >
                                  Forgot password?
                                </RouterLink>
                              </Grid>
                              <Grid item>
                                <RouterLink
                                  to={"/merchant/create"}
                                  className={classes.link}
                                >
                                  {"Don't have an account? Sign Up"}
                                </RouterLink>
                              </Grid>
                            </Grid>
                          </form>
                        );
                      }}
                    </Formik>
                  </Paper>
                  <div className={classes.subtitleContainer}>
                    <Link href="https://thnx.io/cafe/" target="_blank">
                      <Typography
                        className={classes.subtitle}
                        component="h2"
                        variant="h6"
                      >
                        Learn how thnx! works for cafes
                      </Typography>
                    </Link>
                  </div>
                  <div className={classes.subtitleContainer}>
                    <Link
                      href="https://hub.thnx.io/"
                      style={{ color: "white" }}
                    >
                      <Typography component="p">
                        Are you a corporate? Log in here
                      </Typography>
                    </Link>
                  </div>
                </Container>
              </div>
              <div className={classes.footer}>
                <Typography>
                  Powering{" "}
                  <span className={classes.strong}>
                    The Gratitude Economy &trade;
                  </span>{" "}
                  with your thnx!
                </Typography>
                Our{" "}
                <Link color="inherit" href="http://thnx.io/privacypolicy">
                  Privacy Policy
                </Link>
                | &copy; Thnx Pty Ltd 2019 | ABN: 29 631 324 804 |{" "}
                <Link color="inherit" href="mailto:admin@thnx.io">
                  hello@thnx.io
                </Link>{" "}
                - Level 5, 200 Adelaide Street, Brisbane QLD 4000
              </div>
            </div>
          )}
        </Mutation>
      )}
    </ApolloConsumer>
  );
}

export default withRouter(LoginPage);
