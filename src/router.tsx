import { createBrowserRouter } from 'react-router-dom';
import Layout from './layouts/Layout';
import BottomLayout from './layouts/BottomLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import ErrorPage from './pages/ErrorPage';
import TodoApp from './pages/TodoApp';
import AddTimer from './pages/AddTimer';
import TimerDetail from './pages/TimerDetail';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
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
        path: 'timerDetail',
        element: <TimerDetail />,
      },
      {
        element: <BottomLayout />,
        children: [],
      },
    ],
  },
]);
