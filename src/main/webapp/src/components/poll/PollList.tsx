import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';

import { Button, Icon, notification } from 'antd';
import { AxiosResponse } from 'axios';
import { LoadingIndicator } from 'components/common';
import { IPollResponse } from 'payload';
import { castVote, getAllPolls, getUserCreatedPolls, getUserVotedPolls } from 'utils/APIUtils';

import { POLL_LIST_SIZE } from '../../constants';
import Poll from './Poll';

import './PollList.less';

export interface IPollListProps extends RouteComponentProps {
  username?: string;
  type?: undefined | 'USER_CREATED_POLLS' | 'USER_VOTED_POLLS';
  isAuthenticated?: boolean;
  handleLogout?(): void;
}

export interface IPollListState {
  polls: IPollResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  currentVotes: number[];
  isLoading: boolean;
}

class PollList extends React.Component<IPollListProps, IPollListState> {
  public readonly state: IPollListState = {
    polls: [],
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    last: true,
    currentVotes: [],
    isLoading: false
  };

  public componentDidMount(): void {
    this.loadPollList();
  }

  public componentDidUpdate(prevProps: IPollListProps, _: IPollListState) {
    if (this.props.isAuthenticated !== prevProps.isAuthenticated) {
      // Reset State
      this.setState({
        polls: [],
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        last: true,
        currentVotes: [],
        isLoading: false
      });
      this.loadPollList();
    }
  }

  private loadPollList = async (page = 0, size = POLL_LIST_SIZE) => {
    const { username, type } = this.props;

    let promise: Promise<AxiosResponse<any>> | undefined;
    if (username) {
      if (type === 'USER_CREATED_POLLS') {
        promise = getUserCreatedPolls(username, page, size);
      } else if (type === 'USER_VOTED_POLLS') {
        promise = getUserVotedPolls(username, page, size);
      }
    } else {
      promise = getAllPolls(page, size);
    }
    if (!promise) {
      return;
    }

    this.setState({
      isLoading: true
    });

    try {
      const res = await promise;
      const polls = this.state.polls.slice();
      const currentVotes = this.state.currentVotes.slice();

      this.setState({
        polls: polls.concat(res.data.content),
        page: res.data.page,
        size: res.data.size,
        totalElements: res.data.totalElements,
        totalPages: res.data.totalPages,
        last: res.data.last,
        currentVotes: currentVotes.concat(
          Array(res.data.content.length).fill(null)
        ),
        isLoading: false
      });
    } catch (error) {
      this.setState({
        isLoading: false
      });
    }
  };

  public handleLoadMore() {
    this.loadPollList(this.state.page + 1);
  }

  public handleVoteChange(event: any, pollIndex: number) {
    const currentVotes = this.state.currentVotes.slice();
    currentVotes[pollIndex] = event.target.value;
    this.setState({
      currentVotes
    });
  }

  public async handleVoteSubmit(event: any, pollIndex: number) {
    event.preventDefault();
    if (!this.props.isAuthenticated) {
      this.props.history.push('/login');
      notification.info({
        message: 'Polling App',
        description: 'Please login to vote.'
      });
      return;
    }

    const poll = this.state.polls[pollIndex];
    const selectedChoice = this.state.currentVotes[pollIndex];

    const voteData = {
      pollId: poll.id,
      choiceId: selectedChoice
    };

    try {
      const res = await castVote(voteData);
      const polls = this.state.polls.slice();
      polls[pollIndex] = res.data;
      this.setState({ polls });
    } catch (error) {
      if (error.response.status === 401) {
        this.props.handleLogout
          ? this.props.handleLogout()
          : console.log('error');
      } else {
        notification.error({
          message: 'Polling App',
          description: '에러가 발생했습니다'
        });
      }
    }
  }

  public render(): React.ReactNode {
    const { polls, currentVotes, isLoading, last } = this.state;
    const pollViews: React.ReactNode[] = [];
    polls.forEach((poll, pollIndex) => {
      pollViews.push(
        <Poll
          key={poll.id}
          poll={poll}
          currentVote={currentVotes[pollIndex]}
          handleVoteChange={(event: any) =>
            this.handleVoteChange(event, pollIndex)
          }
          handleVoteSubmit={(event: any) =>
            this.handleVoteSubmit(event, pollIndex)
          }
        />
      );
    });

    return (
      <div className="polls-container">
        {pollViews}
        {!isLoading && polls.length === 0 ? (
          <div className="no-polls-found">
            <span>No Polls Found.</span>
          </div>
        ) : null}
        {!isLoading && !last ? (
          <div className="load-more-polls">
            <Button
              type="dashed"
              onClick={this.handleLoadMore}
              disabled={isLoading}
            >
              <Icon type="plus" /> Load more
            </Button>
          </div>
        ) : null}
        {isLoading ? <LoadingIndicator /> : null}
      </div>
    );
  }
}

export default withRouter(PollList);
