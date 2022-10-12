const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
app.use(express.urlencoded({ extended: false }));

const ShortUrl = require('./models/shortUrl');

mongoose.connect(process.env.MONGO_URL, () => {
  console.log('Connected to MONGODB');
});

app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render('index', { shortUrls });
});

app.post('/shortUrls', async (req, res) => {
  try {
    const url = await ShortUrl.create({ full: req.body.fullUrl });
    console.log(url);
    res.redirect('/');
  } catch (error) {
    console.log(error);
  }
});

app.get('/:shortUrl', async (req, res) => {
  try {
    const param = req.params.shortUrl;
    const short = await ShortUrl.findOne({ short: param });
    if (!short) return res.sendStatus(404);

    short.clicks++;
    await short.save();

    res.redirect(short.full);
  } catch (error) {
    console.log(error);
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT);
