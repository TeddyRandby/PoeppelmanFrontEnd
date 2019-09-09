import React from "react";

function HomeTeamSelector (props) {
  const content = (
    <input className="input" onChange={props.onHomeTeamUpdate} value={props.homeTeam}/>
  );
  return content;
};

export default HomeTeamSelector;
