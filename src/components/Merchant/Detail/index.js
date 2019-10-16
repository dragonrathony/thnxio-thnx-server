import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import { Mutation, ApolloConsumer } from "react-apollo";
import { gql } from "apollo-boost";
import { TextMaskBSB, TextMaskNumber } from "../../Common/Form";

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
function checkRequired(ref, msg) {
  return this.test({
    name: "checkRequired",
    exclusive: false,
    message: msg || "Required", // eslint-disable-line no-template-curly-in-string
    test: function(value, id) {
      return value !== undefined && id === undefined;
    }
  });
}
Yup.addMethod(Yup.string, "checkRequired", checkRequired);
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
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
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
  title: {
    color: "#fff",
    marginBottom: 12
  },
  subtitle: {
    color: "#fff"
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
  strong: {
    fontWeight: 600
  },
  logoContainer: {
    display: "flex",
    justifyContent: "flex-end"
  },
  logo: {
    height: 225
  },
  nameContainer: {
    display: "flex",
    justifyContent: "space-between"
  }
}));

function CreateMerchantForm(props) {
  const classes = useStyles();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showSnack, setShowSnack] = React.useState(false);

  return (
    <ApolloConsumer>
      {client => {
        return (
          <Mutation
            mutation={gql`
              mutation updateMerchant(
                $name: String!
                $address1: String!
                $address2: String
                $city: String!
                $state: String!
                $postcode: String!
                $latitude: String
                $longitude: String
                $abn: String
                $bsb: String
                $accountNo: String
                $id: ID
                $addressId: Int
                $primaryEmail: String
              ) {
                updateMerchant(
                  name: $name
                  address1: $address1
                  address2: $address2
                  city: $city
                  state: $state
                  postcode: $postcode
                  latitude: $latitude
                  longitude: $longitude
                  abn: $abn
                  bsb: $bsb
                  accountNo: $accountNo
                  id: $id
                  addressId: $addressId
                  active: true
                  primaryEmail: $primaryEmail
                ) {
                  merchant {
                    id
                  }
                  errors
                }
              }
            `}
          >
            {(createMerchant, { loading, error }) => {
              return (
                <Formik
                  initialValues={props.data}
                  validationSchema={Yup.object().shape({
                    name: Yup.string().required("Required"),
                    primaryEmail: Yup.string().email(),
                    address: Yup.object({
                      address1: Yup.string().required("Required"),
                      city: Yup.string().required("Required"),
                      state: Yup.string().required("Required"),
                      postcode: Yup.string().required("Required")
                    })
                  })}
                  onSubmit={(values, actions) => {
                    // call mutation here
                    createMerchant({
                      variables: {
                        name: values.name,
                        address1: values.address.address1,
                        address2: values.address.address2,
                        city: values.address.city,
                        state: values.address.state,
                        postcode: values.address.postcode,
                        longitude: values.address.longitude
                          ? values.address.longitude.toString()
                          : null,
                        latitude: values.address.latitude
                          ? values.address.latitude.toString()
                          : null,
                        addressId: values.address.id
                          ? parseInt(values.address.id)
                          : undefined,
                        id: values.id ? parseInt(values.id) : undefined,
                        abn: values.abn,
                        bsb: values.bsb,
                        accountNo: values.accountNo,
                        primaryEmail: values.primaryEmail
                      }
                    })
                      .then(response => {
                        actions.setSubmitting(false);
                        createMerchant = response.data.updateMerchant;
                        if (createMerchant && !createMerchant.errors) {
                          //props.handleCreate(createMerchant.merchant.id);
                        } else {
                          console.log(createMerchant.errors);
                          actions.setErrors(createMerchant.errors);
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
                  {formProps => {
                    const {
                      values,
                      touched,
                      errors,
                      isSubmitting,
                      handleChange,
                      handleBlur,
                      handleSubmit
                    } = formProps;

                    return (
                      <form
                        onSubmit={handleSubmit}
                        className={classes.form}
                        noValidate
                      >
                        <TextField
                          margin="normal"
                          required
                          label="Merchant Name"
                          name="name"
                          autoFocus
                          fullWidth
                          className={classes.nameField}
                          value={values.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          helperText={
                            errors.name && touched.name && errors.name
                          }
                        />
                        {values.id ? (
                          <div className={classes.nameContainer}>
                            <TextField
                              margin="normal"
                              label="ABN"
                              name="abn"
                              className={classes.nameField}
                              value={values.abn}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              helperText={
                                errors.abn && touched.abn && errors.abn
                              }
                            />
                            <TextField
                              margin="normal"
                              label="BSB"
                              name="bsb"
                              className={classes.nameField}
                              style={{ marginLeft: "5px" }}
                              value={values.bsb}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              helperText={
                                errors.bsb && touched.bsb && errors.bsb
                              }
                              InputProps={{
                                inputComponent: TextMaskBSB
                              }}
                            />

                            <TextField
                              margin="normal"
                              style={{ marginLeft: "5px" }}
                              label="ACC"
                              name="accountNo"
                              className={classes.nameField}
                              value={values.accountNo}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              helperText={
                                errors.accountNo &&
                                touched.accountNo &&
                                errors.accountNo
                              }
                              InputProps={{
                                inputComponent: TextMaskNumber
                              }}
                            />
                          </div>
                        ) : (
                          undefined
                        )}

                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          label="Primary Email"
                          name="primaryEmail"
                          value={values.primaryEmail}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          helperText={errors.address && errors.primaryEmail}
                        />
                        <div className={classes.nameContainer}>
                          <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Address"
                            name="address.address1"
                            value={values.address.address1}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            helperText={
                              errors.address && errors.address.address1
                            }
                          />
                          <TextField
                            margin="normal"
                            style={{ marginLeft: "5px" }}
                            fullWidth
                            label="Address 2"
                            name="address.address2"
                            value={values.address.address2}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            helperText={
                              errors.address && errors.address.address2
                            }
                          />
                        </div>

                        <div className={classes.nameContainer}>
                          <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="City"
                            name="address.city"
                            value={values.address.city}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            helperText={errors.address && errors.address.city}
                          />

                          <TextField
                            margin="normal"
                            style={{ marginLeft: "5px" }}
                            required
                            fullWidth
                            label="State"
                            name="address.state"
                            value={values.address.state}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            helperText={errors.address && errors.address.state}
                          />

                          <TextField
                            margin="normal"
                            style={{ marginLeft: "5px" }}
                            required
                            label="Postcode"
                            name="address.postcode"
                            value={values.address.postcode}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            helperText={
                              errors.address && errors.address.postcode
                            }
                          />
                        </div>
                        {values.id ? (
                          <div className={classes.nameContainer}>
                            <TextField
                              margin="normal"
                              required
                              fullWidth
                              label="Lat"
                              name="address.latitude"
                              value={values.address.latitude}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              helperText={
                                errors.address && errors.address.latitude
                              }
                            />

                            <TextField
                              margin="normal"
                              style={{ marginLeft: "5px" }}
                              required
                              fullWidth
                              label="Lng"
                              name="address.longitude"
                              value={values.address.longitude}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              helperText={
                                errors.address && errors.address.longitude
                              }
                            />
                          </div>
                        ) : (
                          undefined
                        )}
                        <div className={classes.error}>{errors[0]}</div>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          className={classes.submit}
                          disabled={isSubmitting}
                        >
                          {values.id ? "Update" : "Create"}
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

export default withRouter(CreateMerchantForm);
