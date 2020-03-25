import React from 'react';
import './App.css';
import axios from 'axios';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { DotLoader } from "react-spinners";



const buttonStyle = {
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  marginLeft: '20px',
  borderRadius: 3,
  border: 0,
  color: 'white',
  height: 48,
  padding: '0 30px',
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
};


const cardStyle = {
  margin: '60px 30px ',
  display: 'inline - block',
  boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
  width: '300px',
  height: '350px',
  boxSizing: 'border-box',
};

let myIntaerval = null;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      weatherLocations: [],
      cityToSearch: "",
      searchCity: "",
      displaySearchCard: false,
      loading: false,
      inputValue: ""
    }
    
  }

  inputHandler = (event) => {
    this.setState({ cityToSearch: event.target.value, inputValue: event.target.value })
    
  };
  
  handleClick = () => {
    this.setState({ loading: true, inputValue:""});
    this.getCityForcast(this.state.cityToSearch);
    //checks for any update user weather
    if (myIntaerval !== null) {clearInterval(myIntaerval);}
    else{myIntaerval = setInterval(this.getCityForcast, 600000, this.state.cityToSearch);}   
    

  }

  componentDidMount() {
    this.updateNewYorkSydneyCitysForcast();
    //Updating New York and Sydney
    setInterval(this.updateNewYorkSydneyCitysForcast, 300000);
  } 


  getCityForcast = (cityName) => {
    axios.get("http://localhost:3001/getweather?name=" + cityName)
      .then((res) => {
        this.setState({ searchCity: res.data, displaySearchCard: true, loading: false })
        
        console.log("Search");
      })
  }

  updateNewYorkSydneyCitysForcast = () => {
    axios.get("http://localhost:3001/pageLoad")
      .then((res) => {
        this.setState({ weatherLocations: res.data })
        console.log("Cities");
      })
  }

  render() {
    return (
      <div className="page">

        <div className="header">
          <TextField onChange={this.inputHandler} className="input" id="outlined-basic" label="Enter City Name" variant="outlined" value={this.state.inputValue} />
          <Button style={buttonStyle} onClick={this.handleClick} >Get Weather</Button>
        </div>

        <div className="sweet-loading">
          <DotLoader
            size={50}
            color={"#123abc"}
            loading={this.state.loading}
          />
        </div>

        <div className="cards" >
          {this.state.displaySearchCard ? (
            <Card style={cardStyle}  >
              <CardContent>
                <h3>{this.state.searchCity.Name}</h3>
                <img src={this.state.searchCity.Image} alt={this.state.searchCity.ImageDescs} /><br />
                <div className="temperature">{this.state.searchCity.Temp}</div><br />
                <div className="card-details">
                  {this.state.searchCity.TimeStamp}<br />
                  {this.state.searchCity.ImageDesc}<br />
                  {this.state.searchCity.Humidity}<br />
                  {this.state.searchCity.Wind}<br />
                </div>
              </CardContent>
            </Card>) : (<span></span>)
          }

          {this.state.weatherLocations.map((location,index) =>
            <Card style={cardStyle} key={index}>
              <CardContent>
                <h3>{location.Name}</h3>
                <img src={location.Image} alt={location.ImageDesc} /><br />
                <div className="temperature">{location.Temp}</div><br />
                <div className="card-details">
                  {location.TimeStamp}<br />
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

