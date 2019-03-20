import axios from 'axios';
import { ICreatePollRequest, ILoginRequest, ISignupReqeust } from 'payload';

import { ACCESS_TOKEN, API_BASE_URL, POLL_LIST_SIZE } from '../constants';

interface IRequestHeaders {
  'Content-Type': string;
  Authorization?: string;
}

interface IRequestOptions {
  url: string;
  method: 'get' | 'post' | 'put' | 'delete';
  data?: any;
}

const req = axios.create({
  baseURL: API_BASE_URL
});

// res.data.success: boolean or res.status: number
const request = async (options: IRequestOptions) => {
  let headers: IRequestHeaders = { 'Content-Type': 'application/json' };

  const token = localStorage.getItem(ACCESS_TOKEN);
  if (token) {
    headers = { ...headers, Authorization: `Bearer ${token}` };
  }

  try {
    const res = await req({ headers, ...options });
    return res;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const login = (loginRequest: ILoginRequest) => {
  return request({ url: '/auth/signin', method: 'post', data: loginRequest });
};

export const getCurrentUser = () => {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject('액세스 토큰이 없습니다');
  }
  return request({ url: '/user/me', method: 'get' });
};

export const signup = (signupRequest: ISignupReqeust) => {
  return request({ url: '/auth/signup', method: 'post', data: signupRequest });
};

export const checkUsernameAvailability = (username: string) => {
  return request({
    url: `/user/checkUsernameAvailability?username=${username}`,
    method: 'get'
  });
};

export const checkEmailAvailability = (email: string) => {
  return request({
    url: `/user/checkEmailAvailability?email=${email}`,
    method: 'get'
  });
};

export const getUserProfile = (username: string) => {
  return request({ url: `/users/${username}`, method: 'get' });
};

export const createPoll = (pollData: ICreatePollRequest) => {
  return request({ url: '/polls', method: 'post', data: pollData });
};

export const getAllPolls = (page = 0, size = POLL_LIST_SIZE) => {
  return request({ url: `/polls?page=${page}&size=${size}`, method: 'get' });
};

export const getUserCreatedPolls = (
  username: string,
  page = 0,
  size = POLL_LIST_SIZE
) => {
  return request({
    url: `/users/${username}/polls?page=${page}&size=${size}`,
    method: 'get'
  });
};

export const getUserVotedPolls = (
  username: string,
  page = 0,
  size = POLL_LIST_SIZE
) => {
  return request({
    url: `/users/${username}/votes?page=${page}&size=${size}`,
    method: 'get'
  });
};

export const castVote = (voteData: { pollId: number; choiceId: number }) => {
  return request({
    url: `/polls/${voteData.pollId}/votes`,
    method: 'post',
    data: voteData
  });
};
