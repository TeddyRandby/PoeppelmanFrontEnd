import React from "react";
import "../../node_modules/bulma/css/bulma.css";

const GameLengthSelector = props => {
  const content = (
    <select onChange={props.onGameLengthUpdate} value={props.gameLength}>
    <option key="85" value={"85"}>
      85 Minutes
    </option>
    <option key="90" value={"90"}>
      90 Minutes
    </option>
  </select>
  );
  return content;
};

export default GameLengthSelector;
