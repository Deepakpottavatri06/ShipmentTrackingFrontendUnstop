import ShipmentTable from '../components/ShipmentTable';
import MapView from '../components/MapView';
import AddShipment from './AddShipment.jsx';
export default function Dashboard() {

  return (
    <div className='container mt-4'>
      <div className='text-center mb-4'>
        <h1 className='display-4'>Shipment Tracker</h1>
        <AddShipment/>
      </div>
      <div className='mb-4'>
        <ShipmentTable />
      </div>
      <div className='mb-4'>
        <MapView />
      </div>
    </div>
  );
}
