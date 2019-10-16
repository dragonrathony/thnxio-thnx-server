import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Redirect } from "react-router";
import Hidden from '@material-ui/core/Hidden';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import DetailsPage from '../DetailsPage';
import TopUpPage from '../TopUpPage';
import PaymentPage from '../PaymentPage';
import CongratulationsPage from '../CongratulationsPage';
import { RollbarContext } from "../../../rollbar-context";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";

const THNX_CREDITS_QUERY = gql`
{
  currentUser {
    thnxCredits
  }
}
`;

const WORKFLOW_STEPS = {
  UNDEFINED: 0,
  DETAILS: 1,
  TOP_UP: 2,
  PAYMENT: 3,
  CONGRATS: 4
}

const useStyles = makeStyles(theme => ({
  '@global': {
    'body': {
      background: theme.palette.background.light,
    }
  },
  loadingContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  root: {
    display: "flex",
    height: "100vh",
    width: "100%",
    justifyContent: "center"
  },
  container: {
    display: "flex",
    position: "relative",
    justifyContent: "center"
  },
  logoContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    margin: theme.spacing(2),
  },
  logo: {
    width: "100%",
    maxWidth: "160px"
  }
}));

export default function MicrosoftTeamsPage(props) {
  const classes = useStyles();
  const imageUrl = require("../../../assets/img/logo.png");

  const rollbar = React.useContext(RollbarContext);

  const defaultLocalData = {
    email: '',
    message: '',
    thnx: 0
  };

  const [currentStep, setCurrentStep] = React.useState(WORKFLOW_STEPS.UNDEFINED);
  const [localData, setLocalData] = React.useState(defaultLocalData);

  const resetData = () => {
    setLocalData(defaultLocalData);
  }

  return (
    <div className={classes.root}>

      <Query
        query={THNX_CREDITS_QUERY}>

          {({ loading, error, data }) => {

            if (error) {
              rollbar.error(error);
              return <Redirect to={`/${props.routes.baseRoute}/${props.routes.error}`} />;
            }

            // If we're loading
            if (loading) {
              return <div className={classes.loadingContainer}>
                <CircularProgress className={classes.progress} />
              </div>
            }

            // Set the localData
            let tempLocalData = localData;
            tempLocalData['thnx'] = data.currentUser.thnxCredits;
            setLocalData(tempLocalData);

            // If the user does not have any thnx! take them to the TopUpPage
            if (currentStep === WORKFLOW_STEPS.UNDEFINED && !tempLocalData.thnx) {
              setCurrentStep(WORKFLOW_STEPS.TOP_UP);
            }
            else if (currentStep === WORKFLOW_STEPS.UNDEFINED) {
              setCurrentStep(WORKFLOW_STEPS.DETAILS);
            }

            return <Container className={classes.container} fixed>

              <Hidden smDown>
                <div className={classes.logoContainer}>
                  <img className={classes.logo} src={imageUrl} alt="Logo image" />
                </div>
              </Hidden>
      
              <DetailsPage 
                workflowSteps={WORKFLOW_STEPS}
                step={WORKFLOW_STEPS.DETAILS}
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                data={tempLocalData}
                setData={setLocalData}
                {...props} />

              <TopUpPage 
                workflowSteps={WORKFLOW_STEPS}
                step={WORKFLOW_STEPS.TOP_UP}
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                data={tempLocalData}
                setData={setLocalData}
                {...props} />
      
              <PaymentPage 
                workflowSteps={WORKFLOW_STEPS}
                step={WORKFLOW_STEPS.PAYMENT}
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                data={tempLocalData}
                setData={setLocalData}
                {...props} />
      
              <CongratulationsPage 
                workflowSteps={WORKFLOW_STEPS}
                step={WORKFLOW_STEPS.CONGRATS}
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                data={tempLocalData}
                setData={setLocalData}
                resetData={resetData}
                {...props} />
        
            </Container>
            
          }}

      </Query>

    </div>
  );
}
