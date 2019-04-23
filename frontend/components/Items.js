import react, { useState, useEffect } from "react";
import axios from "axios";
import Item from "./Item";

class Items extends react.Component {
  state = { inventory: [] };
  componentWillMount() {
    axios.get("http://localhost:8000").then(res => {
      this.setState({ inventory: res.data });
    });
  }
  refetch = () => {
    axios.get("http://localhost:8000").then(res => {
      this.setState({ inventory: res.data });
    });
  };
  passDataUp = serial => {
    let newInventory = this.state.inventory.filter(cam => {
      return cam[2] !== serial;
    });
    this.setState({ inventory: newInventory });
    axios.delete(`http://localhost:8000/inventory/${serial}`);
  };
  render() {
    // const passDataUp = serial => {
    //   //use data here
    // };
    return (
      <div>
        {this.state.inventory.map(entry => {
          return (
            <Item
              key={entry[3]}
              item={entry[0]}
              model={entry[1]}
              serial={entry[2]}
              control={entry[3]}
              row={entry[4]}
              passData={this.passDataUp}
            />
          );
        })}
        <button onClick={this.refetch}>Refetch</button>
      </div>
    );
  }
}

export default Items;
