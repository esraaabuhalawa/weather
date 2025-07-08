const getLocation = async () => {
    const location = localStorage.getItem('searchLocation') || 'egypt';

    try {
        const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=e7a3f211406f412da2764621250707&q=${location}&days=3&aqi=no&alerts=no`);
        const data = await response.json();
        const locationData = data.location;

        const lat = locationData.lat;
        const lon = locationData.lon;

        const map = L.map('map').setView([lat, lon], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        L.marker([lat, lon]).addTo(map)
            .bindPopup(`Location: ${locationData.name}`)
            .openPopup();

    } catch (error) {
        console.error('Error:', error);
    }
};

window.addEventListener('load', () => {
    getLocation();
})
