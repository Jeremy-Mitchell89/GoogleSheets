import react, { useState, useEffect } from "react";
import axios from "axios";
import Item from "./Item";

class Items extends react.Component {
  state = { inventory: {} };
  componentWillMount() {
    axios.get("http://localhost:8000").then(res => {
      console.log(res.data[0]);
      this.setState({ inventory: res.data[0] });
    });
  }
  render() {
    return (
      <div>
        {Object.keys(this.state.inventory).map((item, i) => {
          return (
            <Item key={i} item={item} quantity={this.state.inventory[item]} />
          );
        })}
      </div>
    );
  }
}

export default Items;
