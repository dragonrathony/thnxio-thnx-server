import React from "react";
import { gql } from "apollo-boost";
import { Query } from "react-apollo";
import { Button, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ContentLoader from "react-content-loader";
import { PlusMinus, ReflectHorizontal } from "mdi-material-ui";
import { Paper } from "@material-ui/core";
import { Sparklines, SparklinesLine } from "react-sparklines";

import AddLocationIcon from "@material-ui/icons/AddLocation";
import Fab from "@material-ui/core/Fab";
import AddBox from "@material-ui/icons/AddBox";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import { Redirect } from "react-router";
import MaterialTable, { MTableAction } from "material-table";
import { RollbarContext } from "../../../rollbar-context";
import { Link } from "react-router-dom";

import moment from "moment";
import AddEditModal from "./AddEditModal";

const tableIcons = {
  Add: AddBox,
  Check: Check,
  Clear: Clear,
  Delete: DeleteOutline,
  DetailPanel: ChevronRight,
  Edit: Edit,
  Export: SaveAlt,
  Filter: FilterList,
  FirstPage: FirstPage,
  LastPage: LastPage,
  NextPage: ChevronRight,
  PreviousPage: ChevronLeft,
  ResetSearch: Clear,
  Search: Search,
  SortArrow: ArrowUpward,
  ThirdStateCheck: Remove,
  ViewColumn: ViewColumn,
  PlusMinus: PlusMinus
};

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)"
  },
  fab: {},
  divider: {
    marginTop: 12,
    margin: 12,
    backgroundColor: "#F8F8F8"
  },
  title: {
    color: "#333d51"
  },
  addButton: {
    color: "#fff"
  },
  avatar: {
    margin: 10,
    backgroundColor: "#E4E8EB"
  },
  user: {
    padding: 12,
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "solid 1px #EDF2F7"
  },
  userContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  userName: {
    fontWeight: 500,
    fontSize: 18
  },
  userEmail: {
    fontSize: 14,
    color: "#718096"
  },
  userThnx: {
    textAlign: "center",
    marginRight: 48
  },
  thnxTotal: {
    fontSize: 24,
    fontWeight: 500
  },
  thnxSubtitle: {
    fontSize: 12
  },
  actionsContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  actions: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  more: {
    color: "#9FAEC0",
    "&:hover": {
      backgroundColor: "#F7FAFC"
    }
  },
  thnxRemaining: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 14,
    fontWeight: 700
  },
  thnxContainer: {
    display: "flex"
  },
  modal: {
    position: "absolute",
    width: 500,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: "none",
    borderRadius: "6px"
  }
}));

