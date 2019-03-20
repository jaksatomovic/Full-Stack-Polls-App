import * as React from 'react';
import { Link } from 'react-router-dom';

import { Button } from 'antd';

import './NotFound.less';

const NotFound = () => {
  return (
    <div className="page-not-found">
      <h1 className="title">404</h1>
      <div className="desc">찾을 수 없는 페이지입니다.</div>
      <Link to="/">
        <Button className="go-back-btn" type="primary" size="large">
          돌아가기
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
