import React, { Component } from 'react';
import placeholder from '../placeholder.svg';
import PropTypes from 'prop-types';
import '../App.css';

export default class CountryCard extends Component {

  render() {
    const { name, info, image } = this.props;
    return(
    <div className="App-country-card">
      <img src={image} alt={placeholder} className="App-country-flag"/>
      <div>
          <h2>{name}</h2>
          <p>{info}</p>
          <br/>
      </div>
    </div>
    )
  }
}

CountryCard.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  info: PropTypes.string.isRequired
};