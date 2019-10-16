import React from "react";
import { gql } from "apollo-boost";
import { Query } from "react-apollo";
import ContentLoader from "react-content-loader";
import AddIcon from "@material-ui/icons/Add";
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
import ErrorOutline from "@material-ui/icons/ErrorOutline";
import MaterialTable from "material-table";

import moment from "moment";
import { CheckCircleOutline } from "mdi-material-ui";
import { Paper } from "@material-ui/core";
import { Redirect } from "react-router";
import { RollbarContext } from "../../rollbar-context";

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
  ViewColumn: ViewColumn
};



export default function PaymentList(props) {
  const rollbar = React.useContext(RollbarContext);

  //const [checked, setChecked] = React.useState([0]);

  // const handleToggle = value => () => {
  //   const currentIndex = checked.indexOf(value);
  //   const newChecked = [...checked];

  //   if (currentIndex === -1) {
  //     newChecked.push(value);
  //   } else {
  //     newChecked.splice(currentIndex, 1);
  //   }

  //   setChecked(newChecked);
  // };
  /*<Grid container direction="row" justify="space-between">
        <Grid item>
          <Typography className={classes.title} component="h1" variant="h5">
            thnx! Payments
          </Typography>
        </Grid>
        <Grid item>
          <Fab
            size="small"
            color="primary"
            aria-label="Add Payment"
            onClick={() => props.onEdit(undefined)}
            className={classes.addButton}
          >
            <AddIcon />
          </Fab>
        </Grid>
      </Grid>
      <Divider className={classes.divider} />*/
  return (
    <React.Fragment>
      <div style={{ margin: "16px" }}>
        <Query
          query={gql`
            {
              payments {
                receipt
                qty
                amount
                tax
                total
                createdAt
                status
                failureMessage
                user {
                  firstName
                  lastName
                }
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
                  <rect x="0" y="15" rx="0" ry="0" width="700" height="20" />
                  <circle cx="10" cy="50" r="8" />
                  <rect x="25" y="45" rx="5" ry="5" width="150" height="10" />
                  <rect x="195" y="45" rx="5" ry="5" width="150" height="10" />
                  <rect x="365" y="45" rx="5" ry="5" width="150" height="10" />
                  <rect x="535" y="45" rx="5" ry="5" width="150" height="10" />
                  <circle cx="10" cy="80" r="8" />
                  <rect x="25" y="75" rx="5" ry="5" width="150" height="10" />
                  <rect x="195" y="75" rx="5" ry="5" width="150" height="10" />
                  <rect x="365" y="75" rx="5" ry="5" width="150" height="10" />
                  <rect x="535" y="75" rx="5" ry="5" width="150" height="10" />
                  <circle cx="10" cy="110" r="8" />
                  <rect x="25" y="105" rx="5" ry="5" width="150" height="10" />
                  <rect x="195" y="105" rx="5" ry="5" width="150" height="10" />
                  <rect x="365" y="105" rx="5" ry="5" width="150" height="10" />
                  <rect x="535" y="105" rx="5" ry="5" width="150" height="10" />
                  <circle cx="10" cy="140" r="8" />
                  <rect x="25" y="135" rx="5" ry="5" width="150" height="10" />
                  <rect x="195" y="135" rx="5" ry="5" width="150" height="10" />
                  <rect x="365" y="135" rx="5" ry="5" width="150" height="10" />
                  <rect x="535" y="135" rx="5" ry="5" width="150" height="10" />
                </ContentLoader>
              );

            if (error) {
              rollbar.error(error);
              return <Redirect to="/error" />;
            }

            return (
              <React.Fragment>
                <Fab
                  size="large"
                  color="primary"
                  aria-label="Add Thnx!"
                  title="Add Thnx!"
                  style={{ position: "fixed", bottom: 15, right: 15 }}
                  onClick={() => props.onEdit(undefined)}
                >
                  <AddIcon />
                </Fab>
                <MaterialTable
                  title=""
                  icons={tableIcons}
                  options={{
                    searchFieldAlignment: "left",
                    showTextRowsSelected: false,
                    exportButton: true,
                    pageSize: data.payments.length > 5 ? 10 : 5,
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
                    search: true
                  }}
                  components={{
                    Container: props => (
                      <Paper elevation={0}>{props.children}</Paper>
                    )
                  }}
                  columns={[
                    {
                      title: "",
                      field: "status",
                      render: rowData =>
                        rowData.status === "succeeded" ? (
                          <CheckCircleOutline
                            style={{ color: "#86BC25", width: 35, height: 30 }}
                          />
                        ) : (
                          <ErrorOutline
                            style={{ color: "#49648D", width: 35, height: 30 }}
                          />
                        )
                    },
                    {
                      title: "Created",
                      field: "createdAt",
                      render: rowData =>
                        moment(rowData.createdAt).format("DD MMM YYYY")
                    },
                    {
                      title: "User",
                      field: "user.firstName",
                      render: rowData =>
                        `${rowData.user.firstName} ${rowData.user.lastName}`
                    },
                    {
                      title: "Qty",
                      field: "qty",
                      cellStyle: { textAlign: "right" },
                      headerStyle: { textAlign: "right" }
                    },
                    {
                      title: "Total",
                      field: "total",
                      cellStyle: { textAlign: "right" },
                      headerStyle: { textAlign: "right" },
                      render: rowData => `$${(rowData.total / 100).toFixed(2)}`
                    },
                    {
                      title: "Receipt",
                      field: "receipt",
                      cellStyle: { textAlign: "left" },
                      headerStyle: { textAlign: "left" }
                    },
                    { title: "", field: "failureMessage" }
                  ]}
                  data={data.payments}
                />
              </React.Fragment>
            );
          }}
        </Query>
      </div>
    </React.Fragment>
  );
}
