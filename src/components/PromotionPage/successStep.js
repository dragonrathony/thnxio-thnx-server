import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  title: {
    paddingTop: theme.spacing(4),
    color: "#998d72",
    fontWeight: "bold",
    fontFamily: "Heebo"
  },
  formContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap"
  },
  message: { fontSize: "1.5rem", marginTop: theme.spacing(3) },
  muted: {
    marginTop: theme.spacing(3),
    color: "#718096"
  },
  link: {
    "&:hover": {
      backgroundColor: "#ffffff",
      color: "#718096"
    }
  }
}));
export default function SuccessStep(props) {
  const classes = useStyles();
  //const email = "";
  /*setTimeout(function() {
    window.location.replace(props.vouchure);
  }, 3000);*/
  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid
          item
          xs={12}
          sm={8}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <div
            style={{
              textAlign: "left",
              marginTop: "32px",
              maxWidth: "500px",
              padding: "24px"
            }}
          >
            <Typography component="h3" variant="h4" className={classes.title}>
              Yay!! Check your email...
            </Typography>
            <div className={classes.message}>
              {`We have sent a thnx! redeem code to ${props.email}`}
            </div>
            <div className={classes.muted} style={{ textAlign: "left" }}>
              To redeem your coffee, simply download the thnx! app from Apple or
              Google Play Stores, and type in the redeem code. First 5,000
              people will receive a free coffee from preferred Di Bella
              locations in Australia
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                textAlign: "center",
                paddingTop: "24px"
              }}
            >
              <a
                className={classes.link}
                href="https://apps.apple.com/au/app/thnx-gratitude-economy/id1475045483"
              >
                <img
                  src={require("../../assets/img/appstore.png")}
                  alt="download appstore"
                  style={{ objectFit: "contain", width: "90%" }}
                />
              </a>
              <a
                className={classes.link}
                href="https://play.google.com/store/apps/details?id=app.thnx"
              >
                <img
                  src={require("../../assets/img/playstore.png")}
                  alt="download playstore"
                  style={{ objectFit: "contain", width: "90%" }}
                />
              </a>
            </div>
            <div
              style={{
                display: "flex",
                textAlign: "center",
                padding: "24px",
                justifyContent: "center",
                flex: 1
              }}
            >
              <a
                className={classes.link}
                href="#"
                style={{ textAlign: "center", flex: 1 }}
              >
                Map of participating Di Bella locations
              </a>
            </div>
          </div>
        </Grid>

        <Grid item xs={12} sm={4}>
          <div
            style={{
              background: `url("${require("../../assets/img/promo/dibella_img.jpg")}")`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              height: "100%",
              minHeight: "300px"
            }}
          >
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/vulCBqfH2Ec"
              frameborder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
          </div>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
