import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import HelpOutlineRounded from "@material-ui/icons/HelpOutlineRounded";
import Promise from "es6-promise";
Promise.polyfill();

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(2),
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(2),
    fontWeight: "bold"
  },
  form: { padding: theme.spacing(2) },
  message: {},
  field: {
    borderBottom: "solid 1px #cccccc",
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: 0,
    border: 0,
    width: "100%",
    fontSize: "16px"
  },
  submit: {
    marginTop: theme.spacing(2),
    background: "#6164a7",
    borderRadius: "6px",
    color: "white"
  },
  error: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    backgroundColor: "rgba(255,93,2,0.7)",
    fontWeight: "bold",
    borderRadius: "6px"
  },
  muted: {
    marginTop: theme.spacing(2),
    fontSize: "0.7rem"
  }
}));
export default function CompleteStep(props) {
  const classes = useStyles();
  return props.show ? (
    <div style={{ textAlign: "center", marginTop: "16px" }}>
      <Typography component="h3" variant="h6" className={classes.title}>
        We are so sorry, but something has gone wrong processing your email.
        Please try again.
      </Typography>

      <div
        style={{
          textAlign: "right",
          marginTop: 10
        }}
      >
        <a
          href="mailto:hello@thnx.io"
          style={{
            color: "#6164a7",
            backgroundColor: "#fffff",
            padding: 10
          }}
        >
          <HelpOutlineRounded />
        </a>
      </div>
    </div>
  ) : null;
}
