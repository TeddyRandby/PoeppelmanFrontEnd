import React from "react";

function GameLengthSelector(props) {
  const content = (
    <select onChange={props.onGameLengthUpdate} value={props.gameLength}>
    <option key="85" value={"85"}>
      85 Minutes
    </option>
    <option key="90" value={"90"}>
      90 Minutes
    </option>
    <option key="95" value={"95"}>
      95 Minutes
    </option>
    <option key="100" value={"100"}>
      100 Minutes
    </option>
  </select>
  );
  return content;
};

export default GameLengthSelector;
