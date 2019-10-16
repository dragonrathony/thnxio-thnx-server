import React from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import { Paper, Grid } from "@material-ui/core";
import CreateMerchantForm from "../AddEditModal/form";
import Transactions from "../Transaction";
import { RollbarContext } from "../../../../rollbar-context";
import Page from "../../../Page";
import SimpleMap from "../Map";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import ContentLoader from "react-content-loader";

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

function AccountPage(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [id, setId] = React.useState(props.match.params.id);

  const rollbar = React.useContext(RollbarContext);

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  function handleChangeIndex(index) {
    setValue(index);
  }
  return (
    <Query
      query={gql`
        query Merchant($id: ID!) {
          merchant(id: $id) {
            id
            name
            code
            unitThnxPrice
            bsb
            accountNo
            abn
            primaryEmail
            accountUsers {
              user {
                id
                firstName
                lastName
                email
              }
            }
            addresses {
              id
              address1
              address2
              city
              state
              postcode
              latitude
              longitude
            }
          }
        }
      `}
      variables={{ id: id }}
    >
      {({ loading, error, data, refetch }) => {
        if (loading)
          return (
            <Page title="Merchant Details">
              <Paper className={classes.paper}>
                <ContentLoader
                  height={75}
                  width={300}
                  speed={2}
                  primaryColor="#f7fafc"
                  secondaryColor="#edf2f7"
                >
                  <rect x="10" y="10" rx="5" ry="5" width="290" height="15" />
                  <rect x="10" y="35" rx="5" ry="5" width="290" height="15" />
                  <rect x="110" y="60" rx="5" ry="5" width="80" height="15" />
                </ContentLoader>
              </Paper>
            </Page>
          );

        if (error) {
          rollbar.error(error);
          console.log(error);
          return null;
        }

        let code = `https://chart.googleapis.com/chart?chs=177x177&cht=qr&chl=${data.merchant.code}&choe=UTF-8`;
        let merchant = data && _.cloneDeep(data.merchant);

        merchant.user =
          merchant.accountUsers.length > 0 ? merchant.accountUsers[0].user : {};
        merchant.address =
          merchant.addresses.length > 0 ? merchant.addresses[0] : {};

        return (
          <Page title="thnx! Merchant">
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
                  <Tab label="Account" />
                  <Tab label="Transactions" />
                </Tabs>
              </AppBar>
              <SwipeableViews
                axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                index={value}
                onChangeIndex={handleChangeIndex}
              >
                <TabContainer dir={theme.direction}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={8}>
                      <CreateMerchantForm
                        handleCreate={() => refetch()}
                        handleClose={() => refetch()}
                        data={merchant}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4} style={{ textAlign: "center" }}>
                      {merchant.address && merchant.address.latitude ? (
                        <SimpleMap data={merchant.address} />
                      ) : (
                        undefined
                      )}
                      {merchant.code ? (
                        <img src={code} alt="qr code" width="300" />
                      ) : (
                        undefined
                      )}
                    </Grid>
                  </Grid>
                </TabContainer>
                <TabContainer dir={theme.direction}>
                  <Transactions id={merchant.id} />
                </TabContainer>
              </SwipeableViews>
            </div>
          </Page>
        );
      }}
    </Query>
  );
}

export default AccountPage;
