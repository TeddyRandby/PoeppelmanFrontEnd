import React from "react";

function ElapsedTimeSelector (props) {
  const content = (
    <input class="input" type="number" onChange={props.onElapsedTimeUpdate} value={props.elapsedTime}/>
  );
  return content;
};

export default ElapsedTimeSelector;
