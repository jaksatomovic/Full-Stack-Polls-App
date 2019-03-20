import * as React from 'react';

import { Form } from 'antd';

import LoginForm from './LoginForm';

import './Login.less';

export interface ILoginProps {
  onLogin(): void;
}

const Login: React.SFC<ILoginProps> = props => {
  const AntWrappedLoginForm = Form.create()(LoginForm);
  return (
    <div className="login-container">
      <h1 className="page-title">Login</h1>
      <div className="login-content">
        <AntWrappedLoginForm onLogin={props.onLogin} />
      </div>
    </div>
  );
};

export default Login;
