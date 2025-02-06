import { useEffect, useRef, useState } from "react";
import leaflet from "leaflet";
import "leaflet/dist/leaflet.css";
import Sidebar from '../components/Sidebar.jsx';  // Import Sidebar component

export default function TrackMyChild() {
  const mapRef = useRef(null);
  const userMarkerRef = useRef(null);
  const mapInstance = useRef(null); // Track map instance to prevent reinitialization

  const [userPosition, setUserPosition] = useState({
    latitude: 0,
    longitude: 0,
  });

  const [nearbyMarkers, setNearbyMarkers] = useState([]);

  // Define the user icon
  const userIcon = leaflet.icon({
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
  });

  // Fetch location from Django API using Fetch
  useEffect(() => {
    fetch("http://127.0.0.1:8000/location") // Replace with your Django server URL
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          console.log("Location data fetched:", data);

          const location = data.data;
          setUserPosition({
            latitude: location.lat, // Use 'lat' from the response
            longitude: location.lon, // Use 'lon' from the response
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching location:", error);
      });
  }, []);

  // Initialize map
  useEffect(() => {
    if (
      userPosition.latitude !== 0 &&
      userPosition.longitude !== 0 &&
      !mapInstance.current
    ) {
      console.log("Initializing map with position:", userPosition);

      mapInstance.current = leaflet
        .map("map")
        .setView([userPosition.latitude, userPosition.longitude], 13);

      leaflet
        .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        })
        .addTo(mapInstance.current);

      // Add user marker with custom icon
      userMarkerRef.current = leaflet
        .marker([userPosition.latitude, userPosition.longitude], {
          icon: userIcon,
        })
        .addTo(mapInstance.current)
        .bindPopup("User");

      // Add nearby markers
      nearbyMarkers.forEach(({ latitude, longitude }) => {
        leaflet
          .marker([latitude, longitude])
          .addTo(mapInstance.current)
          .bindPopup(
            `lat: ${latitude.toFixed(2)}, long: ${longitude.toFixed(2)}`
          );
      });

      // Cleanup map on component unmount
      return () => {
        if (mapInstance.current) {
          mapInstance.current.remove();
        }
      };
    }
  }, [userPosition, nearbyMarkers]);

  // Handle click event on map to add marker
  useEffect(() => {
    if (mapInstance.current) {
      mapInstance.current.on("click", (e) => {
        const { lat: latitude, lng: longitude } = e.latlng;
        leaflet
          .marker([latitude, longitude])
          .addTo(mapInstance.current)
          .bindPopup(
            `lat: ${latitude.toFixed(2)}, long: ${longitude.toFixed(2)}`
          );

        setNearbyMarkers((prevMarkers) => [
          ...prevMarkers,
          { latitude, longitude },
        ]);
      });
    }
  }, [nearbyMarkers]);

  // Update user marker
  useEffect(() => {
    if (mapInstance.current && userMarkerRef.current) {
      // Remove the previous marker if it exists
      mapInstance.current.removeLayer(userMarkerRef.current);

      // Add the updated user marker with the custom icon
      userMarkerRef.current = leaflet
        .marker([userPosition.latitude, userPosition.longitude], {
          icon: userIcon,
        })
        .addTo(mapInstance.current)
        .bindPopup("User");

      const el = userMarkerRef.current.getElement();
      if (el) {
        el.style.filter = "hue-rotate(120deg)";
      }

      // Center the map to the user position
      mapInstance.current.setView([userPosition.latitude, userPosition.longitude]);
    }
  }, [userPosition]);

  return (
    <>
      <div className="flex">
        {/* Sidebar Component */}
        <Sidebar onNavigation={() => {}} />
        
        {/* Map Section */}
        <div className="flex-1">
          <div className="flex items-center justify-center min-h-[90vh] py-8">
            <div
              id="map"
              className="w-[80%] h-[60vh] max-h-[500px] min-h-[300px] rounded-lg shadow-lg border border-gray-300"
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}
