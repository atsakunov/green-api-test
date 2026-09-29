import { api } from '../api';

type CheckAccountBaseParams = {
  idInstance: string;
  apiTokenInstance: string;
  force?: boolean;
};

export type CheckAccountParams = CheckAccountBaseParams &
  (
    | { phoneNumber: number | string; username?: never }
    | { username: string; phoneNumber?: never }
  );

export type CheckAccountResponse = {
  exist?: boolean;
  chatId?: string;
  username?: string;
  phoneNumber?: number;
  fromCache?: boolean;
  status?: boolean;
  reason?: string;
  data?: {
    status?: string;
    reason?: string;
    retryAfter?: number;
  };
};

export const checkAccount = async ({
  idInstance,
  apiTokenInstance,
  phoneNumber,
  username,
  force,
}: CheckAccountParams): Promise<CheckAccountResponse> => {
  const url = `/waInstance${idInstance}/checkAccount/${apiTokenInstance}`;

  const body: {
    phoneNumber?: number;
    username?: string;
    force?: boolean;
  } = {};

  if (phoneNumber !== undefined) {
    body.phoneNumber = Number(phoneNumber);
  }

  if (username !== undefined) {
    body.username = username.startsWith('@') ? username : `@${username}`;
  }

  if (force !== undefined) {
    body.force = force;
  }

  return api.post<CheckAccountResponse>(url, body);
};
