import react from "react";
import axios from "axios";
import Item from "./Item";

class Items extends react.Component {
  state = { inventory: [] };
  componentDidMount() {
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
    return (
      <div>
        <h2>Cameras to Scrap</h2>
        {this.state.inventory.length ? (
          this.state.inventory.map(camera => {
            return (
              <Item
                key={camera._id}
                item={camera.partNumber}
                model={camera.modelNumber}
                serial={camera.serialNumber}
                control={camera.controlNumber}
                row={camera.row}
                passData={this.passDataUp}
              />
            );
          })
        ) : (
          <div>Scrap list is empty</div>
        )}
      </div>
    );
  }
}

export default Items;
