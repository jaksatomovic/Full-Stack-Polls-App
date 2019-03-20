import * as React from 'react';

import { Form, Icon, Input } from 'antd';
import { IChoice } from 'payload';


export interface IPollChoice {
  choiceNumber: number;
  choice: IChoice;
  removeChoice(choiceNumber: number): void;
  handleChoiceChange(
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ): void;
}

const PollChoice: React.SFC<IPollChoice> = ({
  choice,
  choiceNumber,
  handleChoiceChange,
  removeChoice
}) => {
  return (
    <Form.Item
      validateStatus={choice.validateStatus}
      help={choice.errorMsg}
      className="poll-form-row"
    >
      <Input
        placeholder={'Choice ' + (choiceNumber + 1)}
        size="large"
        value={choice.text}
        className={choiceNumber > 1 ? 'optional-choice' : undefined}
        onChange={event => handleChoiceChange(event, choiceNumber)}
      />
      {choiceNumber > 1 ? (
        <Icon
          className="dynamic-delete-button"
          type="close"
          onClick={() => removeChoice(choiceNumber)}
        />
      ) : null}
    </Form.Item>
  );
};

export default PollChoice;
