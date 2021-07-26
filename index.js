const http = require("http");
const fs = require("fs");
var requests = require("requests");
const port = process.env.PORT || 80;


const homeFile = fs.readFileSync("index.html", 'utf-8');


const replaceValue = (temperatureValue, originalValue) => {
    let temperature = temperatureValue.replace("{%tempval%}", originalValue.main.temp);
    temperature = temperature.replace("{%tempminval%}", originalValue.main.temp_min);
    temperature = temperature.replace("{%tempmaxval%}", originalValue.main.temp_max);
    temperature = temperature.replace("{%location%}", originalValue.name);
    temperature = temperature.replace("{%country%}", originalValue.sys.country);
    temperature = temperature.replace("{%tempstatus%}", originalValue.weather[0].main);

    return temperature;
};

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests(
            "http://api.openweathermap.org/data/2.5/weather?q=Kolkata&units=metric&appid=c3be4f76f0f5524f051905656d778488"
        )
            .on("data", (chunk) => {
                const objdata = JSON.parse(chunk);
                const arrData = [objdata];
                const realTimeData = arrData
                    .map((value) => replaceValue(homeFile, value))
                    .join("");
                res.write(realTimeData);
                // console.log(realTimeData);
            })
            .on("end", (err) => {
                if (err) return console.log("connection closed due to errors", err);
                res.end();
            });
    } else {
        res.end("File not found");
    }
});

server.listen(port, "127.0.0.1", ()=>{
    console.log(`Server is running at port ${port}`);
});