import * as React from 'react';
import { Link } from 'react-router-dom';

import { Button, Form, Icon, Input, notification } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import { login } from 'src/utils/APIUtils';

import { ACCESS_TOKEN } from '../../constants';

export interface ILoginFormProps {
  onLogin(): void;
}

const LoginForm: React.SFC<ILoginFormProps & FormComponentProps> = props => {
  const handleSubmit = (event: React.FormEvent<any>) => {
    event.preventDefault();
    props.form.validateFields(async (error: any, values: any) => {
      if (!error) {
        try {
          const res = await login({ ...values });
          localStorage.setItem(ACCESS_TOKEN, res.data.accessToken);
          props.onLogin();
        } catch (error) {
          if (error.response.status === 401) {
            notification.error({
              message: 'Polling App',
              description: '유저명과 패스워드를 확인해주세요'
            });
          } else {
            notification.error({
              message: 'Polling App',
              description: '에러가 발생했습니다'
            });
          }
        }
      }
    });
  };

  const { getFieldDecorator } = props.form;
  return (
    <Form onSubmit={handleSubmit} className="login-form">
      <Form.Item>
        {getFieldDecorator('usernameOrEmail', {
          rules: [
            { required: true, message: 'Please input your username or email!' }
          ]
        })(
          <Input
            prefix={<Icon type="user" />}
            size="large"
            name="usernameOrEmail"
            placeholder="Username or Email"
          />
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('password', {
          rules: [{ required: true, message: 'Please input your Password!' }]
        })(
          <Input
            prefix={<Icon type="lock" />}
            size="large"
            name="password"
            type="password"
            placeholder="Password"
          />
        )}
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          className="login-form-button"
        >
          Login
        </Button>
        Or <Link to="/signup">register now!</Link>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
