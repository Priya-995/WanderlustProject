const express=require('express');
const mongoose = require('mongoose');
const app=express();
const PORT =  3000;

app.get("/",(req,res)=>{
  res.send("res send")
})

app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`)
})