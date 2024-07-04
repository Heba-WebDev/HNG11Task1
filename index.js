import express from "express";
import "dotenv/config";
import geoip from 'geoip-lite';

const app = express();
const port = process.env.PORT || 3000;
app.set("trust proxy", true);

app.use(express.json());
app.get(
  "/api/hello",
  async (req, res ) => {
   const visitorName = req.query.visitor_name || "Visitor";
    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    var geo = geoip.lookup(clientIp);
    console.log(geo.ll)
    const weather = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${geo?.ll[0]}&lon=${geo?.ll[1]}&units=metric&appid=${process.env.KEY}`
    ).then((data) => data.json());
    console.log(weather.main.temp_max);
  
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({
      client_ip: clientIp,
      location: geo?.city,
      greeting: `Hello, ${visitorName}!, the temperature is ${weather?.main?.temp_max} degrees Celcius in ${geo?.city}`,
    });
  }
);


app.listen(port,'0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
