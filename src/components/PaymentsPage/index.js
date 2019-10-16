import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Page from "../Page";
import PaymentList from "./list";
import BuyModal from "../BuyModal";

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

export default function PaymentsPage() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [, setSelectedUser] = React.useState(undefined);
  // getModalStyle is not a pure function, we roll the style only on the first render

  const handleOpen = id => {
    setSelectedUser(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Page title="thnx! Payments">
      <Paper className={classes.paper} elevation={0}>
        <PaymentList onEdit={handleOpen} />
        <BuyModal open={open} handleClose={handleClose} />
      </Paper>
    </Page>
  );
}
