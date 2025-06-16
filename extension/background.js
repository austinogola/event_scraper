
chrome.runtime.onMessage.addListener((msg,sender)=>{
        if(msg.action){
            // console.log(msg)
        }
});

function talkToTab(toObject,actionFrom,tabId) {
  return new Promise((resolve) => {
    
    const listener = (msg, sender) => {
      console.log(msg)
        if (msg.action === actionFrom) {
          chrome.runtime.onMessage.removeListener(listener);
          resolve(msg.results);
        }
      };


      console.log(tabId);
      
      chrome.runtime.onMessage.addListener(listener);
      chrome.tabs.sendMessage(tabId, toObject);
    
    //   setTimeout(() => {
    //     chrome.runtime.onMessage.removeListener(listener);
    //     resolve(null);
    //   }, 2500); // fallback timeout
     
  });
}
const openTabAndScrape = (filterObj) =>{
    chrome.runtime.onMessage.addListener((msg,sender)=>{
        console.log(msg)
    });
    return new Promise((resolve, reject) => {
   
    const {keyword,countryString,fromDate,toDate,size,page,sort,locationString,category} = filterObj
    let urlTovisit= 'https://www.eventbrite.com'

    if(countryString){
        urlTovisit += `/d/${countryString}`
    }else{
        if(locationString){
        urlTovisit += `/d/${locationString}`
    }
    }
    if(keyword){
        urlTovisit+=`/${keyword}`
    }

    
    
    
     chrome.tabs.create({url:urlTovisit,active:true},res=>{
            console.log(res)

          
            
        const listener = async function (tabId, changeInfo) {
            console.log(changeInfo)
            if (tabId === res.id && changeInfo.status === 'complete') {
                console.log('Complete')
                chrome.tabs.onUpdated.removeListener(listener); // Remove listener
                    
                // Send message to the content script
                let result = await talkToTab({action:'scrape'},'scrapeResult',res.id)
                console.log(result)
                resolve(result)
            }
            };

            chrome.tabs.onUpdated.addListener(listener);
            // setTimeout(async()=>{
            //     let sBoxPresent = await talkToTab({action:'searchBoxPresent'},'searchBoxPresent',res.id)
            //     console.log(sBoxPresent)

            //     let addSearchValue = await talkToTab({action:'searchKey',keyword},'typeSearch',res.id)
            // },2500)

        })

    // if(keyword){
        // chrome.tabs.create({url:urlTovisit,active:true},res=>{
        //     console.log(res)
        //     setTimeout(async()=>{
        //         let sBoxPresent = await talkToTab({action:'searchBoxPresent'},'searchBoxPresent',res.id)
        //         console.log(sBoxPresent)

        //         let addSearchValue = await talkToTab({action:'searchKey',keyword},'typeSearch',res.id)
        //     },2500)
            
    //     })
    // }

     })


}

// openTabAndScrape({keyword:"dance",countryString:"kenya",fromDate:"",toDate:"",size:"",page:"",sort:"",locationString:"",category:""} )


// let webSocketURL='wss://eventscraper-production.up.railway.app/'
let webSocketURL='ws://localhost:3000/'

const getTime=()=>{
    const now = new Date();

// Get the current time components (hours, minutes, seconds)
const hours = now.getHours();
const minutes = now.getMinutes();
const seconds = now.getSeconds();

// Format the time components as a string
const timeString = `${hours}:${minutes}:${seconds}`;

return(timeString)
}

