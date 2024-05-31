import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import { ErrorPage } from './pages/ErrorPage';
import { Locations } from './pages/Locations';
import { Logements } from './pages/Logements';
import { Transactions } from './pages/Transactions';
import { Visites } from './pages/Vistes';
import {AddHouse} from "./pages/AddHouse";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Logements />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/my-bookings",
    element: <Locations />,
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
    path: "/my-houses",
    element: <Visites />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/add-house",
    element: <AddHouse />,
    errorElement: <ErrorPage />,
  },

]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    {/* <App /> */}
  </React.StrictMode>,
)
