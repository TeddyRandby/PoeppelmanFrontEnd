import React, { useState, useEffect } from "react";
import "../node_modules/bulma/css/bulma.css";
import RecScoreSelector from "./components/RecScoreSelector";
import PullScoreSelector from "./components/PullScoreSelector";
import GameLengthSelector from "./components/GameLengthSelector";
import DivisionSelector from "./components/DivisionSelector";
import ReceivingSelector from "./components/ReceivingSelector";
import SoftCapSelector from "./components/SoftCapSelector";
import ElapsedTimeSelector from "./components/ElapsedTimeSelector";
import Stopwatch from "./components/Stopwatch";
import HomeTeamSelector from "./components/HomeTeamSelector";
import AwayTeamSelector from "./components/AwayTeamSelector";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function App() {
  // State monitoring the divisions.
  // m = Mens Division
  // w = Womens Division
  // x = Mixed Divison (not yet implemented -- no data)
  const [division, setDivision] = useState("m");

  // State monitoring the total length of the game.
  const [gameLength, setGameLength] = useState("85");

  // State monitoring the receiving team's score.
  const [recScore, setRecScore] = useState("0");

  // State monitoring the pulling team's score.
  const [pullScore, setPullScore] = useState("0");

  // State monitoring which team began the game by receiving.
  const [received, setStartedReceving] = useState("1");

  // State monitoring when hard cap comes on.
  const [softCap, setSoftCap] = useState("85");

  // State monitoring the elapsed time.
  const [elapsedTime, setElapsedTime] = useState("0");

  // State monitoring seconds for the timer.
  const [seconds, setSeconds] = useState(0);

  // State monitoring minutes for the timer.
  const [minutes, setMinutes] = useState(0);

  // State monitoring the timer's status.
  const [stopwatchOn, setStopwatchOn] = useState(false);

  // State monitoring the input team names.
  const [homeTeam, setHomeTeam] = useState("Home");

  const [awayTeam, setAwayTeam] = useState("Away");

  // State containing the graphQL API's response.
  const [apiResponse, setAPIResponse] = useState({});

  // Handlers for the above states.
  const divisionHandler = event => {
    const division = event.target.value;
    setDivision(division);
  };

  const gameLengthHandler = event => {
    const gameLength = event.target.value;
    setGameLength(gameLength);
    setSoftCap(gameLength - elapsedTime);
  };

  const recScoreHandler = event => {
    const recScore = event.target.value;
    setRecScore(recScore);
  };

  const pullScoreHandler = event => {
    const pullScore = event.target.value;
    setPullScore(pullScore);
  };

  const receivedHandler = event => {
    const startedReceiving = event.target.value;
    setStartedReceving(startedReceiving);
  };

  const softCapHandler = event => {
    const softCap = event.target.value;
    setSoftCap(softCap);
    setElapsedTime(gameLength - softCap);
  };

  const elapsedTimeHandler = event => {
    const elapsedTime = event.target.value;
    setElapsedTime(elapsedTime);
    setSoftCap(gameLength - elapsedTime);
  };
  const homeTeamHandler = event => {
    const homeTeam = event.target.value;
    setHomeTeam(homeTeam);
  };
  const awayTeamHandler = event => {
    const awayTeam = event.target.value;
    setAwayTeam(awayTeam);
  };
  const stopwatchResetHandler = event => {
    const stopwatchOn = event.target.value;
    setSeconds(0);
    setMinutes(0);
    setElapsedTime(0);
    setSoftCap(gameLength);
    setStopwatchOn(stopwatchOn);
  };

  const stopwatchOnHandler = event => {
    if (stopwatchOn) {
      setStopwatchOn(false);
    } else {
      setStopwatchOn(true);
    }
  };

  // This function monitors the game timer.
  useEffect(() => {
    let interval = null;
    if (stopwatchOn) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
        if (seconds >= 59) {
          setSeconds(0);
          setMinutes(minutes + 1);
          setSoftCap(parseInt(softCap) -1);
          setElapsedTime(parseInt(elapsedTime) + 1);
        }
      }, 1000);
    } else if (!stopwatchOn && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [stopwatchOn, seconds, minutes]);

  // This function is run when the page updates, and sends
  // an API request to update the statistics.
  useEffect(
    event => {
      // Derived parameters
      let ole_rate = "0.63";
      let capOn = "0";
      let secondHalf = "0";
      let timeElapsed = gameLength - softCap;
      let receiving = received;

      // If either of the teams have scored higher than 8, it is passed halftime.
      if (parseInt(pullScore) >= 8 || parseInt(recScore) >= 8) {
        secondHalf = "1";
        receiving = "1";
      }

      if (division === "m") {
        ole_rate = "0.7";
      }

      // If more than 85 minutes have elapsed, hard cap is on.
      if (parseInt(gameLength) > 85) {
        capOn = "1";
        timeElapsed = "5";
      }

      let requestBody = {
        query: `
            {
            poeppelman(gameQuery: {
              RecTeam_Score: "${recScore}",
              PullTeam_Score: "${pullScore}",
              RecTeam_RecToStartGame: "${receiving}",
              SecondHalf: "${secondHalf}",
              Time_StartofSim: "${timeElapsed}",
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
          alert("No data available");
          setAPIResponse({});
          console.log(err);
        });
    },
    // This array contains the whitelisted states which will "call" this useEffect when changed.
    [pullScore, recScore, division, received, gameLength, softCap, elapsedTime, minutes]
  );

  const content = (
    <body>
      <div className="hero is-dark">
        <div className="hero-body">
          <div className="content">
            <h1 className="title"> Poeppelman Calculator </h1>
          </div>
        </div>
      </div>
      <div className="section">
        <div className="container">
          <div className="columns is-multiline justify-center">
            <div className="column">
              <React.Fragment>
                <div className="field">
                  <label className="label">Division</label>
                  <div className="control">
                    <div className="select">
                      <DivisionSelector
                        division={division}
                        onDivisionUpdate={divisionHandler}
                      />
                    </div>
                  </div>
                </div>
                <div className="field">
                  <label className="label has-text-primary">
                    {homeTeam}'s Score
                  </label>
                  <div className="level">
                    <div className="level-left">
                      <div className="control">
                        <div className="select">
                          <RecScoreSelector
                            recScore={recScore}
                            onRecScoreUpdate={recScoreHandler}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="level-right">
                      <div className="control">
                        {/* <button className="button" onClick={() => setPullScore(pullScore + 1)}>
                      <FontAwesomeIcon
                        icon="plus-square"
                        size="2x"
                      />
                      </button> */}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="field">
                  <label className="label has-text-info">
                    {awayTeam}'s Score
                  </label>
                  <div className="control">
                    <div className="select">
                      <PullScoreSelector
                        pullScore={pullScore}
                        onPullScoreUpdate={pullScoreHandler}
                      />
                    </div>
                  </div>
                </div>
                <div className="field">
                  <label className="label">
                    Which team received this point?
                  </label>
                  <div className="control">
                    <div className="select">
                      <ReceivingSelector
                        received={received}
                        onReceivingUpdate={receivedHandler}
                        homeTeam={homeTeam}
                        awayTeam={awayTeam}
                      />
                    </div>
                  </div>
                </div>
                <div className="field">
                  <label className="label">
                    What is the total length of the game? (softcap)
                  </label>
                  <div className="control">
                    <div className="select">
                      <GameLengthSelector
                        gameLength={gameLength}
                        onGameLengthUpdate={gameLengthHandler}
                      />
                    </div>
                  </div>
                </div>
                <div className="field">
                  <label className="label">
                    How many minutes until softcap?
                  </label>
                  <div className="control">
                    <SoftCapSelector
                      softCap={softCap}
                      onSoftCapUpdate={softCapHandler}
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Elapsed time:</label>
                  <div className="control">
                    <ElapsedTimeSelector
                      elapsedTime={elapsedTime}
                      onElapsedTimeUpdate={elapsedTimeHandler}
                    />
                  </div>
                </div>
              </React.Fragment>
            </div>
            <div className="column">
              <div className="container">
                <React.Fragment>
                  <label className="label has-text-primary">
                    Home Team:{" "}
                    <span className="subtitle has-text-gray has-text-weight-light">
                      (received starting pull)
                    </span>
                  </label>
                  <div className="control">
                    <HomeTeamSelector
                      homeTeam={homeTeam}
                      onHomeTeamUpdate={homeTeamHandler}
                    />
                  </div>
                  <label className="label has-text-info">
                    Away Team:{" "}
                    <span className="subtitle has-text-gray has-text-weight-light">
                      (pulled starting pull)
                    </span>
                  </label>
                  <div className="control">
                    <AwayTeamSelector
                      awayTeam={awayTeam}
                      onAwayTeamUpdate={awayTeamHandler}
                    />
                  </div>
                </React.Fragment>
              </div>
              <h1 className="subtitle has-text-centered has-text-weight-bold">
                Game Stopwatch
              </h1>
              <div className="content has-text-centered">
                <React.Fragment>
                  <Stopwatch
                    seconds={seconds}
                    minutes={minutes}
                    stopwatchOn={stopwatchOn}
                  />
                </React.Fragment>
                <button className="button" onClick={stopwatchResetHandler}>
                  Reset
                </button>
                <button
                  className={`button button-primary button-primary-${
                    stopwatchOn ? "active" : "inactive"
                  }`}
                  onClick={stopwatchOnHandler}
                >
                  {stopwatchOn ? "Pause" : "Start"}
                </button>
              </div>
              <h2 className="subtitle has-text-weight-bold">Results:</h2>
              <div className="container">
                <div className="content">
                  <p className="has-text-primary has-text-weight-bold">
                    {homeTeam}'s Win Probability: {apiResponse.RecTeam_Win_Prob}{" "}
                  </p>
                  <p className="has-text-primary has-text-weight-bold">
                    {homeTeam}'s Predicted Score:{" "}
                    {apiResponse.RecTeam_Avg_Score}{" "}
                  </p>
                  <p className="has-text-info has-text-weight-bold">
                    {awayTeam}'s Win Probability:{" "}
                    {apiResponse.PullTeam_Win_Prob}{" "}
                  </p>
                  <p className="has-text-info has-text-weight-bold">
                    {awayTeam}'s' Predicted Score:{" "}
                    {apiResponse.PullTeam_Avg_Score}{" "}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer">
        <div className="content has-text-centered">
          React App Programming: Teddy Randby, Monte Carlo Programming (R):
          Craig Poeppleman, Concept: Charles Kerr
        </div>
      </div>
    </body>
  );

  return content;
}

export default App;
