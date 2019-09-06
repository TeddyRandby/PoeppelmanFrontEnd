import React from "react";

const ReceivingSelector = props => {


  const content = (
    <select onChange={props.onReceivingUpdate} value={props.startedReceiving}>
      <option key="pull" value={"0"}>
        Pulling Team
      </option>

      <option key="rec" value={"1"}>
        Receiving Team
      </option>
    </select>
  );
  return content;
};

export default ReceivingSelector;
