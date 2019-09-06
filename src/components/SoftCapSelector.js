import React from "react";
import "../../node_modules/bulma/css/bulma.css";

const SoftCapSelector = props => {
  const content = (
    <input class="input" type="number" onChange={props.onSoftCapUpdate} value={props.softCap}/>
  );
  return content;
};

export default SoftCapSelector;
