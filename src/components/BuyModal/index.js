import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ContentLoader from "react-content-loader";
import { Elements } from "react-stripe-elements";
import { Redirect } from "react-router";
import CheckoutForm from "./Form";
import { Modal } from "@material-ui/core";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { RollbarContext } from "../../rollbar-context";
import CloseButton from "../Common/CloseButton";

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

export default function BuyPage(props) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const rollbar = React.useContext(RollbarContext);

  return (
    <Modal
      aria-labelledby="buy-thnx"
      aria-describedby="buying-thnx"
      open={props.open}
      onClose={props.handleClose}
    >
      <div style={modalStyle} className={classes.modal}>
        <CloseButton handleClick={props.handleClose} />
        <Query
          query={gql`
            {
              account {
                id
                name
                unitThnxPrice
              }
            }
          `}
        >
          {({ loading, error, data }) => {
            if (loading) {
              return (
                <ContentLoader
                  height={200}
                  width={300}
                  speed={2}
                  primaryColor="#f7fafc"
                  secondaryColor="#edf2f7"
                >
                  <rect x="10" y="10" rx="5" ry="5" width="290" height="20" />
                  <rect x="10" y="40" rx="5" ry="5" width="290" height="20" />

                  <rect x="220" y="70" rx="5" ry="5" width="80" height="20" />
                  <rect x="220" y="100" rx="5" ry="5" width="80" height="20" />

                  <rect x="10" y="130" rx="5" ry="5" width="200" height="20" />
                  <rect x="220" y="130" rx="5" ry="5" width="80" height="20" />

                  <rect x="10" y="160" rx="5" ry="5" width="290" height="20" />
                </ContentLoader>
              );
            }
            if (error) {
              rollbar.error(error);
              return <Redirect to="/error" />;
            }

            return (
              <Elements>
                <CheckoutForm
                  handleClose={props.handleClose}
                  account={data.account}
                />
              </Elements>
            );
          }}
        </Query>
      </div>
    </Modal>
  );
}
