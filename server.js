// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


app.get('/api/timestamp/:data_string?',function(req, res, next){
  
  let timeRequest = req.params.data_string || '';
  let dataSend = new Date();
  let jsonData = {
      unix: dataSend.getTime(),
      utc: dataSend.toUTCString()
  };
  if(timeRequest != '')
  {
      if(new RegExp('^\\d+$').test(`${timeRequest}`))
      {
        //data with only digits, unix format
        dataSend =new Date(parseInt(`${timeRequest}`));
        jsonData = {
            unix: dataSend.getTime(),
            utc: dataSend.toUTCString()
        };
      }
     else if(new RegExp('^[0-9]+-[0-9]+-[0-9]+$','ig').test(`${timeRequest}`))
     {
       //data with '-' example '2015-09-09'
        dataSend =new Date(`${timeRequest}`);
        jsonData = {
            unix: dataSend.getTime(),
            utc: dataSend.toUTCString()
        };
       
      }
      else if(new RegExp('[^\d-]+','ig').test(`${timeRequest}`))
      {
        //data with letter or alphanumeric, except '-' and digits
        delete jsonData.unix;
        delete jsonData.utc;
        jsonData = {error: 'Invalid Date'}
      }
  }
  res.json(jsonData);
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});