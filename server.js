const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


const puppeteer = require('puppeteer');
const url = 'https://www.google.com/search?q=weather+';
const jsdom = require('jsdom');
const cors = require('cors');
app.use(cors());


let newYorkWeather;
let sydneyWeather;
//let localWeather;

app.get('/getweather', (req, res) => {
    getWeather(url + req.query.name)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        })

})

//returns array of 2 cities New York and Sydney
app.get('/pageLoad', (req, res) => {
    Promise.resolve(newYorkWeather)
        .then((resNewYork) => {
            Promise.resolve(sydneyWeather)
                .then((resSydney) => {
                   res.send([resNewYork, resSydney]);
                });
        })
        .catch((err) => {
            console.log(err);
        })

})

//Web scrapper - query google for the weather data
async function getWeather(url) {

    const browser = await puppeteer.launch();
    console.log('browser');
    const page = await browser.newPage();
    // takes a lot of time - need fix
    await page.goto(url);
    const html = await page.content();
    const dom = new jsdom.JSDOM(html);
    let weatherData = {
        Name: dom.window.document.getElementById("wob_loc").textContent,
        Temp: dom.window.document.getElementById("wob_tm").textContent +"°C",
        Humidity: "Humidity: " + dom.window.document.getElementById("wob_hm").textContent,
        Wind: "Wind: " + dom.window.document.getElementById("wob_tws").textContent,
        Image: dom.window.document.getElementById("wob_tci").src,
        ImageDesc: dom.window.document.getElementById("wob_dc").textContent,
    };
    console.log(weatherData);
    return (weatherData);
};

app.listen(3000, function () {
    console.log('Server listening on port 3000.');
    getConstWheathers();
    
    
    //update the cities weather
    setInterval(getConstWheathers,300000);

})

function getConstWheathers() {
    newYorkWeather = getWeather(url + "new york");
    sydneyWeather = getWeather(url + "sydney");
}





