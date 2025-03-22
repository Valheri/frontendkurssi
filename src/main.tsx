import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import About from './About.tsx';
import App from './App.tsx';
import Contact from './Contact.tsx';
import Home from './Home.tsx';
import './index.css';
//https://frontendprogramming.onrender.com/docs/3rdpartycomponents/router
const router = createBrowserRouter([  // Import components that are used in routes
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true, // This makes it the default route for "/"
        element: <Navigate to="/home" replace />, // Redirect to "/home"
      },
      {
        path: "home",
        element: <Home />,

      },
      {
        path: "about",                // path can be defined relative to the parent path
        element: <About />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
