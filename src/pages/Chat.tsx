import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useRootContext } from "../context/RootContext";
import {
  POLLING_EMPTY_INTERVAL_MS,
  POLLING_ERROR_RETRY_MS,
} from "../constants";
import {
  deleteNotification,
  receiveNotification,
  sendMessage,
  type NotificationBody,
} from "../services/chat";

type ChatMessage = {
  id: string;
  text: string;
  direction: "incoming" | "outgoing";
  timestamp: number;
};

const getNotificationText = (body: NotificationBody): string | null => {
  const text =
    body.messageData?.textMessageData?.textMessage ??
    body.messageData?.extendedTextMessageData?.text;

  return text?.trim() ? text : null;
};

const Chat = () => {
  const navigate = useNavigate();
  const { idInstance, apiTokenInstance, chatId, logout } = useRootContext();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const seenIdsRef = useRef(new Set<string>());

  const appendMessage = useCallback((next: ChatMessage) => {
    if (seenIdsRef.current.has(next.id)) {
      return;
    }

    seenIdsRef.current.add(next.id);
    setMessages((prev) => [...prev, next]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!chatId) {
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    const processNotification = (body: NotificationBody) => {
      const notificationChatId = body.senderData?.chatId;
      const text = getNotificationText(body);
      const isCurrentChat = notificationChatId === chatId;
      const isIncoming = body.typeWebhook === "incomingMessageReceived";
      const isOutgoing =
        body.typeWebhook === "outgoingAPIMessageReceived" ||
        body.typeWebhook === "outgoingMessageReceived";

      if (
        isCurrentChat &&
        text &&
        body.idMessage &&
        (isIncoming || isOutgoing)
      ) {
        setError("");
        appendMessage({
          id: body.idMessage,
          text,
          direction: isIncoming ? "incoming" : "outgoing",
          timestamp: body.timestamp ?? Date.now() / 1000,
        });
      }
    };

    const runPollIteration = async () => {
      const notification = await receiveNotification({
        idInstance,
        apiTokenInstance,
        receiveTimeout: 5,
        signal: controller.signal,
      });

      if (!notification) {
        await new Promise((resolve) =>
          setTimeout(resolve, POLLING_EMPTY_INTERVAL_MS),
        );
        return;
      }

      const { receiptId, body } = notification;
      processNotification(body);
      await deleteNotification({
        idInstance,
        apiTokenInstance,
        receiptId,
        signal: controller.signal,
      });
    };

    const poll = async () => {
      while (!cancelled) {
        try {
          await runPollIteration();
        } catch (err) {
          if (controller.signal.aborted || cancelled) {
            break;
          }

          setError(
            err instanceof Error
              ? err.message
              : "Не удалось получить уведомления",
          );
          await new Promise((resolve) =>
            setTimeout(resolve, POLLING_ERROR_RETRY_MS),
          );
        }
      }
    };

    void poll();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [idInstance, apiTokenInstance, chatId, appendMessage]);

  if (!chatId) {
    return <Navigate to="/create-chat" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const text = message.trim();
    if (!text || isSending) {
      return;
    }

    setError("");
    setIsSending(true);

    try {
      const result = await sendMessage({
        idInstance,
        apiTokenInstance,
        chatId,
        message: text,
      });

      appendMessage({
        id: result.idMessage,
        text,
        direction: "outgoing",
        timestamp: Date.now() / 1000,
      });
      setMessage("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Не удалось отправить сообщение",
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_top,#e8f8ee_0%,#f4f7f5_45%,#eef2f0_100%)]">
      <header className="flex items-center justify-between border-b border-white/70 bg-white/80 px-4 py-4 backdrop-blur sm:px-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Chat</h1>
          <p className="mt-0.5 text-xs text-slate-500">{chatId}</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
        >
          Выйти
        </button>
      </header>

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-3 px-4 py-6 sm:px-6">
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="m-auto text-sm text-slate-400">Пока нет сообщений</p>
          ) : (
            messages.map((item) => (
              <div
                key={item.id}
                className={`flex ${item.direction === "outgoing" ? "justify-end" : "justify-start"}`}
              >
                <p
                  className={`max-w-[80%] rounded-3xl px-4 py-3 text-sm leading-relaxed ${
                    item.direction === "outgoing"
                      ? "bg-emerald-500 text-white"
                      : "bg-white/90 text-slate-800 border border-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
                  }`}
                >
                  {item.text}
                </p>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {error ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <form
          onSubmit={handleSubmit}
          className="flex gap-3 rounded-3xl border border-white bg-white/90 p-3 shadow-[0_16px_40px_rgba(16,185,129,0.12)] backdrop-blur"
        >
          <input
            type="text"
            name="message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Введите сообщение"
            className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            autoComplete="off"
            disabled={isSending}
          />
          <button
            type="submit"
            className="rounded-full bg-emerald-500 px-5 py-3 font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!message.trim() || isSending}
          >
            {isSending ? "…" : "Отправить"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default Chat;
