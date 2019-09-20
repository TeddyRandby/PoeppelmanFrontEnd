import React from 'react';
function Stopwatch (props) {
  return (
    
      <div className="title is-size-3 has-text-grey box">
        {props.minutes}:{props.seconds}
      </div>

  );
};

export default Stopwatch;