import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Hidden from '@material-ui/core/Hidden';
import Container from '@material-ui/core/Container';
import { Formik } from 'formik';
import * as Yup from "yup";
import BasePage from "../BasePage";
import { gql } from "apollo-boost";
import { Mutation, ApolloConsumer } from "react-apollo";
import CircularProgress from '@material-ui/core/CircularProgress';

const jwtDecode = require("jwt-decode");
const thnxTokenName = 'thnx.token';

const REGISTER_USER_MUTATION = gql`
  mutation RegisterUserMutation($email: String!, $firstName: String!, $lastName: String!) {
    registerUser(email: $email, firstName: $firstName, lastName: $lastName) {
      userId
      token
      errors
    }
  }
`;

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    position: "relative",
    justifyContent: "center"
  },
  logoContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    margin: theme.spacing(2),
  },
  logo: {
    width: "100%",
    maxWidth: "160px"
  },
  contentContainer: {
    display: "flex",
    flexGrow: 1,
    flexDirection: "column",
    padding: theme.spacing(4, 16, 4, 16),
  },
  formContainer: {
    display: "flex",
    flexGrow: 1
  },
  form: {
    display: "flex",
    flexGrow: 1,
    flexDirection: "column",
    width: "100%",
    textAlign: "center"
  },
  formInnerContainer: {
    display: "flex",
    flexGrow: 1,
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "stretch"
  },
  formInputContainer: {
    flexGrow: 1
  },
  formButtonContainer: {
    display: "flex",
    flexDirection: "column"
  },
  input: {
    fontSize: "1.2rem",
    fontWeight: "200",
    borderRadius: "0px",
    "& fieldset": {
      borderRadius: theme.spacing(0.25),
    }
  },
  emailTextField: {
    background: theme.palette.background.light,
    margin: theme.spacing(3, 0, 2, 0)
  },
  messageTextField: {
    flexGrow: 1,
    background: theme.palette.background.light,
    margin: theme.spacing(0, 0, 3, 0)
  },
  error: {
    color: theme.palette.error.main,
    padding: theme.spacing(0, 0, 2, 0),
    alignSelf: "center"
  },
  signIn: {
    padding: theme.spacing(1, 2),
    textTransform: "none",
    fontSize: "1.2rem",
    fontWeight: 400,
    alignSelf: "flex-end",
    borderRadius: theme.spacing(0.25)
  },
  submit: {
    background: theme.palette.secondary.main,
    color: theme.palette.text.white,
    padding: theme.spacing(1.5, 0),
    textTransform: "none",
    fontSize: "1.4rem",
    borderRadius: theme.spacing(0.25),
  },
  info: {
    textTransform: "none",
    fontSize: "1.2rem",
    width: "100%",
    padding: theme.spacing(1, 0),
    fontWeight: "200",
    textAlign: "center"
  }
}));

export default function SignUpPage(props) {
  const classes = useStyles();
  const logoImageUrl = require("../../../assets/img/logo.png");
  const imageUrl = require("../../../assets/img/welcome_bernie.png");

  const headerMessage = "Welcome!"

  const initialValues = {
    firstName: '',
    lastName: '',
    email: ''
  };

  const schemaValidation = () => {
    return Yup.object().shape({ 
      firstName: Yup.string().required("Required"),
      lastName: Yup.string().required("Required"),
      email: Yup.string().email("Must be a valid email").required("Required")
    });
  }
  
  const onSubmit = (values, actions, registerUser, client) => {
    localStorage.clear();
    client && client.resetStore();

    registerUser({
      variables: {
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName
      }
    })
    .then(response => {
      actions.setSubmitting(false);
      let data = response.data;
      
      // Set the token and roles 
      if (data.registerUser && data.registerUser.token) {
        let token = data.registerUser.token;
        var decoded = jwtDecode(token);

        let roles = (decoded.roles && decoded.roles.map(role => role)) || [];
        localStorage.setItem(thnxTokenName, token);
        client.writeData({ data: { roles: roles, isLoggedIn: true }});

        // Navigate to the app
        props.history.push(`${props.match.path}/${props.routes.app}`);
      } 
      else if (data.registerUser && data.registerUser.errors) {
        actions.setErrors(data.registerUser.errors);
      } 
      else {
        actions.setErrors(["Error occurred. Please try again later."]);
      }
    })
    .catch(error => {
      actions.setSubmitting(false);
      actions.setErrors(["Error occurred. Please try again later."]);
    });

  };

  const signIn = () => {
    props.history.push(`${props.match.path}/${props.routes.signIn}`);
  }

  const form = ({values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting}) => (    
    <form className={classes.form} onSubmit={handleSubmit} noValidate>
      <div className={classes.formInnerContainer}>

        <div className={classes.formInputContainer}>

          {/* First Name */}
          <TextField
            className={classes.input}
            fullWidth
            autoFocus
            placeholder="First Name"
            value={values.firstName}
            name="firstName"
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            variant="outlined"
            disabled={isSubmitting}
            helperText={
              errors.firstName &&
              touched.firstName &&
              errors.firstName
            }
            InputProps={{ className: classes.input }}
          />

          {/* Last Name */}
          <TextField
            className={classes.input}
            fullWidth
            placeholder="Last Name"
            value={values.lastName}
            name="lastName"
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            variant="outlined"
            disabled={isSubmitting}
            helperText={
              errors.lastName &&
              touched.lastName &&
              errors.lastName
            }
            InputProps={{ className: classes.input }}
          />

          {/* Email */}
          <TextField
            className={classes.input}
            fullWidth
            placeholder="Email"
            value={values.email}
            name="email"
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            variant="outlined"
            disabled={isSubmitting}
            helperText={
              errors.email &&
              touched.email &&
              errors.email
            }
            InputProps={{ className: classes.input }}
          />

          <div className={classes.error}>{errors[0]}</div>

        </div>

        <div className={classes.formButtonContainer}>

            {/* Submit Button */}
            <Button
              type="submit"
              className={classes.submit}
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress /> : 'CREATE ACCOUNT'}
            </Button>

            {/* Sign In Button */}
            <Button
              className={classes.signIn}
              onClick={signIn}
              disabled={isSubmitting}
            >
              Existing Account?
            </Button>

        </div>

      </div>
    </form>
  );

  return (
    <ApolloConsumer>
      {client => (
        <Mutation mutation={REGISTER_USER_MUTATION}>
          {(registerUser) => (
            <Container className={classes.container} fixed>
              
              <Hidden smDown>
                <div className={classes.logoContainer}>
                  <img className={classes.logo} src={logoImageUrl} alt="Logo image" />
                </div>
              </Hidden>

              <BasePage 
                {...props}
                imageUrl={imageUrl}
                message={headerMessage}>

                <div className={classes.contentContainer}>

                  <div className={classes.formContainer}>
                    <Formik
                      initialValues={initialValues}
                      validationSchema={schemaValidation}
                      onSubmit={(values, actions) => { onSubmit(values, actions, registerUser, client) }}>
                      {form}
                    </Formik>
                  </div>

                </div>

              </BasePage>

            </Container>
          )}
        </Mutation>
      )}
    </ApolloConsumer>
  );
}
