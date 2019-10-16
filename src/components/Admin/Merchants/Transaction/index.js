import React from "react";
import { gql } from "apollo-boost";
import { Query } from "react-apollo";
import ContentLoader from "react-content-loader";
import Button from "@material-ui/core/Button";

import moment from "moment";
import { Redirect } from "react-router";
import { RollbarContext } from "../../../../rollbar-context";

import { FlexibleWidthXYPlot, XAxis, YAxis, LineSeries } from "react-vis";
import "../../../../../node_modules/react-vis/dist/style.css";
import { Grid } from "@material-ui/core";
const _ = require("lodash");

export default function TransactionPage(props) {
  const rollbar = React.useContext(RollbarContext);

  return (
    <React.Fragment>
      <div style={{ margin: "16px" }}>
        <Query
          query={gql`
            query Merchant($id: ID!) {
              redeemedGifts(id: $id) {
                id
                redeemedAt
                remitAt
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
              rollbar.error(error);
              console.log(error);
              return null;
            }

            let dates = _.uniq(
              data.redeemedGifts
                .sort((a, b) =>
                  moment(a.redeemedAt).isBefore(moment(b.redeemedAt))
                    ? 1
                    : moment(a.redeemedAt).isAfter(moment(b.redeemedAt))
                    ? -1
                    : 0
                )
                .map(d =>
                  moment(d.redeemedAt)
                    .startOf("day")
                    .format("DD MMM YY")
                )
            );
            let mydata = dates.map((d, i) => {
              return {
                x: i,
                y: data.redeemedGifts.filter(g =>
                  moment(g.redeemedAt).isSame(moment(d), "day")
                ).length
              };
            });
            return (
              <div>
                <div>Total thnx recieved: {data.redeemedGifts.length}</div>
                <div
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex"
                  }}
                >
                  <Button disabled={true}>Last 7 Days </Button>
                  <Button disabled={true}>Last 30 Days</Button>
                  <Button disabled={true}>Last Month</Button>
                  <Button>All</Button>
                </div>
                <FlexibleWidthXYPlot height={300}>
                  <XAxis
                    tickFormat={v => (v % 7 === 0 ? dates[v] : undefined)}
                    tickValues={dates.map((d, i) => i)}
                  />
                  <YAxis title="Redeemed Qty" />
                  <LineSeries curve={"curveMonotoneX"} data={mydata} />
                </FlexibleWidthXYPlot>
                <h4>Detail</h4>
                <Grid container>
                  {data.redeemedGifts.map(gift => (
                    <Grid item xs="12">
                      {moment(gift.redeemedAt).format("DD MMM YYYY hh:mm a")}{" "}
                      {gift.remitAt ? (
                        <span>
                          (paid {moment(gift.remitAt).format("DD MMM YYYY")})
                        </span>
                      ) : (
                        undefined
                      )}
                    </Grid>
                  ))}
                </Grid>
              </div>
            );
          }}
        </Query>
      </div>
    </React.Fragment>
  );
}
