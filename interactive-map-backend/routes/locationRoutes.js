const express = require("express");
const axios = require("axios");

const router = express.Router();

// Route to fetch locations dynamically
router.get("/locations", async (req, res) => {
    try {
        const query = req.query.q;  // Get search term from frontend (e.g., "hospitals")
        if (!query) {
            return res.status(400).json({ error: "Query parameter is required" });
        }

        const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
            params: {
                q: query,
                format: "json",
                limit: 10  // Fetch 10 locations max
            }
        });

        // Map response to required format
        const locations = response.data.map(place => ({
            name: place.display_name,
            lat: parseFloat(place.lat),
            lon: parseFloat(place.lon)
        }));

        res.json(locations);
    } catch (error) {
        console.error("Error fetching location data:", error);
        res.status(500).json({ error: "Failed to fetch location data" });
    }
});

module.exports = router;
