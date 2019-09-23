import React, { useState, useEffect } from "react";
import "../node_modules/bulma/css/bulma.css";
import HomeScoreSelector from "./components/HomeScoreSelector";
import AwayScoreSelector from "./components/AwayScoreSelector";
import GameLengthSelector from "./components/GameLengthSelector";
import DivisionSelector from "./components/DivisionSelector";
import ReceivingSelector from "./components/ReceivingSelector";
import SoftCapSelector from "./components/SoftCapSelector";
import ElapsedTimeSelector from "./components/ElapsedTimeSelector";
import Stopwatch from "./components/Stopwatch";
import HomeTeamSelector from "./components/HomeTeamSelector";
import AwayTeamSelector from "./components/AwayTeamSelector";

function App() {
  // State monitoring the divisions.
  // m = Mens Division
  // w = Womens Division
  // x = Mixed Divison (not yet implemented -- no data)
  const [division, setDivision] = useState("m");

  // State monitoring the total length of the game.
  const [gameLength, setGameLength] = useState("85");

  // State monitoring the receiving team's score.
  const [homeScore, setHomeScore] = useState(0);

  // State monitoring the pulling team's score.
  const [awayScore, setAwayScore] = useState(0);

  // State monitoring which team began the game by receiving.
  const [received, setStartedReceving] = useState("1");

  // State monitoring when hard cap comes on.
  const [softCap, setSoftCap] = useState("85");

  // State monitoring the elapsed time.
  const [elapsedTime, setElapsedTime] = useState("0");

  // State monitoring seconds for the timer.
  const [seconds, setSeconds] = useState("00");

  // State monitoring minutes for the timer.
  const [minutes, setMinutes] = useState("00");

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

  const incrementAway = () => {
    if ( awayScore < 15) {
      setAwayScore(awayScore + 1);
    }
    // setStartedReceving("1")
  };

  const decrementAway = () => {
    if ( awayScore > 0 ) {
      setAwayScore(awayScore - 1);
    }
  }

  const decrementHome = () => {
    if ( homeScore > 0 ) {
      setHomeScore(homeScore - 1);
    }
  }
  const incrementHome = () => {
    if ( homeScore < 15) {
      setHomeScore(homeScore + 1);
    }
    // setStartedReceving("0")
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
    setSeconds("00");
    setMinutes("00");
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
        let sec = parseInt(seconds) + 1;
        if (sec < 10) {
          setSeconds("0" + sec);
        } else {
          setSeconds(sec);
        }
        if (seconds >= 59) {
          let min = parseInt(minutes) + 1;
          setSeconds("00");
          if (min < 10) {
            setMinutes("0" + min);
          } else {
            setMinutes(min);  
          }
          setSoftCap(parseInt(softCap) - 1);
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
      if (parseInt(awayScore) >= 8 || parseInt(homeScore) >= 8) {
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
              RecTeam_Score: "${homeScore}",
              PullTeam_Score: "${awayScore}",
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
            poeppelman.RecTeam_Win_Prob.substring(0, 4) + "%";
          poeppelman.RecTeam_Avg_Score = poeppelman.RecTeam_Avg_Score.substring(
            0,
            4
          );
          poeppelman.PullTeam_Win_Prob =
            poeppelman.PullTeam_Win_Prob.substring(0, 4) + "%";
          poeppelman.PullTeam_Avg_Score = poeppelman.PullTeam_Avg_Score.substring(
            0,
            4
          );

          setAPIResponse(poeppelman);
        })
        .catch(err => {
          alert("No data available. Check your internet connection and make sure that the scores entered are correct.");
          setAPIResponse({});
          console.log(err);
        });
    },
    // This array contains the whitelisted states which will "call" this useEffect when changed.
    [
      awayScore,
      homeScore,
      division,
      received,
      gameLength,
      softCap,
      elapsedTime,
      minutes
    ]
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
      <div className="tile is-ancestor has-background-light section">
        <div className="tile is-parent container">
          <div className="tile is-child box is-3  ">
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
                <label className="label has-text-info">
                  {awayTeam}'s Score
                </label>
                <div className="control">
                    <AwayScoreSelector
                      awayScore={awayScore}
                      incrementAway={incrementAway}
                      decrementAway={decrementAway}
                    />
                </div>
              </div>
              <div className="field">
                <label className="label has-text-primary">
                  {homeTeam}'s Score
                </label>
                   <div className="control">
                        <HomeScoreSelector
                          homeScore={homeScore}
                          incrementHome={incrementHome}
                          decrementHome={decrementHome}                        />
                    </div>
                </div>
              <div className="field">
                <label className="label">Which team received this point?</label>
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
                <label className="label">How many minutes until softcap?</label>
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
          <div className="tile is-parent is-vertical container has-background-light">
            <div className="tile is-parent">
              <div className="tile is-child section">
                <React.Fragment>
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
                </React.Fragment>
              </div>
              <div class="tile is-child section">
                <h1 className="title has-text-centered has-text-weight-bold">
                  Game Stopwatch
                </h1>
                <div className=" has-text-centered">
                  <React.Fragment>
                    <Stopwatch
                      seconds={seconds}
                      minutes={minutes}
                      stopwatchOn={stopwatchOn}
                    />
                  </React.Fragment>
                  <button className="button has-background-dark has-text-light" onClick={stopwatchResetHandler}>
                    Reset
                  </button>
                  <button
                    className={`button has-background-dark has-text-light button-primary-${
                      stopwatchOn ? "active" : "inactive"
                    }`}
                    onClick={stopwatchOnHandler}
                  >
                    {stopwatchOn ? "Pause" : "Start"}
                  </button>
                </div>
              </div>
            </div>

            <div class="tile is-parent ">

              <div className="tile is-parent is-child is-vertical">
              <div className="tile has-text-centered is-child box">
                  <div className="title has-text-info"> {apiResponse.PullTeam_Win_Prob} </div>
                  <div className="subtitle has-text-info">
                    {awayTeam}'s Win Probability
                  </div>
                </div>
                <div className="tile has-text-centered is-child box">
                  <div className="title has-text-info"> {apiResponse.PullTeam_Avg_Score} </div>
                  <div className="subtitle has-text-info">
                    {awayTeam}'s Predicted Score
                  </div>
                </div>
              </div>
              <div className="tile is-parent is-child is-vertical">
                <div className="tile has-text-centered is-child box">
                  <div className="title has-text-primary"> {apiResponse.RecTeam_Win_Prob} </div>
                  <div className="subtitle has-text-primary">
                    {homeTeam}'s Win Probability
                  </div>
                </div>

                <div className="tile has-text-centered is-child box">
                  <div className="title has-text-primary"> {apiResponse.RecTeam_Avg_Score} </div>
                  <div className="subtitle has-text-primary">
                    {homeTeam}'s Predicted Score
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer has-background-white">
        <div className="content has-text-centered">
          <p>React App Programming: Teddy Randby - <a class="has-text-link"href="https://github.com/TeddyRandby"> Find me on Github </a></p>
          <p>Monte Carlo Programming (R): Craig Poeppleman </p>
          <p>Concept: Charles Kerr </p> 
        </div>
      </div>
    </body>
  );

  return content;
}

export default App;
