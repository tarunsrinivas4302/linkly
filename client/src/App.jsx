import { Suspense, lazy } from 'react';
import './App.css'
import { createBrowserRouter, RouterProvider, } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import NotFound from './pages/NotFound';
import UrlProvider from './context/UrlContext';
import RequireAuth from './components/RequireAuth';
import { CircleLoader } from 'react-spinners';

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
            <Suspense fallback={<CircleLoader />}>
              <LandingPage />
            </Suspense>
          )
        },
        {
          path: '/link',
          element: <RequireAuth>
            <Suspense fallback={<CircleLoader />}>
              <LinkPage />
            </Suspense>
          </RequireAuth>

        }, {
          path: '/dashboard',
          element: (
            <RequireAuth>
              <Suspense fallback={<CircleLoader />}>
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
          <Suspense fallback={<CircleLoader />}>
            <Auth />
          </Suspense>
        )
    },
    {
      path: '/:url',
      element: <RedirectTo />
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