export default function MerchantList(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [selectedAccount, setSelected] = React.useState(null);
  const rollbar = React.useContext(RollbarContext);
  function handleOpenClick(account) {
    setSelected(account);
    setOpen(true);
  }

  function handleClose(id) {
    setOpen(false);
  }
  return (
    <React.Fragment>
      <Query
        query={gql`
          query Merchants {
            merchants {
              id
              name
              code
              primaryEmail
              accountUsers {
                user {
                  id
                  firstName
                  lastName
                  email
                  lastSignInAt
                }
              }
              last7DaysActivity
            }
          }
        `}
      >
        {({ loading, error, data, refetch }) => {
          if (loading)
            return (
              <ContentLoader
                height={160}
                width={750}
                speed={2}
                primaryColor="#f7fafc"
                secondaryColor="#edf2f7"
              >
                <circle cx="10" cy="15" r="8" />
                <rect x="25" y="10" rx="5" ry="5" width="150" height="10" />
                <rect x="195" y="10" rx="5" ry="5" width="150" height="10" />
                <rect x="365" y="10" rx="5" ry="5" width="150" height="10" />
                <rect x="535" y="10" rx="5" ry="5" width="150" height="10" />
                <circle cx="10" cy="55" r="8" />
                <rect x="25" y="50" rx="5" ry="5" width="150" height="10" />
                <rect x="195" y="50" rx="5" ry="5" width="150" height="10" />
                <rect x="365" y="50" rx="5" ry="5" width="150" height="10" />
                <rect x="535" y="50" rx="5" ry="5" width="150" height="10" />
                <circle cx="10" cy="95" r="8" />
                <rect x="25" y="90" rx="5" ry="5" width="150" height="10" />
                <rect x="195" y="90" rx="5" ry="5" width="150" height="10" />
                <rect x="365" y="90" rx="5" ry="5" width="150" height="10" />
                <rect x="535" y="90" rx="5" ry="5" width="150" height="10" />
                <circle cx="10" cy="135" r="8" />
                <rect x="25" y="130" rx="5" ry="5" width="150" height="10" />
                <rect x="195" y="130" rx="5" ry="5" width="150" height="10" />
                <rect x="365" y="130" rx="5" ry="5" width="150" height="10" />
                <rect x="535" y="130" rx="5" ry="5" width="150" height="10" />
              </ContentLoader>
            );

          if (error) {
            rollbar.error(error);
            return <Redirect to="/error" />;
          }
          return (
            <React.Fragment>
              <AddEditModal
                account={selectedAccount}
                open={open}
                handleCreate={id => {
                  handleClose();
                  refetch().then(response => {
                    if (!isNaN(id)) {
                      props.history.push(`/admin/merchant/${id}`);
                    }
                  });
                }}
                handleClose={handleClose}
              />
              <Fab
                size="large"
                color="primary"
                aria-label="Add Giver"
                title="Add Giver"
                style={{ position: "fixed", bottom: 15, right: 15 }}
                onClick={() => handleOpenClick(undefined)}
              >
                <AddLocationIcon />
              </Fab>
              <MaterialTable
                title=""
                icons={tableIcons}
                options={{
                  search: true,
                  searchFieldAlignment: "left",
                  showTextRowsSelected: false,
                  exportButton: false,
                  pageSize: data.merchants.length > 5 ? 10 : 5,
                  showTitle: false,
                  elevation: 0,
                  headerStyle: {
                    fontFamily: "Roboto",
                    fontWeight: 400,
                    color: "#718096"
                  },
                  rowStyle: {
                    fontFamily: "Roboto",
                    fontWeight: 300,
                    color: "#595a5c"
                  },
                  actionsColumnIndex: -1,
                  selection: false
                }}
                /* actions={[
                  {
                    icon: () => <DeleteOutline />,
                    tooltip: "Delete Merchants",
                    onClick: (event, rowData) => {}
                  }
                ]}*/
                components={{
                  Action: actionProps => {
                    if (actionProps.action.button) {
                      return (
                        <Button
                          onClick={actionProps.action.onClick}
                          disabled={actionProps.action.disabled}
                          variant={actionProps.action.button.variant}
                          color={actionProps.action.button.color}
                        >
                          {actionProps.action.button.text}
                        </Button>
                      );
                    } else {
                      return <MTableAction {...actionProps} />;
                    }
                  },
                  Container: props => (
                    <Paper elevation={0}>{props.children}</Paper>
                  )
                }}
                columns={[
                  {
                    title: "Name",
                    field: "name",
                    render: account => `${account.name}`
                  },
                  {
                    title: "Contact",
                    field: "firstName",
                    render: merchant =>
                      `${
                        merchant.accountUsers &&
                        merchant.accountUsers.length > 0
                          ? `${merchant.accountUsers[0].user.firstName} ${merchant.accountUsers[0].user.lastName}`
                          : ""
                      }`
                  },
                  {
                    title: "Primary Email",
                    field: "email",
                    render: merchant =>
                      `${
                        merchant.accountUsers &&
                        merchant.accountUsers.length > 0
                          ? merchant.accountUsers[0].user.email
                          : ""
                      }`
                  },
                  {
                    title: "Last Sign In",
                    field: "lastSinInAt",
                    render: merchant =>
                      `${
                        merchant.accountUsers &&
                        merchant.accountUsers.length > 0 &&
                        merchant.accountUsers[0].user.lastSignInAt
                          ? moment(
                              merchant.accountUsers[0].user.lastSignInAt
                            ).fromNow()
                          : ""
                      }`
                  },
                  {
                    title: "Last 7 Days Activity",
                    field: "",
                    cellStyle: { textAlign: "center" },
                    headerStyle: { textAlign: "center" },
                    render: account => (
                      <Sparklines
                        data={account.last7DaysActivity}
                        width={100}
                        height={20}
                        margin={5}
                        limit={7}
                      >
                        <SparklinesLine
                          color="#BD0F68"
                          style={{ fill: "none" }}
                        />
                      </Sparklines>
                    )
                  },
                  {
                    title: "",
                    field: "action",
                    cellStyle: { textAlign: "right", width: "50px" },
                    headerStyle: { textAlign: "right", width: "50px" },
                    render: account => (
                      <div>
                        <Link
                          color="inherit"
                          to={`/admin/merchant/${account.id}`}
                        >
                          <Edit />
                        </Link>
                        <div />
                      </div>
                    )
                  }
                ]}
                data={data.merchants}
              />
            </React.Fragment>
          );
        }}
      </Query>
    </React.Fragment>
  );
}
