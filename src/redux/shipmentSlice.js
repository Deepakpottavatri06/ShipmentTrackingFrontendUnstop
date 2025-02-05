import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  shipments: [], // Ensure it's an empty array, not undefined
};

const shipmentSlice = createSlice({
  name: 'shipments',
  initialState,
  reducers: {
    setShipments: (state, action) => {
      state.shipments = action.payload || [];
    },
    addShipment: (state, action) => {
      state.shipments.push(action.payload);
    },
  },
});

export const { setShipments, addShipment } = shipmentSlice.actions;
export default shipmentSlice.reducer;
