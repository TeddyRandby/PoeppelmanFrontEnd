import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function RecScoreSelector(props) {
  const content = (
    <div class="is-flex">
    <button class="button has-text-danger" onClick={props.decrementRec}>
      <span class="icon is-small">
      <FontAwesomeIcon
        icon="minus"
        zsize="2x"
      />
      </span>
    </button>
    <div class="container">
      <p class="title content has-text-centered">{props.recScore}</p>
    </div>
    <button class="button has-text-success" onClick={props.incrementRec}>
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

export default RecScoreSelector;
