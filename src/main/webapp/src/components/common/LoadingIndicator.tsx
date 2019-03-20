import * as React from 'react';

import { Icon, Spin } from 'antd';

const LoadingIndicator: React.SFC<{}> = () => {
  const antIcon = (
    <Icon type="loading-3-quarters" style={{ fontSize: 30 }} spin={true} />
  );
  return (
    <Spin
      indicator={antIcon}
      style={{ display: 'block', textAlign: 'center', marginTop: 30 }}
    />
  );
};

export default LoadingIndicator;
