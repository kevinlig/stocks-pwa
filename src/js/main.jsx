import React from 'react';
import ReactDOM from 'react-dom';

import App from 'App';

// const offlinePluginRuntime = require('offline-plugin/runtime')
// offlinePluginRuntime.install()

require('../scss/style.scss');

ReactDOM.render(
    <App />,
    document.getElementById('app')
);