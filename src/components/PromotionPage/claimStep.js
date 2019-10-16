import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Grid } from "@material-ui/core";
import HelpOutlineRounded from "@material-ui/icons/HelpOutlineRounded";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import WelcomeStep from "./completeStep";
import Promise from "es6-promise";
import "./PromotionPage.css";
Promise.polyfill();

const useStyles = makeStyles(theme => ({
  title: {
    paddingTop: theme.spacing(4),
    color: "#998d72",
    fontWeight: "bold",
    fontFamily: "Heebo"
  },
  formContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap"
  },
  form: {
    padding: theme.spacing(3),
    textAlign: "left",
    flexGrow: "1",
    justifyContent: "center",
    display: "flex"
  },
  message: { fontSize: "1.5rem", marginTop: theme.spacing(3) },
  field: {
    borderBottom: "solid 1px #998d72",
    padding: theme.spacing(2),
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(3),
    borderRadius: 0,
    border: 0,
    width: "100%",
    fontSize: "20px"
  },
  submit: {
    background: "#998d72",
    borderRadius: "25px",
    textTransform: "none",
    fontSize: "20px",
    height: "50px",
    color: "white"
  },
  error: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    backgroundColor: "rgba(255,93,2,0.7)",
    fontWeight: "bold",
    borderRadius: "6px"
  },
  muted: {
    marginTop: theme.spacing(3),
    color: "#718096"
  },
  link: {
    "&:hover": {
      backgroundColor: "#ffffff"
    }
  }
}));
export default function ClaimStep(props) {
  const classes = useStyles();

  const { promo_code, code } = props && props.match && props.match.params;
  return props.promo ? (
    <React.Fragment>
      <Formik
        initialValues={{ contactme: false, email: "" }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email()
            .required("Required")
        })}
        onSubmit={(values, actions) => {
          axios
            .put(`/api/promotion/${promo_code}`, {
              promotion_account_code: code,
              contact_me: values.contactme,
              email: values.email
            })
            .then(response => {
              if (response.data && response.data.error) {
                console.log(response.data.error);
                setTimeout(
                  () =>
                    props.onError({
                      email: values.email,
                      contactme: values.contactme
                    }),
                  2500
                );
              } else {
                let claimedData = response.data;
                actions.setSubmitting(false);
                props.handleClaimed(claimedData.merchant, claimedData.gift);
              }
            })
            .catch(error => {
              console.log(error);
              actions.setError(["Unexpected error occured. Please try again."]);
              actions.setSubmitting(false);
            });
        }}
      >
        {formProps => {
          const { isSubmitting, handleSubmit } = formProps;

          let loader = isSubmitting ? (
            <div className="spinner-container">
              <div className="spinner">
                <div className="bounce1" />
                <div className="bounce2" />
                <div className="bounce3" />
              </div>
            </div>
          ) : (
            undefined
          );

          return (
            <React.Fragment>
              {loader}

              <Grid container spacing={3}>
                <Grid item xs={12} sm={8}>
                  <form noValidate className={classes.form}>
                    <div style={{ maxWidth: "450px" }}>
                      <Typography
                        component="h3"
                        variant="h4"
                        className={classes.title}
                      >
                        Get your cup of gratitude
                      </Typography>
                      <div className={classes.message}>
                        With thnx! from Di Bella
                      </div>
                      <Field
                        type="email"
                        name="email"
                        className={classes.field}
                        placeholder="Enter your email address"
                      />

                      <div
                        style={{
                          textAlign: "center"
                        }}
                      >
                        <Button
                          type="submit"
                          variant="contained"
                          color="default"
                          className={classes.submit}
                          disabled={isSubmitting}
                          onClick={() => handleSubmit()}
                        >
                          Email my thnx! code
                        </Button>
                        <div
                          className={classes.muted}
                          style={{ textAlign: "left" }}
                        >
                          We will email a thnx! redeem code to your nominated
                          email address. The first 5,000 people to download the
                          thnx! app and enter their redeem code will get a free
                          coffee at preferred Di Bella locations in Australia
                        </div>
                        <div
                          style={{
                            textAlign: "right"
                          }}
                        >
                          <a
                            href="mailto:hello@thnx.io"
                            className={classes.link}
                          >
                            <span
                              style={{
                                color: "#998d72",
                                padding: 10
                              }}
                            >
                              <HelpOutlineRounded />
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </form>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <img
                    alt="banner"
                    src={require("../../assets/img/promo/dibella_img.jpg")}
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%"
                    }}
                  />
                </Grid>
              </Grid>
            </React.Fragment>
          );
        }}
      </Formik>
    </React.Fragment>
  ) : (
    <WelcomeStep {...props} />
  );
}

/*<Field
                  name="contactme"
                  component="input"
                  type="checkbox"
                  checked={values.contactme}
                />{" "}
                Please let me know when thnx! for Teams launches in the USA
                {errors && errors.length > 0 ? (
                  <div className={classes.error}>{errors[0]}</div>
                ) : (
                  undefined
                )}*/
