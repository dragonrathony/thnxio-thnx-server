import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Page from "../../Page";
import MerchantList from "./list";

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    background: "#fff"
  }
}));

export default function AdminMerchantPage(props) {
  const classes = useStyles();

  return (
    <Page title="thnx! Merchants">
      <Paper className={classes.paper}>
        <MerchantList {...props} />
      </Paper>
    </Page>
  );
}
