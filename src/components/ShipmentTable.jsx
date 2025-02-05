import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { setShipments } from '../redux/shipmentSlice';
import axios from 'axios';

export default function ShipmentTable() {
  const dispatch = useDispatch();
  const shipments = useSelector((state) => state.shipments.shipments);

  const [editableShipment, setEditableShipment] = useState(null); 
  const [updatedShipment, setUpdatedShipment] = useState({
    shipmentId: '',
    containerId: '',
    currentLocation: '',
    currentETA: '',
    status: '',
  });

  const fetchShipments = async () => {
    try {
      const res = await axios.get("http://localhost:4000/shipments");
      const data = res.data.map((item) => {
        item.currentETA = item.currentETA.split("T")[0];
        return item;
      });
      dispatch(setShipments(data));
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedShipment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle the update button click
  const handleUpdate = (shipment) => {
    setEditableShipment(shipment._id);
    setUpdatedShipment({
      shipmentId: shipment.shipmentId,
      containerId: shipment.containerId,
      currentLocation: shipment.currentLocation,
      currentETA: shipment.currentETA,
      status: shipment.status,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:4000/shipment/${editableShipment}/update-location`, updatedShipment);
      console.log('Shipment updated:', response.data);
      fetchShipments(); 
      setEditableShipment(null); 
    } catch (error) {
      console.log('Error updating shipment:', error);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, [dispatch]);

  return (
    <div className='table-responsive'>
      <table className='table table-bordered table-hover table-striped table-sm'>
        <thead className='table-dark'>
          <tr>
            <th>Shipment ID</th>
            <th>Container ID</th>
            <th>Current Location</th>
            <th>ETA</th>
            <th>Status</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          {shipments.length > 0 ? (
            shipments.map((shipment) => (
              <tr key={shipment._id}>
                <td>
                  {editableShipment === shipment._id ? (
                    <input
                      type="text"
                      name="shipmentId"
                      value={updatedShipment.shipmentId}
                      onChange={handleChange}
                      className="form-control"
                    />
                  ) : (
                    shipment.shipmentId
                  )}
                </td>
                <td>
                  {editableShipment === shipment._id ? (
                    <input
                      type="text"
                      name="containerId"
                      value={updatedShipment.containerId}
                      onChange={handleChange}
                      className="form-control"
                    />
                  ) : (
                    shipment.containerId
                  )}
                </td>
                <td>
                  {editableShipment === shipment._id ? (
                    <input
                      type="text"
                      name="currentLocation"
                      value={updatedShipment.currentLocation}
                      onChange={handleChange}
                      className="form-control"
                    />
                  ) : (
                    shipment.currentLocation
                  )}
                </td>
                <td>
                  {editableShipment === shipment._id ? (
                    <input
                      type="date"
                      name="currentETA"
                      value={updatedShipment.currentETA}
                      onChange={handleChange}
                      className="form-control"
                    />
                  ) : (
                    shipment.currentETA
                  )}
                </td>
                <td>
                  {editableShipment === shipment._id ? (
                    <select
                      name="status"
                      value={updatedShipment.status}
                      onChange={handleChange}
                      className="form-control"
                    >
                      <option value="In Transit">In Transit</option>
                      <option value="Arrived">Arrived</option>
                      <option value="Pending">Pending</option>
                    </select>
                  ) : (
                    shipment.status
                  )}
                </td>
                <td>
                  {editableShipment === shipment._id ? (
                    <button className="btn btn-primary" onClick={handleSubmit}>
                      Save
                    </button>
                  ) : (
                    <button className="btn btn-warning" onClick={() => handleUpdate(shipment)}>
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No shipments available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
