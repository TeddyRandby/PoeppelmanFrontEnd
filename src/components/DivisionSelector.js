import React from "react";

function DivisionSelector (props) {
  const content = (
    <select onChange={props.onDivisionUpdate} value={props.divison}>
      <option key="m" value={"m"}>
        Mens
      </option>

      <option key="w" value={"w"}>
        Womens
      </option>
    </select>
  );
  return content;
};

export default DivisionSelector;
