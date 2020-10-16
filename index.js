'use strict'
const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');

exports.handler = function (event, context, callback) {
   //#1. Parse out query string params
	const numberOfVideoLoops = event['queryStringParameters']['numberOfVideoLoops']
    const clickedComments = event['queryStringParameters']['clickedComments']
    const clickedLike = event['queryStringParameters']['clickedLike']
    const isFollowing = event['queryStringParameters']['isFollowing']
    const sharedvideo = event['queryStringParameters']['sharedvideo']
    const videoTags = event['queryStringParameters']['videoTags']

    let interestedScore = 0;

    if(numberOfVideoLoops > 2) interestedScore++;
    if(clickedComments) interestedScore++;
    if(clickedLike) interestedScore = interestedScore + 5;
    if(isFollowing) interestedScore++;
    if(sharedvideo) interestedScore = interestedScore + 2;
    
  
	console.log('numberOfVideoLoops=' + numberOfVideoLoops)
	console.log('clickedComments=' + clickedComments)
	console.log('clickedLike=' + clickedLike)
	console.log('sharedvideo=' + sharedvideo)
	console.log('isFollowing=' + isFollowing)
	console.log('videoTags=' + videoTags)
    console.log('interestedScore=' + interestedScore)
    
    var dynamodb = new AWS.DynamoDB();

    var params = {
        Item: {
        "id": {
          S: uuidv4()
          }, 
         "numberOfVideoLoops": {
           S: numberOfVideoLoops
          }, 
         "clickedComments": {
           S: clickedComments
          }, 
         "clickedLike": {
           S: clickedLike
          },
          "sharedvideo": {
            S: sharedvideo
           },
           "isFollowing": {
            S: isFollowing
           },
           "videoTags": {
            S: videoTags
           },
           "interestedScore": {
            N: interestedScore.toString()
           }
        }, 
        ReturnConsumedCapacity: "TOTAL", 
        TableName: "userHistory"
       };
       dynamodb.putItem(params, function(err, data) {
         if (err) console.log(err, err.stack); 
         else     console.log(data);           
       });
      

	//#2. Construct the body of the response object
	let transactionResponse = {}
	transactionResponse['message'] = 'Hello from Lambda land'

	//#3. Construct http response object
	let responseObject = {}
	responseObject['statusCode'] = 200
	responseObject['headers'] = {}
	responseObject['headers']['Content-Type'] = 'application/json'
  responseObject['body'] = JSON.stringify(transactionResponse)
  
  console.log(responseObject)

	//#4. Return the response object
    return responseObject;
}