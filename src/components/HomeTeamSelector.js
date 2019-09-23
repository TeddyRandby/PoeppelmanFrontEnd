import React from "react";

function HomeTeamSelector(props) {
  const content = (
    <div>
      <label className="label has-text-primary">
        Home Team:{" "}
        <span className="subtitle is-pulled-right has-text-weight-light">
          <label className="checkbox">
            <input 
              className="checkbox"
              type="checkbox"
              onChange={props.onChange}
              checked={props.checked}
              />
              Received first pull?
          </label>
        </span>
      </label>
      <div className="control">
        <input
          className="input"
          onChange={props.onHomeTeamUpdate}
          value={props.homeTeam}
          checked={props.checked}
        />
      </div>
    </div>
  );
  return content;
}

export default HomeTeamSelector;
