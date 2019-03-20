import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { LocaleProvider } from 'antd';
import kr_KR from 'antd/lib/locale-provider/ko_KR';
import App from 'components/App';

import 'moment/locale/ko';

const Root: React.SFC<{}> = () => (
  <LocaleProvider locale={kr_KR}>
    <Router>
      <App />
    </Router>
  </LocaleProvider>
);

export default Root;
