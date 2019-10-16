import React from "react";
import { gql } from "apollo-boost";
import { Query } from "react-apollo";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import ContentLoader from "react-content-loader";
import { PlusMinus, EmailCheck, EmailOutline } from "mdi-material-ui";
import { Paper, Modal, Chip } from "@material-ui/core";
import { Sparklines, SparklinesLine } from "react-sparklines";

import PersonAddIcon from "@material-ui/icons/PersonAdd";
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
import AssignThnxModal from "./assignThanxModal";
import ConfirmUserDelete from "./ConfirmDelete";
import ConfirmAssignThnx from "./ConfirmAssignThnx";
import { Redirect } from "react-router";
import MaterialTable, { MTableAction } from "material-table";
import { RollbarContext } from "../../rollbar-context";
import CloseButton from "../Common/CloseButton";
import ConfirmResentInvite from "./ConfirmResendInvite";
import moment from "moment";

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
    //color: "#ED1A70",
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

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

export default function TeamList(props) {
  const classes = useStyles();
  const [availableThnx, setAvailableThnx] = React.useState([0]);
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [confirmAssign, setConfirmAssign] = React.useState(false);
  const [modalStyle] = React.useState(getModalStyle);

  const [open, setOpen] = React.useState(false);
  const [resendInviteConfirm, setResendInviteConfirm] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [selectedUserRows, setSelectedUserRows] = React.useState([]);

  const rollbar = React.useContext(RollbarContext);

  function handleResendInviteClick(user) {
    setSelectedUser(user);
    setResendInviteConfirm(true);
  }
  function handleAssignThnxClick(user) {
    setSelectedUser(user);
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setResendInviteConfirm(false);
  }

  function handleConfirmClick(event) {
    setConfirmDelete(true);
  }

  function handleCloseConfirm() {
    setConfirmDelete(false);
  }
  function handleAssignConfirmClick(event) {
    setConfirmAssign(true);
  }

  function handleAssignCloseConfirm() {
    setConfirmAssign(false);
  }
  /*<Grid container direction="row" justify="space-between">
        <Grid item>
          <Typography className={classes.title} component="h1" variant="h5">
            thnx! Givers
          </Typography>
        </Grid>
      </Grid>
      <Divider className={classes.divider} />*/
  return (
    <React.Fragment>
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
                <ContentLoader
                  height={30}
                  width={500}
                  speed={2}
                  primaryColor="#f7fafc"
                  secondaryColor="#edf2f7"
                >
                  <circle cx="400" cy="14" r="14" />
                  <rect x="420" y="6" rx="4" ry="4" width="80" height="14" />
                </ContentLoader>
              </div>
            );

          if (error) {
            rollbar.error(error);
            return <Redirect to="/error" />;
          }

          setAvailableThnx(data.unassignedThnx.length);
          return (
            <div className={classes.thnxRemaining}>
              <span style={{ fontSize: "24px" }}>
                {data.unassignedThnx.length}
              </span>
              <span
                style={{ fontSize: "16px", marginLeft: 15, marginRight: 10 }}
              >
                thnx! unassigned
              </span>
            </div>
          );
        }}
      </Query>
      <Query
        query={gql`
          {
            accountUsers {
              id
              firstName
              lastName
              email
              thnxCredits
              last7DaysGivingActivity
              isAdmin
              lastSignInAt
              resetPasswordSentAt
            }
          }
        `}
      >
        {({ loading, error, data }) => {
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

          // return (
          //   <Grid container direction="column">
          //     {data.accountUsers.map(user => (
          //       <ListItem
          //         key={user.id}
          //         user={user}
          //         availableThnx={availableThnx}
          //       />
          //     ))}
          //   </Grid>
          // );

          let assignThnxModalComponent = selectedUser ? (
            <AssignThnxModal
              user={selectedUser}
              qty={selectedUser.thnxCredits}
              maxQty={availableThnx}
              handleClose={handleClose}
            />
          ) : (
            undefined
          );

          let deleteUserModalComponent = selectedUserRows ? (
            <ConfirmUserDelete
              users={selectedUserRows}
              open={confirmDelete}
              handleClose={handleCloseConfirm}
            />
          ) : (
            undefined
          );
          let confirmAssignThnxModalComponent = (
            <ConfirmAssignThnx
              users={
                selectedUserRows && selectedUserRows.length > 0
                  ? selectedUserRows
                  : data.accountUsers
              }
              availableThnx={availableThnx}
              open={confirmAssign}
              handleClose={handleAssignCloseConfirm}
            />
          );

          let confirmResendInviteComponent = (
            <ConfirmResentInvite
              user={selectedUser}
              open={resendInviteConfirm}
              handleClose={handleClose}
            />
          );
          /*
                  {
                    icon: () => (
                      <Fab size="small" color="primary" aria-label="Add Giver">
                        <PersonAddIcon />
                      </Fab>
                    ),
                    tooltip: "Add Giver",
                    isFreeAction: true,
                    onClick: event => {
                      props.onEdit(undefined);
                    }
                  },*/
          return (
            <React.Fragment>
              <Modal
                aria-labelledby="buy-thnx"
                aria-describedby="buying-thnx"
                open={open}
                onClose={handleClose}
              >
                <div style={modalStyle} className={classes.modal}>
                  <CloseButton handleClick={handleClose} />
                  {assignThnxModalComponent}
                </div>
              </Modal>
              {deleteUserModalComponent}
              {confirmAssignThnxModalComponent}
              {confirmResendInviteComponent}
              <Fab
                size="large"
                color="primary"
                aria-label="Add Giver"
                title="Add Giver"
                style={{ position: "fixed", bottom: 15, right: 15 }}
                onClick={() => props.onEdit(undefined)}
              >
                <PersonAddIcon />
              </Fab>
              <MaterialTable
                title=""
                icons={tableIcons}
                options={{
                  search: true,
                  searchFieldAlignment: "left",
                  showTextRowsSelected: false,
                  exportButton: false,
                  pageSize: data.accountUsers.length > 5 ? 10 : 5,
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
                  selection: true
                }}
                actions={[
                  {
                    icon: () => <div>Assign Evenly</div>,
                    button: {
                      text: "Assign Evenly",
                      variant: "outlined",
                      color: !availableThnx ? "default" : "secondary"
                    },
                    tooltip: "Assign Thnx! Evenly",
                    isFreeAction: true,
                    onClick: (event, rowData) => {
                      handleAssignConfirmClick();
                    },
                    disabled: !availableThnx
                  },
                  {
                    icon: () => <div>Assign Evenly</div>,
                    button: {
                      text: "Assign Evenly",
                      variant: "outlined",
                      color: !availableThnx ? "default" : "secondary"
                    },
                    tooltip: "Assign Thnx! Evenly",
                    onClick: (event, rowData) => {
                      handleAssignConfirmClick();
                    },
                    disabled: !availableThnx
                  },
                  {
                    icon: () => <DeleteOutline />,
                    tooltip: "Delete Users",
                    onClick: (event, rowData) => {
                      handleConfirmClick();
                    }
                  }
                ]}
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
                    title: "User",
                    field: "firstName",
                    render: user => (
                      <div>
                        {user.firstName} {user.lastName}
                        {user.isAdmin ? (
                          <Chip
                            style={{ marginLeft: 5 }}
                            color="primary"
                            size="small"
                            variant="outlined"
                            label={<div>admin</div>}
                          />
                        ) : (
                          undefined
                        )}
                      </div>
                    )
                  },
                  {
                    title: "Email",
                    field: "email",
                    render: user => `${user.email}`
                  },
                  {
                    title: "Last 7 Days Giving",
                    field: "",
                    cellStyle: { textAlign: "center" },
                    headerStyle: { textAlign: "center" },
                    render: user => (
                      <Sparklines
                        data={user.last7DaysGivingActivity}
                        width={100}
                        height={20}
                        margin={5}
                        limit={7}
                      >
                        {/* <SparklinesBars
                          color="#BD0F68"
                          style={{ fill: "#BD0F68" }}
                        /> */}
                        <SparklinesLine
                          color="#BD0F68"
                          style={{ fill: "none" }}
                        />
                      </Sparklines>
                    )
                  },
                  {
                    title: "Available thnx!",
                    field: "thnxCredits",
                    cellStyle: { textAlign: "left", width: "100px" },
                    headerStyle: { textAlign: "left", width: "100px" },
                    render: user => `${user.thnxCredits}`
                  },
                  {
                    title: "",
                    field: "lastSignInAt",
                    width: "50px",
                    cellStyle: { textAlign: "center", width: "100px" },
                    headerStyle: { textAlign: "center", width: "100px" },
                    render: user => (
                      <div style={{ textAlign: "center" }}>
                        {user.resetPasswordSentAt && !user.lastSignInAt ? (
                          <IconButton
                            onClick={() => handleResendInviteClick(user)}
                          >
                            <EmailCheck />
                          </IconButton>
                        ) : !user.lastSignInAt ? (
                          <IconButton
                            onClick={() => handleResendInviteClick(user)}
                          >
                            <EmailOutline />
                          </IconButton>
                        ) : (
                          undefined
                        )}

                        {user.resetPasswordSentAt && !user.lastSignInAt ? (
                          <div
                            style={{ fontSize: "0.6rem", textAlign: "center" }}
                          >
                            {moment(user.resetPasswordSentAt).fromNow()}
                          </div>
                        ) : (
                          undefined
                        )}
                      </div>
                    )
                  },
                  {
                    title: "",
                    field: "action",
                    cellStyle: { textAlign: "right", width: "50px" },
                    headerStyle: { textAlign: "right", width: "50px" },
                    render: user => (
                      <div>
                        <IconButton
                          onClick={() => handleAssignThnxClick(user)}
                          disabled={!availableThnx && user.thnxCredits === 0}
                        >
                          <PlusMinus />
                        </IconButton>
                        <div />
                      </div>
                    )
                  }
                ]}
                data={data.accountUsers}
                onSelectionChange={rows => setSelectedUserRows(rows)}
              />
            </React.Fragment>
          );
        }}
      </Query>
    </React.Fragment>
  );
}
