import React from "react";
import { gql } from "apollo-boost";
import { Query } from "react-apollo";
import { makeStyles } from "@material-ui/core/styles";
import ContentLoader from "react-content-loader";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import { Redirect } from "react-router";
import { RollbarContext } from "../../rollbar-context";

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
    marginBottom: 12,
    backgroundColor: "#F8F8F8"
  },
  title: {
    color: "#333d51"
  },
  subtitle: {
    color: "#374359",
    fontWeight: "bold",
    fontSize: "1.1rem",
    marginTop: theme.spacing(2)
  },
  subtitleMuted: {
    color: "#BD0F68"
  },
  addButton: {
    color: "#fff"
  },
  avatar: {
    margin: 10,
    backgroundColor: "#289FCF"
  },
  user: {
    padding: 5,
    marginTop: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  userContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  itemPlace: {
    fontSize: 36,
    padding: 10,
    width: 40
  },
  itemPlace2: {
    color: theme.palette.text.secondary,
    fontSize: 24,
    padding: 10,
    width: 40
  },
  userName: {
    fontWeight: 600,
    fontSize: 16,
    paddingLeft: 10
  },
  userName2: {
    fontSize: 16,
    paddingLeft: 10,
    color: theme.palette.text.secondary
  },
  userThnx: {
    textAlign: "center",
    marginRight: 24
  },
  sectionTitle: { fontSize: 28, fontWeight: 600, textAlign: "center" },
  thnxTotal: {
    fontSize: 24,
    fontWeight: 900
  },
  thnxTotal2: {
    fontSize: 24,
    fontWeight: 600,
    color: theme.palette.text.secondary
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
  delete: {
    color: "#ED1A70",
    "&:hover": {
      backgroundColor: "#fff5f5"
    }
  },
  thnxRemaining: {
    display: "flex",
    alignItems: "flex-end",
    flexDirection: "column",
    marginBottom: 24,
    color: "#718096"
  },
  thnxContainer: {
    display: "flex"
  },
  assignThnxContainer: {
    padding: 24
  }
}));

export default function LeaderboardList(props) {
  const classes = useStyles();
  const rollbar = React.useContext(RollbarContext);

  return (
    <React.Fragment>
      <Grid container direction="row" justify="space-between">
        <Grid item>
          <Typography className={classes.title} component="h1" variant="h5">
            thnx! Receivers Leaderboard
          </Typography>
        </Grid>
      </Grid>
      <Divider className={classes.divider} />
      <Query
        query={gql`
          {
            accountUsers {
              id
              firstName
              lastName
              email
              totalThnxReceived
              totalThnxGifted
              isAdmin
            }
          }
        `}
      >
        {({ loading, error, data }) => {
          if (loading)
            return (
              <ContentLoader
                height={160}
                width={300}
                speed={2}
                primaryColor="#f7fafc"
                secondaryColor="#edf2f7"
              >
                <rect x="10" y="10" rx="5" ry="5" width="40" height="10" />
                <rect x="70" y="10" rx="5" ry="5" width="150" height="10" />
                <rect x="240" y="10" rx="5" ry="5" width="40" height="10" />
                <rect x="10" y="50" rx="5" ry="5" width="40" height="10" />
                <rect x="70" y="50" rx="5" ry="5" width="150" height="10" />
                <rect x="240" y="50" rx="5" ry="5" width="40" height="10" />
                <rect x="10" y="90" rx="5" ry="5" width="40" height="10" />
                <rect x="70" y="90" rx="5" ry="5" width="150" height="10" />
                <rect x="240" y="90" rx="5" ry="5" width="40" height="10" />
                <rect x="10" y="130" rx="5" ry="5" width="40" height="10" />
                <rect x="70" y="130" rx="5" ry="5" width="150" height="10" />
                <rect x="240" y="130" rx="5" ry="5" width="40" height="10" />
              </ContentLoader>
            );

          if (error) {
            rollbar.error(error);
            return <Redirect to="/error" />;
          }

          let oldTitle = undefined;
          let title = undefined;
          return (
            <Grid container direction="row">
              <Grid
                container
                direction="column"
                style={{ flex: 1, display: "flex" }}
              >
                {data.accountUsers
                  .sort((a, b) => b.totalThnxReceived - a.totalThnxReceived)
                  .map((user, i) => {
                    let newTitle = "Encouragement Award";
                    let subtitle =
                      "A lot of staff prefer recognition to a pay rise - Forbes";
                    if (user.totalThnxReceived >= 3) {
                      newTitle = "Solid Work";
                      subtitle = "";
                    }
                    if (user.totalThnxReceived >= 4) {
                      newTitle = "Close to the Stars ";
                      subtitle = "";
                    }
                    if (user.totalThnxReceived >= 6) {
                      newTitle = "Epic Collaborator";
                      subtitle =
                        "A simple thnx! Can make staff work 50% harder - Harvard";
                    }

                    if (newTitle !== oldTitle) {
                      title = newTitle;
                      oldTitle = newTitle;
                    } else {
                      title = undefined;
                    }

                    let message = `Received ${
                      user.totalThnxReceived ? user.totalThnxReceived : 0
                    } thnx!`;

                    return (
                      <Grid item>
                        {title ? (
                          <div>
                            <Typography className={classes.subtitle}>
                              {title}
                            </Typography>
                            <muted className={classes.subtitleMuted}>
                              {subtitle}
                            </muted>
                          </div>
                        ) : (
                          undefined
                        )}
                        <Card className={classes.user} elevation={0}>
                          <div className={classes.userContainer}>
                            <div>
                              <Typography className={classes.userName2}>
                                <strong>
                                  {user.firstName} {user.lastName}
                                </strong>{" "}
                                {message}
                              </Typography>
                            </div>
                          </div>
                        </Card>
                      </Grid>
                    );
                  })}
              </Grid>
            </Grid>
          );
        }}
      </Query>
    </React.Fragment>
  );
}
