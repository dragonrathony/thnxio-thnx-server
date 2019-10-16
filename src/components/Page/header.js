import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import ContentLoader from "react-content-loader";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";

import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import MenuIcon from "@material-ui/icons/Menu";
import PersonIcon from "@material-ui/icons/Person";
import ExitIcon from "@material-ui/icons/ExitToAppRounded";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { Redirect } from "react-router";
import { RollbarContext } from "../../rollbar-context";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  toolbar: {
    //paddingRight: 24 // keep right padding when drawer closed
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    backgroundColor: "#EDF2F7"
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: 36
  },
  menuButtonHidden: {
    display: "none"
  },
  title: {
    flexGrow: 1,
    fontSize: "1rem",
    textAlign: "right"
  },
  pageTitle: {
    flexGrow: 1,
    textAlign: "left"
  },
  actionButtons: {
    color: "#9FAEC0",
    "&:hover": {
      backgroundColor: "#F7FAFC"
    }
  }
}));

function ElevationScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0
  });

  return React.cloneElement(children, {
    elevation: trigger ? 2 : 0
  });
}

ElevationScroll.propTypes = {
  children: PropTypes.node.isRequired
};

export default function PageHeader(props) {
  const classes = useStyles();
  const rollbar = React.useContext(RollbarContext);
  //333d51
  return (
    <ElevationScroll>
      <AppBar
        style={{ color: "#333d51", background: "#F7FAFC" }}
        className={clsx(classes.appBar, props.open && classes.appBarShift)}
        elevation={0}
      >
        <Toolbar className={classes.toolbar} variant="dense">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="Open drawer"
            onClick={props.handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              props.open && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            component="h1"
            variant="h5"
            color="inherit"
            noWrap
            className={classes.pageTitle}
          >
            {props.title}
          </Typography>
          <Query
            query={gql`
              {
                currentUser {
                  id
                  firstName
                  lastName
                  email
                }
              }
            `}
          >
            {({ loading, error, data }) => {
              if (loading)
                return (
                  <div className={classes.title}>
                    <ContentLoader
                      height={25}
                      width={500}
                      speed={2}
                      primaryColor="#f7fafc"
                      secondaryColor="#edf2f7"
                    >
                      <rect
                        x="420"
                        y="8"
                        rx="4"
                        ry="4"
                        width="80"
                        height="12"
                      />
                    </ContentLoader>
                  </div>
                );
              if (error) {
                rollbar.error(error);
                return <Redirect to="/error" />;
              }

              return data.currentUser ? (
                <Typography
                  component="h1"
                  variant="h6"
                  color="inherit"
                  noWrap
                  className={classes.title}
                >
                  {data.currentUser.firstName} {data.currentUser.lastName}
                </Typography>
              ) : null;
            }}
          </Query>
          <Tooltip title="Edit Profile">
            <IconButton
              color="secondary"
              classes={{ colorSecondary: classes.actionButtons }}
              onClick={props.onProfileClicked}
            >
              <Badge color="secondary">
                <PersonIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Logout">
            <IconButton
              color="secondary"
              classes={{ colorSecondary: classes.actionButtons }}
              onClick={props.onLogoutClicked}
            >
              <Badge color="secondary">
                <ExitIcon />
              </Badge>
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
    </ElevationScroll>
  );
}
