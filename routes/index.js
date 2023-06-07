var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Google Sheets Backend' });
  console.log("Testing this here")
});

// GET some of that sweet google data

module.exports = router;
