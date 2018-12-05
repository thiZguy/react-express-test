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

app.post('/api/world', (req, res) => {
  console.log(req.body);
  // fetch()
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`,
  );
});

app.post('/api/country',  (req, res) => {

  request(`${countriesUrl}name/${req.body.name}`,  (error, response, body) => {
      if(error) {
          // If there is an error, tell the user 
          res.send('An error occured').status(420);
      }
      // Otherwise do something with the API data and send a response
      else {
        console.log('the url called: ', `${countriesUrl}name/${req.body.name}`)
        if(body.status){
          res.send('Error').status(body.status);
        }
        // console.log('this is the body: ', body);
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