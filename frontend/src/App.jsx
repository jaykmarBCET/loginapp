import { RouterProvider, createBrowserRouter, json } from 'react-router-dom';
import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DashboardEdit from './components/DashBoardEdit';
import Navigation from './components/Navigation';
import { AppContext } from './context/AppProvider';
import { useContext, useEffect } from 'react';
import { currentUser, refreshToken } from './api/user.routes';

function App() {
  const { user, setUser } = useContext(AppContext);
  
  const router = createBrowserRouter([
    {
      path: '/',
      element: <>
        <Navigation />
        {user.email ? <Dashboard /> : <Login />}
      </>,
    },
    {
      path: '/register',
      element: <>
        <Navigation />
        <Register />
      </>,
    },
    {
      path: '/dashboard',
      element: <>
        <Navigation />
        <Dashboard />
      </>,
    },
    {
      path: '/login',
      element: <>
        <Navigation />
        <Login />
      </>,
    },
    {
      path:'/edit-profile',
      element: <>
      <Navigation />
      <DashboardEdit />
      </>
    }
  ]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await currentUser();
        if(!data?.data?.email){
          const response  = await refreshToken();
          console.log(response);
          if(!response?.data){
             setUser(await  currentUser());
          }
        }
        else{
          setUser(data.data)
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        
      }
    };
    getUser();
  }, []); 
  
  return (
    <RouterProvider router={router} />
  );
}

export default App;
