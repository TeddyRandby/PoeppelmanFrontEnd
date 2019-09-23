import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faMinus, faPlay, faPause } from '@fortawesome/free-solid-svg-icons'

library.add(faPlus);
library.add(faMinus);
library.add(faPlay);
library.add(faPause);
ReactDOM.render(<App/>, document.getElementById('root'));
