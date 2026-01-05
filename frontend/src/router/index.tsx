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
import ProtectedRoute from '@/components/ProtectedRoute';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/funds">
          <Route index element={<FundsPage />} />
          <Route element={<Layout />}>
            <Route path=":id/dashboard" element={<DashboardPage />} />
            <Route path=":id/transactions" element={<TransactionsPage />} />
            <Route path=":id/investments" element={<InvestmentsPage />} />
          </Route>
        </Route>
      </Route>
    </Route>
  )
);
