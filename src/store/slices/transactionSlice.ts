import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface Transaction {
  id: number;
  userId: number;
  packageId: number;
  date: string;
  status: string;
  total: number;
}

interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  transactions: [],
  loading: false,
  error: null,
};

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    fetchTransactionsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTransactionsSuccess: (state, action: PayloadAction<Transaction[]>) => {
      state.loading = false;
      state.transactions = action.payload;
      state.error = null;
    },
    fetchTransactionsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    createTransactionStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createTransactionSuccess: (state, action: PayloadAction<Transaction>) => {
      state.loading = false;
      state.transactions.push(action.payload);
      state.error = null;
    },
    createTransactionFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchTransactionsStart,
  fetchTransactionsSuccess,
  fetchTransactionsFailure,
  createTransactionStart,
  createTransactionSuccess,
  createTransactionFailure,
} = transactionSlice.actions;

export default transactionSlice.reducer;
