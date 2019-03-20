import { FormItemProps } from 'antd/lib/form';

// common
export interface ILoginRequest {
  usernameOrEmail: string;
  password: string;
}
export interface ISignupReqeust {
  name: string;
  email: string;
  username: string;
  password: string;
}
export interface ICurrentUserResponse {
  id: number;
  username: string;
  name: string;
}
export interface IUserProfileResponse extends ICurrentUserResponse {
  joinedAt: string;
  pollCount: number;
  voteCount: number;
}

// polls
export interface ICustomFormData {
  errorMsg?: string | undefined | null;
  validateStatus?: FormItemProps['validateStatus'];
}
export interface IQuestion extends ICustomFormData {
  text: string;
}
export interface IChoice extends ICustomFormData {
  text: string;
}
export interface ICreatePollRequest {
  question: string;
  choices: Array<{ text: string }>;
  pollLength: { days: number; hours: number };
}
export interface IPollResponse {
  id: number;
  question: string;
  choices: IChoice[];
  createdBy: IUserSummary;
  creationDateTime: string;
  expirationDateTime: string;
  totalVotes: number;
  expired: boolean;
  selectedChoice?: number;
}
export interface IChoiceReponse {
  id: number;
  text: string;
  voteCount: number;
}
export interface IUserSummary {
  id: number;
  username: string;
  name: string;
}
