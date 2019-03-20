import * as React from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';

import { Dropdown, Icon, Layout, Menu } from 'antd';
import { ClickParam } from 'antd/lib/menu';
import { ICurrentUserResponse } from 'payload';
import pollIcon from 'poll.svg';

import './AppHeader.less';

export interface IAppHeaderProps extends RouteComponentProps {
  currentUser?: ICurrentUserResponse | null;
  onLogout(): void;
}

class AppHeader extends React.Component<IAppHeaderProps, {}> {
  public render(): React.ReactNode {
    const { currentUser } = this.props;

    let menuItems;
    if (currentUser) {
      menuItems = [
        <Menu.Item key="/">
          <Link to="/">
            <Icon type="home" className="nav-icon" />
          </Link>
        </Menu.Item>,
        <Menu.Item key="/poll/new">
          <Link to="/poll/new">
            <img src={pollIcon} alt="poll" className="poll-icon" />
          </Link>
        </Menu.Item>,
        <Menu.Item key="/profile" className="profile-menu">
          <this.ProfileDropdownMenu
            currentUser={currentUser}
            handleMenuClick={this.handleMenuClick}
          />
        </Menu.Item>
      ];
    } else {
      menuItems = [
        <Menu.Item key="/login">
          <Link to="/login">Login</Link>
        </Menu.Item>,
        <Menu.Item key="/signup">
          <Link to="/signup">Signup</Link>
        </Menu.Item>
      ];
    }

    return (
      <Layout.Header className="app-header">
        <div className="container">
          <div className="app-title">
            <Link to="/">Polling App</Link>
          </div>
          <Menu
            className="app-menu"
            mode="horizontal"
            selectedKeys={[this.props.location.pathname]}
            style={{ lineHeight: '64px' }}
          >
            {menuItems}
          </Menu>
        </div>
      </Layout.Header>
    );
  }

  private ProfileDropdownMenu(props: any) {
    const { currentUser } = props;
    const dropdownMenu = (
      <Menu onClick={props.handleMenuClick} className="profile-dropdown-menu">
        <Menu.Item key="user-info" className="dropdown-item" disabled={true}>
          <div className="user-full-name-info">{currentUser.name}</div>
          <div className="username-info">@{currentUser.username}</div>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="profile" className="dropdown-item">
          <Link to={`/users/${currentUser.username}`}>Profile</Link>
        </Menu.Item>
        <Menu.Item key="logout" className="dropdown-item">
          Logout
        </Menu.Item>
      </Menu>
    );
    return (
      <Dropdown
        overlay={dropdownMenu}
        trigger={['click']}
        getPopupContainer={() =>
          document.getElementsByClassName('profile-menu')[0] as HTMLElement
        }
      >
        <a className="ant-dropdown-link">
          <Icon type="user" className="nav-icon" style={{ marginRight: 0 }} />{' '}
          <Icon type="down" />
        </a>
      </Dropdown>
    );
  }

  private handleMenuClick = ({ key }: ClickParam) => {
    if (key === 'logout') {
      this.props.onLogout();
    }
  };
}

export default withRouter(AppHeader);
