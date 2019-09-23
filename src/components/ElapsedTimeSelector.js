import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ElapsedTimeSelector(props) {
  const content = (
    <div className="field">
      <label className="label">Elapsed time:</label>
      <div className="control is-inline-flex">
        <input
          className="input"
          type="number"
          onChange={props.onElapsedMinUpdate}
          value={props.elapsedMin}
        />
      </div>
      <button
          className={`button has-background-dark has-text-light button-primary-${
            props.stopwatchOn ? "active" : "inactive"
          }`}
          onClick={props.stopwatchOnHandler}
        >
          {props.stopwatchOn ? (
            <span className="icon is-small">
              <FontAwesomeIcon icon="pause" zsize="2x" />
            </span>
          ) : (
            <span className="icon is-small">
              <FontAwesomeIcon icon="play" zsize="2x" />
            </span>
          )}
        </button>
    </div>
  );
  return content;
}

export default ElapsedTimeSelector;
