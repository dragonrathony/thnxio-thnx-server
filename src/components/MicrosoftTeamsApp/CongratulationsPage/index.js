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
    flexGrow: 1
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
  },
  congratulations: {
    textAlign: "left",
    textTransform: "none",
    width: "100%",
    padding: theme.spacing(1, 0),
  },
  message: {
    textAlign: "left",
    textTransform: "none",
    width: "100%",
    padding: theme.spacing(4, 0),
    fontWeight: "400",
    fontSize: "1.6rem"
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

export default function CongratulationsPage(props) {
  const classes = useStyles();
  const imageUrl = require("../../../assets/img/coffee2.png");

  const infoMessage = "";
  const headerMessage = "YOUR thnx! IS ON THE WAY TO MAKING SOMEONE'S DAY";

  const sendMoreThnx = () => {
    props.setCurrentStep(props.workflowSteps.UNDEFINED);
    props.resetData();
  }

  return (
    <BasePage 
      {...props}
      imageUrl={imageUrl}
      message={headerMessage}>

      <div className={classes.container}>

        <div className={classes.textContainer}>
          {/* Message */}
          <Typography className={classes.message} style={{whiteSpace: 'pre-line'}} variant="body1" component="p">
            {props.data.message}
          </Typography>
        </div>

        <div className={classes.buttonContainer}>

          <Button 
            className={classes.button}
            onClick={sendMoreThnx}>
            SEND ANOTHER thnx!
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
