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
  buttonContainer: {
    display: "flex",
    flexDirection: "column"
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

export default function TopUpPage(props) {
  const classes = useStyles();
  const imageUrl = require("../../../assets/img/wave_bernie.png");
  const infoMessage = "We don't store your payment information";
  const headerMessage = "KEEP ON GIVING: TOP UP YOUR ACCOUNT WITH ONE OR MORE thnx!";

  const topUp = () => {
    props.setCurrentStep(props.workflowSteps.PAYMENT);
  }

  return (
    <BasePage 
      {...props}
      bigImage={true}
      imageUrl={imageUrl}
      message={headerMessage}>
    
      <div className={classes.container}>
        <div className={classes.buttonContainer}>

          <Button className={classes.button} onClick={topUp}>
            TOP UP MY thnx! ACCOUNT
          </Button>

          <Typography className={classes.info} variant="subtitle1" component="p">
            {infoMessage}
          </Typography>

        </div>
      </div>

    </BasePage>
  );
}
