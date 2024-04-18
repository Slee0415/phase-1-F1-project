document.addEventListener('DOMContentLoaded', function() {
    const searchBar = document.getElementById('search-bar');
    const driversList = document.getElementById('drivers-list');
    let drivers; // Define drivers array in the outer scope

    // Function to display driver's full details
    function displayDriverDetails(event) {
        const driverId = event.currentTarget.dataset.id;
        const driver = drivers.find(driver => driver.id === driverId);
        alert(`Name: ${driver.name}\nTeam: ${driver.team}\nRating: ${driver.rating}\nComment: ${driver.comment}\nCountry: ${driver.country}`);
    }

    // Function to show/hide driver's skill points on mouse over/out
    function toggleSkillPoints(event, drivers) {
        const driverId = event.currentTarget.dataset.id;
        const driver = drivers.find(driver => driver.id === driverId);
        const skillPoints = event.currentTarget.nextElementSibling; // Targeting the skill-points div next to the image

        if (event.type === 'mouseover') {
            skillPoints.textContent = `Skill Points: ${driver.rating}`;
            skillPoints.style.display = 'block';
        } else if (event.type === 'mouseout') {
            skillPoints.style.display = 'none';
        }
    }

    // Attach mouseover and mouseout event listeners to each driver image
    function attachMouseEvents(drivers) {
        const driverImages = document.querySelectorAll('.driver img');
        driverImages.forEach(image => {
            image.addEventListener('mouseover', event => toggleSkillPoints(event, drivers));
            image.addEventListener('mouseout', event => toggleSkillPoints(event, drivers));
            image.addEventListener('click', displayDriverDetails); // Add click event listener to the image
        });
    }

    // Function to filter drivers based on search bar input
    function filterDrivers(event) {
        const searchText = event.target.value.toLowerCase();
        const filteredDrivers = drivers.filter(driver => driver.name.toLowerCase().includes(searchText));
        displayDrivers(filteredDrivers);
    }

    // Display drivers list
    function displayDrivers(drivers) {
        driversList.innerHTML = '';
        drivers.forEach(driver => {
            const driverElement = document.createElement('div');
            driverElement.classList.add('driver');

            const nameContainer = document.createElement('div');
            nameContainer.classList.add('driver-name');
            const boldName = document.createElement('strong'); // Make the name bold
            boldName.textContent = driver.name;
            nameContainer.appendChild(boldName);

            const teamContainer = document.createElement('div');
            teamContainer.classList.add('driver-team');
            const boldTeam = document.createElement('strong'); // Make the team name bold
            boldTeam.textContent = driver.team;
            teamContainer.appendChild(boldTeam);

            const img = new Image();
            img.src = driver.image;
            img.alt = driver.name;
            img.dataset.id = driver.id;

            const p = document.createElement('p');
            

            const skillPoints = document.createElement('div');
            skillPoints.classList.add('skill-points');
            skillPoints.style.display = 'none';

            driverElement.appendChild(nameContainer); // Append the name container above the image
            driverElement.appendChild(teamContainer); // Append the team container below the name
            driverElement.appendChild(img);
            driverElement.appendChild(p);
            driverElement.appendChild(skillPoints);

            driversList.appendChild(driverElement);
        });
        attachMouseEvents(drivers); // Attach mouse events after displaying drivers
    }

    // Fetch drivers data from db.json file
    fetch('db.json')
        .then(response => response.json())
        .then(data => {
            drivers = data.Drivers; // Assuming "Drivers" is the key for the array in db.json
            displayDrivers(drivers);

            // Event listener for search bar input
            searchBar.addEventListener('input', filterDrivers);
        })
        .catch(error => console.error('Error fetching drivers data:', error));
});
