var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Comment = mongoose.model('comments');

/* GET users listing. */
router.get('/', function(req, res) {

    var drinks = [
        { name: 'Bloody Mary', drunkness: 3 },
        { name: 'Martini', drunkness: 5 },
        { name: 'Scotch', drunkness: 10 }
    ];
    var tagline = "Any code of your own that you haven't lne else.";

    Comment.find(function(err, comments){
        console.log(comments);
    
         res.render('form', {
            title: "Form Test", //page title
            action: "/form", //post action for the form
            fields: [
            	{name:'comment',type:'text',property:'required',value:'comment'},   //first field for the form
            	{name:'password',type:'password',property:'required'}   //another field for the form
            ],
        drinks: drinks,
        tagline: tagline,
        comments : comments}
        );
    });

});


/* POST form. */
router.post('/', function(req, res) {
    new Comment({title : req.body.comment})
    .save(function(err,comment) {
      console.log(req.body.comment);
    res.redirect('form');
   });
});

module.exports = router;