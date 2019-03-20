import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import { Avatar, Tabs } from 'antd';
import { LoadingIndicator } from 'components/common';
import { PollList } from 'components/poll';
import { NotFound, ServerError } from 'pages';
import { ICurrentUserResponse, IUserProfileResponse } from 'payload';
import { getUserProfile } from 'utils/APIUtils';
import { getAvatarColor } from 'utils/Colors';
import { formatDate } from 'utils/Helpers';

import './Profile.less';

export interface IProfileProps extends RouteComponentProps<IMatchParams> {
  currentUser?: ICurrentUserResponse | null;
  isAuthenticated: boolean;
}

export interface IProfileState {
  user: IUserProfileResponse | null;
  isLoading: boolean;
  notFound: boolean;
  serverError: boolean;
}

interface IMatchParams {
  username: string;
}

class Profile extends React.Component<IProfileProps, {}> {
  public readonly state: IProfileState = {
    user: null,
    isLoading: false,
    notFound: false,
    serverError: false
  };

  public componentDidMount(): void {
    const { username } = this.props.match.params;
    this.loadUserProfile(username);
  }

  public componentDidUpdate(prevProps: IProfileProps, _: IProfileState) {
    const { username } = prevProps.match.params;
    if (username !== this.props.match.params.username) {
      this.loadUserProfile(username);
    }
  }

  private loadUserProfile = async (username: string) => {
    this.setState({ isLoading: true });
    try {
      const res = await getUserProfile(username);
      this.setState({ user: res.data, isLoading: false });
    } catch (error) {
      if (error.response.status === 404) {
        this.setState({ notFound: true, isLoading: false });
      } else {
        this.setState({ serverError: true, isLoading: false });
      }
    }
  };

  public render(): React.ReactNode {
    const { username } = this.props.match.params;
    const { isLoading, notFound, serverError, user } = this.state;

    if (isLoading) {
      return <LoadingIndicator />;
    }
    if (notFound) {
      return <NotFound />;
    }
    if (serverError) {
      return <ServerError />;
    }

    return (
      <div className="profile">
        {user ? (
          <div className="user-profile">
            <div className="user-details">
              <div className="user-avatar">
                <Avatar
                  className="user-avatar-circle"
                  style={{ backgroundColor: getAvatarColor(user.name) }}
                >
                  {user.name[0].toUpperCase()}
                </Avatar>
              </div>
              <div className="user-summary">
                <div className="full-name">{user.name}</div>
                <div className="username">@{user.username}</div>
                <div className="user-joined">
                  Joined {formatDate(user.joinedAt)}
                </div>
              </div>
            </div>
            <div className="user-poll-details">
              <Tabs
                defaultActiveKey="1"
                animated={false}
                tabBarStyle={{ textAlign: 'center' }}
                size="large"
                className="profile-tabs"
              >
                <Tabs.TabPane tab={`${user.pollCount} Polls`} key="1">
                  <PollList username={username} type="USER_CREATED_POLLS" />
                </Tabs.TabPane>
                <Tabs.TabPane tab={`${user.voteCount} Votes`} key="2">
                  <PollList username={username} type="USER_VOTED_POLLS" />
                </Tabs.TabPane>
              </Tabs>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default Profile;
