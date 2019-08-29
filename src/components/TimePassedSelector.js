import React, { useState, useEffect } from "react";

const TimePassedSelector = props => {
  const content = (
    <input type="number" onChange={props.onTimeUpdate} value={props.time}/>
  );
  return content;
};

export default TimePassedSelector;
