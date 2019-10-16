import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Modal } from "@material-ui/core";
import CreateMerchantForm from "./form";

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
  modal: {
    position: "absolute",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: "none",
    borderRadius: "8px"
  }
}));

export default function AddEditModal(props) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  return (
    <Modal
      aria-labelledby="assign-thnx-evenly"
      aria-describedby="assign-thnx-evenly"
      open={props.open}
      onClose={props.handleClose}
    >
      <div style={modalStyle} className={classes.modal}>
        <CreateMerchantForm
          handleCreate={props.handleCreate}
          data={{ user: {}, address: {} }}
        />
      </div>
    </Modal>
  );
}
