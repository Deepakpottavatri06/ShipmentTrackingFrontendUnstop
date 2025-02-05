import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addShipment } from '../redux/shipmentSlice';

export default function AddShipment() {
  const dispatch = useDispatch();

  // State for each form field
  const [shipmentId, setShipmentId] = useState('');
  const [containerId, setContainerId] = useState('');
  const [route, setRoute] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [currentETA, setCurrentETA] = useState('');
  const [status, setStatus] = useState('Pending');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newShipment = {
      shipmentId,
      containerId,
      route: route.split(','), 
      currentLocation,
      currentETA: new Date(currentETA),
      status,
    };

    try {
      const response = await axios.post('http://localhost:4000/shipment', newShipment);
      const data = response.data;
      data.currentETA = data.currentETA.split("T")[0];
      dispatch(addShipment(data));
      alert('Shipment added successfully!');
    } catch (error) {
      console.error('Error adding shipment:', error);
      alert('Failed to add shipment');
    }
  };

  return (
    <div>
      <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Add Shipment
      </button>

      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">New Shipment</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="shipment-id" className="col-form-label">Shipment ID:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="shipment-id"
                    value={shipmentId}
                    onChange={(e) => setShipmentId(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="container-id" className="col-form-label">Container ID:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="container-id"
                    value={containerId}
                    onChange={(e) => setContainerId(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="route" className="col-form-label">Route (comma separated):</label>
                  <input
                    type="text"
                    className="form-control"
                    id="route"
                    value={route}
                    onChange={(e) => setRoute(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="current-location" className="col-form-label">Current Location:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="current-location"
                    value={currentLocation}
                    onChange={(e) => setCurrentLocation(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="current-eta" className="col-form-label">Current ETA:</label>
                  <input
                    type="date"
                    className="form-control"
                    id="current-eta"
                    value={currentETA}
                    onChange={(e) => setCurrentETA(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="status" className="col-form-label">Status:</label>
                  <select
                    className="form-select"
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                  >
                    <option value="In Transit">In Transit</option>
                    <option value="Arrived">Arrived</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="submit" className="btn btn-primary">Add Shipment</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
