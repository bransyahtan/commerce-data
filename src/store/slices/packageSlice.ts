import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface Package {
  id: number;
  name: string;
  price: number;
  data: string;
  duration: string;
  description: string;
}

interface PackageState {
  packages: Package[];
  selectedPackage: Package | null;
  loading: boolean;
  error: string | null;
}

const initialState: PackageState = {
  packages: [],
  selectedPackage: null,
  loading: false,
  error: null,
};

const packageSlice = createSlice({
  name: "packages",
  initialState,
  reducers: {
    fetchPackagesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPackagesSuccess: (state, action: PayloadAction<Package[]>) => {
      state.loading = false;
      state.packages = action.payload;
    },
    fetchPackagesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchPackageByIdStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPackageByIdSuccess: (state, action: PayloadAction<Package>) => {
      state.loading = false;
      state.selectedPackage = action.payload;
    },
    fetchPackageByIdFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearSelectedPackage: (state) => {
      state.selectedPackage = null;
    },
    deletePackageStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deletePackageSuccess: (state, action: PayloadAction<number>) => {
      state.loading = false;
      state.packages = state.packages.filter(
        (pkg) => pkg.id !== action.payload
      );
    },
    deletePackageFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchPackagesStart,
  fetchPackagesSuccess,
  fetchPackagesFailure,
  fetchPackageByIdStart,
  fetchPackageByIdSuccess,
  fetchPackageByIdFailure,
  clearSelectedPackage,
  deletePackageStart,
  deletePackageSuccess,
  deletePackageFailure,
} = packageSlice.actions;

export default packageSlice.reducer;
