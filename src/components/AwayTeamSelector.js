import React from "react";

function AwayTeamSelector (props) {
  const content = (
    <input className="input" onChange={props.onAwayTeamUpdate} value={props.awayTeam}/>
  );
  return content;
};

export default AwayTeamSelector;
