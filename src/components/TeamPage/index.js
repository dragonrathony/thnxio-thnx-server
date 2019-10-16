import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Page from "../Page";
import TeamList from "./list";
import Modal from "@material-ui/core/Modal";
import UserDetails from "./Form";
import CloseButton from "../Common/CloseButton";

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

export default function TeamPage() {
  const classes = useStyles();
  const [selectedUser, setSelectedUser] = React.useState(undefined);
  const [open, setOpen] = React.useState(false);
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const handleOpen = id => {
    setSelectedUser(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Page title="thnx! Givers">
      <Paper className={classes.paper} elevation={0}>
        <TeamList onEdit={handleOpen} />
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={open}
          onClose={handleClose}
        >
          <div style={modalStyle} className={classes.modal}>
            <CloseButton handleClick={handleClose} />
            <UserDetails id={selectedUser} handleClose={handleClose} />
          </div>
        </Modal>
      </Paper>
    </Page>
  );
}
