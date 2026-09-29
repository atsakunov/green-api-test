import { DEFAULT_API_URL } from '../../constants';

type CheckAccountBaseParams = {
  idInstance: string;
  apiTokenInstance: string;
  force?: boolean;
  apiUrl?: string;
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
  apiUrl = DEFAULT_API_URL,
}: CheckAccountParams): Promise<CheckAccountResponse> => {
  const url = `${apiUrl}/waInstance${idInstance}/checkAccount/${apiTokenInstance}`;

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

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`CheckAccount failed (${response.status}): ${errorText}`);
  }

  return response.json();
}
