import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import { injectStripe, CardElement } from "react-stripe-elements";

const useStyles = makeStyles(theme => ({
  root: {
    
  },
  cardElementGridItem: {
    margin: theme.spacing(3, 0, 3, 0),
  },
  gridItemContainer: {
    background: theme.palette.background.light,
    padding: theme.spacing(2),
    borderWidth: '1px',
    borderColor: 'rgba(0, 0, 0, 0.23)',
    borderStyle: 'solid',
    borderRadius: theme.spacing(0.25),
  }
}));

function Payment(props) {
  const classes = useStyles();
  const theme = useTheme();
  
  props.setStripe(props.stripe);

  const elementStyle = {
    base: {
      fontFamily: theme.typography.fontFamily,
      fontSize: '19.2px',
      color: theme.palette.text.primary,
      fontWeight: '200',
      fontSmoothing: 'antialiased',
    }
  };

  return (
    <div className={classes.root}>

      {/* First we want the card number element */}
      <Grid container spacing={0} alignItems="center">

        <Grid className={classes.cardElementGridItem} item xs={12}>
          <div className={classes.gridItemContainer}>
            <CardElement style={elementStyle} />
          </div>
        </Grid>

      </Grid>

    </div>
    
  );
}

export default injectStripe(Payment);
