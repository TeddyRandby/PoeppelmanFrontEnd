import React from "react";

function ReceivingSelector (props) {


  const content = (
    <select onChange={props.onReceivingUpdate} value={props.startedReceiving}>
      <option key="pull" value={"0"}>
        {props.awayTeam}
      </option>

      <option key="rec" value={"1"}>
        {props.homeTeam}
      </option>
    </select>
  );
  return content;
};

export default ReceivingSelector;
