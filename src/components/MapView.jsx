import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useSelector } from 'react-redux';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Icon } from 'leaflet';

export default function MapView() {
  const shipments = useSelector((state) => state.shipments.shipments);
  const [locations, setLocations] = useState([]);
  const [center, setCenter] = useState([0, 0]);
  const mapRef = useRef(null); // Reference for map container

  useEffect(() => {
    const fetchLocations = async () => {
      const locationsPromises = shipments.map(async (shipment) => {
        try {
          const location = shipment.currentLocation;
          console.log('Fetching location for:', location);

          const response = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: {
              q: location,
              format: 'json',
              limit: 1,
            },
            headers: {
              'User-Agent': 'CargoShipmentTrackerApp',
            },
          });

          if (response.data && response.data[0]) {
            return {
              id: shipment._id,
              lat: parseFloat(response.data[0].lat),
              lng: parseFloat(response.data[0].lon),
              containerId: shipment.containerId,
              shipmentId: shipment.shipmentId,
            };
          } else {
            return null; // If no coordinates are found
          }
        } catch (error) {
          console.error(`Error fetching location for ${shipment.shipmentId}:`, error);
          return null;
        }
      });

      // Wait for all geocoding requests to complete
      const resolvedLocations = await Promise.all(locationsPromises);
      const validLocations = resolvedLocations.filter((loc) => loc !== null);
      setLocations(validLocations);

      // Calculate the center by averaging the latitudes and longitudes
      if (validLocations.length > 0) {
        const avgLat = validLocations.reduce((sum, loc) => sum + loc.lat, 0) / validLocations.length;
        const avgLng = validLocations.reduce((sum, loc) => sum + loc.lng, 0) / validLocations.length;
        setCenter([avgLat, avgLng]); // Update center once locations are fetched
      }
    };

    if (shipments.length > 0) {
      fetchLocations(); 
    }
  }, [shipments]);

  // Wait until locations are fetched and center is set to render the map
  if (locations.length === 0 || center[0] === 0 && center[1] === 0) {
    return <div>Loading map...</div>; // Show a loading message until center and locations are available
  }

  return (
    <MapContainer ref={mapRef} center={center} zoom={5} style={{ height: '400px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      {locations.map((location) => (
        <Marker
          key={location.id}
          position={[location.lat, location.lng]}
          icon={
            new Icon({
              iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Custom icon
              iconSize: [25, 25],
            })
          }
        >
          <Popup>
            <strong>Shipment ID: </strong>{location.shipmentId}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
