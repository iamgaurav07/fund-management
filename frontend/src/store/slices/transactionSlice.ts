/* eslint-disable @typescript-eslint/no-explicit-any */
import { Transaction } from "../../interfaces/transaction";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TransactionState {
    transactionData: Transaction[];
}
 
const initialState: TransactionState = {
    transactionData: []
};

const transactionSlice = createSlice({
  name: "transactionSlice",
  initialState,
  reducers: {
    setTransaction: (state, action: PayloadAction<any>) => {
        state.transactionData = action.payload;
  },}
});

export const { setTransaction } = transactionSlice.actions;
export default transactionSlice.reducer;
