import React from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const lazyRoute = <T = any>(
  importFn: () => Promise<T>,
  componentName: keyof T
) => async () => {
  const module = await importFn();
  return { Component: module[componentName] };
};

const router = createBrowserRouter([
  {
    path: "/",
    lazy: lazyRoute(() => import("@/PageA"), "default")
  },
  {
    path: "/PageA",
    lazy: lazyRoute(() => import("@/PageA"), "default")
  },
  {
    path: "/PageB",
    lazy: lazyRoute(() => import("@/PageB"), "default")
  },
  {
    path: "/PageC",
    lazy: lazyRoute(() => import("@/PageC"), "default")
  },
]);

function App() {
  return (
        <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />
  )
}

export default App;
