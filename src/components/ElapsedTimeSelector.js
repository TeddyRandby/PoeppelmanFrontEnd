import React from "react";
import "../../node_modules/bulma/css/bulma.css";

const ElapsedTimeSelector = props => {
  const content = (
    <input class="input" type="number" onChange={props.onElapsedTimeUpdate} value={props.elapsedTime}/>
  );
  return content;
};

export default ElapsedTimeSelector;
