import React, { Component } from 'react';
import placeholder from './placeholder.svg';
import './App.css';
import CountryCard from './components/CountryCard';

const CardList = ({ countries }) => {
  if(countries.length > 0) {
    console.log('rendering country: ', countries[0].name);
    const cardsArray = countries.map(country => (
      <CountryCard
        name={country.name}
        info={country.region}
        image={country.flag} />
    ));
  
    return (
      <div>
        {cardsArray}
      </div>
    );
  }
  return null;
};

class App extends Component {
  state = {
    response: '',
    post: '',
    responseToPost: '',
    flag: placeholder,
    country: null,
    countries: []
  };

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  handleSubmit = async e => {
    e.preventDefault();  
    if(this.state.post !== '') {
      const response = await fetch('/api/country', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: this.state.post }),
      });
      const body = JSON.parse(await response.text());
      if(!body.status) {
        console.log('the response body: ', body);
        this.setState({
          responseToPost: JSON.stringify(body),
          flag: body[0].flag ? body[0].flag : placeholder,
          countries: body,
          country: body[0]
        });
      }
    }
  };

render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={this.state.flag} className="Flag-placeholder" alt={placeholder} />
          {/* <p>
            Edit <code>src/App.js</code> and save to reload.
          </p> */}
          <a
            className="App-link"
            href={ this.state.country ? `https://www.google.com/search?q=${this.state.country.name}` : "http://www.worldometers.info/geography/alphabetical-list-of-countries/" }
            target="_blank"
            rel="noopener noreferrer"
          >
            { this.state.country ? this.state.country.name : 'Country Informer' }
          </a>
        </header>
        <p>{this.state.response}</p>
        <form onSubmit={this.handleSubmit}>
          <p>
            <strong>Look for Country:</strong>
          </p>
          <input
            type="text"
            value={this.state.post}
            onChange={e => this.setState({ post: e.target.value })}
            className="Input-text"
          />
          <br/>
          <br/>
          <button type="submit" className="App-button-1">Search</button>
        </form>
        {/* <p>{this.state.responseToPost}</p> */}
        <CardList countries={this.state.countries} />
      </div>
    );
  }
}



export default App;
