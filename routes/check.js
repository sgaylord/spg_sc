var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var async = require('async');

const https = require('https')
const http = require('http')
const crypto = require('crypto')

var checkbookgateway = null;

/* GET users listing. */
router.get('/', function(req, res) {
    res.render('check',
    	{
            title: "Check Test", //page title
            action: "/check", //post action for the form
            fields: [
            	{name:'name',type:'text',value:'comment'},   //first field for the form
            	{name:'checknum',type:'text',value:''},   //another field for the form	
				{name:'routingnum',type:'text',value:''},   //another field for the form
				{name:'accountnum',type:'text',value:''}   //another field for the form
            ]
        }

    	);
});


/* POST form. */
router.post('/', function(req, res) {

/*

var checkRequestData = {
    "first_name": "Ramyatha",
    "last_name": "Yugendernath",
    "amount": 20,
    "recipient": "ramyathaby@gmail.com"
};
var key = process.env.CHECKBOOK_KEY;
var secret = process.env.CHECKBOOK_SECRET;
var checkbook = require('checkbook.io')(key, secret);
checkbook.setRealm('sandbox');
checkbook.check.sendDigital(checkRequestData, function(err, response){
  console.log(response);
});

*/














        checkbook_gateway = {
            environment:  'sandbox.checkbook.io',
            publicKey:    '237243046d294dc8a5638e027ded097c',
            privateKey:   '0bb36596269c3f39a427308f9d0b7c80f758e963ff09a70c2fe14ce092db26140462d6012d19f1223b06c1cfc881a66c10952b1b0c8243e2d75d44864db1aad5cc7b1418bd03c94ba1db30ca002b275c52f0c73d3cd0b6b5e2a681cbe71a57fb1d261ce46b1dc5fd1209e3b324be2daa28414cadd96a45903a26133493611dacd568ff20b2db1a36487362dde75f9c9e794df70770b031575a3821a75db42cae201d444891307175303faf9c463d5b5f6984c19e8c570c8c150eab382b87cd7a5b913da90a87cef3801524e175c4359c4d69796035027cf7b94e89be167956767ef1cc2f737410ddca7237232ae6b01d8cc1402443e2c4eb78780da89df5c75f',
            method:       'POST',
            port:         '443'
        };      


    //
    // Set an array to be passed to the post function with the information necessary
    //   to know which host, path (file), method and port.
    //   
    var CheckbookRequestInfo = {
        RequestType: 0,
        CheckNumber: '',
        InvoiceNumber: ''
    }


    //
    // Build an array of all the "refunds" that need to be processed.  We will then 
    //   pass each check request one by one to the function to call checkbook.
    //
    var aCheckRefunds = [];
    for (var i=0; i < 1; i++) {
        aCheckRefunds.push({
            "amount": 1+i,
            "business": "Business Name " + i,
            "check_number": 5105 + i,
            "description": "Check Memo " + i,
            "first_name": "Steve",
            "last_name": "Gaylord",
            "recipient": "sgaylord@facilitron.com"
            });
    };

    for (var ii=0; ii < aCheckRefunds.length; ii++) {


        CallCheckbookViaHTTPS(CheckbookRequestInfo, aCheckRefunds[ii], function (err, checkbookresults) {
            if (err) {
                console.log("SPG 1:" + err)
            };
            console.log("SPG 2:" + checkbookresults);
        });
    }
 
    res.redirect('check');
});





function CallCheckbookViaHTTPS(CheckbookRequestInfo, CheckbookRequestData, callbackFunc){

    //First we need to set the host name and path we are going to 
    //  call at checkbook.  For the sandbox / testing we will use a
    //  host of sandbox.checkbook.io.  The path will depend on what
    //  we are trying to do.
    //
    //  To create a digital check call the path: /check/digital
    //  To cancel a digital check call the path: /check/cancel/<Check ID>
    //  To list all checks call the path: /check
    //  To view a specific check detail call the path: /check/<Check ID>
    //
    //  To create an inovice call the path: /invoice
    //  To cancel an invoice call the path: /invoice/cancel/<Invoice ID>
    //  To list all invoices call the path: /invoice
    //  To view a specific invoice detail call the path: /invoice/<Invoice ID>
    //
    //  API Documentation here: https://checkbook.io/docs/api
    //
    
    var urlpath = "";
    switch (CheckbookRequestInfo.RequestType) {
        case 0:     //create digital check
            urlpath = '/v2/check/digital';
            break;
        case 1:     //cancel digitial check
            urlpath = '/v2/check/cancel' + CheckbookRequestInfo.CheckNumber;
            break;
        case 2:     //list all checks
            urlpath = '/v2/check';
            break;
        case 3:     //get a specific check
            urlpath = '/v2/check/' + CheckbookRequestInfo.CheckNumber;
            break;
        case 4:     //create an invoice
            urlpath = '/v2/invoice';
            break;
        case 5:     //cancel an invoice
            urlpath = '/v2/invoice/cancel/' + CheckbookRequestInfo.InvoiceNumber;
            break;
        case 6:     //list all invoices
            urlpath = '/v2/invoice';
            break;       
        case 7:     //view a specific invoice
            urlpath = '/v2/invoice/' + CheckbookRequestInfo.InvoiceNumber;
            break;
        default:
            urlpath = '/v2/check';
    }     

    //
    //  We need to setup the request to checkbook with our
    //   authorization keys.
    //
    var hmacMessage = checkbook_gateway.method + 'application/json' + urlpath;
    var hmacSignature = crypto
                            .createHmac('sha256', checkbook_gateway.privateKey)
                            .update(hmacMessage)
                            .digest('base64');
    var authorizationHeader = checkbook_gateway.publicKey + ':' + hmacSignature;
    //
    //  Now we have to cycle through all the checks that we need to create and post
    //  each one to checkbook.io
    //
    var curCheckRequest = JSON.stringify(CheckbookRequestData);

    var headers = {
      'Authorization': authorizationHeader,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Content-Length': curCheckRequest.length,
      'User-Agent': 'Checkbook/v2 NodeBindings'
    };

    var request_obj = {
        host: checkbook_gateway.environment,
        port: checkbook_gateway.port,
        path: urlpath,
        method: checkbook_gateway.method,
        headers: headers
    };

console.log(request_obj);

    //
    // Once the https request is complete we should have a response 
    //  object and then we can work with that response object.
    //      
    var post_req = https.request(request_obj);

    post_req.on('response', function (res) {
        var responseBody = '';
        res.setEncoding('utf8');
        
        res.on('data', function(chunk) {
            responseBody += chunk;
        });

        res.on('end', function () {
            console.log("SPG Response:" + responseBody);
        });
    });

    //
    // If there is an error with the request then this
    //  function is called to trap and log the error
    //
    post_req.on('error', function(req) {
        console.log("SPG Response:" + req.statusCode);
    });

    post_req.write(curCheckRequest);
    post_req.end();

};

exports.CallCheckbookViaHTTPS=CallCheckbookViaHTTPS;


module.exports = router;