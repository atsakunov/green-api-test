import { FormEvent, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useRootContext } from '../context/RootContext';

const Home = () => {
  const navigate = useNavigate();
  const { login, isAuthorized, chatId } = useRootContext();
  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] = useState('');

  if (isAuthorized) {
    return <Navigate to={chatId ? '/chat' : '/create-chat'} replace />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login(idInstance, apiTokenInstance);
    navigate('/create-chat');
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,#e8f8ee_0%,#f4f7f5_45%,#eef2f0_100%)] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[420px] flex flex-col gap-6 rounded-3xl bg-white/90 backdrop-blur p-8 sm:p-10 shadow-[0_20px_60px_rgba(16,185,129,0.12)] border border-white"
      >
        <div className="text-center">
          <p className="text-sm font-medium tracking-wide text-emerald-600 uppercase">
            GREEN-API
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            Вход
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Введите данные вашего инстанса
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            idInstance
            <input
              type="text"
              name="idInstance"
              value={idInstance}
              onChange={(event) => setIdInstance(event.target.value)}
              placeholder="Например, 1101234567"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              autoComplete="off"
              required
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            apiTokenInstance
            <input
              type="password"
              name="apiTokenInstance"
              value={apiTokenInstance}
              onChange={(event) => setApiTokenInstance(event.target.value)}
              placeholder="Ваш API-токен"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              autoComplete="off"
              required
            />
          </label>
        </div>

        <button
          type="submit"
          className="rounded-full bg-emerald-500 px-4 py-3.5 font-semibold text-white shadow-[0_10px_24px_rgba(16,185,129,0.35)] transition hover:bg-emerald-600 hover:shadow-[0_12px_28px_rgba(16,185,129,0.45)] active:scale-[0.99]"
        >
          Войти
        </button>
      </form>
    </main>
  );
}

export default Home;
