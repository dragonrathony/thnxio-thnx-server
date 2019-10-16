import React from "react";
import { gql } from "apollo-boost";
import { Query } from "react-apollo";
import ContentLoader from "react-content-loader";
import PageViewIcon from "@material-ui/icons/PageviewTwoTone";
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
import MaterialTable, { MTableAction } from "material-table";
import RefreshIcon from "@material-ui/icons/RefreshOutlined";

import moment from "moment";
import { CheckCircleOutline } from "mdi-material-ui";
import { Paper, Button, Tooltip } from "@material-ui/core";
import { Redirect } from "react-router";
import { RollbarContext } from "../../../rollbar-context";
import RemittancePaymentDetail from "./Detail";

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
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(undefined);

  return (
    <React.Fragment>
      <div style={{ margin: "16px" }}>
        <Query
          query={gql`
            {
              remittancePayments {
                id
                totalAmount
                totalTax
                total
                createdAt
                paidAt
                qty
                remittanceBatch {
                  id
                }
                merchantAccount {
                  id
                  name
                  payable
                }
              }
            }
          `}
          fetchPolicy="network-only"
          partialRefetch="true"
        >
          {({ loading, error, data, refetch }) => {
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

            let batches = {};
            _.uniq(
              data.remittancePayments.map(
                d => d.remittanceBatch && d.remittanceBatch.id
              )
            ).map(b => {
              batches[b] = b;
              return batches;
            });
            console.log(batches);
            console.log(data);
            return (
              <React.Fragment>
                {open && selected ? (
                  <RemittancePaymentDetail
                    open={open}
                    handleClose={() => setOpen(false)}
                    id={selected}
                  />
                ) : (
                  undefined
                )}
                <MaterialTable
                  title=""
                  icons={tableIcons}
                  options={{
                    filtering: true,
                    actionsColumnIndex: -1,
                    searchFieldAlignment: "left",
                    showTextRowsSelected: false,
                    exportButton: false,
                    pageSize: data.remittancePayments.length > 5 ? 10 : 5,
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
                    search: true,
                    selection: true
                  }}
                  actions={[
                    {
                      icon: () => <RefreshIcon />,
                      tooltip: "Refresh",
                      isFreeAction: true,
                      onClick: (event, rowData) => {
                        refetch();
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
                      filtering: false,
                      title: "",
                      field: "status",
                      render: rowData =>
                        !rowData.merchantAccount.payable ? (
                          <Tooltip
                            title="Missing payment details"
                            aria-label="Can't add to payment"
                          >
                            <ErrorOutline
                              style={{
                                color: "#49648D",
                                width: 35,
                                height: 30
                              }}
                            />
                          </Tooltip>
                        ) : rowData.paidAt ? (
                          <CheckCircleOutline
                            style={{ color: "#86BC25", width: 35, height: 30 }}
                          />
                        ) : (
                          undefined
                        )
                    },
                    {
                      title: "Name",
                      field: "merchantAccount.name",
                      render: rowData => rowData.merchantAccount.name
                    },
                    {
                      filtering: false,
                      title: "Created",
                      field: "createdAt",
                      defaultSort: "desc",
                      render: rowData =>
                        moment(rowData.createdAt).format("DD MMM YYYY")
                    },
                    {
                      filtering: false,
                      title: "Qty",
                      field: "qty",
                      render: rowData => rowData.qty
                    },
                    {
                      filtering: false,
                      title: "Amount",
                      field: "totalAmount",
                      render: rowData =>
                        `$${(rowData.totalAmount / 1000).toFixed(2)}`
                    },
                    {
                      filtering: false,
                      title: "Tax",
                      field: "totalTax",
                      render: rowData =>
                        `$${(rowData.totalTax / 1000).toFixed(2)}`
                    },
                    {
                      filtering: false,
                      title: "Total",
                      field: "total",
                      render: rowData => `$${(rowData.total / 1000).toFixed(2)}`
                    },
                    {
                      filtering: false,
                      title: "Paid",
                      field: "paidAt",
                      render: rowData =>
                        rowData.paidAt
                          ? moment(rowData.paidAt).format("DD MMM YYYY")
                          : undefined
                    },
                    {
                      title: "Batch",
                      lookup: batches,
                      field: "remittanceBatch.id",
                      render: rowData =>
                        rowData.remittanceBatch && rowData.remittanceBatch.id
                    }
                  ]}
                  data={data.remittancePayments}
                />
              </React.Fragment>
            );
          }}
        </Query>
      </div>
    </React.Fragment>
  );
}
