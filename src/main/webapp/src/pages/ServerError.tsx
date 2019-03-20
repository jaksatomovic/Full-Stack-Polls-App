import * as React from 'react';
import { Link } from 'react-router-dom';

import { Button } from 'antd';

import './ServerError.less';

class ServerError extends React.Component<{}, {}> {
  public render(): React.ReactNode {
    return (
      <div className="server-error-page">
        <h1 className="server-error-title">500</h1>
        <div className="server-error-desc">서버 에러가 발생했습니다.</div>
        <Link to="/">
          <Button
            className="server-error-go-back-btn"
            type="primary"
            size="large"
          >
            돌아가기
          </Button>
        </Link>
      </div>
    );
  }
}

export default ServerError;
