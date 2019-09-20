import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'

library.add(faPlus);
library.add(faMinus);
ReactDOM.render(<App/>, document.getElementById('root'));
