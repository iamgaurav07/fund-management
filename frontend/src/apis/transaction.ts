// Get all transactions
export const getTransactions = () => ({
  url: "/transactions",
  method: "GET",
});

// Get transactions by fund ID
export const getTransactionsByFundId = (fundId: string) => ({
  url: `/transactions/fund/${fundId}`,
  method: "GET",
});

// Get transaction summary for a fund
export const getTransactionSummary = (fundId: string) => ({
  url: `/transactions/fund/${fundId}/summary`,
  method: "GET",
});

// Get transactions by date range
export const getTransactionsByDateRange = (fundId: string, startDate: string, endDate: string) => ({
  url: `/transactions/fund/${fundId}/date-range`,
  method: "GET",
  params: { startDate, endDate },
});

// Get single transaction by ID
export const getTransactionById = (id: string) => ({
  url: `/transactions/${id}`,
  method: "GET",
});

// Create new transaction
export const createTransaction = () => ({
  url: "/transactions",
  method: "POST",
});

// Update transaction
export const updateTransaction = (id: string) => ({
  url: `/transactions/${id}`,
  method: "PUT",
});

// Delete transaction
export const deleteTransaction = (id: string) => ({
  url: `/transactions/${id}`,
  method: "DELETE",
});

// Export all as an object for easy import
export const transactionApi = {
  getTransactions,
  getTransactionsByFundId,
  getTransactionSummary,
  getTransactionsByDateRange,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};