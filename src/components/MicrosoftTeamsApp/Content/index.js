import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    background: theme.palette.background.light
  },
  paper: {
    display: "flex",
    minHeight: "450px",
    background: theme.palette.background.light
  }
}));

export default function Content(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} square={true} elevation={0}>
        {props.children}
      </Paper>
    </div>
  );
}
