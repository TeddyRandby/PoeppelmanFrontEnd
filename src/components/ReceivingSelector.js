import React from "react";

function ReceivingSelector (props) {


  const content = (
    <select onChange={props.onReceivingUpdate} value={props.received}>
      <option key="pull" value={"1"}>
        {props.awayTeam}
      </option>

      <option key="rec" value={"0"}>
        {props.homeTeam}
      </option>
    </select>
  );
  return content;
};

export default ReceivingSelector;
