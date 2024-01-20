require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const app = express();
const port = process.env.PORT || 8080;

app.use(express.static('public'));

app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));

app.get('/get', cors(), async (req, res) => {
    console.log(req.query);
    const url = req.query.url;

    if (!url) {
      res.status(400).send('URL required');
      return;
    }

    try {
      const response = await axios.get(url, { responseType: 'text' });
      parser.parseString(response.data, (err, result) => {
        if (err) {
          console.error('Error parsing XML:', err);
          res.status(500).send('Error parsing XML');
          return;
        }
        res.setHeader('Access-Control-Allow-Origin', '*');
        console.log(result);
        res.json(result);
      });
    } catch (err) {
      console.log(`Error on ${url}:`, err.message);
      res.status(500).send('Server error occurred');
    }
});

app.listen(8080, () => {
  console.log(`Server started on port ${port}`);
});