import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Stopwatch(props) {
  return (
    <div>
      <h1 className="title has-text-centered has-text-weight-bold">
        Game Stopwatch
      </h1>
      <div className=" has-text-centered">
        <div className="title is-size-3 has-text-grey box">
          {props.minutes}:{props.seconds}
        </div>
        <button
          className="button has-background-dark has-text-light"
          onClick={props.stopwatchResetHandler}
        >
          RESET
        </button>
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
    </div>
  );
}

export default Stopwatch;
