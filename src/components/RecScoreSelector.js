import React from "react";

function RecScoreSelector(props) {
  const content = (
    <select onChange={props.onRecScoreUpdate} value={props.recScore}>
      <option key="0" value={"0"}>
        0
      </option>
      <option key="1" value={"1"}>
        1
      </option>

      <option key="2" value={"2"}>
        2
      </option>
      <option key="3" value={"3"}>
        3
      </option>
      <option key="4" value={"4"}>
        4
      </option>
      <option key="5" value={"5"}>
        5
      </option>
      <option key="6" value={"6"}>
        6
      </option>
      <option key="7" value={"7"}>
        7
      </option>
      <option key="8" value={"8"}>
        8
      </option>
      <option key="9" value={"9"}>
        9
      </option>
      <option key="10" value={"10"}>
        10
      </option>
      <option key="11" value={"11"}>
        11
      </option>
      <option key="12" value={"12"}>
        12
      </option>
      <option key="13" value={"13"}>
        13
      </option>
      <option key="14" value={"14"}>
        14
      </option>
      <option key="15" value={"15"}>
        15
      </option>
    </select>
  );
  return content;
};

export default RecScoreSelector;
