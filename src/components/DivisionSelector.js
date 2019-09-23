import React from "react";

function DivisionSelector(props) {
  const content = (
    <div className="field">
      <label className="label">Division</label>
      <div className="control">
        <div className="select">
          <select onChange={props.onDivisionUpdate} value={props.divison}>
            <option key="m" value={"m"}>
              Mens
            </option>

            <option key="w" value={"w"}>
              Womens
            </option>
          </select>
        </div>
      </div>
    </div>
  );
  return content;
}

export default DivisionSelector;
