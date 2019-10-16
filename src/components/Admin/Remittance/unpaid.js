import React from "react";
import { gql } from "apollo-boost";
import { Query, ApolloConsumer, Mutation } from "react-apollo";
import {Link} from "react-router-dom";
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
import LockedIcon from "@material-ui/icons/LockOutlined";
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
import Tooltip from '@material-ui/core/Tooltip';
import { Paper, Button } from "@material-ui/core";
import { Redirect } from "react-router";
import { RollbarContext } from "../../../rollbar-context";
import RemittancePaymentDetail from "./Detail";

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

export default function UnpaidRemittancePaymentList(props) {
  const rollbar = React.useContext(RollbarContext);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(undefined);

  return (
    <React.Fragment> 
      <ApolloConsumer>
    {client => {
      return (
        <Mutation
          mutation={gql`
            mutation CreateRemittanceBatch($ids: [Int!]!) {
              createRemittanceBatch(remittancePaymentIds: $ids) {
                errors
              }
            }
          `}
        >
          {createRemittanceBatch => {

    return <div style={{ margin: "16px" }}>
        <Query
          query={gql`
            {
              unpaidRemittancePayments {
                id
                totalAmount
                totalTax
                total
                createdAt
                paidAt
                qty
                processing
                merchantAccount {
                  id
                  name
                  payable
                  bsb
                }
              }
            }
          `}
          partialRefetch={true}
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

            let payments = data.unpaidRemittancePayments.filter(
              d => !d.remittanceBatch
            );
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
                    actionsColumnIndex: -1,
                    searchFieldAlignment: "left",
                    showTextRowsSelected: false,
                    exportButton: false,
                    pageSize: payments.length > 5 ? 10 : 5,
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
                    selection: true,
                    selectionProps: rowData => {
                      return {
                      disabled: rowData.processing || !rowData.merchantAccount.payable || !/\d{3}-?\d{3}$/.test(String(rowData.merchantAccount.bsb)),
                      color: 'primary'
                    }}
                  }}
                  actions={[
                    {
                      icon: () => <RefreshIcon />,
                      tooltip: "Refresh",
                      isFreeAction: true,
                      onClick: (event, rowData) => {
                        refetch();
                      }
                    },
                    {
                      icon: () => <div>Create Payment Run</div>,
                      button: {
                        text: "Create Payment Run",
                        variant: "outlined",
                        color: "secondary"
                      },
                      tooltip: "Create Batch Payment",
                      onClick: (event, rowData) => {
                        createRemittanceBatch({
                          variables: {
                            ids: selected.map(payments => parseInt(payments.id))
                          }
                        }).then(
                          response => {
                            // refetch users
                            props.triggerRefresh();
                            refetch();
                          },
                          error => {
                            props.triggerRefresh();
                            refetch();
                            console.log(error);
                          }
                        );
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
                      title: "",
                      field: "status",
                      render: rowData =>
                        rowData.processing ? (
                          <Tooltip title="Processing" aria-label="cannt add to payment">
                            <LockedIcon
                              style={{ color: "#49648D", width: 35, height: 30 }}
                            />
                          </Tooltip>
                        ) 
                        :
                        !rowData.merchantAccount.payable ? (
                          <Tooltip title="Missing payment details" aria-label="cannt add to payment">
                            <ErrorOutline
                              style={{ color: "#49648D", width: 35, height: 30 }}
                            />
                          </Tooltip>
                        ) : 
                        !/\d{3}-?\d{3}$/.test(String(rowData.merchantAccount.bsb)) ? (
                          <Tooltip title="Invalid BSB " aria-label="cannt add to payment">
                            <ErrorOutline
                              style={{ color: "#49648D", width: 35, height: 30 }}
                            />
                          </Tooltip>
                        ) : (
                          undefined
                        )
                    },
                    {
                      title: "Name",
                      field: "name",
                      render: rowData => <Link to={`/admin/merchant/${rowData.merchantAccount.id}`}>{rowData.merchantAccount.name}</Link>
                    },
                    {
                      title: "Created",
                      field: "createdAt",
                      defaultSort: "desc",
                      render: rowData =>
                        moment(rowData.createdAt).format("DD MMM YYYY")
                    },
                    {
                      title: "Qty",
                      field: "qty",
                      render: rowData => rowData.qty
                    },
                    {
                      title: "Amount",
                      field: "totalAmount",
                      render: rowData =>
                        `$${(rowData.totalAmount / 1000).toFixed(2)}`
                    },
                    {
                      title: "Tax",
                      field: "totalTax",
                      render: rowData =>
                        `$${(rowData.totalTax / 1000).toFixed(2)}`
                    },
                    {
                      title: "Total",
                      field: "total",
                      render: rowData => `$${(rowData.total / 1000).toFixed(2)}`
                    }
                  ]}
                  data={payments}
                  onSelectionChange={rows => setSelected(rows.filter(p => p.merchantAccount.payable))}
                />
              </React.Fragment>
            );
          }}
        </Query>
      </div>}
      }
      </Mutation>)
    }
    }
    </ApolloConsumer>
    </React.Fragment>
  );
}
