import { api } from '../api';

export type SendMessageParams = {
  idInstance: string;
  apiTokenInstance: string;
  chatId: string;
  message: string;
  typingTime?: number;
  quotedMessageId?: string;
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
}: SendMessageParams): Promise<SendMessageResponse> => {
  const url = `/waInstance${idInstance}/sendMessage/${apiTokenInstance}`;

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

  return api.post<SendMessageResponse>(url, body);
};
