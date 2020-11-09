//Created by Saksham Agarwal
//19323666
const express = require('express')
const app = express()
const port = 8000
const path = require("path")
let publicPath = path.resolve(__dirname, "public")
app.use(express.static(publicPath))
app.listen(port, function(){
     console.log(`Weather app listening on port ${port}!`)
    })
const fetch = require("node-fetch")
const APIkey = "5e3372a4963938fde6772cf72372f17e";

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/Client.html"))})
app.get("/weather/:location", Weatherprediction)

async function Weatherprediction(req, res) {

    var city = req.params.location
    const url = "https://api.openweathermap.org/data/2.5/forecast?q="+ city + "&units=metric" +"&appid=" +APIkey
    var response = await fetch(url)
    let weatherData = await response.json()
 
    var packing_advise, date = ''
    var temp, windSpeed,rain = 0
    var prediction_list = {
      Umbrella : "The weather is clear today in "+ city + " ,no umbrella is required!",
      Clothes: '',
      forecastList :[]
    }
    Umbrella = 'N' 
    Clothes = ' ' 

    if(weatherData.list[0].rain != undefined){
        if(JSON.stringify(weatherData).substr(6,4) != ''){
            prediction_list.Umbrella = "There is prediction for rain in " +city+ ",you should bring an umbrella ";
        }
    }

    for(var index = 0; index < (weatherData.list.length); index++){
        date = weatherData.list[index].dt_txt
        temp = weatherData.list[index].main.temp
        rain = Rain_prediction(weatherData.list[index].rain)
        windSpeed = weatherData.list[index].wind.speed;
        packing_advise = Pack(weatherData.list[index].main.temp, prediction_list)

        prediction_list.forecastList.push(
            {
                Date: date,
                Temp: temp,
                Rainfall: rain,
                Windspeed: windSpeed, 
            }
        )
    }
    res.json(prediction_list)
}

function Pack(temp, prediction_list){
    if(temp >= -10 && temp <= 10){
        packing_advise = "Cold"
        prediction_list.Clothes = "It will be a Cold day, wear clothes for cold weather"
    }
    else if(temp > 10 && temp <= 20){
        packing_advise = "Warm"
        prediction_list.Clothes = "It will be a warm day, wear clothes for warm weather"
    }
    else{
        packing_advise = "Hot"
        prediction_list.Clothes = "It will be a Hot  day, wear clothes for Hot weather"
    }
    return packing_advise
}


function Rain_prediction(weatherData){

    if(weatherData != undefined){
        if(JSON.stringify(weatherData).substr(6,4) != ''){
            rain = parseFloat((JSON.stringify(weatherData)).substr(6,4))
        }      
    }
    else{
        rain = '0.0'
    }
    return rain
}


