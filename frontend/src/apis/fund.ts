export const getFunds = () => ({
  url: "/funds",
  method: "GET",
});

// Get funds with filters
export const getFundsWithFilters = () => ({
  url: "/funds/filter",
  method: "GET",
});

// Get single fund by ID
export const getFundById = (id: string) => ({
  url: `/funds/${id}`,
  method: "GET",
});

// Create new fund
export const createFund = () => ({
  url: "/funds",
  method: "POST",
});

// Update fund
export const updateFund = (id: string) => ({
  url: `/funds/${id}`,
  method: "PUT",
});

// Delete fund
export const deleteFund = (id: string) => ({
  url: `/funds/${id}`,
  method: "DELETE",
});