import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(2),
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  }
}));
export default function WelcomeStep(props) {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <img
        src={props.animation}
        style={{ height: "150px", position: "relative", right: "-100px" }}
        alt="Animated Thnx! Logo"
      />
    </div>
  );
}
