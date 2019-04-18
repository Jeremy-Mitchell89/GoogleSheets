import React, { useState, useEffect } from "react";

const Item = props => {
  return (
    <div>
      <p>{props.item}</p>
      <p>{props.quantity}</p>
    </div>
  );
};

export default Item;
