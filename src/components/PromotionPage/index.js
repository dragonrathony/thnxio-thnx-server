import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { Helmet } from "react-helmet";
import PromotionStepper from "./stepper";
import axios from "axios";
import Promise from "es6-promise";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
Promise.polyfill();

const useStyles = makeStyles(theme => ({
  root: {
    fontFamily: "Heebo",
    display: "flex",
    background: "#000000", //"#374359",
    minHeight: "100vh",
    flexDirection: "column",
    fontSize: "18px"
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flex: "1 0 auto"
  },
  container: {
    display: "flex",
    padding: "0px",
    background: "#ffffff" //"#374359",
  },
  header: {
    background: `url("${require("../../assets/img/promo/header.jpg")}")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    justifyContent: "center",
    display: "flex"
  }
}));

export default function PromotionPage(props) {
  const classes = useStyles();
  const theme = useTheme();
  const lg = useMediaQuery(theme.breakpoints.up("sm"));

  const [promo, setPromo] = React.useState(undefined);
  const [error, setError] = React.useState(undefined);

  if (!promo) {
    axios
      .get(`/api/promotion/${props.match.params.promo_code}`)
      .then(response => {
        if (response.data && response.data.promotion) {
          setPromo(response.data.promotion);
        } else {
          setError(response.data.error);
        }
      })
      .catch(error => {
        console.log(error);
        setError("Unexpected error");
      });
  }

  return (
    <div className={classes.root}>
      <Helmet title={promo && promo.name} />
      <CssBaseline />

      <Container
        maxWidth="lg"
        className={classes.header}
        style={{
          height: lg ? "250px" : "175px"
        }}
      >
        <img
          alt="logo"
          src={require("../../assets/img/logo.png")}
          style={{
            height: lg ? "100px" : "70px",
            position: "relative",
            top: "25px",
            right: lg ? "-200px" : "-135px"
          }}
        />
      </Container>
      <Container maxWidth="lg" className={classes.container}>
        {error ? (
          <div>Error occured</div>
        ) : (
          <PromotionStepper promo={promo} {...props} />
        )}
      </Container>
    </div>
  );
}
