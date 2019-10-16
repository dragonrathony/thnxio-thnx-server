import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/CloseRounded";
import { Fab } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  closeButtonContainer: {
    position: "absolute",
    right: "-45px",
    top: "-45px",
    background: "white",
    borderRadius: "22px",
    width: "44px",
    height: "44px"
  },
  closeButton: {
    background: "white",
    borderRadius: "22px",
    width: "44px",
    height: "44px",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    padding: 0
  }
}));
export default function CloseButton(props) {
  const classes = useStyles();
  return (
    <div style={{ position: "relative" }}>
      <div className={classes.closeButtonContainer}>
        <Fab
          size="small"
          color="default"
          aria-label="Close Modal"
          className={classes.closeButton}
          onClick={props.handleClick}
        >
          <CloseIcon />
        </Fab>
      </div>
    </div>
  );
}

CloseButton.propTypes = {
  children: PropTypes.node
};
