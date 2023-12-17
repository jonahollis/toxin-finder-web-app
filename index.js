
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express()

app.get('/', (req, res) => res.send('hello world'))

app.get(
  '/get',
  cors(),
  async (req, res) => {
    console.log(req.query)
    // strip leading slash
    const url = req.query.url
    if (!url) {
      res.send('url required')
      return
    }
    axios({
      url,
      method: 'GET',
      responseType: 'stream',
    }).then(data => {
      data.data.pipe(res)
    }).catch(err => {
      console.log(`err on ${url}`, err.message)
    })
  },
);

app.listen(8080, () => {
  console.log('started')
})
