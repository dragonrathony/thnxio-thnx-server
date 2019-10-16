import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Page from "../../Page";
import List from "./list";

const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    //marginTop: theme.spacing(2) - 2,
    paddingBottom: "100px !important",
    background: "#fff"
  },
  modal: {
    position: "absolute",
    width: 500,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: "none",
    borderRadius: "6px"
  },
  fixedHeight: {
    height: 500
  }
}));

export default function TransactionPage() {
  const classes = useStyles();

  return (
    <Page title="thnx! Transactions">
      <Paper className={classes.paper} elevation={0}>
        <List />
      </Paper>
    </Page>
  );
}
