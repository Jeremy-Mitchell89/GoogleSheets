import react from "react";
import axios from "axios";

class Items extends react.Component {
  static async getInitialProps() {
    const res = await fetch(`http://localhost:8000`);
  }
  componentWillMount() {
    const res = axios.get(`http://localhost:8000`).then(res => {
      console.log(res.data);
    });
  }
  render() {
    return <div>Test</div>;
  }
}

export default Items;
