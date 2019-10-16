import React from "react";
import { Redirect } from "react-router-dom";
import ContentLoader from "react-content-loader";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";

import { withRouter } from "react-router-dom";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { RollbarContext } from "../../rollbar-context";
import BuyModal from "../BuyModal";

const useStyles = makeStyles(theme => ({
  coffeeContainer: {
    margin: "10px 20px 20px 20px",
    flexDirection: "row",
    display: "flex",
    color: "#fff",
    alignItems: "center",
    fontFamily: "Roboto",
    fontSize: 12
  },
  card: {
    display: "relative",
    background: "#fff",
    textAlign: "center",
    margin: "10px 20px 20px 20px",
    padding: 10
  },
  subtitle: {
    padding: 12,
    fontSize: 14,
    color: "#333d51"
  },
  title: {
    padding: 12,
    color: "#374359",
    fontWeight: 900
  },
  actions: {
    textAlign: "center",
    justifyContent: "center"
  },
  addButton: {
    color: "#fff",
    backgroundColor: "#BD0F68",
    "&:hover": {
      backgroundColor: "#db4b86"
    }
  },
  logoContainer: {
    position: "absolute",
    right: "5px",
    top: "-20px"
  },
  avatar: {
    margin: 10,
    backgroundColor: "#49648D"
  }
}));

function ThnxBalance(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const rollbar = React.useContext(RollbarContext);
  const handleOpen = id => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Query
      query={gql`
        {
          unassignedThnx {
            id
          }
        }
      `}
    >
      {({ loading, error, data }) => {
        if (loading)
          return (
            <div>
              <div className={classes.coffeeContainer}>
                <Avatar className={classes.avatar}>
                  <img
                    src={require("../../assets/img/coffee.png")}
                    className={classes.logo}
                    height="30px"
                    alt="Coffee"
                  />
                </Avatar>

                <div>
                  <div style={{ borderBottom: "2px solid #4C5C7A" }}>
                    <Typography
                      component="h6"
                      varient="p"
                      style={{ fontSize: 14 }}
                    >
                      0 LITTLE thnx!
                    </Typography>
                  </div>
                  <div>
                    <Typography
                      component="h6"
                      varient="p"
                      style={{ fontSize: 14 }}
                    >
                      0 BIG thnx!
                    </Typography>
                  </div>
                </div>
              </div>
              <div style={{ position: "relative" }}>
                <div className={classes.logoContainer}>
                  <img
                    src={require("../../assets/img/logo.png")}
                    className={classes.logo}
                    height={70}
                    alt="Thnx! Logo"
                  />
                </div>
              </div>
              <Card className={classes.card}>
                <ContentLoader
                  height={80}
                  width={150}
                  speed={2}
                  primaryColor="#f7fafc"
                  secondaryColor="#edf2f7"
                >
                  <circle cx="75" cy="50" r="30" />
                </ContentLoader>
                <Typography className={classes.subtitle} gutterBottom>
                  thnx! left
                </Typography>
                <CardActions className={classes.actions} />
              </Card>
            </div>
          );

        if (error) {
          rollbar.error(error);
          return <Redirect to="/error" />;
        }

        return (
          <div>
            <div className={classes.coffeeContainer}>
              <Avatar className={classes.avatar}>
                <img
                  src={require("../../assets/img/coffee.png")}
                  className={classes.logo}
                  height="30px"
                  alt="Coffee"
                />
              </Avatar>

              <div>
                <div style={{ borderBottom: "2px solid #4C5C7A" }}>
                  <Typography
                    component="h6"
                    varient="p"
                    style={{ fontSize: 14 }}
                  >
                    {data.unassignedThnx.length} LITTLE thnx!
                  </Typography>
                </div>
                <div>
                  <Typography
                    component="h6"
                    varient="p"
                    style={{ fontSize: 14 }}
                  >
                    {Math.floor(data.unassignedThnx.length / 2).toFixed(0)} BIG
                    thnx!
                  </Typography>
                </div>
              </div>
            </div>
            <div style={{ position: "relative" }}>
              <div className={classes.logoContainer}>
                <img
                  src={require("../../assets/img/logo.png")}
                  className={classes.logo}
                  height={70}
                  alt="Thnx! Logo"
                />
              </div>
            </div>
            <Card className={classes.card}>
              <Typography className={classes.title} component="h1" variant="h2">
                {data.unassignedThnx.length}
              </Typography>
              <Typography className={classes.subtitle} gutterBottom>
                thnx! left
              </Typography>
              <CardActions className={classes.actions}>
                <Button
                  variant="contained"
                  color="primary"
                  aria-label="Add Thnx!"
                  size="large"
                  className={classes.addButton}
                  onClick={handleOpen}
                >
                  <AddIcon /> Add More
                </Button>
                <BuyModal open={open} handleClose={handleClose} />
              </CardActions>
            </Card>
          </div>
        );
      }}
    </Query>
  );
}
export default withRouter(ThnxBalance);
