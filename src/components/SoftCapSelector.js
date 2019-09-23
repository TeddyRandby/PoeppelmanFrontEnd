import React from "react";

function SoftCapSelector(props) {
  const content = (
    <div className="field">
      <label className="label">How many minutes until softcap?</label>
      <div className="control">
        <input
          className="input"
          type="number"
          onChange={props.onSoftCapUpdate}
          value={props.softCap}
        />
      </div>
    </div>
  );
  return content;
}

export default SoftCapSelector;
