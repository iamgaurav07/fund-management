import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
} from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import Layout from '../layouts/Layout';
import FundsPage from '../pages/FundsPage';
import TransactionsPage from '../pages/TransactionsPage';
import InvestmentsPage from '../pages/InvestmentsPage';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<LoginPage />} />
      <Route path="/funds" element={<FundsPage />} />
      <Route element={<Layout />}>
        <Route path="/funds/:id/dashboard" element={<DashboardPage />} />
        <Route path="/funds/:id/transactions" element={<TransactionsPage />} />
        <Route path="/funds/:id/investments" element={<InvestmentsPage />} />
      </Route>
    </Route>
  )
);
