import * as React from 'react';
import { RouteProps } from 'react-router';
import { Redirect, Route } from 'react-router-dom';

export interface IPrivateRouteProps extends RouteProps {
  component: React.ComponentType<any>;
  authenticated: boolean;
  handleLogout(): void;
}

const PrivateRoute: React.SFC<IPrivateRouteProps> = ({
  component: Component,
  authenticated,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={props =>
        authenticated ? (
          <Component {...rest} {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
