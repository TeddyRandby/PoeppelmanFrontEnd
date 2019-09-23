import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function AwayScoreSelector (props) {
  const content = (
    <div class="is-flex">
    <button class="button has-text-danger" onClick={props.decrementAway}>
      <span class="icon is-small">
      <FontAwesomeIcon
        icon="minus"
        zsize="2x"
      />
      </span>
    </button>
    <div class="container">
      <p class="title content has-text-centered">{props.awayScore}</p>
    </div>
    <button class="button has-text-success" onClick={props.incrementAway}>
      <span class="icon is-small">
      <FontAwesomeIcon
        icon="plus"
        zsize="2x"
      />
      </span>
    </button>
    </div>
  );
  return content;
};

export default AwayScoreSelector;
