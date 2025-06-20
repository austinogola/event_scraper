const router = require("express").Router()
const {askforEvents,askForCompany}=require('../utils/extension')


router.get('/events/meetup',async(req,res)=>{
    console.log('Req received')
    const queryParams=req.query
    // const {keyword,country,fromDate,toDate,size,page,sort,location,category} = queryParams
    queryParams.scrapeType = 'meetup'
     let events = await askforEvents(queryParams)

    console.log("Events",events.length,'evetns')

    res.json({events}).status(200)
})

router.get('/events/eventbrite',async(req,res)=>{
    const queryParams=req.query
    console.log(queryParams)
    const {keyword,country,fromDate,toDate,size,page,sort,location,category} = queryParams

    queryParams.scrapeType = 'eventbrite'

    let events = await askforEvents(queryParams)

    console.log("Events",events,'evetns')

    res.json({events}).status(200)


    
})




module.exports=router