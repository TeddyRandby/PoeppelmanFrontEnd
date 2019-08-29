import React, { useState, useEffect } from "react";
import "../../node_modules/bulma/css/bulma.css";

const TimePassedSelector = props => {
  const content = (
    <input class="input" type="number" onChange={props.onTimeUpdate} value={props.time}/>
  );
  return content;
};

export default TimePassedSelector;
