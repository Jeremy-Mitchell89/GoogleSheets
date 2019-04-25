import React from "react";
import axios from "axios";
import styled from "styled-components";

const StyledItem = styled.div`
  background-color: #1d1f21;
  color: #c5c8c6;
  border: 1px solid black;
  width: 300px;
  font-family: "Open Sans", sans-serif;
  padding: 0rem 1rem 1rem 1rem;
  border-radius: 5px;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  span {
    font-size: 0.8rem;
  }
  #serial {
    background-color: #5a6268;
    border: 1px solid #5a6268;
    max-width: 150px;
  }
`;

const StyledButton = styled.button`
  color: #c5c8c6;
  background-color: #6c757d;
  border: 1px solid #6c757d;
  border-radius: 0.25rem;
  font-size: 1.2rem;
  padding: 0.4rem;
  :hover {
    background-color: #5a6268;
    border: 1px solid #5a6268;
  }
`;

function Item(props) {
  const { item, model, serial, control, passData } = props;
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
    <StyledItem>
      <div>
        <h3>{item}</h3>
        <p
          id="serial"
          onClick={e => {
            navigator.clipboard.writeText(serial);
          }}
        >
          {serial}
        </p>

        <p>{model}</p>
        <p>{control}</p>
      </div>
      <div>
        <StyledButton
          onClick={e => {
            writeToSheet();
            passData(serial);
          }}
          size="small"
        >
          Scrapped
        </StyledButton>
      </div>
    </StyledItem>
  );
}
export default Item;
