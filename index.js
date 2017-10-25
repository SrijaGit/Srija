//This is still work in progress
/*
Please report any bugs to nicomwaks@gmail.com

i have added console.log on line 48 




 */
'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

var orderDetails ='';
var orderArr ;
app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
	res.send('hello world i am a srija bot Trial - 13')
	
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
		res.send(req.query['hub.challenge'])
		sendGreetingMessage()
	}
	res.send('Error, wrong token')
})
app.get('/test/', function (req, res) {	
	orderDetails=req.query['order'];	
	orderArr = orderDetails.split("|")
	res.send('Read value' + orderArr[0] + orderArr[1])
})

// Spin up the server
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})


app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
	    let event = req.body.entry[0].messaging[i]
	    let sender = event.sender.id
	    if (event.message && event.message.text) {
		    let text = event.message.text
		    if (text === 'Generic') {
			    sendGenericMessage(sender)
		    	continue
		    }
		    sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
	    }
		
		if (event.postback) {
			let text = JSON.stringify(event.postback)
			
			if(text.indexOf('Polo') !== -1) {
				continue;
			}
			orderDetails=text
			orderArr = orderDetails.split("|")
			//sendTextMessage(sender, "Postback received: "+orderDetails)
			sendOrder(sender,orderArr)
			continue
      }
    }
    res.sendStatus(200)
})

const token = "EAATDE4Qrm4MBAGBacJUKP1ZBBUCyBaJLT7XlRLZBBrRkn2HiuOmPAELDUnB081KUYvRN9BMctHM4TpECXzcRtE8qjTIMJnoz8MmSEtvZBsti054LmWizHQ6ROqF9qOZB6KmBWJei7RoOMXADqgOkzZCKdWPBDkLqLruj4P3XasAZDZD"


function sendOrder(sender,orderArray) {
    let messageData = {
	    "attachment": {
		    "type": "template",			
		    "payload": {
			"template_type":"receipt",
			"recipient_name":"Stephane Crozatier",
			"order_number":"12345678902",
			"currency":"USD",
			"payment_method":"Visa 2345",        
			"order_url":"http://petersapparel.parseapp.com/order?order_id=123456",
			"timestamp":"1428444852",         
			"address":{
				"street_1":"1 Hacker Way",
				"street_2":"",
				"city":"Menlo Park",
				"postal_code":"94025",
				"state":"CA",
				"country":"US"
			},
			"summary":{
				"subtotal":75.00,
				"shipping_cost":4.95,
				"total_tax":6.19,
				"total_cost":56.14
			},
			"adjustments":[
			{
				"name":"New Customer Discount",
				"amount":20
			},
			{
				"name":"$10 Off Coupon",
				"amount":10
			}
			],
			"elements": [ {
			    "title": orderArray[0],
			    "subtitle": orderArray[1],
			    "image_url": "shopping.jpg"				   
			    }]
		    }
	    }
    }
    request({
	    url: 'https://graph.facebook.com/v2.6/me/messages',
	    qs: {access_token:token},
	    method: 'POST',
	    json: {
		    recipient: {id:sender},
		    message: messageData,
	    }
    }, function(error, response, body) {
	    if (error) {
		    console.log('Error sending messages: ', error)
	    } else if (response.body.error) {
		    console.log('Error: ', response.body.error)
	    }
    })
	
	
}

function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
	    url: 'https://graph.facebook.com/v2.6/me/messages',
	    qs: {access_token:token},
	    method: 'POST',
		json: {
		    recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
		    console.log('Error sending messages: ', error)
		} else if (response.body.error) {
		    console.log('Error: ', response.body.error)
	    }
    })
}

function sendGenericMessage(sender) {
    let messageData = {
	    "attachment": {
		    "type": "template",
		    "payload": {
				"template_type": "generic",
			    "elements": [{
					"title": "First card",
				    "subtitle": "Element #1 of an hscroll",
				    "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
				    "buttons": [{
					    "type": "web_url",
					    "url": "https://www.messenger.com",
					    "title": "web url"
				    }, {
					    "type": "postback",
					    "title": "Postback",
					    "payload": "Payload for first element in a generic bubble",
				    }],
			    }, {
				    "title": "Second card",
				    "subtitle": "Element #2 of an hscroll",
				    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
				    "buttons": [{
					    "type": "postback",
					    "title": "Postback",
					    "payload": "1|Dress Red|28|$54",
				    }],
			    }]
		    }
	    }
    }
    request({
	    url: 'https://graph.facebook.com/v2.6/me/messages',
	    qs: {access_token:token},
	    method: 'POST',
	    json: {
		    recipient: {id:sender},
		    message: messageData,
	    }
    }, function(error, response, body) {
	    if (error) {
		    console.log('Error sending messages: ', error)
	    } else if (response.body.error) {
		    console.log('Error: ', response.body.error)
	    }
    })
}


function sendGreetingMessage() {
    let messageData = { 'Welcome to order management system' }
    request({
	    url: 'https://graph.facebook.com/v2.6/me/messages',
	    qs: {access_token:token},
	    method: 'POST',
		json: {
		    recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
		    console.log('Error sending messages: ', error)
		} else if (response.body.error) {
		    console.log('Error: ', response.body.error)
	    }
    })
}
