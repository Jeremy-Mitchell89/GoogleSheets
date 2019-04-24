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
  passDataUp = (serial, i) => {
    let newInventory = this.state.inventory.filter(cam => {
      return cam.serialNumber !== serial;
    });
    this.setState({ inventory: newInventory });
  };
  render() {
    // const passDataUp = serial => {
    //   //use data here
    // };
    return (
      <div>
        {this.state.inventory.map(camera => {
          return (
            <Item
              key={camera._id}
              item={camera.partNumber}
              model={camera.modelNumber}
              serial={camera.serialNumber}
              control={camera.controlNumer}
              row={camera.row}
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
