import React, { Component } from 'react';
import './App.css';

class App extends Component {

  constructor(props) {
  super(props);
  this.RTSEl = React.createRef();
  this.PTSEl = React.createRef();
  this.RTRTSGEl = React.createRef();
  this.TSOSEl = React.createRef();
  this.COEl = React.createRef();
  this.MEl = React.createRef();
  this.WEl = React.createRef();
  this.state = {
    rtrtsgChecked: false,
    coChecked: false,
    mChecked: false,
    wChecked: false,
    apiResponse: {}
  }

}

  render() {
    return (
      <div className="App">
        <h1 className="Header"> Welcome to the Poeppelman Calculator! </h1>
          <form className="PoppelmanForm" onSubmit={this.submitHandler} >
            <div className="form-control text">
              <label htmlFor="RecTeam_Score">Receiving Team's Score</label>
              <input
              type="String"
              id="RTS"
              ref={this.RTSEl} />
            </div>
            <div className="form-control text">
              <label htmlFor="PullTeam_Score">Pulling Team's Score</label>
              <input type="String" id="PTS" ref={this.PTSEl} />
            </div>
            <div className="form-control">
              <label htmlFor="RecTeam_RecToStartGame">Did the receiving team receive to start the game?</label>
              <input
              type="checkbox"
              id="RTRTSG"
              name="rtrtsgChecked"
              ref={this.RTRTSGEl}
              checked = {this.state.rtrtsgChecked}
              onChange = {this.handleCheckboxChange} />
            </div>
            <div className="form-control text ">
              <label htmlFor="Time_StartofSim">How much time has passed in the game?</label>
              <input
              type="String"
              id="TSOS"
              ref={this.TSOSEl} />
            </div>
            <div className="form-control box">
              <label htmlFor="CapOn">Is hardcap on?</label>
              <input
              type="checkbox"
              id="CO"
              name="coChecked"
              ref={this.COEl}
              checked = {this.state.coChecked}
              onChange = {this.handleCheckboxChange}/>
            </div>
            <div className="form-control box">
              <label htmlFor="Mens">Is this a mens game?</label>
              <input
              type="checkbox"
              id="M"
              name="mChecked"
              ref={this.MEl}
              checked = {this.state.mChecked}
              onChange = {this.handleCheckboxChange} />
            </div>
            <div className="form-control box">
              <label htmlFor="Womens">Is this a womens game?</label>
              <input
              type="checkbox"
              id="W"
              name="wChecked"
              ref={this.WEl}
              checked = {this.state.wChecked}
              onChange = {this.handleCheckboxChange} />
            </div>
            <button type="submit">Submit</button>
          </form>
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
  }

  handleCheckboxChange = event => {
    const target = event.target;
    const value = target.checked;
    const name = target.name;
    this.setState({
      [name]: value
    });
  };

  submitHandler = event => {
  event.preventDefault();
  const rts = this.RTSEl.current.value;
  const pts = this.PTSEl.current.value;
  const rtrtsg = this.state.rtrtsgChecked;
  const tsos = this.TSOSEl.current.value;
  const co = this.state.coChecked;
  const m = this.state.mChecked;
  const w = this.state.wChecked;
  var ole_rate;
  var capOn;
  var secondHalf;
  var recTeamRecToStartGame;
  var timeStart = tsos;

  if ( !((m && !w) || (w && !m)) ) {
    alert("Must be either mens or womens")
    return;
  }

  if ( rtrtsg ) {
    recTeamRecToStartGame = "0";
  } else {
    recTeamRecToStartGame = "1";
  }

  if ( parseInt(rts) >= 8 || parseInt(pts) >= 8) {
    secondHalf = "1";
    recTeamRecToStartGame = "1";
  } else {
    secondHalf = "0";
  }

// Yes- it is unintuitive for 0 to be true and 1 to be false.
// Blame the guy who got the data and made the CSV, not me.


  if ( m ) {
    ole_rate = "0.7";
  } else {
    ole_rate = "0.63";
  }

  if ( co ) {
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
  fetch('https://poeppelman-api.herokuapp.com/api', {
    method: 'POST',
    body: JSON.stringify(requestBody),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      return res.json();
    })
    .then(resData => {
      var poeppelman = resData.data.poeppelman[0];
      var recProb = parseFloat(poeppelman.RecTeam_Win_Prob);
      var pullProb = parseFloat(poeppelman.PullTeam_Win_Prob);
      poeppelman.RecTeam_Win_Prob = (recProb * 100).toString();
      poeppelman.PullTeam_Win_Prob = (pullProb * 100).toString();

      poeppelman.RecTeam_Win_Prob = poeppelman.RecTeam_Win_Prob.substring(0,6) + "%";
      poeppelman.RecTeam_Avg_Score = poeppelman.RecTeam_Avg_Score.substring(0,6);
      poeppelman.PullTeam_Win_Prob = poeppelman.PullTeam_Win_Prob.substring(0,6) + "%";
      poeppelman.PullTeam_Avg_Score = poeppelman.PullTeam_Avg_Score.substring(0,6);


      this.setState({
        apiResponse: poeppelman
      })

    })
    .catch(err => {
      console.log(err);
    });
};
}

export default App;
