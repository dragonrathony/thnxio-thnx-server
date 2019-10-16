import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import { NavLink as RouterLink } from "react-router-dom";

const _ = require("lodash");
const useStyles = makeStyles(theme => ({
  link: {
    textDecoration: "none",
    display: "block",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#4C5C7A"
    },
    "&.active": {
      backgroundColor: "#49648D !important",
      fontWeight: 900
    }
  },
  linkContainer: {
    /*"&:hover": {
      backgroundColor: "#4a5568"
    }*/
  },
  menuItem: {
    //color: "#fff"
  },
  icon: {
    color: "#fff"
  }
}));

export default function MenuItem(props) {
  const classes = useStyles();

  let isAuthorized =
    props.roles.length === 0 ||
    _.intersection(props.userRoles, props.roles).length > 0;
  return isAuthorized ? (
    <RouterLink
      exact
      to={props.to}
      className={classes.link}
      activeClassName={classes.linkActive}
    >
      <ListItem button className={classes.linkContainer}>
        <ListItemText className={classes.menuItem} primary={props.title} />
      </ListItem>
    </RouterLink>
  ) : null;
}
