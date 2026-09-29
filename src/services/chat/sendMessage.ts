import { DEFAULT_API_URL } from '../../constants';

export type SendMessageParams = {
  idInstance: string;
  apiTokenInstance: string;
  chatId: string;
  message: string;
  typingTime?: number;
  quotedMessageId?: string;
  apiUrl?: string;
};

export type SendMessageResponse = {
  idMessage: string;
};

export const sendMessage = async ({
  idInstance,
  apiTokenInstance,
  chatId,
  message,
  typingTime,
  quotedMessageId,
  apiUrl = DEFAULT_API_URL,
}: SendMessageParams): Promise<SendMessageResponse> => {
  const url = `${apiUrl}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`;

  const body: {
    chatId: string;
    message: string;
    typingTime?: number;
    quotedMessageId?: string;
  } = {
    chatId,
    message,
  };

  if (typingTime !== undefined) {
    body.typingTime = typingTime;
  }

  if (quotedMessageId !== undefined) {
    body.quotedMessageId = quotedMessageId;
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
    throw new Error(`SendMessage failed (${response.status}): ${errorText}`);
  }

  return response.json();
}
