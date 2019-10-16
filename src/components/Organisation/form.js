import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import { Mutation, ApolloConsumer } from "react-apollo";
import { gql } from "apollo-boost";
import Dropzone from "react-dropzone";

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
  },
  logo: {
    maxWidth: "200px"
  },
  dropZone: {
    border: "1px dashed #E2E8F0",
    borderRadius: theme.borderRadius,
    padding: theme.spacing(2),
    color: "#A0AEC0"
  }
}));

function CreateOrganisationForm(props) {
  const classes = useStyles();
  const [preview, setPreview] = React.useState(null);
  const [fileName, setFileName] = React.useState(null);
  const [file, setFile] = React.useState(null);

  let handleDrop = files => {
    // Push all the axios request promise into a single array
    let file = files && files.length > 0 ? files[0] : undefined;
    let fileType = file && file.type;
    let previewLink = undefined;
    switch (fileType) {
      // case "application/pdf":
      //   previewLink = require("../../../resources/images/pdf-icon.png");
      //   break;
      // case "application/word":
      //   previewLink = "";
      //   break;
      default:
        previewLink = file && URL.createObjectURL(file);
        break;
    }
    setPreview(file && previewLink);
    setFileName(file && file.name);
    setFile(file);
    //this.props.handleDrop(files);
    // trigger the upload
  };

  return (
    <ApolloConsumer>
      {client => {
        return (
          <Mutation
            mutation={gql`
              mutation updateOrganisation(
                $id: ID!
                $name: String!
                $active: Boolean!
                $image: File
                $abn: String
              ) {
                updateOrganisation(
                  id: $id
                  name: $name
                  active: $active
                  image: $image
                  abn: $abn
                ) {
                  organisation {
                    id
                    name
                    imageUrl
                    abn
                  }
                  errors
                }
              }
            `}
            context={{ hasUpload: true }} // Use UploadClient
          >
            {(updateOrganisation, { loading, error }) => {
              return (
                <Formik
                  initialValues={props.account}
                  validationSchema={Yup.object().shape({
                    name: Yup.string().required("Required")
                  })}
                  onSubmit={(values, actions) => {
                    // call mutation here
                    updateOrganisation({
                      variables: {
                        id: props.account.id,
                        name: values.name,
                        abn: values.abn,
                        active: true,
                        image: file ? file : null
                      }
                    })
                      .then(response => {
                        actions.setSubmitting(false);
                        let data = response.data.updateOrganisation;
                        if (data.errors) {
                          actions.setErrors(data.errors);
                        } else {
                          client.query({
                            query: gql`
                              {
                                account {
                                  id
                                  name
                                  imageUrl
                                  abn
                                }
                              }
                            `,
                            fetchPolicy: "network-only"
                          });
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
                          label="Organisation Name"
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

                        <TextField
                          margin="normal"
                          fullWidth
                          label="ABN"
                          name="abn"
                          className={classes.nameField}
                          value={values.abn}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          helperText={errors.abn && touched.abn && errors.abn}
                        />
                        {preview ? (
                          <img
                            src={preview}
                            title={fileName}
                            className={classes.logo}
                            alt="company logo"
                          />
                        ) : (
                          undefined
                        )}
                        <Dropzone
                          multiple={false}
                          accept="image/*"
                          onDrop={handleDrop}
                        >
                          {({ getRootProps, getInputProps }) => (
                            <section>
                              <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <p className={classes.dropZone}>
                                  Drag 'n' drop a new logo file here, or click
                                  to select files
                                </p>
                              </div>
                            </section>
                          )}
                        </Dropzone>
                        <div className={classes.error}>{errors[0]}</div>
                        <div>
                          <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            disabled={isSubmitting}
                          >
                            Save
                          </Button>
                        </div>
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

export default withRouter(CreateOrganisationForm);
