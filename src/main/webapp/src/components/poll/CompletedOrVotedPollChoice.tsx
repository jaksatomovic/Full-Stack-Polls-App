import * as React from 'react';

import { Icon } from 'antd';



export interface ICompletedOrVotedPollChoiceProps {
  percentVote: number;
  choice: any;
  isSelected: boolean;
  isWinner: boolean;
}

const CompletedOrVotedPollChoice: React.SFC<
  ICompletedOrVotedPollChoiceProps
> = ({ percentVote, choice, isSelected, isWinner }) => {
  return (
    <div className="cv-poll-choice">
      <span className="cv-poll-choice-details">
        <span className="cv-choice-percentage">
          {Math.round(percentVote * 100) / 100}%
        </span>
        <span className="cv-choice-text">{choice.text}</span>
        {isSelected ? (
          <Icon className="selected-choice-icon" type="check-circle-o" />
        ) : null}
      </span>
      <span
        className={
          isWinner
            ? 'cv-choice-percent-chart winner'
            : 'cv-choice-percent-chart'
        }
        style={{ width: percentVote + '%' }}
      />
    </div>
  );
};

export default CompletedOrVotedPollChoice;
