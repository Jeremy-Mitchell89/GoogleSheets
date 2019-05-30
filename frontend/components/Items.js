import react from "react";
import axios from "axios";
import Item from "./Item";

async function getInventory() {
  console.log("getting inventory");
  const data = await axios.get("http://localhost:8000");
  return data;
}

class Items extends react.Component {
  state = { inventory: [] };

  componentDidMount() {
    getInventory().then(res => {
      this.setState({ inventory: res.data });
    });
  }
  updateDb = async () => {
    axios.post("http://localhost:8000/update");
    setTimeout(() => {
      getInventory().then(res => {
        this.setState({ inventory: res.data });
      });
    }, 1000);
  };
  passDataUp = (serial, i) => {
    let newInventory = this.state.inventory.filter(cam => {
      return cam.serialNumber !== serial;
    });
    this.setState({ inventory: newInventory });
  };
  render() {
    return (
      <div>
        <button
          onClick={e => {
            this.updateDb();
          }}
        >
          Update
        </button>
        <button
          onClick={() => {
            getInventory().then(res => {
              this.setState({ inventory: res.data });
            });
          }}
        >
          Refetch
        </button>
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
      </div>
    );
  }
}

export default Items;
