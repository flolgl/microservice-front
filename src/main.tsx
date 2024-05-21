import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import { ErrorPage } from './pages/ErrorPage';
import { Personnes } from './pages/Personnes';
import { Logements } from './pages/Logements';
import { Transactions } from './pages/Transactions';
import { Visites } from './pages/Vistes';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Logements />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/personnes",
    element: <Personnes />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/logements",
    element: <Logements />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/transactions",
    element: <Transactions />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/visites",
    element: <Visites />,
    errorElement: <ErrorPage />,
  },

]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    {/* <App /> */}
  </React.StrictMode>,
)
