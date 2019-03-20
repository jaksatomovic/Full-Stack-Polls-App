import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

import { Button, Form, Input, notification } from 'antd';
import { FormItemProps } from 'antd/lib/form';
import { ISignupReqeust } from 'payload';
import { checkEmailAvailability, checkUsernameAvailability, signup } from 'utils/APIUtils';

import {
  EMAIL_MAX_LENGTH,
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH
} from '../../constants';

import './Signup.less';

interface IFormData {
  value: string;
  errorMsg?: string | undefined | null;
  validateStatus?: FormItemProps['validateStatus'];
}

export interface ISignupState {
  name: IFormData;
  username: IFormData;
  email: IFormData;
  password: IFormData;
}

class Signup extends React.Component<{} & RouteComponentProps, ISignupState> {
  public readonly state: ISignupState = {
    name: { value: '' },
    username: { value: '' },
    email: { value: '' },
    password: { value: '' }
  };

  private handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    validateFun: any
  ) => {
    const target = event.target;
    const inputName = target.name;
    const inputValue = target.value;

    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/26635
    this.setState({
      [inputName]: { value: inputValue, ...validateFun(inputValue) }
    } as Pick<ISignupState, keyof ISignupState>);
  };

  private handleSubmit = async (event: React.FormEvent<any>): Promise<void> => {
    event.preventDefault();
    const { name, email, username, password } = this.state;

    const signupRequest: ISignupReqeust = {
      name: name.value,
      email: email.value,
      username: username.value,
      password: password.value
    };

    try {
      await signup(signupRequest);
      notification.success({
        message: 'Polling App',
        description: ''
      });
      this.props.history.push('/login');
    } catch (error) {
      notification.error({
        message: 'Polling App',
        description: ''
      });
    }
  };

  private isFormInvalid = (): boolean => {
    const { name, email, username, password } = this.state;
    return !(
      name.validateStatus === 'success' &&
      username.validateStatus === 'success' &&
      email.validateStatus === 'success' &&
      password.validateStatus === 'success'
    );
  };

  public render(): React.ReactNode {
    const { name, email, username, password } = this.state;
    return (
      <div className="signup-container">
        <h1 className="page-title">Sign Up</h1>
        <div className="signup-content">
          <Form onSubmit={this.handleSubmit} className="signup-form">
            <Form.Item
              label="Full Name"
              validateStatus={name.validateStatus}
              help={name.errorMsg}
            >
              <Input
                size="large"
                name="name"
                autoComplete="off"
                placeholder="Your full name"
                value={name.value}
                onChange={event =>
                  this.handleInputChange(event, this.validateName)
                }
              />
            </Form.Item>
            <Form.Item
              label="Username"
              hasFeedback={true}
              validateStatus={username.validateStatus}
              help={username.errorMsg}
            >
              <Input
                size="large"
                name="username"
                autoComplete="off"
                placeholder="A unique username"
                value={username.value}
                onBlur={this.validateUsernameAvailability}
                onChange={event =>
                  this.handleInputChange(event, this.validateUsername)
                }
              />
            </Form.Item>
            <Form.Item
              label="Email"
              hasFeedback={true}
              validateStatus={email.validateStatus}
              help={email.errorMsg}
            >
              <Input
                size="large"
                name="email"
                type="email"
                autoComplete="off"
                placeholder="Your email"
                value={email.value}
                onBlur={this.validateEmailAvailability}
                onChange={event =>
                  this.handleInputChange(event, this.validateEmail)
                }
              />
            </Form.Item>
            <Form.Item
              label="Password"
              validateStatus={password.validateStatus}
              help={password.errorMsg}
            >
              <Input
                size="large"
                name="password"
                type="password"
                autoComplete="off"
                placeholder="A password between 6 to 20 characters"
                value={password.value}
                onChange={event =>
                  this.handleInputChange(event, this.validatePassword)
                }
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="signup-form-button"
                disabled={this.isFormInvalid()}
              >
                Sign up
              </Button>
              Already registed? <Link to="/login">Login now!</Link>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }

  private validateName = (name: string): Partial<IFormData> => {
    if (name.length < NAME_MIN_LENGTH) {
      return {
        validateStatus: 'error',
        errorMsg: `Name is too short (Minimum ${NAME_MIN_LENGTH} characters needed.)`
      };
    } else if (name.length > NAME_MAX_LENGTH) {
      return {
        validateStatus: 'error',
        errorMsg: `Name is too long (Maximum ${NAME_MAX_LENGTH} characters allowed.)`
      };
    } else {
      return {
        validateStatus: 'success',
        errorMsg: null
      };
    }
  };

  private validateEmail = (email: string): Partial<IFormData> => {
    if (!email) {
      return {
        validateStatus: 'error',
        errorMsg: 'Email may not be empty'
      };
    }

    const EMAIL_REGEX = RegExp('[^@ ]+@[^@ ]+\\.[^@ ]+');
    if (!EMAIL_REGEX.test(email)) {
      return {
        validateStatus: 'error',
        errorMsg: 'Email not valid'
      };
    }

    if (email.length > EMAIL_MAX_LENGTH) {
      return {
        validateStatus: 'error',
        errorMsg: `Email is too long (Maximum ${EMAIL_MAX_LENGTH} characters allowed)`
      };
    }

    return {
      validateStatus: undefined,
      errorMsg: null
    };
  };

  private validateUsername = (username: string): Partial<IFormData> => {
    if (username.length < USERNAME_MIN_LENGTH) {
      return {
        validateStatus: 'error',
        errorMsg: `Username is too short (Minimum ${USERNAME_MIN_LENGTH} characters needed.)`
      };
    } else if (username.length > USERNAME_MAX_LENGTH) {
      return {
        validateStatus: 'error',
        errorMsg: `Username is too long (Maximum ${USERNAME_MAX_LENGTH} characters allowed.)`
      };
    } else {
      return {
        validateStatus: undefined,
        errorMsg: null
      };
    }
  };

  private validatePassword = (password: string): Partial<IFormData> => {
    if (password.length < PASSWORD_MIN_LENGTH) {
      return {
        validateStatus: 'error',
        errorMsg: `Password is too short (Minimum ${PASSWORD_MIN_LENGTH} characters needed.)`
      };
    } else if (password.length > PASSWORD_MAX_LENGTH) {
      return {
        validateStatus: 'error',
        errorMsg: `Password is too long (Maximum ${PASSWORD_MAX_LENGTH} characters allowed.)`
      };
    } else {
      return {
        validateStatus: 'success',
        errorMsg: null
      };
    }
  };

  private validateUsernameAvailability = async () => {
    const usernameValue = this.state.username.value;
    const usernameValidation = this.validateUsername(usernameValue);

    if (usernameValidation.validateStatus === 'error') {
      this.setState({
        username: {
          value: usernameValue,
          ...usernameValidation
        }
      });
      return;
    }

    this.setState({
      username: {
        value: usernameValue,
        validateStatus: 'validating',
        errorMsg: null
      }
    });

    try {
      const res = await checkUsernameAvailability(usernameValue);
      if (res.data.available) {
        this.setState({
          username: {
            value: usernameValue,
            validateStatus: 'success',
            errorMsg: null
          }
        });
      } else {
        this.setState({
          username: {
            value: usernameValue,
            validateStatus: 'error',
            errorMsg: '이미 등록된 유저명입니다'
          }
        });
      }
    } catch (error) {
      this.setState({
        username: {
          value: usernameValue,
          validateStatus: 'success',
          errorMsg: null
        }
      });
    }
  };

  private validateEmailAvailability = async () => {
    const emailValue = this.state.email.value;
    const emailValidation = this.validateEmail(emailValue);

    if (emailValidation.validateStatus === 'error') {
      this.setState({
        email: {
          value: emailValue,
          ...emailValidation
        }
      });
      return;
    }

    this.setState({
      email: {
        value: emailValue,
        validateStatus: 'validating',
        errorMsg: null
      }
    });

    try {
      const res = await checkEmailAvailability(emailValue);
      if (res.data.available) {
        this.setState({
          email: {
            value: emailValue,
            validateStatus: 'success',
            errorMsg: null
          }
        });
      } else {
        this.setState({
          email: {
            value: emailValue,
            validateStatus: 'error',
            errorMsg: '이미 등록된 이메일입니다'
          }
        });
      }
    } catch (error) {
      this.setState({
        email: {
          value: emailValue,
          validateStatus: 'success',
          errorMsg: null
        }
      });
    }
  };
}

export default Signup;
