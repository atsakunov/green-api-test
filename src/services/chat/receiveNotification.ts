import { DEFAULT_API_URL } from '../../constants';

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
  apiUrl?: string;
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
  apiUrl = DEFAULT_API_URL,
  signal,
}: ReceiveNotificationParams): Promise<ReceiveNotificationResponse> => {
  const url = new URL(
    `${apiUrl}/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`
  );
  url.searchParams.set('receiveTimeout', String(receiveTimeout));

  const response = await fetch(url.toString(), {
    method: 'GET',
    signal,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ReceiveNotification failed (${response.status}): ${errorText}`);
  }

  const text = await response.text();
  if (!text) {
    return null;
  }

  return JSON.parse(text) as ReceiveNotificationResponse;
}
