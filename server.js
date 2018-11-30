const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;

// API info
const countriesUrl = 'https://restcountries.eu/rest/v2/';


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// API calls

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.post('/api/world', async (req, res) => {
  console.log(req.body);
  // fetch()
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`,
  );
});

app.post('/api/country',  (req, res) => {

  request(`${countriesUrl}name/${req.body.post}`,  (error, response, body) => {
      if(error) {
          // If there is an error, tell the user 
          res.send('An erorr occured')
      }
      // Otherwise do something with the API data and send a response
      else {
          res.send(body)
      }
  });
});

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}
app.listen(port, () => console.log(`Listening on port ${port}`));