import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  logoContainer: {
    position: "relative"
  },
  logo: {
    position: "absolute",
    right: -100,
    top: -100,
    height: 150
  },
  logoSmall: {
    position: "absolute",
    right: -75,
    top: -75,
    height: 100
  }
}));
export default function Logo(props) {
  const classes = useStyles();
  return (
    <div className={classes.logoContainer}>
      <img
        src={require("../../../assets/img/logo.png")}
        className={props.size === "small" ? classes.logoSmall : classes.logo}
        alt="thnx! logo"
      />
    </div>
  );
}

Logo.propTypes = {
  children: PropTypes.node
};
