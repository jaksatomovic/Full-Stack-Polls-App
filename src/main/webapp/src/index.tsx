import * as React from 'react';
import * as ReactDOM from 'react-dom';

import registerServiceWorker from './registerServiceWorker';
import Root from './Root';

import './index.less';

ReactDOM.render(<Root />, document.getElementById('root') as HTMLElement);

registerServiceWorker();
