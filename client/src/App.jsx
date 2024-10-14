import { Suspense, lazy } from 'react';
import './App.css'
import { createBrowserRouter, RouterProvider, } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import NotFound from './pages/NotFound';
import UrlProvider from './context/UrlContext';
import RequireAuth from './components/RequireAuth';
import { BarLoader } from 'react-spinners';

const LandingPage = lazy(() => import('./pages/landing-page'));
const Dashboard = lazy(() => import('./pages/dashboard'));
const Auth = lazy(() => import('./pages/auth'));
const LinkPage = lazy(() => import('./pages/link-page'));
const RedirectTo = lazy(() => import('./pages/redirect-link'));



function App() {

  const router = createBrowserRouter([
    {
      element: <MainLayout />,
      children: [
        {
          path: '/',
          element: (
            <Suspense fallback={<BarLoader className="w-full h-full " />}>
              <LandingPage />
            </Suspense>
          )
        },
        {
          path: '/link',
          element: <RequireAuth>
            <Suspense fallback={<BarLoader className="w-full h-full" />}>
              <LinkPage />
            </Suspense>
          </RequireAuth>

        }, {
          path: '/dashboard',
          element: (
            <RequireAuth>
              <Suspense fallback={<BarLoader className="w-full h-full" />}>
                <Dashboard />
              </Suspense>
            </RequireAuth>
          )
        },

        {
          path: '*',
          element: <NotFound />
        }
      ]
    },
    {
      path: '/auth',
      element:
        (
          <Suspense fallback={<BarLoader className="w-full h-full" />}>
            <Auth />
          </Suspense>
        )
    },
    {
      path: '/:url',
      element: (
        <Suspense fallback={<BarLoader className="w-full h-full" />}>
          <RedirectTo />
        </Suspense>
      )
    },
  ])


  return (
    <>
      <UrlProvider>
        <RouterProvider router={router} />
      </UrlProvider>
    </>
  )

}

export default App
