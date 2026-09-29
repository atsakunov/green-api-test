import { FormEvent, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useRootContext } from '../context/RootContext';
import { checkAccount } from '../services/chat';

const CreateChat = () => {
  const navigate = useNavigate();
  const { idInstance, apiTokenInstance, chatId, setChatId, logout } =
    useRootContext();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (chatId) {
    return <Navigate to="/chat" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const normalizedPhone = phoneNumber.replace(/\D/g, '');
    if (!normalizedPhone) {
      setError('Введите номер телефона');
      return;
    }

    setIsLoading(true);

    try {
      const account = await checkAccount({
        idInstance,
        apiTokenInstance,
        phoneNumber: normalizedPhone,
      });

      if (account.status === false) {
        setError(account.reason || 'Инстанс не авторизован');
        return;
      }

      if (!account.exist || !account.chatId) {
        setError('Аккаунт Telegram на этом номере не найден');
        return;
      }

      setChatId(account.chatId);
      navigate('/chat');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось создать чат');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_top,#e8f8ee_0%,#f4f7f5_45%,#eef2f0_100%)]">
      <header className="flex items-center justify-between border-b border-white/70 bg-white/80 px-4 py-4 backdrop-blur sm:px-6">
        <h1 className="text-xl font-semibold text-slate-900">Новый чат</h1>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
        >
          Выйти
        </button>
      </header>

      <div className="flex flex-1 items-center justify-center px-4 py-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[420px] flex flex-col gap-6 rounded-3xl bg-white/90 backdrop-blur p-8 sm:p-10 shadow-[0_20px_60px_rgba(16,185,129,0.12)] border border-white"
        >
          <div className="text-center">
            <p className="text-sm font-medium tracking-wide text-emerald-600 uppercase">
              GREEN-API
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              Создать чат
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Введите номер телефона собеседника
            </p>
          </div>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Номер телефона
            <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 transition focus-within:border-emerald-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-100">
              <span className="select-none pl-4 pr-2 text-slate-500">+375</span>
              <input
                type="tel"
                name="phoneNumber"
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                placeholder="291234567"
                className="min-w-0 flex-1 rounded-2xl bg-transparent py-3.5 pr-4 text-slate-900 outline-none placeholder:text-slate-400"
                autoComplete="tel"
                required
                disabled={isLoading}
              />
            </div>
          </label>

          {error ? (
            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isLoading || !phoneNumber.trim()}
            className="rounded-full bg-emerald-500 px-4 py-3.5 font-semibold text-white shadow-[0_10px_24px_rgba(16,185,129,0.35)] transition hover:bg-emerald-600 hover:shadow-[0_12px_28px_rgba(16,185,129,0.45)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          >
            {isLoading ? 'Проверяем номер…' : 'Создать'}
          </button>
        </form>
      </div>
    </main>
  );
}

export default CreateChat;
