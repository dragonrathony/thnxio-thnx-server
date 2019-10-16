import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import { Mutation, ApolloConsumer } from "react-apollo";
import { gql } from "apollo-boost";

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
  }
}));

function CreateMerchantForm(props) {
  const classes = useStyles();

  return (
    <ApolloConsumer>
      {client => {
        return (
          <Mutation
            mutation={gql`
              mutation updateMerchant(
                $id: ID!
                $name: String!
                $active: Boolean!
              ) {
                updateMerchant(id: $id, name: $name, active: $active) {
                  merchant {
                    id
                    name
                  }
                  errors
                }
              }
            `}
          >
            {(updateMerchant, { loading, error }) => {
              return props.account ? (
                <Formik
                  initialValues={props.account}
                  validationSchema={Yup.object().shape({
                    name: Yup.string().required("Required")
                  })}
                  onSubmit={(values, actions) => {
                    // call mutation here
                    updateMerchant({
                      variables: {
                        id: props.account.id,
                        name: values.name,
                        active: true
                      }
                    })
                      .then(response => {
                        actions.setSubmitting(false);
                        let data = response.data.updateMerchant;
                        if (data.errors) {
                          actions.setErrors(data.errors);
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
                        <div className={classes.error}>{errors[0]}</div>
                        <Button
                          type="submit"
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
              ) : null;
            }}
          </Mutation>
        );
      }}
    </ApolloConsumer>
  );
}

export default withRouter(CreateMerchantForm);
