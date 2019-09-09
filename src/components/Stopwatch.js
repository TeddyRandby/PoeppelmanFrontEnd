import React from 'react';
function Stopwatch (props) {
  return (
    
      <div className="subtitle is-size-3 has-text-grey">
        {props.minutes}:{props.seconds}
      </div>

  );
};

export default Stopwatch;