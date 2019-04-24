import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import axios from "axios";

const styles = {
  card: {
    maxWidth: 275
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 12
  },
  pos: {
    marginBottom: 2
  }
};

function Item(props) {
  const { classes, item, model, serial, control, passData } = props;
  const bull = <span className={classes.bullet}>•</span>;
  function writeToSheet() {
    axios
      .post("http://localhost:8000/destroy", {
        row: props.row,
        serial: props.serial
      })
      .then(res => {
        // console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  }
  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          {item}
        </Typography>
        <Typography variant="h5" component="h2">
          {serial}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {model}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {control}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          onClick={e => {
            writeToSheet();
            passData(serial);
          }}
          size="small"
        >
          Camera Scrapped
        </Button>
      </CardActions>
    </Card>
  );
}
export default withStyles(styles)(Item);
