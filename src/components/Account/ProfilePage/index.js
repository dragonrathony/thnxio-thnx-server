import React from "react";
import { gql } from "apollo-boost";
import ContentLoader from "react-content-loader";
import { Query } from "react-apollo";
import { makeStyles } from "@material-ui/core/styles";
import Form from "./form";
import { Modal } from "@material-ui/core";
import { Redirect } from "react-router";
import { RollbarContext } from "../../../rollbar-context";
import CloseButton from "../../Common/CloseButton";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}
const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    //marginTop: theme.spacing(2) - 2,
    paddingBottom: "100px !important",
    background: "#fff"
  },
  pageContainer: {
    display: "flex",
    flexDirection: "row"
  },
  totalsContainer: {
    textAlign: "right",
    marginTop: 48
  },
  paymentContainer: {
    textAlign: "left",
    marginTop: theme.spacing(4)
  },
  paymentTitle: {
    marginBottom: theme.spacing(2)
  },
  totalSubtitle: {
    color: "#718096",
    fontSize: "1rem"
  },
  submit: {
    marginTop: theme.spacing(2)
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

export default function UpdateProfile(props) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const rollbar = React.useContext(RollbarContext);

  return (
    <Modal
      aria-labelledby="update-profile"
      aria-describedby="update-profile"
      open={props.open}
      onClose={props.handleClose}
    >
      <div style={modalStyle} className={classes.modal}>
        <CloseButton handleClick={props.handleClose} />
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
                <ContentLoader
                  height={200}
                  width={300}
                  speed={2}
                  primaryColor="#f7fafc"
                  secondaryColor="#edf2f7"
                >
                  <rect x="10" y="10" rx="5" ry="5" width="140" height="20" />
                  <rect x="160" y="10" rx="5" ry="5" width="140" height="20" />

                  <rect x="10" y="50" rx="5" ry="5" width="290" height="20" />
                  <rect x="10" y="90" rx="5" ry="5" width="290" height="20" />

                  <rect x="10" y="130" rx="5" ry="5" width="290" height="20" />

                  <rect x="10" y="170" rx="5" ry="5" width="290" height="20" />
                </ContentLoader>
              );

            if (error) {
              rollbar.error(error);
              return <Redirect to="/error" />;
            }

            return (
              <Form user={data.currentUser} handleClose={props.handleClose} />
            );
          }}
        </Query>
      </div>
    </Modal>
  );
}
