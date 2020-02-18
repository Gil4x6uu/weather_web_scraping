import React from 'react';
import './App.css';
import axios from 'axios';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

//Style 
const buttonStyle = {
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  marginLeft: '10px',
  borderRadius: 3,
  border: 0,
  color: 'white',
  height: 48,
  padding: '0 30px',
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
};

//Style
const cardStyle = {
  margin: '20px',
  hëight: '45%'

};

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
    //checks for any update user weather
    if (myIntaerval !== null) clearInterval(myIntaerval);
    myIntaerval = setInterval(this.getCityForcast, 60000, this.state.cityToSearch);

  }

  componentDidMount() {
    this.updateNewYorkSydneyCitysForcast();
    //Updating New York and Sydney
    setInterval(this.updateNewYorkSydneyCitysForcast, 300000);
    //return local weather 
    this.getCityForcast("");
  }

  getCityForcast = (cityName) => {
    axios.get("http://localhost:3000/getweather?name=" + cityName)
      .then((res) => {
        this.setState({ searchCity: res.data })
        console.log("Search");
      })
  }

  updateNewYorkSydneyCitysForcast = () => {
    axios.get("http://localhost:3000/pageLoad")
      .then((res) => {
        this.setState({ weatherLocations: res.data })
        console.log("Cities");
      })
  }






  render() {
    return (
      <div className="page">

        <div className="header">
          <TextField onChange={this.inputHandler} className="input" id="outlined-basic" label="Enter City Name" variant="outlined" onc />
          <Button style={buttonStyle} onClick={this.handleClick} >Get Weather</Button>
        </div>


        <div className="cards" >
          <Card style={cardStyle} >

            <CardContent>
              <h3>{this.state.searchCity.Name}</h3>
              <img src={this.state.searchCity.Image} alt={this.state.searchCity.ImageDescs} /><br />
              <div className="temperature">{this.state.searchCity.Temp}</div><br />
              <div className="card-details">
                {this.state.searchCity.ImageDesc}<br />
                {this.state.searchCity.Humidity}<br />
                {this.state.searchCity.Wind}<br />
              </div>
            </CardContent>

          </Card>


          {this.state.weatherLocations.map(location =>
            <Card style={cardStyle}>
              <CardContent >
                <h3>{location.Name}</h3>
                <img src={location.Image} alt={location.ImageDesc} /><br />
                <div className="temperature">{location.Temp}</div><br />
                <div className="card-details">
                  {location.ImageDesc}<br />
                  {location.Humidity}<br />
                  {location.Wind}<br />
                </div>
              </CardContent>
            </Card>)}
        </div>
      </div>


    );
  }
}



export default App;

