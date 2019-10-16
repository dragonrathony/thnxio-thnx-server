import React from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import { Paper, Grid } from "@material-ui/core";
import { RollbarContext } from "../../../rollbar-context";
import Page from "../../Page";
import RemittancePaymentList from "./list";
import RemittanceBatchList from "./batchList";
import UnpaidRemittancePaymentList from "./unpaid";

const moment = require("moment");
const _ = require("lodash");

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired
};

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "left",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper
  },
  container: {
    justifyContent: "left"
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    marginTop: theme.spacing(2) - 2
  },
  gridList: {
    width: 500,
    height: 450
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)"
  },
  tabs: {
    background: "white",
    borderRadius: "6px"
  }
}));

function AdminRemittancePaymentPage(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [refreshDate, setRefreshDate] = React.useState(0);

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  function handleChangeIndex(index) {
    setValue(index);
  }
  return (
    <Page title="thnx! Remittance Payments">
      <div className={classes.tabs}>
        <AppBar
          elevation={0}
          position="static"
          color="default"
          style={{
            borderTopLeftRadius: "6px",
            borderTopRightRadius: "6px"
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="secondary"
            variant="fullWidth"
          >
            <Tab label="Outstanding Payments" />
            <Tab label="Batched Payments" />
            <Tab label="History" />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <TabContainer dir={theme.direction}>
            <UnpaidRemittancePaymentList
              triggerRefresh={() => {
                setRefreshDate(moment());
                setValue(1);
              }}
            />
          </TabContainer>
          <TabContainer dir={theme.direction}>
            <RemittanceBatchList
              triggerRefresh={() => {
                setRefreshDate(moment());
              }}
            />
          </TabContainer>
          <TabContainer dir={theme.direction}>
            <RemittancePaymentList
              triggerRefresh={() => {
                setRefreshDate(moment());
              }}
            />
          </TabContainer>
        </SwipeableViews>
      </div>
    </Page>
  );
}

export default AdminRemittancePaymentPage;
