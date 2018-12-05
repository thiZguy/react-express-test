import React, { Component } from 'react';
import placeholder from './assets/placeholder.svg';
import './App.css';
import CountryCard from './components/CountryCard';
import Pagination from './components/Pagination';

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
    countries: [],
    allCountries: null
  };

  componentDidMount() {
    
  }

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

  listOnFront = () => {
    const url = 'https://restcountries.eu/rest/v2/all';
    fetch(url).then(
      async res => {
        const response = await res.json();
        console.log('the response: ', response);
        this.setState({ allCountries:  response });
      }
    ).catch(
      error => {
        console.log('the error: ', error);
        
      }
    );
  };

  onPageChanged = data => {
    const { allCountries } = this.state;
    if(allCountries && allCountries.length > 0){
      const { currentPage, totalPages, pageLimit } = data;

      const offset = (currentPage - 1) * pageLimit;
      const currentCountries = allCountries.slice(offset, offset + pageLimit);
  
      this.setState({ currentPage, currentCountries, totalPages });
      console.log('the current countries are: ', currentCountries);
    }
  };

  clearListOnFront = () => {
    this.clearList();
   this.setState({ allCountries:  null, currentCountries: null });
  }

  clearList = () => {
   this.setState({ countries:  [], country: null, flag: placeholder });
  }

render() {
  const { allCountries, currentCountries, countries } = this.state;
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
        <br/>
        <button className="App-button-2" onClick={this.listOnFront}>{'List By Front'}</button>
        <button className="App-button-2" onClick={this.clearListOnFront}>{'Clear'}</button>
        <br/>
        <p>{this.state.response}</p>
        {
          allCountries && allCountries.length > 0 &&
          <div
            className="Container-row d-flex flex-row py-4 align-items-center"
          >
            <Pagination
              totalRecords={allCountries.length}
              pageLimit={18}
              pageNeighbours={1}
              onPageChanged={this.onPageChanged}
            />
          </div>
        }
        {
          currentCountries && currentCountries.length > 0 &&
          <CardList countries={currentCountries} />
        }
        <form onSubmit={this.handleSubmit}>
          <p>
            <strong>{'Look for Country:'}</strong>
          </p>
          <input
            type="text"
            value={this.state.post}
            onChange={e => this.setState({ post: e.target.value })}
            className="Input-text"
          />
          <br/>
          <br/>
          <button type="submit" className="App-button-1">{'Search using Backend'}</button>
        </form>
        {/* <p>{this.state.responseToPost}</p> */}
        {
          countries && countries.length > 0 &&
          <CardList countries={countries} />
        }
      </div>
    );
  }
}



export default App;
