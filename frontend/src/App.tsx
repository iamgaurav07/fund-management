import './App.css';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/router';
import AxiosInterceptor from './utils/axios-interceptor';

function App() {
  return (
    <>
      <AxiosInterceptor />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
