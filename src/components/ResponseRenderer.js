import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ResponseRenderer(props) {
  let content;
  if (props.isLoading) {
    return (
      <div className="tile is-parent ">
        <div className="tile is-parent is-child is-vertical">
          <div className="tile has-text-centered is-child box">
            <div className="title has-text-info">
              <span className="icon is-small">
                <FontAwesomeIcon icon="spinner" zsize="2x" spin />
              </span>
            </div>
            <div className="subtitle has-text-info">
              {props.awayTeam}'s Win Probability
            </div>
          </div>
          <div className="tile has-text-centered is-child box">
            <div className="title has-text-info">
              <span className="icon is-small">
                <FontAwesomeIcon icon="spinner" zsize="2x" spin/>
              </span>
            </div>
            <div className="subtitle has-text-info">
              {props.awayTeam}'s Predicted Score
            </div>
          </div>
        </div>
        <div className="tile is-parent is-child is-vertical">
          <div className="tile has-text-centered is-child box">
            <div className="title has-text-primary">
              <span className="icon is-small">
                <FontAwesomeIcon icon="spinner" zsize="2x" spin/>
              </span>
            </div>
            <div className="subtitle has-text-primary">
              {props.homeTeam}'s Win Probability
            </div>
          </div>

          <div className="tile has-text-centered is-child box">
            <div className="title has-text-primary">
              <span className="icon is-small">
                <FontAwesomeIcon icon="spinner" zsize="2x" spin/>
              </span>
            </div>
            <div className="subtitle has-text-primary">
              {props.homeTeam}'s Predicted Score
            </div>
          </div>
        </div>
      </div>
    );
  }
  switch (props.received) {
    case "away":
      content = (
        <div className="tile is-parent ">
          <div className="tile is-parent is-child is-vertical">
            <div className="tile has-text-centered is-child box">
              <div className="title has-text-info">
                {" "}
                {props.apiResponse.RecTeam_Win_Prob}{" "}
              </div>
              <div className="subtitle has-text-info">
                {props.awayTeam}'s Win Probability
              </div>
            </div>
            <div className="tile has-text-centered is-child box">
              <div className="title has-text-info">
                {" "}
                {props.apiResponse.RecTeam_Avg_Score}{" "}
              </div>
              <div className="subtitle has-text-info">
                {props.awayTeam}'s Predicted Score
              </div>
            </div>
          </div>
          <div className="tile is-parent is-child is-vertical">
            <div className="tile has-text-centered is-child box">
              <div className="title has-text-primary">
                {" "}
                {props.apiResponse.PullTeam_Win_Prob}{" "}
              </div>
              <div className="subtitle has-text-primary">
                {props.homeTeam}'s Win Probability
              </div>
            </div>

            <div className="tile has-text-centered is-child box">
              <div className="title has-text-primary">
                {" "}
                {props.apiResponse.PullTeam_Avg_Score}{" "}
              </div>
              <div className="subtitle has-text-primary">
                {props.homeTeam}'s Predicted Score
              </div>
            </div>
          </div>
        </div>
      );
      break;
    case "home":
      content = (
        <div className="tile is-parent ">
          <div className="tile is-parent is-child is-vertical">
            <div className="tile has-text-centered is-child box">
              <div className="title has-text-info">
                {" "}
                {props.apiResponse.PullTeam_Win_Prob}{" "}
              </div>
              <div className="subtitle has-text-info">
                {props.awayTeam}'s Win Probability
              </div>
            </div>
            <div className="tile has-text-centered is-child box">
              <div className="title has-text-info">
                {" "}
                {props.apiResponse.PullTeam_Avg_Score}{" "}
              </div>
              <div className="subtitle has-text-info">
                {props.awayTeam}'s Predicted Score
              </div>
            </div>
          </div>
          <div className="tile is-parent is-child is-vertical">
            <div className="tile has-text-centered is-child box">
              <div className="title has-text-primary">
                {" "}
                {props.apiResponse.RecTeam_Win_Prob}{" "}
              </div>
              <div className="subtitle has-text-primary">
                {props.homeTeam}'s Win Probability
              </div>
            </div>

            <div className="tile has-text-centered is-child box">
              <div className="title has-text-primary">
                {" "}
                {props.apiResponse.RecTeam_Avg_Score}{" "}
              </div>
              <div className="subtitle has-text-primary">
                {props.homeTeam}'s Predicted Score
              </div>
            </div>
          </div>
        </div>
      );
      break;
  }

  return content;
}

export default ResponseRenderer;
