import React, { useState, useEffect } from "react";
import "../node_modules/bulma/css/bulma.css";
import RecScoreSelector from "./components/RecScoreSelector";
import PullScoreSelector from "./components/PullScoreSelector";
import TimePassedSelector from "./components/TimePassedSelector";
import DivisionSelector from "./components/DivisionSelector";
import ReceivingSelector from "./components/ReceivingSelector";

const App = props => {
  // State monitoring the divisions.
  // M = Mens Division
  // W = Womens Division
  // X = Mixed Divison (not yet implemented -- no data)
  const [division, setDivision] = useState("m");

  // State monitoring the amount of time passed since the start of the game.
  const [time, setTime] = useState("0");

  // State monitoring the receiving team's score.
  const [recScore, setRecScore] = useState("0");

  // State monitoring the pulling team's score.
  const [pullScore, setPullScore] = useState("0");

  // State monitoring which team began the game by receiving.
  const [startedReceiving, setStartedReceving] = useState("1");

  const [apiResponse, setAPIResponse] = useState({});

  // Handlers for the states.
  const divisionHandler = event => {
    const division = event.target.value;
    setDivision(division);
  };

  const timeHandler = event => {
    const time = event.target.value;
    setTime(time);
  };

  const recScoreHandler = event => {
    const recScore = event.target.value;
    setRecScore(recScore);
  };

  const pullScoreHandler = event => {
    const pullScore = event.target.value;
    setPullScore(pullScore);
  };

  const startedReceivingHandler = event => {
    const startedReceiving = event.target.value;
    setStartedReceving(startedReceiving);
  };

  useEffect(
    event => {
      // Derived parameters
      var ole_rate = "0.63";
      var capOn = "0";
      var secondHalf = "0";
      var timeStart = time + "";
      var receiving = startedReceiving;

      // If either of the teams have scored higher than 8, it is passed halftime.
      if (parseInt(pullScore) >= 8 || parseInt(recScore) >= 8) {
        secondHalf = "1";
        receiving = "1"
      }

      if (division == "m") {
        ole_rate = "0.7";
      }

      // If more than 85 minutes have elapsed, hard cap is on.
      if (parseInt(time) > 85) {
        capOn = "1";
        timeStart = "5";
      }

      let requestBody = {
        query: `
            {
            poeppelman(gameQuery: {
              RecTeam_Score: "${recScore}",
              PullTeam_Score: "${pullScore}",
              RecTeam_RecToStartGame: "${receiving}",
              SecondHalf: "${secondHalf}",
              Time_StartofSim: "${timeStart}",
              CapOn: "${capOn}",
              OLE_Rate: "${ole_rate}"
            }) {
        
              RecTeam_Win_Prob
            RecTeam_Avg_Score
            PullTeam_Win_Prob
            PullTeam_Avg_Score
        
            }
          }
          `
      };
      fetch("https://poeppelman-api.herokuapp.com/api", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          if (res.status !== 200 && res.status !== 201) {
            throw new Error("Failed!");
          }
          return res.json();
        })
        .then(resData => {
          var poeppelman = resData.data.poeppelman[0];
          var recProb = parseFloat(poeppelman.RecTeam_Win_Prob);
          var pullProb = parseFloat(poeppelman.PullTeam_Win_Prob);
          poeppelman.RecTeam_Win_Prob = (recProb * 100).toString();
          poeppelman.PullTeam_Win_Prob = (pullProb * 100).toString();

          poeppelman.RecTeam_Win_Prob =
            poeppelman.RecTeam_Win_Prob.substring(0, 6) + "%";
          poeppelman.RecTeam_Avg_Score = poeppelman.RecTeam_Avg_Score.substring(
            0,
            6
          );
          poeppelman.PullTeam_Win_Prob =
            poeppelman.PullTeam_Win_Prob.substring(0, 6) + "%";
          poeppelman.PullTeam_Avg_Score = poeppelman.PullTeam_Avg_Score.substring(
            0,
            6
          );

          setAPIResponse(poeppelman);
        })
        .catch(err => {
          alert('No data available');
          setAPIResponse({});
          console.log(err);
        });
    },
    // This array contains the whitelisted states which will "call" this useEffect when changed.
    [pullScore, recScore, division, startedReceiving, time]
  );

  let content = (
    <body>
      <div class="hero is-dark">
        <div class="hero-body">
          <div class="content">
            <h1 class="title"> Poeppelman Calculator </h1>
          </div>
        </div>
      </div>
      <div class="section">
        <div class="container">
          <div class="columns is-multiline justify-center">
            <div class="column">
              <React.Fragment>
                <div class="field">
                  <label class="label">Division</label>
                  <div class="control">
                    <div class="select">
                      <DivisionSelector
                        division={division}
                        onDivisionUpdate={divisionHandler}
                      />
                    </div>
                  </div>
                </div>
                <div class="field">
                  <label class="label has-text-primary">Pulling Team's Score</label>
                  <div class="control">
                    <div class="select">
                      <PullScoreSelector
                        pullScore={pullScore}
                        onPullScoreUpdate={pullScoreHandler}
                      />
                    </div>
                  </div>
                </div>
                <div class="field">
                  <label class="label has-text-info">Receiving Team's Score</label>
                  <div class="control">
                    <div class="select">
                      <RecScoreSelector
                        recScore={recScore}
                        onRecScoreUpdate={recScoreHandler}
                      />
                    </div>
                  </div>
                </div>
                <div class="field">
                  <label class="label">
                    Which team received to start the game?
                  </label>
                  <div class="control">
                    <div class="select">
                      <ReceivingSelector
                        startedReceiving={startedReceiving}
                        onReceivingUpdate={startedReceivingHandler}
                      />
                    </div>
                  </div>
                </div>
                <div class="field">
                  <label class="label">
                    How much time has passed in the game?
                  </label>
                  <div class="control">
                    <TimePassedSelector
                      time={time}
                      onTimeUpdate={timeHandler}
                    />
                  </div>
                </div>
              </React.Fragment>
            </div>
            <div class="column">
              <h2 class="subtitle has-text-weight-bold">Results:</h2>
              <div class="container">
                <div class="content">
                <p class="has-text-primary has-text-weight-bold">
                  Pulling Team Win Probability: {apiResponse.PullTeam_Win_Prob} </p>
                <p class="has-text-primary has-text-weight-bold">
                  Pulling Team Predicted Score: {apiResponse.PullTeam_Avg_Score} </p>
                <p class="has-text-info has-text-weight-bold">
                  Receiving Team Win Probability: {apiResponse.RecTeam_Win_Prob} </p>
                <p class="has-text-info has-text-weight-bold">
                  Receiving Team Predicted Score: {apiResponse.RecTeam_Avg_Score} </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
  );

  return content;
};

export default App;
