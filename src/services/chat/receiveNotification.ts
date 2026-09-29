import { api } from '../api';

export type NotificationSenderData = {
  chatId?: string;
  chatName?: string;
  sender?: string;
  senderName?: string;
  senderContactName?: string;
  senderPhoneNumber?: number;
};

export type NotificationMessageData = {
  typeMessage?: string;
  textMessageData?: {
    textMessage?: string;
  };
  extendedTextMessageData?: {
    text?: string;
  };
};

export type NotificationBody = {
  typeWebhook?: string;
  timestamp?: number;
  idMessage?: string;
  senderData?: NotificationSenderData;
  messageData?: NotificationMessageData;
};

export type ReceiveNotificationParams = {
  idInstance: string;
  apiTokenInstance: string;
  receiveTimeout?: number;
  signal?: AbortSignal;
};

export type ReceiveNotificationResponse = {
  receiptId: number;
  body: NotificationBody;
} | null;

export const receiveNotification = async ({
  idInstance,
  apiTokenInstance,
  receiveTimeout = 5,
  signal,
}: ReceiveNotificationParams): Promise<ReceiveNotificationResponse> => {
  const url = `/waInstance${idInstance}/receiveNotification/${apiTokenInstance}?receiveTimeout=${receiveTimeout}`;

  return api.get<ReceiveNotificationResponse>(url, signal);
};
