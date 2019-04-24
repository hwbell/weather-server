var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');

// good npm package, makes syntax much easier
const DarkSkyApi = require('dark-sky-api');
DarkSkyApi.apiKey = process.env.APPID;
DarkSkyApi.proxy = true; 

const checkInput = (lat, long, res) => {
  // make sure you have parameters
  if (!lat || !long) {
    res.render('nocoords', { 
      title: `Please include a latitude and longitude` 
    });
  } else if ( !Number(lat) || !Number(long)) { // make sure they are #s
    res.render('nocoords', { 
      title: `latitude and longitude must be numbers` 
    });
  } else if ( Math.abs(lat) > 180 || Math.abs(long) > 180) { // make sure they are valid
    res.render('nocoords', { 
      title: `latitude and longitude must be real!` 
    });
  }
}


/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('GET @ /');
  res.render('nocoords', { 
    title: `Include a latitude and longitude in the url!`, 
  });

});

router.get('/:lat/:long', function(req, res, next) {
  console.log('GET @ /:lat/:long')
  var lat = req.params.lat;
  var long = req.params.long;
  console.log(lat, long)

  checkInput(lat, long, res);

  const position = {
    latitude: Number(lat), 
    longitude: Number(long)
  };

  // make the call to darksky
  fetch(`https://api.darksky.net/forecast/${process.env.APPID}/${lat},${long}`)
    .then(response => response.json())
    .then( (weatherInfo) => {
      console.log(weatherInfo)
      
      // send it back
      weatherInfo.mapBoxKey = process.env.MAPBOX_KEY;
      res.send(weatherInfo);
    })

});

module.exports = router;
