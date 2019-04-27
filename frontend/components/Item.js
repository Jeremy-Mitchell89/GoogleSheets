import React, { useState, useEffect } from "react";
import axios from "axios";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
`;

const StyledItem = styled.div`
  background-color: #1d1f21;
  color: #c5c8c6;
  border: 1px solid black;
  width: 250px;
  font-family: "Open Sans", sans-serif;
  padding: 0rem 1rem 1rem 1rem;
  border-radius: 5px;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  span {
    font-size: 0.8rem;
  }
  #serial {
    max-width: 150px;
    margin-top: 0;
  }
  #model {
    margin-top: 0;
  }
  #item {
    margin-bottom: 0;
  }
  #tooltip {
    margin-top: 0;
    position: relative;
    border-radius: 6px;
    text-align: center;
    background-color: #6c757d;
    padding: 2px 5px;
    animation: ${fadeIn} 1s linear;
    transition: "visibility .1s linear";
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
  const [hover, setHover] = useState(false);
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
        <h3 id="item">{item}</h3>
        <span
          id="tooltip"
          style={{
            visibility: hover ? "visible" : "hidden"
          }}
        >
          Click serial # to copy to clipboard
        </span>
        <p
          id="serial"
          onClick={e => {
            navigator.clipboard.writeText(serial);
          }}
          onMouseOut={() => {
            setHover(false);
          }}
          onMouseOver={() => {
            setHover(true);
          }}
        >
          {serial}
        </p>

        <p id="model">{model}</p>
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
