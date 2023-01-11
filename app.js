const express = require("express");
const https = require("node:https");
const bodyParser = require("body-parser");
var url = require('url');
const dayjs = require("dayjs");
var utc = require('dayjs/plugin/utc');
var timezone = require('dayjs/plugin/timezone');
const { IPinfoWrapper } = require("node-ipinfo");
const requestIP = require('request-ip');
const request = require('dotenv').config();

dayjs.extend(utc);
dayjs.extend(timezone);

const ipinfo = new IPinfoWrapper(process.env.ipInfoKey);

const app = express();
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));

let city = 'lisbon';
var units = "metric";

let type_of_measurement = 'ºC'
let daySelected = 0;

// VERSION 1.0.5


function createAllData(city){

    dayOfWeekNow = dayjs.tz().day();
    yearRightNow = dayjs.tz().year();
    monthRightNow = dayjs.tz().month() + 1;
    dayRightNow = dayjs.tz().date();

    app.get("/day1", function(req,res){
        function changeDaySelected(callback){

            if(daySelected==0){
                daySelected = 1;
            } else{
                daySelected = 0;
            }

            var allData = '';
            var urlToApi = "https://api.openweathermap.org/data/2.5/forecast?q="+city+"&units="+units+"&appid="+process.env.key;
            
            discoverDaysOfWeek();
            discoverDateOfYear();
            getAllInformation(urlToApi, allData, callback);
        }

        changeDaySelected(() => {
            renderFile(res);
        })
    })

    app.get("/day2", function(req,res){
        function changeDaySelected(callback){
             if(daySelected==1 || daySelected==0){
                daySelected = 2;
            } else{
                daySelected = 1;
            }

            var allData = '';
            var urlToApi = "https://api.openweathermap.org/data/2.5/forecast?q="+city+"&units="+units+"&appid="+process.env.key;
            
            discoverDaysOfWeek();
            discoverDateOfYear();
            getAllInformation(urlToApi, allData, callback);
        }

        changeDaySelected(() => {
            renderFile(res);
        })
    })

    app.get("/day3", function(req,res){
        function changeDaySelected(callback){

             if(daySelected==2 || daySelected==0 || daySelected==1){
                daySelected = 3;
            } else{
                daySelected = 2;
            }

            var allData = '';
            var urlToApi = "https://api.openweathermap.org/data/2.5/forecast?q="+city+"&units="+units+"&appid="+process.env.key;
            
            discoverDaysOfWeek();
            discoverDateOfYear();
            getAllInformation(urlToApi, allData, callback);
        }

        changeDaySelected(() => {
            renderFile(res);
        })
    })

    app.get("/day4", function(req,res){
        function changeDaySelected(callback){

             if(daySelected !=4){
                daySelected = 4;
            } else{
                daySelected = 3;
            }

            var allData = '';
            var urlToApi = "https://api.openweathermap.org/data/2.5/forecast?q="+city+"&units="+units+"&appid="+process.env.key;
            
            discoverDaysOfWeek();
            discoverDateOfYear();
            getAllInformation(urlToApi, allData, callback);
        }

        changeDaySelected(() => {
            renderFile(res);
        })
    })

    let day = [];
    let message = '';

    let date_ = [];
    let date__ = [];

    let hour = [];
    let icon_hour = [];
    let temp_hour = [];

    let temp = []
    let icon = [];

    let tempSecondDayIndex = 0;
    let tempThirdDayIndex = 0;
    let tempFourthDayIndex = 0;
    let tempFifthDayIndex = 0;


    function getAllInformation(urlToApi, allData, callback){
        https.get(urlToApi, function(response){
            response.on('data', function(data){
                allData += data;
            })
            response.on('end', function() {      
                allData = JSON.parse(allData);
                if(allData.message != 0){

                    message = allData.message;
                    temp_hour = [];
                    hour = [];
                    icon_hour = [];
                    temp = [];
                    icon = [];
                    callback();

                } else{

                    let number = [];

                    function getMidNight(callback){
                        let findHour;
                        let numberOfMidNight = 0;

                        while(findHour != date__[1] + " 00:00:00"){
                            findHour = allData.list[numberOfMidNight].dt_txt;
                            numberOfMidNight+=1;
                        }

                        for (let index = 0; index < 9; index++) {
                            newNumber = numberOfMidNight + index -1;
                            number.push(newNumber);
                            if(index==8){
                                callback();
                            }
                        }
                    }

                    function getDetails(){

                        message = '';
                        temp_hour[1] = Math.round(allData.list[number[0]].main.temp);
                        temp_hour[2] = Math.round(allData.list[number[1]].main.temp);
                        temp_hour[3] = Math.round(allData.list[number[2]].main.temp);
                        temp_hour[4] = Math.round(allData.list[number[3]].main.temp);
                        temp_hour[5] = Math.round(allData.list[number[4]].main.temp);
                        temp_hour[6] = Math.round(allData.list[number[5]].main.temp);
                        temp_hour[7] = Math.round(allData.list[number[6]].main.temp);
                        temp_hour[8] = Math.round(allData.list[number[7]].main.temp);
            
                        hour[1] = allData.list[number[0]].dt_txt.split(" ")[1];
                        hour[2] = allData.list[number[1]].dt_txt.split(" ")[1];
                        hour[3] = allData.list[number[2]].dt_txt.split(" ")[1];
                        hour[4] = allData.list[number[3]].dt_txt.split(" ")[1];
                        hour[5] = allData.list[number[4]].dt_txt.split(" ")[1];
                        hour[6] = allData.list[number[5]].dt_txt.split(" ")[1];
                        hour[7] = allData.list[number[6]].dt_txt.split(" ")[1];
                        hour[8] = allData.list[number[7]].dt_txt.split(" ")[1];
            
                        icon_hour[1] = "http://openweathermap.org/img/wn/"+ allData.list[number[1]].weather[0].icon +"@4x.png"
                        icon_hour[2] = "http://openweathermap.org/img/wn/"+ allData.list[number[2]].weather[0].icon +"@4x.png"
                        icon_hour[3] = "http://openweathermap.org/img/wn/"+ allData.list[number[3]].weather[0].icon +"@4x.png"
                        icon_hour[4] = "http://openweathermap.org/img/wn/"+ allData.list[number[4]].weather[0].icon +"@4x.png"
                        icon_hour[5] = "http://openweathermap.org/img/wn/"+ allData.list[number[5]].weather[0].icon +"@4x.png"
                        icon_hour[6] = "http://openweathermap.org/img/wn/"+ allData.list[number[6]].weather[0].icon +"@4x.png"
                        icon_hour[7] = "http://openweathermap.org/img/wn/"+ allData.list[number[7]].weather[0].icon +"@4x.png"
                        icon_hour[8] = "http://openweathermap.org/img/wn/"+ allData.list[number[8]].weather[0].icon +"@4x.png"
                    
    
                        while(allData.list[tempSecondDayIndex].dt_txt != allData.list[0].dt_txt){
                            tempSecondDayIndex+=1;
                        }
    
                        while(allData.list[tempThirdDayIndex].dt_txt != date__[3] + " " +"12:00:00"){
                            tempThirdDayIndex+=1;
                        }
                        while(allData.list[tempFourthDayIndex].dt_txt != date__[4] + " " +"12:00:00"){
                            tempFourthDayIndex+=1;
                        }
                        while(allData.list[tempFifthDayIndex].dt_txt != date__[5] + " " +"12:00:00"){
                            tempFifthDayIndex+=1;
                        }
            
                        temp[2] = Math.round(allData.list[tempSecondDayIndex].main.temp);
                        temp[3] = Math.round(allData.list[tempThirdDayIndex].main.temp);
                        temp[4] = Math.round(allData.list[tempFourthDayIndex].main.temp);
                        temp[5] = Math.round(allData.list[tempFifthDayIndex].main.temp);
            
                        icon[2] = "http://openweathermap.org/img/wn/"+ allData.list[tempSecondDayIndex].weather[0].icon +"@4x.png";
                        icon[3] = "http://openweathermap.org/img/wn/"+ allData.list[tempThirdDayIndex].weather[0].icon +"@4x.png";
                        icon[4] = "http://openweathermap.org/img/wn/"+ allData.list[tempFourthDayIndex].weather[0].icon +"@4x.png";
                        icon[5] = "http://openweathermap.org/img/wn/"+ allData.list[tempFifthDayIndex].weather[0].icon +"@4x.png";
    
                        tempSecondDayIndex = 0;
                        tempThirdDayIndex = 0;
                        tempFourthDayIndex = 0;
                        tempFifthDayIndex = 0;
                    }

                    if(daySelected!=0){
                        getMidNight(() => {
                            getDetails();
                        })
                    } else{
                        for (let index = 0; index < 9; index++) {
                            number[index] = index;                            
                        }
                        getDetails();
                    }
                    callback();
                };
            });
        });
    }

    function renderFile(res){
        res.render("index.html", {
            city:city, type_of_measurement:type_of_measurement, message:message,
            temp,[2]:temp[2],  temp,[3]:temp[3], temp,[4]:temp[4], temp,[5]:temp[5],
            day,[1]:day[1] ,day,[2]:day[2],day,[3]:day[3],day,[4]:day[4],day,[5]:day[5],day,[6]:day[6],day,[7]:day[7],
            date_,[1]:date_[1], date_,[2]:date_[2],date_,[3]:date_[3], date_,[4]:date_[4], date_,[5]:date_[5],
            hour,[1]:hour[1], hour,[2]:hour[2], hour,[3]:hour[3], hour,[4]:hour[4], hour,[5]:hour[5], hour,[6]:hour[6], hour,[7]:hour[7], hour,[8]:hour[8], 
            icon_hour,[5]:icon_hour[5], icon_hour,[6]:icon_hour[6], icon_hour,[7]:icon_hour[7], icon_hour,[8]:icon_hour[8], 
            icon_hour,[5]:icon_hour[5], icon_hour,[6]:icon_hour[6], icon_hour,[7]:icon_hour[7], icon_hour,[8]:icon_hour[8], 
            temp_hour,[1]:temp_hour[1], temp_hour,[2]:temp_hour[2], temp_hour,[3]:temp_hour[3], temp_hour,[4]:temp_hour[4],
            temp_hour,[5]:temp_hour[5], temp_hour,[6]:temp_hour[6], temp_hour,[7]:temp_hour[7], temp_hour,[8]:temp_hour[8],
            icon,[2]:icon[2], icon,[3]:icon[3], icon,[4]:icon[4], icon,[5]:icon[5],
        })
    }

    function discoverDaysOfWeek(){
        if(dayOfWeekNow==0){
            day[1] = 'Sunday';
            day[2] = 'Monday';
            day[3] = 'Tuesday';
            day[4] = 'Wednesday';
            day[5] = 'Thursday';
            day[6] = 'Friday';
            day[7] = 'Saturday';
        }
        if(dayOfWeekNow==1){
            day[1] = 'Monday';
            day[2] = 'Tuesday';
            day[3] = 'Wednesday';
            day[4] = 'Thursday';
            day[5] = 'Friday';
            day[6] = 'Saturday';
            day[7] = 'Sunday';
        }
        if(dayOfWeekNow==2){
            day[1] = 'Tuesday';
            day[2] = 'Wednesday';
            day[3] = 'Thursday';
            day[4] = 'Friday';
            day[5] = 'Saturday';
            day[6] = 'Sunday';
            day[7] = 'Monday';
        }
        if(dayOfWeekNow==3){
            day[1] = 'Wednesday';
            day[2] = 'Thursday';
            day[3] = 'Friday';
            day[4] = 'Saturday';
            day[5] = 'Sunday';
            day[6] = 'Monday';
            day[7] = 'Tuesday';
        }
        if(dayOfWeekNow==4){
            day[1] = 'Thursday';
            day[2] = 'Friday';
            day[3]= 'Saturday';
            day[4] = 'Sunday';
            day[5] = 'Monday';
            day[6] = 'Tuesday';
            day[7] = 'Wednesday';
        }
        if(dayOfWeekNow==5){
            day[1] = 'Friday';
            day[2]= 'Saturday';
            day[3] = 'Sunday';
            day[4] = 'Monday';
            day[5] = 'Tuesday';
            day[6] = 'Wednesday';
            day[7] = 'Thursday';
        }
        if(dayOfWeekNow==6){
            day[1] = 'Saturday';
            day[2] = 'Sunday';
            day[3] = 'Monday';
            day[4] = 'Tuesday';
            day[5] = 'Wednesday';
            day[6] = 'Thursday';
            day[7] = 'Friday';
        }

        if(daySelected==1){
            day[0] = day[1];
            day[1] = day[2];
            day[2] = day[0]
        } if(daySelected==2){
            day[0] = day[1];
            day[1] = day[3];
            day[3] = day[2];
            day[2] = day[0];
        } if(daySelected==3){
            day[0] = day[1];
            day[1] = day [4];
            day[4] = day[3];
            day[3] = day[2];
            day[2] = day[0];
        } if(daySelected==4){
            day[0] = day[1];
            day[1] = day[5];
            day[5] = day[4];
            day[4] = day[3];
            day[3] = day[2];
            day[2] = day[0];
        }
    }

    function discoverDateOfYear(){
        let dayNowAndFuture = [];
        let monthsNowAndFuture = [];
        let yearsNowAndFuture = [];
        let futureMonthHere = false;

        let newDay = Number(dayRightNow);
        let amountDaysMonth = dayjs().daysInMonth();
        for(i=1; i<6; i++){
            if(i==1){
                newDay = newDay +0;
            } else{
                newDay = newDay +1;
            }
            if(newDay>amountDaysMonth){
                newDay = newDay - amountDaysMonth;
                futureMonthHere = true;
            } else{
                yearsNowAndFuture[i] = yearRightNow;
                monthsNowAndFuture[i] = monthRightNow;
            }          
            if(newDay<10){
                var newDayZero = "0" + newDay;
                dayNowAndFuture[i] = newDayZero;
                if(futureMonthHere == true){
                    monthsNowAndFuture[i] = monthRightNow+1;
                    if(monthsNowAndFuture[i]>12){
                        monthsNowAndFuture[i] = "01";
                        yearsNowAndFuture[i] = yearRightNow+1;
                    }
                }
            } else{
                dayNowAndFuture[i] = newDay;
                monthsNowAndFuture[i] = monthRightNow;
                yearsNowAndFuture[i] = yearRightNow;
            }      
            if(monthRightNow<10){
                var newMonthZero = "0" + monthRightNow;
                monthsNowAndFuture[i] = newMonthZero;
            }
        }

        if(daySelected==1){
            dayNowAndFuture[0] = dayNowAndFuture[1];
            dayNowAndFuture[1] = dayNowAndFuture[2];
            dayNowAndFuture[2] = dayNowAndFuture[0];
        } if(daySelected==2){
            dayNowAndFuture[0] = dayNowAndFuture[1];
            dayNowAndFuture[1] = dayNowAndFuture[3];
            dayNowAndFuture[3] = dayNowAndFuture[2];
            dayNowAndFuture[2] = dayNowAndFuture[0];
        } if(daySelected==3){
            dayNowAndFuture[0] = dayNowAndFuture[1];
            dayNowAndFuture[1] = dayNowAndFuture[4];
            dayNowAndFuture[4] = dayNowAndFuture[3];
            dayNowAndFuture[3] = dayNowAndFuture[2];
            dayNowAndFuture[2] = dayNowAndFuture[0];
        } if(daySelected==4){
            dayNowAndFuture[0] = dayNowAndFuture[1];
            dayNowAndFuture[1] = dayNowAndFuture[5];
            dayNowAndFuture[5] = dayNowAndFuture[4];
            dayNowAndFuture[4] = dayNowAndFuture[3];
            dayNowAndFuture[3] = dayNowAndFuture[2];
            dayNowAndFuture[2] = dayNowAndFuture[0];
        }


        date_[1] =  dayNowAndFuture[1]+"/"+monthsNowAndFuture[1]+"/"+yearsNowAndFuture[1];
        date_[2] =  dayNowAndFuture[2]+"/"+monthsNowAndFuture[2]+"/"+yearsNowAndFuture[2];
        date_[3] =  dayNowAndFuture[3]+"/"+monthsNowAndFuture[3]+"/"+yearsNowAndFuture[3];
        date_[4] =  dayNowAndFuture[4]+"/"+monthsNowAndFuture[4]+"/"+yearsNowAndFuture[4];
        date_[5] =  dayNowAndFuture[5]+"/"+monthsNowAndFuture[5]+"/"+yearsNowAndFuture[5];

        date__[1] =  yearsNowAndFuture[1]+"-"+monthsNowAndFuture[1]+"-"+dayNowAndFuture[1];
        date__[2] =  yearsNowAndFuture[2]+"-"+monthsNowAndFuture[2]+"-"+dayNowAndFuture[2];
        date__[3] =  yearsNowAndFuture[3]+"-"+monthsNowAndFuture[3]+"-"+dayNowAndFuture[3];
        date__[4] =  yearsNowAndFuture[4]+"-"+monthsNowAndFuture[4]+"-"+dayNowAndFuture[4];
        date__[5] =  yearsNowAndFuture[5]+"-"+monthsNowAndFuture[5]+"-"+dayNowAndFuture[5];

    }

    discoverDaysOfWeek();
    discoverDateOfYear();

    app.post("/temp", function(req, res){

        function changeMeasure(callback){
            if(req.body.exampleRadios==0){
                units = 'metric';
                type_of_measurement = 'ºC'
            }
            if(req.body.exampleRadios==1){
                units = 'imperial';
                type_of_measurement = 'ºF'
            }
            if(req.body.exampleRadios==2){
                units = 'standart';
                type_of_measurement = 'K'
            }
            var allData = '';
            var urlToApi = "https://api.openweathermap.org/data/2.5/forecast?q="+city+"&units="+units+"&appid="+process.env.key;
    
            
            getAllInformation(urlToApi, allData, callback);
        }

        changeMeasure(() => {
            renderFile(res);
        })

    })

    app.use("/", function(req, res){
        function decideCity(callback){
            var cityByUrl = req.originalUrl.slice(1);
            if (cityByUrl!='app.js'&&cityByUrl!='favicon.ico'){
                if (cityByUrl!=''){
                    city = cityByUrl;
                    var allData = '';
                    var urlToApi = "https://api.openweathermap.org/data/2.5/forecast?q="+city+"&units="+units+"&appid="+process.env.key;
                    getAllInformation(urlToApi, allData, callback);

                } else{
                    let city;
                    const ipAddress = requestIP.getClientIp(req);

                    ipinfo.lookupIp(ipAddress).then((response) => {
                        city = response.country;
                        isFirstTime = true;
                        var allData = '';
                        var urlToApi = "https://api.openweathermap.org/data/2.5/forecast?q="+city+"&units="+units+"&appid="+process.env.key;
                        getAllInformation(urlToApi, allData, callback);
                    });
                }
            }
        }

        decideCity(() => {
            renderFile(res);
            daySelected = 0;
        })
    })
}

app.post("/text", function(req, res){
    city = req.body.cityName
    res.redirect("/"+city)
})

createAllData(city);

app.listen(process.env.PORT || 3000, function(){
    console.log("Server running on port " + process.env.PORT);
})
