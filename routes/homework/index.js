var express = require('express');
var router = express.Router();
var board  = require("./board")
router.use('/board',board)
module.exports = router;
