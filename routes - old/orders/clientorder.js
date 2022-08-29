
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

const axios = require("axios");
const config = require('../../config/config')
var url=config.mongoURI;

const { promisify } = require('util')
const sleep = promisify(setTimeout)

module.exports = function(router) {

router.post("/clientorder", (req, res1) => {




    var allposts=[];
    //   var checksubscribe=[];
        
        MongoClient.connect(url, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },async function(err, db) {
          if (err) throw err;
          var dbo = db.db("wholesaller");
          /*Return only the documents with the address "Park Lane 38":*/
          var query = {};
      
          allposts= await dbo.collection('order').aggregate([
            { $match : {"buyerid" : ObjectId(req.body.id)}},
            //  { $sort : { _id : -1}},
            { $lookup:
               {
                 from: 'users',
                 localField: 'carddata.shopid',
                 
                 foreignField: '_id',
                 as: 'users'
               }
             },
      
            
             {   $unwind:"$users" }, 
      
         
        
           ]).toArray()
        
                       ////console.log(allposts);
                        res1.json(allposts);

      
      
         });
        

          })
    
    


        //   router.post("/confirmorder", (req, res1) => {



               
        // MongoClient.connect(url, function (err, db) {
        //     if (err) throw err;
        //     var dbo = db.db("wholesaller");
            
        //     req.body.orderid=ObjectId(req.body.orderid);
               
                  
        //               dbo.collection("shipmentdetails").insertOne(req.body, function(err, res) {
        //                   if (err) throw err;
        //                   ////console.log("1 document inserted");
        //                  //// db.close();
        //                 });
          

        //                 var myquery = { _id : req.body.orderid };
        //                 var newvalues = { $set: {status: "packed"} };
        //                 dbo.collection("order").updateOne(myquery, newvalues, function(err, res) {
        //                   if (err) throw err;
        //                   ////console.log("1 document updated");
        //                   db.close();

        //                 });









        //               res1.json("Account created.Now signIn");
                    
          
                  
              
          
                
          
              
            
        //   });

        //           })
            
            
        



///////////////////


// router.post("/holdonorder", (req, res1) => {


// MongoClient.connect(url, function (err, db) {
//         if (err) throw err;
//         var dbo = db.db("wholesaller");
        
//         req.body.orderid=ObjectId(req.body.orderid);
           
              
              

//                     var myquery = { _id : req.body.orderid };
//                     var newvalues = { $set: {status: "holdon"} };
//                     dbo.collection("order").updateOne(myquery, newvalues, function(err, res) {
//                       if (err) throw err;
//                       ////console.log("1 document updated");
//                       db.close();

//                     });



//    res1.json("Account created.Now signIn");
                
      
              
          
      
            
      
          
        
//       });

//               })





              router.post("/cancelorderclient", (req, res1) => {


                MongoClient.connect(url, function (err, db) {
                        if (err) throw err;
                        var dbo = db.db("wholesaller");
                        
                        req.body.orderid=ObjectId(req.body.orderid);
                           
                              
                              
                
                                    var myquery = { _id : req.body.orderid };
                                    var newvalues = { $set: {status: "cancel by customer"} };
                                    dbo.collection("order").updateOne(myquery, newvalues, function(err, res) {
                                      if (err) throw err;
                                      ////console.log("1 document updated");
                                      db.close();
                
                                    });
                
                
                
                   res1.json("Account created.Now signIn");
                                
                      
                              
                          
                      
                            
                      
                          
                        
                      });
                
                              })
                





};