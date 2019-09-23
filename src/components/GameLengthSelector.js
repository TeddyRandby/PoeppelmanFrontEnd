import React from "react";

function GameLengthSelector(props) {
  const content = (
    <div className="field">
      <label className="label">
        What is the total length of the game? (softcap)
      </label>
      <div className="control">
        <div className="select">
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
        </div>
      </div>
    </div>
  );
  return content;
}

export default GameLengthSelector;
