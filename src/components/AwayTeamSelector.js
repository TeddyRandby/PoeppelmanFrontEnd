import React from "react";

function AwayTeamSelector(props) {
  const content = (
    <div>
      <label className="label has-text-dark">
        Away Team:{" "}
        <span className="label has-text-dark is-pulled-right has-text-weight-light">
          <label className="checkbox">
            <input 
              className="checkbox"
              type="checkbox"
              onChange={props.onChange}
              checked={!props.checked}
              />
              Received first pull?
          </label>
        </span>
      </label>
      <div className="control">
        <input
          className="input"
          onChange={props.onAwayTeamUpdate}
          value={props.awayTeam}
        />
      </div>
    </div>
  );
  return content;
}

export default AwayTeamSelector;
