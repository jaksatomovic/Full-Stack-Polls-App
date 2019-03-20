import * as React from 'react';
import { Link } from 'react-router-dom';

import { Avatar, Button, Radio } from 'antd';
import { IPollResponse } from 'payload';
import { getAvatarColor } from 'utils/Colors';
import { formatDateTime } from 'utils/Helpers';

import CompletedOrVotedPollChoice from './CompletedOrVotedPollChoice';

import './Poll.less';

export interface IChoice {
  id: number;
  voteCount: number;
  text: string;
}

export interface IPollProps {
  poll: IPollResponse;
  currentVote: number;
  handleVoteChange(event: any): void;
  handleVoteSubmit(event: any): void;
}

const Poll: React.SFC<IPollProps> = ({
  poll,
  currentVote,
  handleVoteChange,
  handleVoteSubmit
}) => {
  const calculatePercentage = (choice: any) => {
    if (poll.totalVotes === 0) {
      return 0;
    }
    return (choice.voteCount * 100) / poll.totalVotes;
  };

  const isSelected = (choice: IChoice) => {
    return poll.selectedChoice === choice.id;
  };

  const getWinningChoice = () => {
    return poll.choices.reduce(
      (prevChoice: any, currentChoice: any) =>
        currentChoice.voteCount > prevChoice.voteCount
          ? currentChoice
          : prevChoice,
      { voteCount: -Infinity }
    );
  };

  const getTimeRemaining = (pollData: IPollResponse) => {
    const expirationTime = new Date(pollData.expirationDateTime).getTime();
    const currentTime = new Date().getTime();
    const diff = expirationTime - currentTime;
    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    let timeRemaining;
    if (days > 0) {
      timeRemaining = days + ' days left';
    } else if (hours > 0) {
      timeRemaining = hours + ' hours left';
    } else if (minutes > 0) {
      timeRemaining = minutes + ' minutes left';
    } else if (seconds > 0) {
      timeRemaining = seconds + ' seconds left';
    } else {
      timeRemaining = 'less than a second left';
    }

    return timeRemaining;
  };

  const pollChoices: React.ReactNode[] = [];
  if (poll.selectedChoice || poll.expired) {
    const winningChoice = poll.expired ? getWinningChoice() : null;

    poll.choices.forEach((choice: any) => {
      pollChoices.push(
        <CompletedOrVotedPollChoice
          key={choice.id}
          choice={choice}
          isWinner={winningChoice && choice.id === winningChoice.id}
          isSelected={isSelected(choice)}
          percentVote={calculatePercentage(choice)}
        />
      );
    });
  } else {
    poll.choices.forEach((choice: any) => {
      pollChoices.push(
        <Radio className="poll-choice-radio" key={choice.id} value={choice.id}>
          {choice.text}
        </Radio>
      );
    });
  }

  return (
    <div className="poll-content">
      <div className="poll-header">
        <div className="poll-creator-info">
          <Link
            className="creator-link"
            to={`/users/${poll.createdBy.username}`}
          >
            <Avatar
              className="poll-creator-avatar"
              style={{
                backgroundColor: getAvatarColor(poll.createdBy.name)
              }}
            >
              {poll.createdBy.name[0].toUpperCase()}
            </Avatar>
            <span className="poll-creator-name">{poll.createdBy.name}</span>
            <span className="poll-creator-username">
              @{poll.createdBy.username}
            </span>
            <span className="poll-creation-date">
              {formatDateTime(poll.creationDateTime)}
            </span>
          </Link>
        </div>
        <div className="poll-question">{poll.question}</div>
      </div>
      <div className="poll-choices">
        <Radio.Group
          className="poll-choice-radio-group"
          onChange={handleVoteChange}
          value={currentVote}
        >
          {pollChoices}
        </Radio.Group>
      </div>
      <div className="poll-footer">
        {!(poll.selectedChoice || poll.expired) ? (
          <Button
            className="vote-button"
            disabled={!currentVote}
            onClick={handleVoteSubmit}
          >
            Vote
          </Button>
        ) : null}
        <span className="total-votes">{poll.totalVotes} votes</span>
        <span className="separator">•</span>
        <span className="time-left">
          {poll.expired ? 'Final results' : getTimeRemaining(poll)}
        </span>
      </div>
    </div>
  );
};

export default Poll;
