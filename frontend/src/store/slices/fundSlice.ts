/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fund } from "../../interfaces/fund";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FundState {
    fundData: Fund[];
}
 
const initialState: FundState = {
    fundData: []
};

const fundSlice = createSlice({
  name: "fundSlice",
  initialState,
  reducers: {
    setFund: (state, action: PayloadAction<any>) => {
        state.fundData = action.payload;
  },}
});

export const { setFund } = fundSlice.actions;
export default fundSlice.reducer;
