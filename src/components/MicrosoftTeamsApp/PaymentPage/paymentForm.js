import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Elements } from "react-stripe-elements";
import TextField from "@material-ui/core/TextField";
import { Typography } from "@material-ui/core";
import { Formik } from 'formik';
import * as Yup from "yup";
import Payment from '../Payment';
import { gql } from "apollo-boost";
import { Mutation, ApolloConsumer } from "react-apollo";
import CircularProgress from '@material-ui/core/CircularProgress';
import { RollbarContext } from "../../../rollbar-context";

const MS_TEAMS_BUY_THNX_MUTATION = gql`
  mutation MSTeamsBuyThnx($quantity: Int!, $token: String!) {
    msTeamsBuyThnx(quantity: $quantity, token: $token) {
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
    flexGrow: 1,
    display: "flex",
    flexDirection: "column"
  },
  loadingContainer: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  formButtonContainer: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    fontSize: "1.2rem",
    fontWeight: "200",
    borderRadius: "0px",
    "& fieldset": {
      borderRadius: theme.spacing(0.25),
    }
  },
  error: {
    color: theme.palette.error.main,
    padding: theme.spacing(0, 0, 2, 0),
    alignSelf: "center"
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
  },
  priceCalculationContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "center",
    flexGrow: "1"
  },
  totalAmount: {
    fontSize: "1.5rem",
    fontWeight: "400",
  },
  gst: {
    fontSize: "1.2rem",
    fontWeight: "200"
  }
}));

export default function PaymentForm(props) {
  const classes = useStyles();
  const infoMessage = "We don't store your payment details";
  const rollbar = React.useContext(RollbarContext);

  const [stripe, setStripe] = React.useState(null);

  const initialValues = {
    numberOfThnx: ''
   };

  const schemaValidation = () => {
    return Yup.object().shape({ 
      numberOfThnx: Yup.number().moreThan(0, 'Number of thnx! must be greater than 0').integer('Number of thnx! must be whole numbers')
    });
  }
  
  const onSubmit = (values, actions, msTeamsBuyThnx, client) => {
    client && client.resetStore();
    
    stripe.createToken({ name: "User Name" }).then(response => {
      if (response && response.token) {

        msTeamsBuyThnx({
          variables: {
            quantity: values.numberOfThnx,
            token: response.token.id
          }
        })
        .then(response => {
          let data = response.data;

          if (data.msTeamsBuyThnx && data.msTeamsBuyThnx.errors.length === 0) {
            // We want to refetch the thnxCredits for the currentUser
            client.query({
              query: THNX_CREDITS_QUERY,
              fetchPolicy: "network-only"
            }).then(response => {
              actions.setSubmitting(false);
              props.setCurrentStep(props.workflowSteps.DETAILS);
            }).catch(error => {
              actions.setSubmitting(false);
              rollbar.error(error);
              props.history.push(`/${props.routes.baseRoute}/${props.routes.error}`);
            });
          } 
          else if (data.msTeamsBuyThnx && data.msTeamsBuyThnx.errors.length > 0) {
            actions.setSubmitting(false);
            actions.setErrors(data.msTeamsBuyThnx.errors);
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

      }
      else {
        actions.setErrors([response.error.message]);
        actions.setSubmitting(false);
      }
    });
  };

  const calculateTotalAmount = (numberOfThnx) => {
    return 6 * numberOfThnx;
  }

  const calculateTotalAmountString = (numberOfThnx, errors) => {
    if (errors) return `Total Amount $0.00`;
    // 1 thnx is $6
    return `Total Amount $${calculateTotalAmount(numberOfThnx).toFixed(2)}`;
  }

  const calculateGst = (totalAmount) => {
    // GST is (totalAmount - (totalAmount / 1.1))
    return (totalAmount - (totalAmount / 1.1));
  }

  const calculateGstString = (numberOfThnx, errors) => {
    if (errors) return `Includes GST $0.00`;
    
    let totalAmount = calculateTotalAmount(numberOfThnx);
    var gst = calculateGst(totalAmount);

    return `Includes GST $${gst.toFixed(2)}`;
  }

  const calculatePayString = (numberOfThnx, errors) => {
    if (errors) return `Pay $0.00 (incl GST)`;
    return `Pay $${calculateTotalAmount(numberOfThnx).toFixed(2)} (incl GST)`;
  }

  const form = ({values, errors, handleChange, handleBlur, handleSubmit, isSubmitting}) => (    
    <form className={classes.form} onSubmit={handleSubmit} noValidate>
      <div className={classes.formInnerContainer}>

        <div className={classes.formInputContainer}>

          {/* Number of thnx! */}
          <TextField
            fullWidth
            autoFocus
            type="number"
            placeholder="Number of thnx!"
            value={values.numberOfThnx}
            name="numberOfThnx"
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            variant="outlined"
            disabled={isSubmitting}
            helperText={errors.numberOfThnx ? errors.numberOfThnx : '1 thnx! = $6 (incl GST)'}
            InputProps={{ className: classes.input }}
          />

          <div className={classes.priceCalculationContainer}>

            <Typography className={classes.totalAmount} variant="subtitle1" component="p">
              {calculateTotalAmountString(values.numberOfThnx, errors.numberOfThnx)}
            </Typography>
            <Typography className={classes.gst} variant="subtitle1" component="p">
              {calculateGstString(values.numberOfThnx, errors.numberOfThnx)}
            </Typography>

          </div>

          <Elements>
            <Payment setStripe={setStripe} />
          </Elements>

        </div>

        <div className={classes.error}>{errors[0]}</div>

        <div className={classes.formButtonContainer}>

          {/* Submit Button */}
          <Button
            type="submit"
            className={classes.submit}
            disabled={isSubmitting || errors.numberOfThnx !== undefined || !values.numberOfThnx}>
            {isSubmitting ? <CircularProgress /> : calculatePayString(values.numberOfThnx, errors.numberOfThnx)}
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
        <Mutation mutation={MS_TEAMS_BUY_THNX_MUTATION}>
          {(msTeamsBuyThnx) => (
            <Formik
              initialValues={initialValues}
              validationSchema={schemaValidation}
              onSubmit={(values, actions) => { onSubmit(values, actions, msTeamsBuyThnx, client) }}>
              {form}
            </Formik>
          )}
        </Mutation>
      )}

    </ApolloConsumer>
  );
}
