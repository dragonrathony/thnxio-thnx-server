import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import MobileStepper from "@material-ui/core/MobileStepper";
import WelcomeStep from "./welcomeStep";
import CompleteStep from "./completeStep";
import SuccessStep from "./successStep";
import ClaimStep from "./claimStep";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center"
  },
  paper: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "#ffffff",
    position: "relative"
  },
  wizardContainer: {
    alignItems: "center",
    justifyContent: "center"
  },
  mutedFooter: {
    justifyContent: "center",
    alignItems: "flex-end",
    flex: 1,
    color: "#ffffff",
    display: "flex"
  }
}));

export default function PromotionStepper(props) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(1);
  const [thnxForm, setForm] = React.useState(0);
  const [claimedDetails, setClaimedDetails] = React.useState(undefined);
  // const animation = require("../../assets/img/animation_unboxing.gif");
  // const coffee = require("../../assets/img/animation_coffee_one_cup_lid_close.gif");
  const animatedLogo = undefined; //require("../../assets/img/promo/logo.gif");
  const teams = require("../../assets/img/sunrise.png");
  const logo = require("../../assets/img/logo.png");
  const coffeeStarbucks = require("../../assets/img/coffee.png");

  function handleNext() {
    console.log("on next");
    setActiveStep(activeStep => activeStep + 1);
  }
  function onError(thnxForm) {
    console.log("on error");
    //setForm(thnxForm);
    setActiveStep(3);
  }
  function handleClaimed(merchant, gift, vouchure) {
    console.log(gift);
    setClaimedDetails({
      date: gift.redeemed_at,
      email: gift.email_or_phone
    });
    handleNext();
  }

  function activeStepForm() {
    let form;
    console.log(activeStep);
    switch (activeStep) {
      case 1:
        form = (
          <ClaimStep
            {...props}
            handleClaimed={handleClaimed}
            animation={logo}
            teams={teams}
            onError={onError}
          />
        );
        break;
      case 3:
        form = (
          <CompleteStep
            {...props}
            animation={logo}
            teams={teams}
            show={true}
            initialValues={thnxForm}
          />
        );
        break;
      case 2:
        form = (
          <SuccessStep
            {...props}
            handleNext={handleNext}
            coffee={coffeeStarbucks}
            logo={logo}
            email={claimedDetails && claimedDetails.email}
          />
        );
        break;
      default:
        form = undefined;
        break;
    }
    console.log(form);
    return form;
  }

  return (
    <div style={{ flex: 1 }}>
      {activeStepForm()}
      <div className={classes.wizardContainer}>
        <link rel="preload" href={logo} as="image" />
      </div>
      <MobileStepper
        variant="dots"
        steps={4}
        position="bottom"
        activeStep={activeStep}
        className={classes.root}
      />
    </div>
  );
}
