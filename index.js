// Wait for the DOM to be fully loaded before executing
document.addEventListener('DOMContentLoaded', function() {
    // Get refrences to elements in the HTML file
    const searchBar = document.getElementById('search-bar');
    const driversList = document.getElementById('drivers-list');
    const selectDriversButton = document.getElementById('selectDriversButton');
    const simulateRaceButton = document.getElementById('simulateRaceButton');
    const userTeamContainer = document.getElementById('userTeam');
    const raceResultsContainer = document.getElementById('raceResults');
    let drivers; // Define drivers array in the outer scope
    let selectedDrivers = [];

    // Function to display driver's full details
    function displayDriverDetails(event) {
        // Get the id of the clicked on driver
        const driverId = event.currentTarget.dataset.id;
        // Find the driver object with the id
        const driver = drivers.find(driver => driver.id === driverId);
        // Display driver details in the aleert box
        alert(`Name: ${driver.name}\nTeam: ${driver.team}\nRating: ${driver.rating}\nComment: ${driver.comment}\nCountry: ${driver.country}`);
    }

    // Function to show/hide driver's skill points on mouse over/out
    function toggleSkillPoints(event, drivers) {
        // Gets the id of driver 
        const driverId = event.currentTarget.dataset.id;
        // Finds the driver with the matching id
        const driver = drivers.find(driver => driver.id === driverId);
        // Get the skill-points div next to the image
        const skillPoints = event.currentTarget.nextElementSibling;


        // Show or hide skill points based on the event type
        if (event.type === 'mouseover') {
            skillPoints.textContent = `Driver rating: ${driver.rating}`;
            skillPoints.style.display = 'block';
        } else if (event.type === 'mouseout') {
            skillPoints.style.display = 'none';
        }
    }

    // Attach mouseover and mouseout event listeners to each driver image
    function attachMouseEvents(drivers) {
        const driverImages = document.querySelectorAll('.driver img');
        driverImages.forEach(image => {
            // mouseover event shows skill points
            image.addEventListener('mouseover', event => toggleSkillPoints(event, drivers));
            // mouseout event hides skill points
            image.addEventListener('mouseout', event => toggleSkillPoints(event, drivers));
            // Click event listener displays driver details
            image.addEventListener('click', displayDriverDetails); 
        });
    }

    // Function to filter drivers based on search bar input
    function filterDrivers(event) {
        // Gets user input
        const searchText = event.target.value.toLowerCase();
        // filters driver whose name includes searched value
        const filteredDrivers = drivers.filter(driver => driver.name.toLowerCase().includes(searchText));
        // Display filtered
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

            const skillPoints = document.createElement('div');
            skillPoints.classList.add('skill-points');
            skillPoints.style.display = 'none';

            driverElement.appendChild(nameContainer);
            driverElement.appendChild(teamContainer);
            driverElement.appendChild(img);
            driverElement.appendChild(skillPoints);

            driversList.appendChild(driverElement);
        });
        attachMouseEvents(drivers);
    }

    // Function to select drivers and move them to the user's team
    function selectDrivers() {
        selectedDrivers = [];
        const driverCards = document.querySelectorAll('.driver');
        driverCards.forEach(card => {
            card.addEventListener('click', function() {
                const driverId = this.querySelector('img').dataset.id;
                const driver = drivers.find(driver => driver.id === driverId);
                if (selectedDrivers.length < 2 && !selectedDrivers.includes(driver)) {
                    selectedDrivers.push(driver);
                    userTeamContainer.appendChild(this.cloneNode(true));
                }
            });
        });
    }

    // Function to randomly shuffle an array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Function to randomly assign the remaining drivers to teams of two
    function randomizeTeams() {
        const remainingDrivers = drivers.filter(driver => !selectedDrivers.includes(driver));
        const shuffledDrivers = shuffleArray(remainingDrivers); // Shuffle the remaining drivers
        const teams = [];
        for (let i = 0; i < shuffledDrivers.length; i += 2) {
            teams.push([shuffledDrivers[i], shuffledDrivers[i + 1]]);
        }
        return teams;
    }

    // Function to simulate the race and display the winner
function simulateRace() {
    const teams = randomizeTeams(); // Get the teams from randomizeTeams function

    // Include selected drivers' team in the race results
    if (selectedDrivers.length > 0) {
        teams.push(selectedDrivers.map(driver => ({ name: driver.name, rating: driver.rating, team: driver.team })));
    }

    // Calculate total rating for each team
    teams.forEach(team => {
        team.totalRating = Array.isArray(team) ? team[0].rating + team[1].rating : team.rating;
    });

    // Sort teams based on total rating in descending order
    teams.sort((a, b) => b.totalRating - a.totalRating);

    let results = '';

    // Display teams in places 1-10
    for (let i = 0; i < Math.min(teams.length, 10); i++) {
        if (Array.isArray(teams[i])) {
            results += `${i + 1}. ${teams[i][0].name} - ${teams[i][1].name} (Total Rating: ${teams[i].totalRating})\n`;
        } else {
            results += `${i + 1}. ${teams[i].name} (Rating: ${teams[i].rating})\n`;
        }
    }

    // Update the race results container in the HTML
    raceResultsContainer.textContent = `Race Results:\n${results}`;
}

    // Fetch drivers data from db.json file
    fetch('db.json')
        .then(response => response.json())
        .then(data => {
            drivers = data.Drivers;
            displayDrivers(drivers);
            searchBar.addEventListener('input', filterDrivers);
            selectDriversButton.addEventListener('click', selectDrivers);
           
            simulateRaceButton.addEventListener('click', simulateRace);
        })
        .catch(error => console.error('Error fetching drivers data:', error));
        
});
