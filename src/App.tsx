import React from 'react'
import './App.css'
import { createBrowserRouter, createRoutesFromElements, Link, Outlet, Route, RouterProvider } from 'react-router-dom'

const PageA = React.lazy(() => import("@/PageA"));
const PageB = React.lazy(() => import("@/PageB"));
const PageC = React.lazy(() => import("@/PageC"));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<><nav>
      <div className="menu">
        <Link to="/PageA">PageA</Link>
        <Link to="/PageB">PageB</Link>
        <Link to="/PageC">PageC</Link>
      </div>
    </nav>
  <Outlet /></>}>
      <Route path="PageA" element={<PageA />} />
      <Route path="PageB" element={<PageB />} />
      <Route path="PageC" element={<PageC />} />
    </Route>
  )
)

function App() {
  return (
    <>
      <React.Suspense fallback={<div>Loading...</div>}>
        <RouterProvider router={router}/>
      </React.Suspense>
    </>
  )
}

export default App
