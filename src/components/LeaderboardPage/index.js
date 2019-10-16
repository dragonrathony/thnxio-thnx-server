import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Page from "../Page";
import LeaderboardList from "./list";
import GiftedLeaderboardList from "./giftedLeaderBoard";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexDirection: "row",
    flex: 1,
    padding: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(2),
    margin: theme.spacing(4),
    display: "flex",
    flex: 1,
    overflow: "auto",
    flexDirection: "column",
    paddingBottom: "100px !important",
    background: "#fff"
  }
}));

export default function LeaderboardPage() {
  const classes = useStyles();

  return (
    <Page title="Dashboard">
      <div className={classes.container}>
        <Paper className={classes.paper} elevation={0}>
          <LeaderboardList />
        </Paper>
        <Paper className={classes.paper} elevation={0}>
          <GiftedLeaderboardList />
        </Paper>
      </div>
    </Page>
  );
}
