import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import { Helmet } from "react-helmet";
import { Typography, Button } from "@material-ui/core";
import axios from "axios";
import Promise from "es6-promise";
const moment = require("moment");

Promise.polyfill();

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    background: "#f3f2f0",
    height: "100vh",
    overflow: "auto"
  },
  content: {
    flex: "1 0 auto"
  },
  container: {
    flex: 1,
    height: "100vh",
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    maxWidth: "80%"
  },
  header: {
    lineHeight: "1.3"
  },
  title: {
    textAlign: "left",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    fontSize: "1.2rem",
    lineHeight: "2rem"
  },
  subtitle: {
    textAlign: "left",
    width: "100%",
    fontSize: "0.9rem"
  },
  paper: {
    display: "flex",
    marginTop: theme.spacing(4),
    padding: theme.spacing(2),
    flexDirection: "column",
    alignItems: "left",
    background: "#ffffff",
    position: "relative",
    justifyContent: "center"
  },
  button: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    margin: theme.spacing(2),
    borderRadius: "6px",
    backgroundColor: "#6164a7",
    color: "#ffffff",
    textTransform: "none"
  },
  buttonOutline: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    margin: theme.spacing(2),
    borderRadius: "6px",
    borderColor: "#6164a7",
    color: "#6164a7",
    textTransform: "none"
  },
  image: {
    padding: theme.spacing(3),
    width: "50%"
  },
  message: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  }
}));

export default function PromotionLaunch(props) {
  const classes = useStyles();
  const [promo] = React.useState(undefined);
  const [, setError] = React.useState(undefined);

  const [showInitial, setInitial] = React.useState(false);
  const [msgResponse, setResponse] = React.useState(undefined);
  const [finished, setFinished] = React.useState(undefined);

  setTimeout(() => setInitial(true), 2000);

  function launchPromo() {
    axios
      .patch(`/api/promotion/ms-inspire`)
      .then(response => {
        if (response.data && !response.data.error) {
          axios
            .post(`/api/promotion/ms-inspire`)
            .then(response => {
              if (response.data && response.data.error) {
                setError(response.data.error);
              }
            })
            .catch(error => {
              setError("Unexpected error");
            });
        }
      })
      .catch(error => {
        setError("Unexpected error");
      });
  }
  let coffeeCup = require("../../assets/img/coffee_starbucks.png");
  let logo_large = require("../../assets/img/logo_large.gif");
  let logo = require("../../assets/img/logo.png");
  return (
    <div className={classes.root}>
      <link rel="preload" href={logo} as="image" />
      <link rel="preload" href={coffeeCup} as="image" />
      <Helmet title={promo && promo.name} />
      <CssBaseline />
      <Container className={classes.container}>
        {!finished ? (
          !showInitial ? (
            <div
              className={classes.message}
              style={{ alignItems: "left", width: "60%" }}
            />
          ) : (
            <div className={classes.message}>
              <div style={{ textAlign: "center" }}>
                Today {moment().format("hh:mm a")}
              </div>
              <div style={{ width: "100%" }}>
                <Paper className={classes.paper} elevation={0}>
                  <div style={{ width: "100%" }}>
                    <img
                      src={logo}
                      width="75px"
                      style={{
                        position: "absolute",
                        left: "-85px",
                        top: "5px"
                      }}
                      alt="Thnx! Logo"
                    />
                  </div>
                  <div>
                    <Typography component="p" className={classes.title}>
                      Hi Gavriella, who would you like to thank today?
                    </Typography>
                  </div>
                </Paper>
                <div style={{ flex: 1, display: "flex", flexDirection: "row" }}>
                  <Button
                    variant="contained"
                    className={classes.button}
                    onClick={() => setTimeout(() => setResponse(true), 1500)}
                  >
                    Partners attending Inspire
                  </Button>
                  <Button variant="outlined" className={classes.buttonOutline}>
                    Inspire Events Team
                  </Button>
                  <Button variant="outlined" className={classes.buttonOutline}>
                    ...
                  </Button>
                </div>
              </div>
              {msgResponse ? (
                <div style={{ width: "100%" }}>
                  <Paper className={classes.paper} elevation={0}>
                    <div style={{ width: "100%" }}>
                      <img
                        src={logo}
                        width="75px"
                        style={{
                          position: "absolute",
                          left: "-85px",
                          top: "5px"
                        }}
                        alt="Thnx! Logo"
                      />
                    </div>
                    <div>
                      <Typography component="p" className={classes.title}>
                        Super. Let's send a cup of gratitude to all Microsoft
                        <br />
                        Partners attending Inspire. Ready?
                      </Typography>
                    </div>
                  </Paper>
                  <div
                    style={{ flex: 1, display: "flex", flexDirection: "row" }}
                  >
                    <Button
                      className={classes.button}
                      variant="contained"
                      onClick={() => {
                        launchPromo();
                        setTimeout(() => setFinished(true), 1000);
                      }}
                    >
                      Give thnx!
                    </Button>
                  </div>
                </div>
              ) : (
                undefined
              )}
            </div>
          )
        ) : (
          <div>
            <div
              style={{
                width: "100%",
                flexDirection: "row",
                display: "flex"
              }}
            >
              <div>
                <Typography
                  component="h3"
                  variant="h3"
                  className={classes.header}
                >
                  Thank you for partnering <br />
                  with Microsoft !
                </Typography>
                <Typography
                  component="h4"
                  variant="h4"
                  className={classes.title}
                >
                  Your thnx! is on the way
                </Typography>
              </div>

              <img src={logo_large} height="250px" alt="Thnx! Logo" />
            </div>
            <div
              style={{
                width: "100%",
                flexDirection: "row",
                position: "relative",
                alignItems: "flex-end",
                justifyContent: "center",
                flex: "1",
                display: "flex"
              }}
            >
              <img src={coffeeCup} height="400px" alt="Coffee" />
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

/*
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={() => launchPromo()}
          >
            Give my thnx!
          </Button>*/
