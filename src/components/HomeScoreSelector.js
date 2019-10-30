import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function HomeScoreSelector(props) {
  const content = (
    <div className="field">
      <label className="label has-text-dark">{props.homeTeam}'s Score</label>
      <div className="control">
        <div className="is-flex">
          <button
            className="button has-text-link has-background-white"
            onClick={props.decrementHome}
          >
            <span className="icon is-small">
              <FontAwesomeIcon icon="minus" zsize="2x" />
            </span>
          </button>
          <div className="container">
            <p className="title content has-text-centered has-text-primary">
              {props.homeScore}
            </p>
          </div>
          <button
            className="button has-text-link has-background-white"
            onClick={props.incrementHome}
          >
            <span className="icon is-small">
              <FontAwesomeIcon icon="plus" zsize="2x" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
  return content;
}

export default HomeScoreSelector;
