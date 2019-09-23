import React from "react";

function SoftCapSelector (props) {
  const content = (
    <input className="input" type="number" onChange={props.onSoftCapUpdate} value={props.softCap}/>
  );
  return content;
};

export default SoftCapSelector;
