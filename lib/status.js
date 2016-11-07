var router = require('express').Router();

router.get('/', function (req, res, next) {
  return res.json({
      status: 'nothing to see here....'
  });
});

module.exports = router;
