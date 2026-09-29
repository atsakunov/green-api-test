import { api } from '../api';

export type DeleteNotificationParams = {
  idInstance: string;
  apiTokenInstance: string;
  receiptId: number;
  signal?: AbortSignal;
};

export type DeleteNotificationResponse = {
  result: boolean;
  reason?: string;
};

export const deleteNotification = async ({
  idInstance,
  apiTokenInstance,
  receiptId,
  signal,
}: DeleteNotificationParams): Promise<DeleteNotificationResponse> => {
  const url = `/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`;

  return api.delete<DeleteNotificationResponse>(url, signal);
};
