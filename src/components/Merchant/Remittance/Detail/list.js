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
import { RollbarContext } from "../../../../rollbar-context";
const _ = require("lodash");

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

export default function RemittancePaymentList(props) {
  const rollbar = React.useContext(RollbarContext);

  return (
    <React.Fragment>
      <div style={{ margin: "16px" }}>
        <Query
          query={gql`
            query RemittancePaymentItems($id: ID!) {
              remittancePaymentItems(id: $id) {
                id
                thnx {
                  redeemedAt
                }
              }
            }
          `}
          variables={{ id: props.id }}
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
              console.log(error);
              rollbar.error(error);
              return <Redirect to="/error" />;
            }

            console.log(data);
            let dates = _.uniq(
              data.remittancePaymentItems
                .sort((a, b) =>
                  moment(a.thnx.redeemedAt).isBefore(moment(b.thnx.redeemedAt))
                    ? 1
                    : moment(a.thnx.redeemedAt).isAfter(
                        moment(b.thnx.redeemedAt)
                      )
                    ? -1
                    : 0
                )
                .map(d =>
                  moment(d.thnx.redeemedAt)
                    .startOf("day")
                    .format("DD MMM YY")
                )
            );
            let mydata = dates.map((d, i) => {
              return {
                redeemedAt: d,
                count: data.remittancePaymentItems.filter(g =>
                  moment(g.thnx.redeemedAt).isSame(moment(d), "day")
                ).length
              };
            });

            return (
              <React.Fragment>
                <MaterialTable
                  title="Payment Items"
                  icons={tableIcons}
                  options={{
                    searchFieldAlignment: "left",
                    showTextRowsSelected: false,
                    exportButton: false,
                    pageSize: mydata.length > 5 ? 10 : 5,
                    showTitle: true,
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
                    search: false
                  }}
                  components={{
                    Container: props => (
                      <Paper elevation={0}>{props.children}</Paper>
                    )
                  }}
                  columns={[
                    {
                      title: "Redeemed",
                      field: "redeemedAt",
                      render: rowData =>
                        moment(rowData.redeemedAt).format("DD MMM YYYY")
                    },
                    {
                      title: "Count",
                      field: "count",
                      render: rowData => rowData.count
                    }
                  ]}
                  data={mydata}
                />
              </React.Fragment>
            );
          }}
        </Query>
      </div>
    </React.Fragment>
  );
}
