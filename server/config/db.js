require("dotenv").config()
const mongoose=require('mongoose')

const connectDb=async()=>{
    try{
        console.log('Attempting connection to DB')
        await mongoose.connect(process.env.db_url,{
            useUnifiedTopology:true,
            useNewUrlParser:true
        })
    }
    catch(err){
        console.log(err)
    }
}

module.exports=connectDb