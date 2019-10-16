import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Typography } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { Formik } from 'formik';
import * as Yup from "yup";
import BasePage from "../BasePage";
import { gql } from "apollo-boost";
import { Mutation, ApolloConsumer } from "react-apollo";
import { RollbarContext } from "../../../rollbar-context";

const MS_TEAMS_SEND_THNX_MUTATION = gql`
  mutation MSTeamsSendThnx($email: String!, $message: String!) {
    msTeamsSendThnx(email: $email, message: $message) {
      errors
    }
  }
`;

const THNX_CREDITS_QUERY = gql`
{
  currentUser {
    thnxCredits
  }
}
`;


const useStyles = makeStyles(theme => ({
  container: {
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

export default function DetailsPage(props) {
  const classes = useStyles();
  const imageUrl = require("../../../assets/img/welcome_bernie.png");
  const infoMessage = "Your thnx! can be redeemed for a cup of coffee";
  const headerMessage = `YOU HAVE ${props.data.thnx} thnx! LEFT EACH thnx! GIVES ONE COFFEE`;
  const rollbar = React.useContext(RollbarContext);

  const initialValues = {
    email: props.data.email, 
    message: props.data.message
  };

  const schemaValidation = () => {
    return Yup.object().shape({ 
      email: Yup.string().email("Must be a valid email").required("Required")
    });
  }
  
  const onSubmit = (values, actions, msTeamsSendThnx, client) => {
    let data = props.data;
    data['email'] = values['email'];
    data['message'] = values['message'];
    props.setData(data);

    client && client.resetStore();

    msTeamsSendThnx({
      variables: {
        email: values['email'],
        message: values['message']
      }
    })
    .then(response => {
      let data = response.data;

      if (data.msTeamsSendThnx && data.msTeamsSendThnx.errors.length === 0) {
        // We want to refetch the thnxCredits for the currentUser
        client.query({
          query: THNX_CREDITS_QUERY,
          fetchPolicy: "network-only"
        }).then(response => {
          actions.setSubmitting(false);
          props.setCurrentStep(props.workflowSteps.CONGRATS);
        }).catch(error => {
          actions.setSubmitting(false);
          rollbar.error(error);
          props.history.push(`/${props.routes.baseRoute}/${props.routes.error}`);
        });
      } 
      else if (data.msTeamsSendThnx && data.msTeamsSendThnx.errors.length > 0) {
        actions.setSubmitting(false);
        actions.setErrors(data.msTeamsSendThnx.errors);
      } 
      else {
        actions.setSubmitting(false);
        actions.setErrors(["Error occurred. Please try again later."]);
      }
    })
    .catch(error => {
      actions.setSubmitting(false);
      actions.setErrors(["Error occurred. Please try again later."]);
    });
  };

  const form = ({values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting}) => (    
    <form className={classes.form} onSubmit={handleSubmit} noValidate>
      <div className={classes.formInnerContainer}>

        <div className={classes.formInputContainer}>

          {/* Email */}
          <TextField
            className={classes.emailTextField}
            fullWidth
            autoFocus
            placeholder="Recipient's email"
            value={values.email}
            name="email"
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            variant="outlined"
            helperText={
              errors.email &&
              touched.email &&
              errors.email
            }
            InputProps={{ className: classes.input }}
          />

          {/* Message */}
          <TextField
            className={classes.messageTextField}
            fullWidth
            placeholder="I am grateful for..."
            value={values.message}
            name="message"
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            variant="outlined"
            multiline={true}
            rows={6}
            InputProps={{ className: classes.input }}
          />

        </div>

        <div className={classes.formButtonContainer}>

          {/* Submit Button */}
          <Button
            type="submit"
            className={classes.submit}
            disabled={isSubmitting}
          >
            SEND MY thnx!
          </Button>

          {/* Info Message */}
          <Typography className={classes.info} variant="subtitle1" component="p">
            {infoMessage}
          </Typography>

        </div>

      </div>
    </form>
  );

  return (
    <ApolloConsumer>

      {client => (
        <Mutation mutation={MS_TEAMS_SEND_THNX_MUTATION}>
          {(msTeamsSendThnx) => (

            <BasePage 
              {...props}
              imageUrl={imageUrl}
              message={headerMessage}>
            
              <div className={classes.container}>

                <div className={classes.formContainer}>
                  <Formik
                    initialValues={initialValues}
                    validationSchema={schemaValidation}
                    onSubmit={(values, actions) => { onSubmit(values, actions, msTeamsSendThnx, client) }}>
                    {form}
                  </Formik>
                </div>

              </div>

            </BasePage>
          )}
        </Mutation>
      )}

    </ApolloConsumer>
  );
}
