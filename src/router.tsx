import { createBrowserRouter } from 'react-router-dom';
import Layout from './layouts/Layout';
import BottomLayout from './layouts/BottomLayout';
import Login from './pages/Login';
import ErrorPage from './pages/ErrorPage';
import TodoApp from './pages/TodoApp';
import AddTimer from './pages/AddTimer';
import TimerDetail from './pages/TimerDetail';
import Setting from './pages/Setting';
import CountDown from './pages/CountDown';
import TimerApp from './pages/Home';
import AdhdTestPage from './pages/AdhdEventPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <TimerApp />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'todo',
        element: <TodoApp />,
      },
      {
        path: 'addTimer',
        element: <AddTimer />,
      },
      {
        path: 'setting',
        element: <Setting />,
      },
      {
        path: 'countdown/:timerId',
        element: <CountDown />,
      },
      {
        path: 'timer/:timerId/detail',
        element: <TimerDetail />,
      },
      {
        path: 'adhd',
        element: <AdhdTestPage />,
      },
      {
        element: <BottomLayout />,
        children: [],
      },
    ],
  },
]);
