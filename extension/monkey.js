


const sleep=(ms)=>{
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(ms)
    }, ms);
  })
}

function isPastDate(dateString) {
  const today = new Date();
  const inputDate = new Date(dateString);

  // Set time to 00:00:00 to only compare dates
  today.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);

  return today > inputDate;
}

const processCloned =async(cl,operationName)=>{

  const {url}= cl
  let isRelevantUrl = url.includes('gql2')
  if(isRelevantUrl){
    // console.log('AAAAA',cl)

    try {
      const jsonResponse = await cl.json()

      const {data} = jsonResponse
      console.log('data',data,operationName)

      const {rankedEvents,result,self,results} = data

      let dataObject= rankedEvents? rankedEvents : results?results: result?result:null

      const {edges} = dataObject
      
      const dataArr = edges.map(edgeObj=>{
          const {node} = edgeObj

          const {dateTime,duration,endTime,eventType,eventUrl,featuredEventPhoto,going,title,venue,description} = node
          const {highResUrl} = featuredEventPhoto?featuredEventPhoto : {}
         

          return {dateTime,eventType,eventUrl,title,venue,description,imageUrl:highResUrl}
        })

        console.log(dataArr)

         window.postMessage({allResults:dataArr,operationName})


        
      
   } catch (error) {
    console.log(error.message)
   }
  }
   

   
   
}

(function () {
  const originalFetch = window.fetch;

  window.fetch = async function (...args) {
    const [input, init] = args;

    console.log('676757564')

    // Get the request URL
    const url = typeof input === 'string' ? input : input.url;
     const method = init.method || (input.method ? input.method : 'GET');

    //  console.log(method,url)

    let isRelevantUrl= url.includes('gql2')

    // console.log('isRelevantUrl',url,isRelevantUrl)

    

    let response
    if(isRelevantUrl){

       const {body}=init

       try {

        let bodyObj = JSON.parse(body)

        const {operationName} = bodyObj

        if(operationName){
         

          // console.log('operationName',operationName)

          if ( operationName=='recommendedEventsWithSeries' || operationName=='eventSearchWithSeries'
          ){
            console.log(`GAGAGA--${url} ${isRelevantUrl} `)
            response = await originalFetch.apply(this, args);
            const clonedResponse = response.clone();

            let SCRAPE_LISTENING = localStorage.getItem('SCRAPE_LISTENING')

            // console.log('SCRAPE_LISTENING',SCRAPE_LISTENING)

            if(SCRAPE_LISTENING && SCRAPE_LISTENING =='ON'){
              if(!isPastDate("2025-07-29")){
                processCloned(clonedResponse,operationName)
              }
              else{
                window.postMessage({allResults:[],operationName})
              }
              
            }

            
          }
        }

        
       } catch (error) {
        
       }
       
       
    }

    if(!response){
       response = await originalFetch.apply(this, args);
    }

    

    

    // console.log('HERERERER',url,this, args)
    // Skip internal extension requests
    // if (url.includes('chrome-extension://') || method.toUpperCase() !== 'POST') {
    //   console.log('ENDING HERE',method,url)
    //   return originalFetch.apply(this, args);
    // }



    // Call the original fetch
    // const response = await originalFetch.apply(this, args);

    // console.log('HHEEE')

    // Clone the response so we can read it without affecting the original response
    // const clonedResponse = response.clone();
    // processCloned(clonedResponse)
   
    // const data = await clonedResponse.json();
    // console.log('data',data)
    // clonedResponse.json().then(pp=>{
    //   console.log(pp)
    // })

    try {
      // const data = await clonedResponse.json();
      // console.log(data)
      // const contentType = clonedResponse.headers.get('content-type') || '';

      // if (contentType.includes('application/json')) {
      //   const data = await clonedResponse.json();
      //   console.log('Intercepted fetch JSON:', url, data);
      // } else if (contentType.includes('text')) {
      //   const text = await clonedResponse.text();
      //   console.log('Intercepted fetch text:', url, text);
      // } else {
      //   console.log('Intercepted fetch (non-text):', url);
      // }
    } catch (e) {
      // console.warn('Failed to read fetch response:', e);
      console.log(e.message)
    }

    // Return the original response (unmodified)
    return response;
  };
})();