import react, { useState, useEffect } from "react";
import axios from "axios";
import Item from "./Item";

class Items extends react.Component {
  state = { inventory: [] };
  componentWillMount() {
    axios.get("http://localhost:8000").then(res => {
      console.log(res.data);
      this.setState({ inventory: res.data });
    });
  }
  render() {
    return (
      <div>
        {console.log(this.state)}
        {this.state.inventory.map(entry => {
          return (
            <Item
              key={entry[3]}
              item={entry[0]}
              model={entry[1]}
              serial={entry[2]}
              control={entry[3]}
              row={entry[4]}
            />
          );
        })}
      </div>
    );
  }
}

export default Items;
