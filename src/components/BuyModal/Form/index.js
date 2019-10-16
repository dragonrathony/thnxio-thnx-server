import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Formik } from "formik";
import * as Yup from "yup";
import { CardElement, injectStripe } from "react-stripe-elements";
import { ApolloConsumer } from "react-apollo";
import gql from "graphql-tag";
import { RollbarContext } from "../../../rollbar-context";

const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    //marginTop: theme.spacing(2) - 2,
    paddingBottom: "100px !important",
    background: "#fff"
  },
  pageContainer: {
    display: "flex",
    flexDirection: "row"
  },
  totalsContainer: {
    textAlign: "right",
    marginTop: 48
  },
  totalTitle: {
    textAlign: "right",
    fontSize: "1.3rem"
  },
  totalSubtitle: {
    textAlign: "right",
    color: "#718096",
    fontSize: "1.1rem"
  },
  paymentContainer: {
    textAlign: "left",
    marginTop: theme.spacing(4)
  },
  paymentTitle: {
    textAlign: "left",
    marginBottom: theme.spacing(2)
  },
  submit: {
    marginTop: theme.spacing(3),
    fontWeight: "bold"
  }
}));

function refetchUnassignedThnx(client) {
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
}
function CheckoutForm(props) {
  const classes = useStyles();
  const rollbar = React.useContext(RollbarContext);

  const unitThnxPrice = props.account.unitThnxPrice
    ? props.account.unitThnxPrice
    : 5;

  return (
    <ApolloConsumer>
      {client => {
        return (
          <Formik
            initialValues={{ quantity: "25" }}
            validationSchema={Yup.object().shape({
              quantity: Yup.number()
                .integer("Must be a positive number")
                .positive()
                .lessThan(1000, "Must be less than 1000")
                .required("Required")
            })}
            onSubmit={(values, { setSubmitting, setErrors }) => {
              // create stripe token
              props.stripe.createToken({ name: "User Name" }).then(response => {
                // check for errors
                if (response && response.token) {
                  client
                    .mutate({
                      mutation: gql`
                        mutation BuyThnx(
                          $quantity: Int!
                          $token: String!
                          $price: Float!
                        ) {
                          buyThnx(
                            quantity: $quantity
                            token: $token
                            price: $price
                          ) {
                            receipt
                            errors
                          }
                        }
                      `,
                      variables: {
                        quantity: parseInt(values.quantity),
                        token: response.token.id,
                        price: unitThnxPrice
                      }
                    })
                    .then(response => {
                      props.handleClose();
                      setSubmitting(false);
                      refetchUnassignedThnx(client);
                    })
                    .catch(error => {
                      refetchUnassignedThnx(client);
                      console.log(error);
                      rollbar.error(error);
                      setErrors([
                        "Error occurred, check payment histoy before trying again."
                      ]);
                    });
                } else {
                  setSubmitting(false);
                  setErrors([response.error.message]);
                }
              });
            }}
          >
            {props => {
              const {
                values,
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
                  <Typography component="h2" variant="h5">
                    Generate more thnx!
                  </Typography>
                  <div style={{ textAlign: "right" }}>
                    <TextField
                      margin="normal"
                      required
                      label="Number of thnx!"
                      name="quantity"
                      fullWidth
                      autoFocus
                      helperText={`1 thnx! = $${unitThnxPrice} + GST ${
                        errors.quantity ? " - " + errors.quantity : ""
                      }`}
                      value={values.quantity}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div className={classes.totalsContainer}>
                    <Typography component="p" className={classes.totalTitle}>
                      Total Amount $
                      {(
                        values.quantity * unitThnxPrice * 0.1 +
                        unitThnxPrice * values.quantity
                      ).toFixed(2)}
                    </Typography>
                    <Typography component="p" className={classes.totalSubtitle}>
                      Includes GST $
                      {(values.quantity * unitThnxPrice * 0.1).toFixed(2)}
                    </Typography>
                  </div>

                  <div className={classes.paymentContainer}>
                    <Typography component="p" className={classes.paymentTitle}>
                      Your payment details
                    </Typography>
                    <CardElement style={{ base: { fontSize: "18px" } }} />
                    <div className={classes.error}>{errors[0]}</div>
                    <Button
                      type="submit"
                      fullWidth
                      size="large"
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                      disabled={isSubmitting}
                    >
                      Pay $
                      {(
                        values.quantity * unitThnxPrice * 0.1 +
                        unitThnxPrice * values.quantity
                      ).toFixed(2)}
                    </Button>
                  </div>
                </form>
              );
            }}
          </Formik>
        );
      }}
    </ApolloConsumer>
  );
}

export default injectStripe(CheckoutForm);
