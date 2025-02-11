import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./styles/App.css";
import customMarker from "./assets/custom-marker.png"; // Custom marker for all locations

const App = () => {
    const [locations, setLocations] = useState([]);
    const [query, setQuery] = useState("");

    // Define a single custom icon for all locations
    const defaultIcon = new L.Icon({
        iconUrl: customMarker,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });

    // Fetch locations from OpenStreetMap Overpass API
    const fetchLocations = async () => {
        if (!query) {
            alert("Please enter a location type (e.g., hospital, restaurant, school)");
            return;
        }

        const overpassQuery = `
            [out:json];
            node["amenity"="${query}"](around:50000,52.629729,1.29227);
            out;
        `;
        const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.elements.length > 0) {
                setLocations(
                    data.elements.map((place, index) => ({
                        id: index,
                        lat: place.lat,
                        lon: place.lon,
                        name: place.tags.name || query
                    }))
                );
            } else {
                alert("No results found. Try another search term.");
                setLocations([]);
            }
        } catch (error) {
            console.error("Error fetching location data:", error);
        }
    };

    return (
        <div>
            <h2>Interactive Map with Live Markers</h2>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Enter location type (e.g., hospital, restaurant, school)..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value.toLowerCase())}
                />
                <button onClick={fetchLocations}>Search</button>
            </div>
            
            <MapContainer center={[52.629729, 1.29227]} zoom={6} className="map-container">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                
                {locations.map((location) => (
                    <Marker 
                        key={location.id} 
                        position={[location.lat, location.lon]} 
                        icon={defaultIcon}
                    >
                        <Popup>{location.name}</Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default App;
