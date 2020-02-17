import React from 'react';
import './App.css';
import axios from 'axios';

const uniqid = require('uniqid');
let myIntaerval = null;
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      weatherLocations: [],
      cityToSearch: "",
      searchCity: ""
    }
  }
  inputHandler = (event) => {
    this.setState({ cityToSearch: event.target.value })
  };

  handleClick = () => {
    this.getCityForcast(this.state.cityToSearch);
    if (myIntaerval !== null) clearInterval(myIntaerval);
    myIntaerval = setInterval(this.getCityForcast, 60000, this.state.cityToSearch);

  }

  componentDidMount() {   
    this.updateConstCitysForcast();
    setInterval(this.updateConstCitysForcast, 10000);
  }

  getCityForcast = (cityName) => {
    axios.get("http://localhost:3000/getweather?name=" + cityName)
      .then((res) => {
        this.setState({ searchCity: res.data })
        console.log("Search");
      })
  }
  
  updateConstCitysForcast = () => {
    axios.get("http://localhost:3000/pageLoad")
      .then((res) => {
        this.setState({ weatherLocations: res.data })
        console.log("Cities");
      })
  }



  render() {
    return (
      <React.Fragment>
      <div>
          <input type="text" onChange={this.inputHandler} />
          <button onClick={this.handleClick} className ="button">SEARCH </button>
      </div>
        <div className="weatherCard">
          <h3>{this.state.searchCity.Name}</h3>
          <br />
          {this.state.searchCity.Temp}
          <br />
          {this.state.searchCity.Humidity}
          <br />
          {this.state.searchCity.Wind}
          <br />
          <img src={this.state.searchCity.Image} alt={this.state.searchCity.ImageDescs} />
          <br />
          {this.state.searchCity.ImageDesc}
          <br />
          <br />
        </div>
        <div className ="weatherCard">
        {this.state.weatherLocations.map(location =>
          <React.Fragment key={uniqid()} >
            <h3>{location.Name}</h3>
            <br />
             {location.Temp}°C
            <br />
            {location.Humidity}
            <br />
            {location.Wind}
            <br />
            <img src={location.Image} alt={location.ImageDesc} />
            <br />
            {location.ImageDesc}
            <br />
            <br />
          </React.Fragment>)}
      </div>
      </React.Fragment>
    );
  }
}



export default App;

