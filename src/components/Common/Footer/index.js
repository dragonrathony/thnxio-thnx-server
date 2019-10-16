import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
  strong: {
    fontWeight: 600
  },
  footer: {
    padding: theme.spacing(2),
    marginTop: "auto",
    textAlign: "center",
    backgroundColor: "#F7FAFC",
    color: "#718096"
  }
}));
export default function Footer(props) {
  const classes = useStyles();
  return (
    <div className={classes.footer}>
      <Typography>
        Powering{" "}
        <span className={classes.strong}>The Gratitude Economy &trade;</span>{" "}
        with your thnx!
      </Typography>
      Our{" "}
      <Link color="inherit" href="http://thnx.io/privacypolicy">
        Privacy Policy
      </Link>
      | &copy; Thnx Pty Ltd 2019 | ABN: 29 631 324 804 |{" "}
      <Link color="inherit" href="mailto:admin@thnx.io">
        hello@thnx.io
      </Link>{" "}
      - Level 5, 200 Adelaide Street, Brisbane QLD 4000
    </div>
  );
}
