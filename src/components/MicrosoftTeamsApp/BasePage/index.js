import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import Content from '../Content';

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    maxWidth: "960px",
    width: "100%"
  },
  container: {
    background: theme.palette.background.light,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "stretch",
    width: "100%"
  },
  topContainer: {
    display: "flex",
    alignItems: "flex-end"
  },
  logoContainer: {
    padding: theme.spacing(2, 2, 0, 2),
  },
  logo: {
    width: "160px",
    maxWidth: "160px"
  },
  messageContainer: {
    flexGrow: "1",
    padding: theme.spacing(2)
  },
  message: {
    color: theme.palette.text.primary,
    fontSize: "1.8rem"
  },
  contentContainer: {
    width: "100%"
  }
}));

const alternateStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    maxWidth: "960px",
    width: "100%"
  },
  container: {
    background: theme.palette.background.light,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "stretch",
    width: "100%"
  },
  topContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  logoContainer: {
    padding: theme.spacing(2, 2, 0, 2),
  },
  logo: {
    width: "320px",
    maxWidth: "320px"
  },
  messageContainer: {
    flexGrow: "1",
    padding: theme.spacing(2),
    textAlign: "center"
  },
  message: {
    color: theme.palette.text.primary,
    fontSize: "1.8rem"
  },
  contentContainer: {
    width: "100%"
  }
}));

export default function BasePage(props) {
  const styles = useStyles();
  const altStyles = alternateStyles();
  const classes = props.bigImage ? altStyles : styles;
  if (props.step !== props.currentStep) return null; 

  if (props.bigImage) {
    return (
      <div className={classes.root}>
        <Grid className={classes.container} container>
          
          <Grid className={classes.topContainer} item>
            <div className={classes.logoContainer}> 
              <img className={classes.logo} src={props.imageUrl} alt="Top header image" />
            </div>
            <div className={classes.messageContainer}> 
              <Typography className={classes.message} variant="h4" component="h4">
                {props.message}
              </Typography>
            </div>
          </Grid>
  
          <Grid className={classes.contentContainer} item>
            <Content>
              {props.children}
            </Content>
          </Grid>
  
        </Grid>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <Grid className={classes.container} container>
        
        <Grid className={classes.topContainer} item>
          <div className={classes.logoContainer}> 
            <img className={classes.logo} src={props.imageUrl} alt="Top header image" />
          </div>
          <div className={classes.messageContainer}> 
            <Typography className={classes.message} variant="h4" component="h4">
              {props.message}
            </Typography>
          </div>
        </Grid>

        <Grid className={classes.contentContainer} item>
          <Content>
            {props.children}
          </Content>
        </Grid>

      </Grid>

    </div>
  );
}