const attemptConnection=()=>{
    try {

        const reconnect=()=>{
            SOCKET.removeEventListener('open',whenConnected)

            SOCKET.removeEventListener('close',whenClosed)

            SOCKET.removeEventListener('error',whenErrored)

            SOCKET.removeEventListener('message', whenMessaged);

            attemptConnection()
        }

        const whenConnected=()=>{
            console.log('WebSocket connection established',getTime());
            SOCKET_CONNECTED=true
        }

        const whenClosed=()=>{
            console.log('WebSocket connection closed',getTime());
            SOCKET_CONNECTED=false
            reconnect()
            // if(SOCKET_CONNECTED==false){
            //     console.log('WebSocket connection closed: Retrying',getTime());
            //     attemptConnection()
            // }
        }

        const whenErrored=()=>{
            console.log('WebSocket connection errored',getTime());
            SOCKET_CONNECTED=false
            reconnect()
            // if(SOCKET_CONNECTED==false){
            //     console.log('WebSocket connection closed: Retrying',getTime());
            //     attemptConnection()
            // }
        }

        const whenMessaged=async(event)=>{
            let {data}=event
            console.log('Received message',data);
            data = JSON.parse(data)
           const {getEvent,clientId}=data
           console.log(getEvent)

           const {scrapeType} = getEvent
            let scrapeResults

           if(scrapeType=='meetup'){
               scrapeResults =  await openMeetUpAndScrape(getEvent)
           }

            let feedBack=JSON.stringify({events:scrapeResults,clientId})
            SOCKET.send(feedBack)

        //    

        //    let scrapeResults = await openTabAndScrape(getEvent)
        //    console.log(scrapeResults)
           
        //    let clientId=dataObj['clientId']

           
        }
        try{
            SOCKET = new WebSocket(webSocketURL);
            SOCKET.addEventListener('open',whenConnected)

            SOCKET.addEventListener('close',whenClosed)

            SOCKET.addEventListener('error',whenErrored)

            SOCKET.addEventListener('message', whenMessaged);
        } catch (error) {
            console.log('Error connecting');
        }
        

        // SOCKET.onmessage = whenMessaged

        





        
        // })

        

          
        
    } catch (error) {
        console.log(error.message);
    }
  }

  attemptConnection()

  


 const openEventBriteAndScrape = (filterObj) =>{
    return new Promise((resolve, reject) => {
   
    const {keyword,countryString,fromDate,toDate,size,page,sort,locationString,category} = filterObj
    let urlTovisit= 'https://www.eventbrite.com'

    let scrapeCommandObj = {action:'scrape'}

    if(countryString){
        urlTovisit += `/d/${countryString}`
        // if(keyword){
        //     urlTovisit+=`/${keyword}`
        // }
    }else{
    //     if(locationString){
    //     urlTovisit += `/d/${locationString}`
    // }
        let scrapeAction = 'scrapeBy'
        scrapeCommandObj = {action:'scrapeByLocation',locationString}
    }
    

     chrome.tabs.create({url:urlTovisit,active:true},res=>{
            console.log(res)

        const listener = async function (tabId, changeInfo) {
            if (tabId === res.id && changeInfo.status === 'complete') {
                chrome.tabs.onUpdated.removeListener(listener); // Remove listener

                // Send message to the content script
                let result = await talkToTab(scrapeCommandObj,'scrapeByLocationResult',res.id)
                console.log(result)
                resolve(result)
            }
            };

            chrome.tabs.onUpdated.addListener(listener);

     })


    })

}


const openMeetUpAndScrape = (filterObj) =>{
    return new Promise((resolve, reject) => {
   
    const {keyword,countryString,fromDate,toDate,size,page,sort,locationString,category,locationRadius} = filterObj
    let urlTovisit= 'https://www.meetup.com/find/?suggested=true&source=EVENTS'

    let scrapeCommandObj = {action:'scrape'}

    if(locationString){
        let [location,countryCode] = locationString.split(',')
       
        urlTovisit += `&location=${countryCode.toLowerCase()}--${location}`
        
    }
    if(keyword){
       urlTovisit += `&keywords=${keyword}`
       
    }
    if(locationRadius){
        urlTovisit += `&distance=${locationRadius}`
    }

    const waitForRelevantMessage = (msg,sender) =>{
        // console.log(msg)
        if(msg.action && msg.action=='allMeetupResults'){
            chrome.runtime.onMessage.removeListener(waitForRelevantMessage);
            const {result} = msg
            console.log(result)
            resolve(result)
            
        }
    }
    

    chrome.runtime.onMessage.addListener(waitForRelevantMessage);
    
    
    chrome.storage.local.get(['scrapingTabs'],res=>{
        const scrapingTabs =   []

        scrapingTabs.push({tabUrl:urlTovisit,type:'all'})

        chrome.storage.local.set({scrapingTabs},resp=>{


            chrome.tabs.create({url:urlTovisit,active:true},tabCreationRes=>{
                    console.log(tabCreationRes)

                    const listener = async function (tabId, changeInfo) {
                            if (tabId === tabCreationRes.id && changeInfo.status === 'complete') {
                                chrome.tabs.onUpdated.removeListener(listener); // Remove listener


                                let result = await talkToTab({action:'scrapeAllMeetUps'},'allMeetupResults',tabCreationRes.id)
                                console.log(result)
                            
                                // console.log(result)
                                // resolve(result)
                            }
                    };

                    chrome.tabs.onUpdated.addListener(listener);

            })

        })
    })

     


    })

}




// chrome.webRequest.onCompleted.addListener((dets)=>{
//     if(dets.method=='POST'){
//         console.log(dets)
//     }   
    
//     },{urls:["*://*.meetup.com/*"]},['responseHeaders','extraHeaders']

// )

// openEventBriteAndScrape({locationString:'Thika'})
// openMeetUpAndScrape({locationString:'Nairobi,KE',keyword:'food',locationRadius:'fiftyMiles'})