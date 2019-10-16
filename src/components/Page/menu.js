import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";

import ThnxBalance from "../ThnxBalance";
import MenuItem from "./menuItem";
import CompanyLogo from "./logo";

const drawerWidth = 240;
const _ = require("lodash");

const useStyles = makeStyles(theme => ({
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  drawerPaper: {
    position: "fixed",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    }),
    background: "#374359",
    display: "flex",
    border: "none"
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9)
    }
  },
  link: {
    textDecoration: "none",
    display: "block",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#4C5C7A"
    },
    "&.active": {
      backgroundColor: "#49648D !important",
      fontWeight: 900
    }
  },
  linkContainer: {
    /*"&:hover": {
      backgroundColor: "#4a5568"
    }*/
  },
  header: {
    marginTop: 12,
    fontWeight: 900,
    color: "#fff"
  },
  divider: {
    marginTop: 12,
    marginLeft: 12,
    marginRight: 12,
    backgroundColor: "#4C5C7A"
  },
  headerContainer: {
    textAlign: "center"
  },
  menuItem: {
    //color: "#fff"
  },
  logOut: {
    color: "#fff"
  },
  menuContainer: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column"
  },
  logoutContainer: {
    marginTop: "auto"
  },
  icon: {
    color: "#fff"
  },
  logoutIcon: {
    color: "#fff"
  },
  brandContainer: {
    padding: "24px"
  }
}));

export default function Menu(props) {
  const classes = useStyles();

  let data = props.data;
  let isOrganisationHub =
    _.intersection(props.data.roles, ["account_admin"]).length > 0;

  return (
    <Drawer
      variant="permanent"
      classes={{
        paper: clsx(
          classes.drawerPaper,
          !props.open && classes.drawerPaperClose
        )
      }}
      open={props.open}
    >
      <div className={classes.headerContainer}>
        <CompanyLogo />
      </div>
      {isOrganisationHub ? <ThnxBalance /> : undefined}
      <Divider className={classes.divider} />
      <List>
        <MenuItem
          title="Dashboard"
          to="/leaderboard"
          roles={["account_admin"]}
          userRoles={data && data.roles}
        />
        <MenuItem
          title="Team"
          to="/team"
          roles={["account_admin"]}
          userRoles={data && data.roles}
        />

        <MenuItem
          title="Payments"
          to="/payments"
          roles={["account_admin"]}
          userRoles={data && data.roles}
        />
        <MenuItem
          title="Account"
          to="/account"
          roles={["account_admin"]}
          userRoles={data && data.roles}
        />

        <MenuItem
          title="Coffee near me"
          to="/merchants"
          roles={["account_admin", "super_admin"]}
          userRoles={data && data.roles}
        />

        <MenuItem
          title="Merchant Admin"
          to="/admin/merchants"
          roles={["super_admin"]}
          userRoles={data && data.roles}
        />
        <MenuItem
          title="Remittance Admin"
          to="/admin/remittance"
          roles={["super_admin"]}
          userRoles={data && data.roles}
        />
        <MenuItem
          title="Account"
          to="/merchant/account"
          roles={["merchant_admin"]}
          userRoles={data && data.roles}
        />
        <MenuItem
          title="Transactions"
          to="/merchant/transactions"
          roles={["merchant_admin"]}
          userRoles={data && data.roles}
        />
        <MenuItem
          title="Payments"
          to="/merchant/payments"
          roles={["merchant_admin"]}
          userRoles={data && data.roles}
        />
      </List>
    </Drawer>
  );
}
