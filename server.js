const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;

// determine if we got an array, object or error
const _dataMaker = (body) => {
  let model = { data: body ? body : { status: 400, message: 'not found' } }
  // is an error
  if(model.data.status) {
    model = {
      ...model,
      type: 'error'
    }
  } else if (Array.isArray(model.data)) {
    model = {
      ...model,
      type: 'array'
    }
  } else if (typeof model.data === 'object' && model.data !== null) {
    model = {
      ...model,
      type: 'object'
    }
  }
  console.log('model to return: ', model);
  return model;
};

// API info
const countriesUrl = 'https://restcountries.eu/rest/v2/';


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// API calls

app.get('/api/hello', (req, res) => {
  res.send({ express: 'API loaded' });
});

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
          console.log('error on country api: ', error)
          res.send('An error occured').status(420);
      }
      // Otherwise do something with the API data and send a response
      else {
        console.log('the url called: ', `${countriesUrl}name/${req.body.name}`)
        if(body.status){
          console.log('country not found');
          res.send('Error').status(body.status);
        }
        console.log('this is the response: ', response);
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