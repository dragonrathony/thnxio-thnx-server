import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import BasePage from "../BasePage";
import PaymentForm from "./paymentForm";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexGrow: 1,
    padding: theme.spacing(4, 16, 4, 16),
  },
}));

export default function PaymentPage(props) {
  const classes = useStyles();
  const imageUrl = require("../../../assets/img/coffee2.png");
  const headerMessage = `YOU HAVE ${props.data.thnx} thnx! LEFT EACH thnx! GIVES ONE COFFEE`;

  return (
    <BasePage 
      {...props}
      imageUrl={imageUrl}
      message={headerMessage}>

      <div className={classes.container}>
        <PaymentForm {...props} /> 
      </div>

    </BasePage>
  );
}
