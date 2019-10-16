import React from "react";
import { Redirect } from "react-router-dom";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";

import { NavLink, withRouter } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import BuyModal from "../BuyModal";

const useStyles = makeStyles(theme => ({
  card: {
    background: "#fff",
    textAlign: "center",
    margin: "10px 20px 20px 20px",
    padding: 10
  },
  titleContainer: {
    display: "flex",
    justifyContent: "space-between"
  },
  title: {
    padding: 14,
    fontWeight: 900
  },
  subtitle: {
    padding: 12,
    color: theme.palette.text.secondary
  },
  actions: {
    textAlign: "center",
    justifyContent: "center"
  }
}));

export default function LeaderboardTile(props) {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <div className={classes.titleContainer}>
        <img src={require("../../assets/img/award.png")} height={30} />
        <Typography className={classes.title} gutterBottom>
          {props.title}
        </Typography>
      </div>
      <Typography className={classes.subtitle} gutterBottom>
        {props.subtitle}
      </Typography>
      <CardActions className={classes.actions}>
        <div />
      </CardActions>
    </Card>
  );
}
