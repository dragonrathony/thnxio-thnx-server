import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import PaymentList from "./list";
import { Modal } from "@material-ui/core";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}
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

export default function RemittancePaymentDetail(props) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  // getModalStyle is not a pure function, we roll the style only on the first render
  return (
    <Modal
      aria-labelledby="remove-user"
      aria-describedby="remove-user"
      open={props.open}
      onClose={props.handleClose}
    >
      <div style={modalStyle} className={classes.modal}>
        <PaymentList onEdit={props.handleClose} {...props} />
      </div>
    </Modal>
  );
}
