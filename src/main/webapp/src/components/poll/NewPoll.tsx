import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import { Button, Col, Form, Icon, Input, notification, Select } from 'antd';
import { SelectValue } from 'antd/lib/select';
import { PollChoice } from 'components/poll';
import { IChoice, IQuestion } from 'payload';
import { createPoll } from 'utils/APIUtils';

import { MAX_CHOICES, POLL_CHOICE_MAX_LENGTH, POLL_QUESTION_MAX_LENGTH } from '../../constants';

import './NewPoll.less';

export interface INewPollProps extends RouteComponentProps {
  handleLogout(): void;
}

export interface INewPollState {
  question: IQuestion;
  choices: IChoice[];
  pollLength: { days: number; hours: number };
}

class NewPoll extends React.Component<INewPollProps, INewPollState> {
  public readonly state: INewPollState = {
    question: { text: '' },
    choices: [{ text: '' }, { text: '' }],
    pollLength: { days: 1, hours: 0 }
  };

  private handleQuestionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { value } = event.target;
    this.setState({
      question: {
        text: value,
        ...this.validateQuestion(value)
      }
    });
  };

  private validateQuestion = (questionText: string): Partial<IQuestion> => {
    if (questionText.length === 0) {
      return {
        validateStatus: 'error',
        errorMsg: 'Please enter your question!'
      };
    } else if (questionText.length > POLL_QUESTION_MAX_LENGTH) {
      return {
        validateStatus: 'error',
        errorMsg: `Question is too long (Maximum ${POLL_QUESTION_MAX_LENGTH} characters allowed)`
      };
    } else {
      return {
        validateStatus: 'success',
        errorMsg: null
      };
    }
  };

  private handleChoiceChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const choices = this.state.choices.slice();
    const { value } = event.target;

    choices[index] = {
      text: value,
      ...this.validateChoice(value)
    };

    this.setState({
      choices
    });
  };

  private validateChoice = (choiceText: string): Partial<IChoice> => {
    if (choiceText.length === 0) {
      return {
        validateStatus: 'error',
        errorMsg: 'Please enter a choice!'
      };
    } else if (choiceText.length > POLL_CHOICE_MAX_LENGTH) {
      return {
        validateStatus: 'error',
        errorMsg: `Choice is too long (Maximum ${POLL_CHOICE_MAX_LENGTH} characters allowed)`
      };
    } else {
      return {
        validateStatus: 'success',
        errorMsg: null
      };
    }
  };

  private addChoice = () => {
    const choices = this.state.choices.slice();
    this.setState({
      choices: choices.concat([
        {
          text: ''
        }
      ])
    });
  };

  private removeChoice = (choiceNumber: number) => {
    const choices = this.state.choices.slice();
    this.setState({
      choices: [
        ...choices.slice(0, choiceNumber),
        ...choices.slice(choiceNumber + 1)
      ]
    });
  };

  private handleSubmit = async (event: React.FormEvent<any>) => {
    event.preventDefault();

    const { question, choices, pollLength } = this.state;
    const pollData = {
      question: question.text,
      choices: choices.map(choice => {
        return { text: choice.text };
      }),
      pollLength
    };

    try {
      await createPoll(pollData);
      this.props.history.push('/');
    } catch (error) {
      if (error.response.status === 401) {
        notification.error({
          message: 'Polling App',
          description: '에러가 발생했습니다'
        });
      }
    }
  };

  private handlePollDaysChange = (value: SelectValue) => {
    const pollLength = Object.assign(this.state.pollLength, { days: value });
    this.setState({
      pollLength
    });
  };

  private handlePollHoursChange = (value: SelectValue) => {
    const pollLength = Object.assign(this.state.pollLength, { hours: value });
    this.setState({
      pollLength
    });
  };

  private isFormInvalid = () => {
    const { question, choices } = this.state;

    if (question.validateStatus !== 'success') {
      return true;
    }
    for (const choice of choices) {
      if (choice.validateStatus !== 'success') {
        return true;
      }
    }
    return undefined;
  };

  public render(): React.ReactNode {
    const { choices, pollLength, question } = this.state;

    const choiceViews: React.ReactNode[] = [];
    choices.forEach((choice, index) => {
      choiceViews.push(
        <PollChoice
          key={index}
          choice={choice}
          choiceNumber={index}
          removeChoice={this.removeChoice}
          handleChoiceChange={this.handleChoiceChange}
        />
      );
    });

    return (
      <div className="new-poll-container">
        <h1 className="page-title">Create Poll</h1>
        <div className="new-poll-content">
          <Form onSubmit={this.handleSubmit} className="create-poll-form">
            <Form.Item
              validateStatus={question.validateStatus}
              help={question.errorMsg}
              className="poll-form-row"
            >
              <Input.TextArea
                placeholder="Enter your question"
                style={{ fontSize: '16px' }}
                autosize={{ minRows: 3, maxRows: 6 }}
                name="question"
                value={question.text}
                onChange={this.handleQuestionChange}
              />
            </Form.Item>
            {choiceViews}
            <Form.Item className="poll-form-row">
              <Button
                type="dashed"
                onClick={this.addChoice}
                disabled={choices.length === MAX_CHOICES}
              >
                <Icon type="plus" /> Add a choice
              </Button>
            </Form.Item>
            <Form.Item className="poll-form-row">
              <Col xs={24} sm={4}>
                Poll length:
              </Col>
              <Col xs={24} sm={20}>
                <span style={{ marginRight: '18px' }}>
                  <Select
                    defaultValue="1"
                    onChange={this.handlePollDaysChange}
                    value={pollLength.days}
                    style={{ width: 60 }}
                  >
                    {Array.from(Array(8).keys()).map(i => (
                      <Select.Option key={i}>{i}</Select.Option>
                    ))}
                  </Select>{' '}
                  &nbsp;Days
                </span>
                <span>
                  <Select
                    defaultValue="0"
                    onChange={this.handlePollHoursChange}
                    value={pollLength.hours}
                    style={{ width: 60 }}
                  >
                    {Array.from(Array(24).keys()).map(i => (
                      <Select.Option key={i}>{i}</Select.Option>
                    ))}
                  </Select>{' '}
                  &nbsp;Hours
                </span>
              </Col>
            </Form.Item>
            <Form.Item className="poll-form-row">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                disabled={this.isFormInvalid()}
                className="create-poll-form-button"
              >
                Create Poll
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

export default NewPoll;
