import express from "express";
import "dotenv/config";

const app = express();
const port = 5002 || process.env.PORT;
app.set("trust proxy", true);

app.use(express.json());
app.get(
  "/api/hello",
  async (req, res ) => {
    const name = req.query.visitor_name || "visitor";
    const ip = req.ip;
    const loc = await getLocation;
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${loc.lat}&lon=${loc.lon}&units=metric&appid=${process.env.KEY}`
    );
    const weatherData = await weatherResponse.json();
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({
      client_ip: ip,
      location: loc.city,
      greeting: `Hello, ${name}, the temperature is ${weatherData.main.temp} degrees Celcius in ${loc.city}`,
    });
  }
);

const getLocation = fetch("http://ip-api.com/json/?fields=61439").then((data) =>
  data.json()
);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
