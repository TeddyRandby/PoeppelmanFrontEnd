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
import ResponseRenderer from "./components/ResponseRenderer";

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

  // State monitoring which team received this point.
  const [received, setReceving] = useState("away");

  const [teamFirstRec, setFirstRec] = useState("away");

  const [homePulledFirst, setHomePulledFirst] = useState(false);

  // State monitoring when hard cap comes on.
  const [softCap, setSoftCap] = useState("85");

  // State monitoring the elapsed time.
  const [elapsedMin, setElapsedMin] = useState("00");

  // State monitoring seconds for the timer.
  const [seconds, setSeconds] = useState("00");

  // State monitoring the timer's status.
  const [stopwatchOn, setStopwatchOn] = useState(false);

  // State monitoring the input team names.
  const [homeTeam, setHomeTeam] = useState("Home");

  const [awayTeam, setAwayTeam] = useState("Away");

  // State containing the graphQL API's response.
  const [apiResponse, setAPIResponse] = useState({});

  const [isLoading, setLoading] = useState(true);

  // Handlers for the above states.
  const divisionHandler = event => {
    const division = event.target.value;
    setDivision(division);
  };

  const gameLengthHandler = event => {
    const gameLength = event.target.value;
    setGameLength(gameLength);
    setSoftCap(gameLength - elapsedMin);
  };

  const incrementAway = () => {
    if (awayScore < 15) {
      setAwayScore(awayScore + 1);
    }
    setReceving("home");
  };

  const decrementAway = () => {
    if (awayScore == 1) {
      setReceving("away");
    }
    if (homeScore == 0 && awayScore == 1) {
      setReceving(teamFirstRec);
    }
    if (awayScore > 0) {
      setAwayScore(awayScore - 1);
    }
  };

  const decrementHome = () => {
    if (homeScore == 1) {
      setReceving("home");
    }
    if (homeScore == 1 && awayScore == 0) {
      setReceving(teamFirstRec);
    }

    if (homeScore > 0) {
      setHomeScore(homeScore - 1);
    }
  };

  const incrementHome = () => {
    if (homeScore < 15) {
      setHomeScore(homeScore + 1);
    }
    setReceving("away");
  };

  const receivedHandler = event => {
    const receiving = event.target.value;
    setReceving(receiving);
  };

  const firstRecHomeHandler = event => {
    setFirstRec("home");
    setHomePulledFirst(true);
    if (homeScore == 0 && awayScore == 0) {
      setReceving("home");
    }
  };

  const firstRecAwayHandler = event => {
    setFirstRec("away");
    setHomePulledFirst(false);
    if (homeScore == 0 && awayScore == 0) {
      setReceving("away");
    }
  };

  const softCapHandler = event => {
    const softCap = event.target.value;
    setSoftCap(softCap);
    setElapsedMin(gameLength - softCap);
  };

  const elapsedMinHandler = event => {
    const elapsedTime = event.target.value;
    setElapsedMin(elapsedTime);
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
    setElapsedMin("00");
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
          let min = parseInt(elapsedMin) + 1;
          setSeconds("00");
          if (min < 10) {
            setElapsedMin("0" + min);
          } else {
            setElapsedMin(min);
          }
          setSoftCap(parseInt(softCap) - 1);
          setElapsedMin(parseInt(elapsedMin) + 1);
        }
      }, 1000);
    } else if (!stopwatchOn && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [stopwatchOn, seconds, elapsedMin]);

  // This function is run when the page updates, and sends
  // an API request to update the statistics.
  useEffect(
    event => {
      setLoading(true);

      // Derived parameters
      let ole_rate = "0.63";
      let capOn = "0";
      let secondHalf = "0";
      let timeElapsed = gameLength - softCap;
      let receiving;
      let recScore;
      let pullScore;

      if (received == "home") {
        recScore = homeScore;
        pullScore = awayScore;
      } else {
        recScore = awayScore;
        pullScore = homeScore;
      }
      // If the receiving team received to start the game, receiving should be 1. Else, 0.
      if (teamFirstRec == received) {
        receiving = "1";
      } else {
        receiving = "0";
      }

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
      console.log(requestBody);
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
          setLoading(false);
        })
        .catch(err => {
          alert(
            "No data available. Check your internet connection and make sure that the scores entered are correct."
          );
          setAPIResponse({});
          console.log(err);
        });
    },
    // This array contains the whitelisted states which will "call" this useEffect when changed.
    [awayScore, homeScore, division, received, elapsedMin, teamFirstRec]
  );

  const content = (
    <div>
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
              <DivisionSelector
                division={division}
                onDivisionUpdate={divisionHandler}
              />

              <AwayScoreSelector
                awayScore={awayScore}
                incrementAway={incrementAway}
                decrementAway={decrementAway}
                awayTeam={awayTeam}
              />

              <HomeScoreSelector
                homeScore={homeScore}
                incrementHome={incrementHome}
                decrementHome={decrementHome}
                homeTeam={homeTeam}
              />

              <ReceivingSelector
                received={received}
                onReceivingUpdate={receivedHandler}
                homeTeam={homeTeam}
                awayTeam={awayTeam}
              />

              <GameLengthSelector
                gameLength={gameLength}
                onGameLengthUpdate={gameLengthHandler}
              />

              <SoftCapSelector
                softCap={softCap}
                onSoftCapUpdate={softCapHandler}
              />

              <ElapsedTimeSelector
                elapsedMin={elapsedMin}
                onElapsedMinUpdate={elapsedMinHandler}
                stopwatchOn={stopwatchOn}
                stopwatchResetHandler={stopwatchResetHandler}
                stopwatchOnHandler={stopwatchOnHandler}
              />
            </React.Fragment>
          </div>
          <div className="tile is-parent is-vertical container has-background-light">
            <div className="tile is-parent">
              <div className="tile is-child section">
                <React.Fragment>
                  <AwayTeamSelector
                    awayTeam={awayTeam}
                    onAwayTeamUpdate={awayTeamHandler}
                    onChange={firstRecAwayHandler}
                    checked={homePulledFirst}
                  />

                  <HomeTeamSelector
                    homeTeam={homeTeam}
                    onHomeTeamUpdate={homeTeamHandler}
                    onChange={firstRecHomeHandler}
                    checked={homePulledFirst}
                  />
                </React.Fragment>
              </div>
              <div className="tile is-child section">
                <React.Fragment>
                  <Stopwatch
                    seconds={seconds}
                    minutes={elapsedMin}
                    stopwatchOn={stopwatchOn}
                    stopwatchResetHandler={stopwatchResetHandler}
                    stopwatchOnHandler={stopwatchOnHandler}
                  />
                </React.Fragment>
              </div>
            </div>
            <React.Fragment>
              <ResponseRenderer
                received={received}
                apiResponse={apiResponse}
                awayTeam={awayTeam}
                homeTeam={homeTeam}
                isLoading={isLoading}
              />
            </React.Fragment>
          </div>
        </div>
      </div>
      <div className="footer has-background-white">
        <div className="content has-text-centered">
          <p>
            React App Programming: Teddy Randby -{" "}
            <a className="has-text-link" href="https://github.com/TeddyRandby">
              {" "}
              Find me on Github{" "}
            </a>
          </p>
          <p>Monte Carlo Programming (R): Craig Poeppleman </p>
          <p>Concept: Charles Kerr </p>
        </div>
      </div>
    </div>
  );

  return content;
}

export default App;
