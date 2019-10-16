import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Page from "../Page";
import Script from "react-load-script";

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

export default function MerchantPage() {
  const classes = useStyles();

  return (
    <Page title="Coffee near me">
      <Script url="https://stagingaz.blob.core.windows.net/thnx-embedded-map/thnx-embedded-map.js" />
      <Paper className={classes.paper}>
        <div style={{ position: "relative", height: "80vh" }}>
          <thnx-embedded-map />
        </div>
      </Paper>
    </Page>
  );
}
