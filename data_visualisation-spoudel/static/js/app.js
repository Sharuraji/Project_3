// Define an array of colors for different products
const colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];

// Function to create the map and add markers
function createMap(data) {
    // Create a map centered at a specific location
    const map = L.map('map').setView([20, 0], 2);
  
    // Add a tile layer from a map provider (e.g., OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  
    // Add markers for each city with production data
    Object.entries(data).forEach(([city, cityData]) => {
        const latitude = cityData[0].latitude;
        const longitude = cityData[0].longitude;
        const crops = cityData.map(item => item.crop);
        const production = cityData.map(item => item.production);
        const totalProduction = cityData.reduce((acc, curr) => acc + curr.production, 0);
        if (latitude && longitude) {
            const marker = L.marker([latitude, longitude]).addTo(map);
            const popupContent = `
                <b>City: ${city}</b><br>
                <table>
                    <tr>
                        <th>Crop Name</th>
                        <th>Production Quantity</th>
                    </tr>
                    ${crops.map((crop, index) => `
                        <tr>
                            <td>${crop}</td>
                            <td>${production[index]}</td>
                        </tr>
                    `).join('')}
                </table>
                <b>Total Production:</b> ${totalProduction}
            `;
            marker.bindPopup(popupContent);
            marker.on('popupclose', function() {
                map.closePopup();
            });
        }
    });
  }

// Fetch data from Flask route
fetch('/data')
    .then(response => response.json())
    .then(data => {
        // Call function to create the map and add markers
        createMap(data);

        // Prepare data for plotting the bar chart
        const cities = Object.keys(data);
        const traces = cities.map((city, index) => ({
            type: 'bar',
            orientation: 'h',
            x: data[city].map(item => item.production),
            y: data[city].map(item => item.crop),
            name: city,
            marker: {
                color: colors[index % colors.length] // Assign a color based on the index
            }
        }));

        // Define layout for the bar chart
        const layout = {
            title: 'City-wise Crop Production',
            barmode: 'stack'
        };

        // Plot the bar chart
        Plotly.newPlot('chart', traces, layout);

        // Populate the dropdown menu with city options
        const citySelect = document.getElementById('citySelect');
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.text = city;
            citySelect.appendChild(option);
        });
    })
    .catch(error => console.error('Error fetching data:', error));

// Function to update the chart based on the selected city
function updateChart(selectedCity) {
    fetch('/data')
        .then(response => response.json())
        .then(data => {
            // Filter data based on the selected city
            const filteredData = selectedCity ? data[selectedCity] : data;

            // Prepare data for plotting the bar chart
            const traces = [{
                type: 'bar',
                orientation: 'h',
                x: filteredData.map(item => item.production),
                y: filteredData.map(item => item.crop),
                name: selectedCity || 'All Cities',
                marker: {
                    color: colors[0] // Use the first color for all bars when city is selected
                }
            }];

            // Update the layout title
            const layout = {
                title: selectedCity ? `Crop Production for ${selectedCity}` : 'City-wise Crop Production',
                barmode: 'stack'
            };

            // Update the chart
            Plotly.newPlot('chart', traces, layout);
        })
        .catch(error => console.error('Error fetching data:', error));
}
