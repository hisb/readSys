var express = require('express');
var router = express.Router();

router.get('/editPerson', function(req, res) {
	res.render('editPerson', {title: '编辑资料'});
});

module.exports = router;