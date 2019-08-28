import React, { useState } from "react";
import "./App.css";
import "./components/RecScore";
import "./components/PullScore";
import "./components/TimePassed";
import "./components/Division";
import "./components/StartedReceiving";

const App = props => {
  // State monitoring the divisions.
  // M = Mens Division
  // W = Womens Division
  // X = Mixed Divison (not yet implemented -- no data)
  const [division, setDivision] = useState("M");

  // State monitoring the amount of time passed since the start of the game.
  const [time, setTime] = useState(0);

  // State monitoring the receiving team's score.
  const [recScore, setRecScore] = useState(0);

  // State monitoring the pulling team's score.
  const [pullScore, setPullScore] = useState(0);

  // State monitoring which team began the game by receiving.
  const [startedReceiving, setStartedReceving] = useState("Rec");

  // Handlers for the states.
  const divisionHandler = division => {
    setDivision(division);
  };

  const timeHandler = time => {
    setTime(time);
  };

  const recScoreHandler = recScore => {
    setRecScore(recScore);
  };

  const pullScoreHandler = pullScore => {
    setPullScore(pullScore);
  };

  const startedReceivingHandler = startedReceiving => {
    setStartedReceving(startedReceiving);
  };

  let content = (
    <div className="App">
      <h1 className="Header"> Welcome to the Poeppelman Calculator! </h1>

      <React.Fragment>
        <Divison division={selectedDivision} onDivisionSelect={submitHandler} />
        <Division selectedDivision={selectedDivision} />
      </React.Fragment>

      <table className="table-wrapper">
        <tbody>
          <tr>
            <th> </th>
            <th> Predicted Scores </th>
            <th> Chance to win </th>
          </tr>
          <tr>
            <th> Receiving Team: </th>
            <td> {this.state.apiResponse.RecTeam_Avg_Score} </td>
            <td> {this.state.apiResponse.RecTeam_Win_Prob} </td>
          </tr>
          <tr>
            <th> Pulling Team: </th>
            <td> {this.state.apiResponse.PullTeam_Avg_Score} </td>
            <td> {this.state.apiResponse.PullTeam_Win_Prob} </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

submitHandler = event => {
  event.preventDefault();
  const rts = this.RTSEl.current.value;
  const pts = this.PTSEl.current.value;
  const rtrtsg = this.state.rtrtsgChecked;
  const tsos = this.TSOSEl.current.value;
  const m = this.state.mChecked;
  const w = this.state.wChecked;
  var ole_rate;
  var capOn;
  var secondHalf;
  var recTeamRecToStartGame;
  var timeStart = tsos;

  if (!((m && !w) || (w && !m))) {
    alert("Must be either mens or womens");
    return;
  }

  if (rtrtsg) {
    recTeamRecToStartGame = "0";
  } else {
    recTeamRecToStartGame = "1";
  }

  if (parseInt(rts) >= 8 || parseInt(pts) >= 8) {
    secondHalf = "1";
    recTeamRecToStartGame = "1";
  } else {
    secondHalf = "0";
  }

  // Yes- it is unintuitive for 0 to be true and 1 to be false.
  // Blame the guy who got the data and made the CSV, not me.

  if (m) {
    ole_rate = "0.7";
  } else {
    ole_rate = "0.63";
  }

  if (parseInt(tsos) > 85) {
    capOn = "1";
    timeStart = "5";
  } else {
    capOn = "0";
  }

  let requestBody = {
    query: `
    query {
  poeppelman(gameQuery: {
    RecTeam_Score: "${rts}",
    PullTeam_Score: "${pts}",
    RecTeam_RecToStartGame: "${recTeamRecToStartGame}",
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

      this.setState({
        apiResponse: poeppelman
      });
    })
    .catch(err => {
      console.log(err);
    });
};

export default App;
