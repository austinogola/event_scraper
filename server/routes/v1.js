const router = require("express").Router()
const {askforEvents,askForCompany}=require('../utils/extension')


router.get('/events/all',async(req,res)=>{
    const queryParams=req.query
    
})

router.get('/events/eventbrite',async(req,res)=>{
    const queryParams=req.query
    console.log(queryParams)
    const {keyword,country,fromDate,toDate,size,page,sort,location,category} = queryParams

    let events = await askforEvents(queryParams)

    console.log("Events",events,'evetns')

    res.json({events}).status(200)


    
})




module.exports=router