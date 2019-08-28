import React, { useState, useEffect } from 'react';


const CharPicker = props => {


    content = (
      <select>
       
          <option key='M' value={1}>
            Mens
          </option>

          <option key='W' value={1}>
                Womens
          </option>


      </select>
    );
    return content;
};

export default CharPicker;