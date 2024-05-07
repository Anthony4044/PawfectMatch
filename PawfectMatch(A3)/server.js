const express = require('express');
const ejs = require('ejs');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 5382;

// Set the view engine to EJS
app.set('view engine', 'html');

// Specify the directory for views
app.set('views', path.join(__dirname, 'views'));

// Render HTML files with EJS
app.engine('html', ejs.renderFile);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: true
}));

// Home page route
app.get('/', (req, res) => {
    res.render('PawfectMatch.html');
});
app.get('/PawfectMatch.html', (req, res) => { res.render(path.join(__dirname, 'views', 'PawfectMatch.html')); });
app.get('/findPet.html', (req, res) => { res.render(path.join(__dirname, 'views', 'findPet.html')); });
app.get('/createAnAccount.html', (req, res) => { res.render(path.join(__dirname, 'views', 'createAnAccount.html')); });
app.get('/dogCare.html', (req, res) => { res.render(path.join(__dirname, 'views', 'dogCare.html')); });
app.get('/catCare.html', (req, res) => { res.render(path.join(__dirname, 'views', 'catCare.html')); });
app.get('/giveAway.html', (req, res) => {
    if (req.session.user) {
        res.render(path.join(__dirname, 'views', 'giveAway.html'));
    } else {
        res.render(path.join(__dirname, 'views', 'login.html'));
    }
});
app.get('/contactUs.html', (req, res) => { res.render(path.join(__dirname, 'views', 'contactUs.html')); });
app.get('/privacyStatement.html', (req, res) => { res.render(path.join(__dirname, 'views', 'privacyStatement.html')); });
app.get('/logOut', (req, res) => {
    if (!req.session.user) {
        res.send(`
        <script>
            alert('Not signed in.');
            window.location.href = "/";
        </script>
    `);
    } else {
        req.session.destroy(err => {
            if (err) {
                console.error('Error destroying session:', err);
                res.sendStatus(500);
            } else {
                res.send(`
        <script>
            alert('Successfully logged out.');
            window.location.href = "/";
        </script>
    `);
            }
        });
    }
});

app.post('/create-account', (req, res) => {
    const { username, password } = req.body;

    // Validate username and password format
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{4,}$/;
    if (!usernameRegex.test(username) || !passwordRegex.test(password)) {
        return res.send(`
        <script>
            alert('Invalid username or password format. Please try again.');
            window.history.back();
        </script>
    `);
    }

    // Check if username already exists
    const filePath = path.join(__dirname, 'data', 'users.txt');
    const userData = fs.readFileSync(filePath, 'utf8');
    if (userData.includes(`${username}:`)) {
        return res.send(`
        <script>
            alert('Username already exists. Please choose a different username.');
            window.history.back();
        </script>
    `);
    }

    // Append new user data to the text file
    appendUserData(username, password);

    // Send success message
    res.send(`
    <script>
        alert('Account successfully created. You are now ready to login.');
        window.history.back();
    </script>
`);
});


app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Read user data from the file
    const userDataPath = path.join(__dirname, 'data', 'users.txt');
    fs.readFile(userDataPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }

        // Parse user data from the file
        const users = data.split('\n').map(line => {
            const [storedUsername, storedPassword] = line.split(':');
            return { username: storedUsername, password: storedPassword };
        });

        // Check if the provided username and password match any entry in the user data
        const matchedUser = users.find(user => user.username === username && user.password === password);
        if (matchedUser) {
            // Set user information in session
            req.session.user = { username };
            return res.redirect('/giveAway.html'); // Redirect to the giveaway page
        } else {
            res.send(`
            <script>
                alert('Invalid username or password.');
                window.history.back();
            </script>
        `);
        }

    });
});
app.post('/give-away', (req, res) => {
    const formData = req.body;

    // Read the current contents of the available pet information file
    fs.readFile(path.join(__dirname, 'data', 'pets.txt'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Internal server error');
        }

        let petEntries = data.trim().split('\n');

        // Get the ID for the new entry
        let id = petEntries.length + 1;

        // Construct the new pet entry
        let newEntry = `${id}:${formData.ownerName}:${formData.animal}:${formData.breed}:${formData.age}:${formData.gender}:${formData.compatibility}:${formData.comments}${formData.ownerEmail}`;

        // Append the new entry to the file
        fs.appendFile(path.join(__dirname, 'data', 'pets.txt'), `${newEntry}\n`, (err) => {
            if (err) {
                console.error('Error appending to file:', err);
                return res.status(500).send('Internal server error');
            }
            console.log('New pet entry added successfully:', newEntry);

            // Redirect the user back to the form or any other desired page
            res.send(`
            <script>
                alert('Added animal to database successfully. ');
                window.location.href = "/";
            </script>
        `);
        });
    });
});
app.post('/find-pet', (req, res) => {
    const petType = req.body.petType;
    const breed = req.body.breed;
    const age = req.body.age;
    const gender = req.body.gender;
    const compatibility = req.body.compatibility;

    // Read the file and filter pets based on form data
    fs.readFile(path.join(__dirname, 'data', 'pets.txt'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).send('Error reading file');
            return;
        }

        // Split file data into lines
        const lines = data.split('\n');

        // Filter pets based on form data
        const matchingPets = lines.filter(line => {
            const [id, owner, petTypeFromFile, breedFromFile, ageFromFile, genderFromFile, compatibilityFromFile, _, ownerEmail] = line.split(':');
            return (
                (petType === petTypeFromFile) &&
                (breed === 'Doesn\'t matter' || breed === breedFromFile) &&
                (age === 'Doesn\'t matter' || age === ageFromFile) &&
                (gender === 'Doesn\'t matter' || gender === genderFromFile) &&
                (compatibility === 'Doesn\'t matter' || compatibility === compatibilityFromFile)
            );
        });
        if (matchingPets.length > 0) {
            res.send('Matching pets: ' + matchingPets.join('<br>') + "<br><h3><a href=/findPet.html>return</a><h3>");
        } else {
            res.send(`
            <script>
                alert('No animals found.');
                window.history.back();
            </script>
        `);
        }
    });
});

function appendUserData(username, password) {
    const filePath = path.join(__dirname, 'data', 'users.txt');
    const userDataLine = `${username}:${password}\n`;
    fs.appendFileSync(filePath, userDataLine);
}
// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://soen287.encs.concordia.ca:${PORT}`);
});
