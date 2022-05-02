let express = require('express');
let app = express();
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const dotenv = require('dotenv');
dotenv.config()
let port = process.env.PORT || 8230;
const mongoUrl = process.env.mongoLiveUrl;
const bodyParser = require('body-parser');
const cors = require('cors');

//middleware
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());

//get
app.get('/',(req,res)=>{
    res.send("Welcome to Express")
})

//location
app.get('/location',(req,res)=>{
    db.collection('location').find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

// //restaurants
// app.get('/restaurants',(req,res)=>{
//     db.collection('RestaurantsData').find().toArray((err,result)=>{
//         if(err) throw err;
//         res.send(result)
//     })
// })

//restaurants with respective city
// app.get('/restaurants/id',(req,res)=>{
//     let id = req.params.id;
//     console.log(`>>>id`,id);
//     db.collection('RestaurantsData').find().toArray((err,result)=>{
//         if(err) throw err;
//         res.send(result)
//     })
// })

//restaurants with respective city
// app.get('/restaurants/',(req,res)=>{
//     let id = req.query.id;
//     console.log(`>>>id`,id);
//     db.collection('RestaurantsData').find().toArray((err,result)=>{
//         if(err) throw err;
//         res.send(result)
//     })
// })



//restaurants
app.get('/restaurants/',(req,res) => {
    // let id = req.params.id;
    // let id  = req.query.id
    // console.log(">>>id",id)
    let query = {};
    let stateId = Number(req.query.state_id);
    console.log(stateId);
    let mealId = Number(req.query.meal_id);
    if(stateId){
        query = {'state_id':stateId}
    }else if(mealId){
        query = {'mealTypes.mealtype_id':mealId}
    }
    db.collection('RestaurantsData').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//Filter on basis of cuisine
app.get('/filters/:mealId',(req,res) => {
    let sort = {cost:1}
    let mealId = Number(req.params.mealId)
    let cuisineId = Number(req.query.cuisineId)
    let lcost = Number(req.query.lcost)
    let hcost = Number(req.query.hcost)

    let query = {}
    if(req.query.sort){
        sort={cost:Number(req.query.sort)}
    }
    if(cuisineId){
        query = {
            "mealTypes.mealtype_id":mealId,
            "cuisines.cuisine_id":cuisineId
        }
    }else if(lcost && hcost){
        query = {
            "mealTypes.mealtype_id":mealId,
            $and:[{cost:{$gt:lcost,$lt:hcost}}]
        }
    }
    else{
        query = {
            "mealTypes.mealtype_id":mealId
        }
    }
     db.collection('RestaurantsData').find(query).sort(sort).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//mealtype
app.get('/mealtypes',(req,res)=>{
    db.collection('Mealtypes').find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})



//restaurantDetails
app.get('/details/:id',(req,res) => {
    //let restId = Number(req.params.id);
    let restId = mongo.ObjectId(req.params.id)
    db.collection('RestaurantsData').find({_id:restId}).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//menu
app.get('/menu',(req,res) => {
    let query = {}
    let restId = Number(req.query.restId)
    if(restId){
        query = {restaurant_id:restId}
    }
    db.collection('RestaurantMenu').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

// //menu on basis of id
// app.post('/menuItem',(req,res)=>{
//     console.log(req.body);
//     res.send('ok')
// })

// //menu on basis of id
// app.post('/menuItem',(req,res)=>{
//     console.log(req.body);
//     db.collection('RestaurantMenu').find({menu_id:{$in:req.body}}).toArray((err,result)=>{
//         if(err) throw err;
//         res.send(result)
//     })
// })

//menu on basis of id
app.post('/menuItem',(req,res)=>{
    console.log(req.body);
    if(Array.isArray(req.body)){
        db.collection('RestaurantMenu').find({menu_id:{$in:req.body}}).toArray((err,result)=>{
            if(err) throw err;
            res.send(result)
        })
    }else{
        res.send('Invalid Input')
    }    
})

//place Order
app.post('/placeOrder',(req,res)=>{
    db.collection('orders').insert(req.body,(err,result)=>{
        if(err) throw err;
        res.send('order place')
    })
})

// View Order
app.get('/viewOrder',(req,res) => {
    let email = req.query.email;
    let query = {};
    if(email){
        query = {"email":email}
    }
    db.collection('orders').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})


// delete order
app.delete('/deleteOrders',(req,res)=>{
    db.collection('orders').remove({},(err,result) => {
        res.send('order deleted')
    })
})


//update orders
app.put('/updateOrder/:id',(req,res) => {
    let oId = mongo.ObjectId(req.params.id);
    db.collection('orders').updateOne(
        {_id:oId},
        {$set:{
            "status":req.body.status,
            "bank_name":req.body.bankName
        }},(err,result) => {
            if(err) throw err
            res.send(`Status Updated to ${req.body.status}`)
        }
    )
})

//connection with db
MongoClient.connect(mongoUrl, (err, client)=>{
    if(err) console.log(`Error while connecting`);
    db = client.db('zomatoproject');
    app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})
})
