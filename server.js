const express = require('express');
const mongodb = require('mongodb')
const dbconnection = require('./mongodb');
const path = require('path')
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/',async (req,res)=>{
    let data = await dbconnection();
    data = await data.find().toArray();
    res.send(data)
})

app.post('/',async(req,res) =>{
    let data =await dbconnection();
    let result =await data.insertOne(req.body)
    res.send(result)
})

app.delete('/:id',async (req,res)=>{
    console.log(req.params.id)
    const  data = await dbconnection();
    let result = data.deleteOne({_id: new mongodb.ObjectId(req.params.id)})
    res.send(result)
})

app.listen(5000,()=>console.log("port listening on 5000"))