import React from "react";

function SoftCapSelector (props) {
  const content = (
    <input class="input" type="number" onChange={props.onSoftCapUpdate} value={props.softCap}/>
  );
  return content;
};

export default SoftCapSelector;
