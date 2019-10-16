import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Typography } from "@material-ui/core";
import BasePage from "../BasePage";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexGrow: 1,
    flexDirection: "column",
    padding: theme.spacing(4, 16, 4, 16),
  },
  textContainer: {
    display: "flex",
    flexDirection: "column",
    marginBottom: theme.spacing(4)
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
  },
  error: {
    textTransform: "none",
    width: "100%",
    padding: theme.spacing(1, 0),
    textAlign: "center"
  },
  subError: {
    textAlign: "center",
    fontSize: "1.2rem",
    fontWeight: "300"
  },
  message: {
    textAlign: "left",
    textTransform: "none",
    width: "100%",
    padding: theme.spacing(4, 0),
    fontWeight: "200",
    fontSize: "1.2rem",
    fontStyle: "italic"
  },
  button: {
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

export default function ErrorPage(props) {
  const classes = useStyles();
  const imageUrl = require("../../../assets/img/logo.png");

  const errorMessage = "Opps, That shouldn't have happened!";
  const subErrorMessage = "Looks like something went wrong, click the button below to head back to the home screen";
  const infoMessage = "We'll try and get this fixed ASAP!";

  const goBack = () => {
    props.history.push(`${props.routes.baseRoute}`);
  }

  return (
    <BasePage 
      {...props}
      bigImage={true}
      imageUrl={imageUrl}
      message={errorMessage}>

      <div className={classes.container}>

        <div className={classes.textContainer}>
          <Typography className={classes.subError} variant="h6" component="p">
            {subErrorMessage}
          </Typography>
        </div>

        <div className={classes.buttonContainer}>

          <Button 
            className={classes.button}
            onClick={goBack}>
            TRY AGAIN!
          </Button>

          {/* Info Message */}
          <Typography className={classes.info} variant="subtitle1" component="p">
            {infoMessage}
          </Typography>
        </div>

      </div>

    </BasePage>
  );
}
