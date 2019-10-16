import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import PersonIcon from "@material-ui/icons/Person";
import Card from "@material-ui/core/Card";
import Avatar from "@material-ui/core/Avatar";

import Grid from "@material-ui/core/Grid";
import AssignThnxModal from "./assignThanxModal";
import ConfirmUserDelete from "./ConfirmDelete";
import ActionMenu from "./actionMenu";

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
    fontSize: 18,
    display: "flex",
    alignItems: "center",
    flexDirection: "row"
  },
  userEmail: {
    fontSize: 14,
    color: "#718096"
  },
  userThnx: {
    textAlign: "center",
    marginRight: theme.spacing(2)
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
    color: "#ED1A70",
    fontWeight: 700
  },
  thnxContainer: {
    display: "flex"
  }
}));

export default function ListItem(props) {
  const classes = useStyles();
  const user = props.user;
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  function handleConfirmClick(event) {
    setConfirmDelete(true);
  }

  function handleCloseConfirm() {
    setConfirmDelete(false);
  }
  return (
    <React.Fragment>
      <Grid item>
        <Card className={classes.user} elevation={0}>
          <div className={classes.userContainer}>
            <Avatar className={classes.avatar}>
              <PersonIcon />
            </Avatar>
            <div>
              <Typography className={classes.userName} component="div">
                {user.firstName} {user.lastName}{" "}
                <ActionMenu handleDelete={handleConfirmClick} />
              </Typography>
              <Typography className={classes.userEmail}>
                {user.email}
              </Typography>
            </div>
          </div>
          <div className={classes.actionsContainer}>
            <div className={classes.thnxContainer}>
              <div className={classes.userThnx}>
                <Typography className={classes.thnxTotal}>
                  {user.thnxCredits}
                </Typography>
                <Typography className={classes.thnxSubtitle}>thnx!</Typography>
              </div>
            </div>
            <div className={classes.actions}>
              <ConfirmUserDelete
                user={user}
                open={confirmDelete}
                handleClose={handleCloseConfirm}
              />
              <AssignThnxModal
                user={user}
                qty={user.thnxCredits}
                maxQty={props.availableThnx}
              />
            </div>
          </div>
        </Card>
      </Grid>
    </React.Fragment>
  );
}
