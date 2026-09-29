import { DEFAULT_API_URL } from '../../constants';

export type DeleteNotificationParams = {
  idInstance: string;
  apiTokenInstance: string;
  receiptId: number;
  apiUrl?: string;
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
  apiUrl = DEFAULT_API_URL,
  signal,
}: DeleteNotificationParams): Promise<DeleteNotificationResponse> => {
  const url = `${apiUrl}/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`;

  const response = await fetch(url, {
    method: 'DELETE',
    signal,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DeleteNotification failed (${response.status}): ${errorText}`);
  }

  return response.json();
}
