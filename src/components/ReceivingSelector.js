import React from "react";

function ReceivingSelector(props) {
  const content = (
    <div className="field">
      <label className="label">Receiving Team</label>
      <div className="control">
        <div className="select">
          <select onChange={props.onReceivingUpdate} value={props.received}>
            <option key="pull" value={"away"}>
              {props.awayTeam}
            </option>

            <option key="rec" value={"home"}>
              {props.homeTeam}
            </option>
          </select>
        </div>
      </div>
    </div>
  );
  return content;
}

export default ReceivingSelector;
