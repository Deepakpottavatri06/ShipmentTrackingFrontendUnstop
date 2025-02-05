import { configureStore } from '@reduxjs/toolkit';
import shipmentReducer from './shipmentSlice';

export const store = configureStore({
  reducer: {
    shipments: shipmentReducer,
  },
});
