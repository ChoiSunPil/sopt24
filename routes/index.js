var express = require('express');
var router = express.Router();
var homework  =  require('./homework/index')

router.use('/homework',homework)

module.exports = router;
