import React from "react";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import PageFooter from "../Page/footer";
import useMobileDetect from "use-mobile-detect-hook";
import SimpleMap from "../Admin/Merchants/Map";
import Script from "react-load-script";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    background: "#F7FAFC"
  },
  appBarSpacer: theme.mixins.toolbar,
  pageContent: {
    flex: 1,
    height: "100vh",
    overflow: "auto",
    display: "flex",
    flexDirection: "column"
  },
  content: {
    flex: "1",
    padding: theme.spacing(2),
    textAlign: "center"
  },
  container: {
    paddingBottom: theme.spacing(4)
  },
  logo: {},
  appTitle: {
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: 10
  },
  paper: {
    padding: 0,
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    //marginTop: theme.spacing(2) - 2,
    background: "#F7FAFC"
  }
}));
function ResetPasswordPage(props) {
  const classes = useStyles();
  const detectMobile = useMobileDetect();

  return (
    <div>
      <Helmet title="Download Apps" />
      <div className={classes.pageContent}>
        <main className={classes.content}>
          <div className={clsx(classes.appBarSpacer, classes.appTitle)} />
          <Container maxWidth="lg" className={classes.container}>
            <Grid container>
              <Grid item xs="12" md="6">
                <Paper className={classes.paper} elevation={0}>
                  <div
                    style={{
                      textAlign: "center",
                      display: "flex",
                      justifyContent: "space-evenly",
                      alignItems: "center"
                    }}
                  >
                    <img
                      src={require("../../assets/img/logo.png")}
                      className={classes.logo}
                      width="125"
                      alt="Thnx! Logo"
                    />
                    <div style={{ fontSize: "1.8rem" }}>
                      <span>
                        Be grateful
                        <br />
                        Send thnx!
                        <br />
                        Get coffee
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      flexDirection: "column",
                      justifyContent: "left",
                      display: "flex"
                    }}
                  >
                    <Query
                      query={gql`
                        query MerchantLookup($code: String!) {
                          merchantLookup(code: $code) {
                            id
                            name
                            code
                            addresses {
                              id
                              address1
                              address2
                              city
                              state
                              postcode
                              latitude
                              longitude
                            }
                          }
                        }
                      `}
                      variables={{ code: props.match.params.code }}
                    >
                      {({ loading, error, data, refetch }) => {
                        if (
                          props.match.params.code &&
                          data &&
                          !data.merchantLookup &&
                          !loading
                        )
                          return (
                            <React.Fragment>
                              <p>
                                Unfortunately this scanned code is not currently
                                a valid thnx! redemption code.
                              </p>
                              <p>
                                Please{" "}
                                <a href="mailto:hello@thnx.io">contact us</a>{" "}
                                and we'll set you up as a part of our thnx!
                                family
                              </p>
                            </React.Fragment>
                          );

                        return data && data.merchantLookup ? (
                          <div
                            style={{
                              textAlign: "left",
                              padding: "32px",
                              marginTop: "24px",
                              marginBottom: "24px",
                              background: "#fff"
                            }}
                          >
                            <div style={{ fontSize: "1.5rem" }}>Welcome to</div>
                            <h1 style={{ fontSize: "2rem" }}>
                              {data.merchantLookup.name}!
                            </h1>
                            <div style={{ fontSize: "1.5rem" }}>
                              {data.merchantLookup.addresses[0].address1}
                              <br />
                              {data.merchantLookup.addresses[0].city}
                            </div>
                          </div>
                        ) : null;
                      }}
                    </Query>
                    <div
                      style={{
                        fontSize: "1.1rem",
                        margin: "16px",
                        textAlign: "left"
                      }}
                    >
                      Download the thnx! app and send
                      <br />
                      someone a graditude coffee today.
                    </div>
                    <div
                      style={{
                        flex: 1,
                        margin: "16px",
                        flexDirection: "row",
                        justifyContent: "left",
                        display: "flex"
                      }}
                    >
                      {detectMobile.isIos() || detectMobile.isDesktop() ? (
                        <a href="https://apps.apple.com/au/app/thnx-gratitude-economy/id1475045483">
                          <img
                            width="120"
                            src={require("../../assets/img/appstore.png")}
                            alt="download appstore"
                          />
                        </a>
                      ) : (
                        undefined
                      )}
                      <div style={{ padding: "5px" }} />
                      {detectMobile.isAndroid() || detectMobile.isDesktop() ? (
                        <a href="https://play.google.com/store/apps/details?id=app.thnx">
                          <img
                            width="120"
                            src={require("../../assets/img/playstore.png")}
                            alt="download playstore"
                          />
                        </a>
                      ) : (
                        undefined
                      )}
                    </div>
                  </div>
                </Paper>
              </Grid>
              <Grid item xs="12" md="6">
                <Script url="https://stagingaz.blob.core.windows.net/thnx-embedded-map/thnx-embedded-map.js" />
                <thnx-embedded-map />
              </Grid>
            </Grid>
          </Container>
          <PageFooter />
        </main>
      </div>
    </div>
  );
}

export default withRouter(ResetPasswordPage);
