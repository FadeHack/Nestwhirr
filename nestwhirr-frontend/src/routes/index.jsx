import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../components/layout/RootLayout';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import Subnest from '../pages/Subnest';
import CreatePost from '../pages/CreatePost';
import Post from '../pages/Post';
import NotFound from '../pages/NotFound';
import SearchResults from '../pages/SearchResults';
import ErrorBoundary from '../components/common/ErrorBoundary';
import ProtectedRoute from '../components/common/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ErrorBoundary>
        <RootLayout />
      </ErrorBoundary>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'n/:subnestName',
        element: <Subnest />,
      },
      {
        path: 'n/:subnestName/post/:postId',
        element: <Post />,
      },
      {
        path: 'submit',
        element: (
          <ProtectedRoute>
            <CreatePost />
          </ProtectedRoute>
        ),
      },
      {
        path: 'user/:username',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: 'search',
        element: <SearchResults />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]); 