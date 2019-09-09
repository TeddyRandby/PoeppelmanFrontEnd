import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons'

library.add(faPlusSquare);
ReactDOM.render(<App/>, document.getElementById('root'));
