import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function AwayScoreSelector(props) {
  const content = (
    <div className="field">
      <label className="label has-text-dark">{props.awayTeam}'s Score</label>
      <div className="control">
        <div className="is-flex">
          <button
            className="button has-text-light has-background-dark"
            onClick={props.decrementAway}
          >
            <span className="icon is-small">
              <FontAwesomeIcon icon="minus" zsize="2x" />
            </span>
          </button>
          <div className="container">
            <p className="title content has-text-centered has-text-info">
              {props.awayScore}
            </p>
          </div>
          <button
            className="button has-text-light has-background-dark"
            onClick={props.incrementAway}
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

export default AwayScoreSelector;
