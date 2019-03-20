import * as React from 'react';
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';

import { Layout, notification } from 'antd';
import { AppHeader, LoadingIndicator, PrivateRoute } from 'components/common';
import { NewPoll, PollList } from 'components/poll';
import { Login, Profile, Signup } from 'components/user';
import { NotFound } from 'pages';
import { ICurrentUserResponse } from 'payload';
import { getCurrentUser } from 'utils/APIUtils';

import { ACCESS_TOKEN } from '../constants';

import './App.less';

export interface IAppState {
  currentUser?: ICurrentUserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

class App extends React.Component<{} & RouteComponentProps, IAppState> {
  public readonly state: IAppState = {
    currentUser: null,
    isAuthenticated: false,
    isLoading: false
  };

  public componentDidMount(): void {
    notification.config({
      placement: 'topRight',
      top: 70,
      duration: 3
    });

    this.loadCurrentUser();
  }

  private handleLogin = () => {
    notification.success({
      message: 'Polling App',
      description: ''
    });
    this.loadCurrentUser();
    this.props.history.push('/');
  };

  private loadCurrentUser = async () => {
    this.setState({ isLoading: true });

    try {
      const res = await getCurrentUser();
      this.setState({
        currentUser: res.data,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      this.setState({ isLoading: false });
    }
  };

  private handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    this.setState({
      currentUser: null,
      isAuthenticated: false
    });

    this.props.history.push('/');
    notification.success({
      message: 'Polling App',
      description: ''
    });
  };

  public render(): React.ReactNode {
    const { isLoading, isAuthenticated, currentUser } = this.state;

    if (isLoading) {
      return <LoadingIndicator />;
    }
    return (
      <Layout className="app-container">
        <AppHeader currentUser={currentUser} onLogout={this.handleLogout} />
        <Layout.Content className="app-content">
          <div className="container">
            <Switch>
              <Route
                exact={true}
                path="/"
                render={props => (
                  <PollList
                    isAuthenticated={isAuthenticated}
                    handleLogout={this.handleLogout}
                    {...props}
                  />
                )}
              />
              <Route
                path="/login"
                render={props => (
                  <Login onLogin={this.handleLogin} {...props} />
                )}
              />
              <Route path="/signup" component={Signup} />
              <Route
                path="/users/:username"
                render={props => (
                  <Profile
                    isAuthenticated={isAuthenticated}
                    currentUser={currentUser}
                    {...props}
                  />
                )}
              />
              <PrivateRoute
                path="/poll/new"
                authenticated={isAuthenticated}
                handleLogout={this.handleLogout}
                component={NewPoll}
              />
              <Route component={NotFound} />
            </Switch>
          </div>
        </Layout.Content>
      </Layout>
    );
  }
}

export default withRouter(App);
