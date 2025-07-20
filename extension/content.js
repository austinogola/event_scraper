

      
      var s = document.createElement('script');

      s.src = chrome.runtime.getURL('monkey.js');
      s.async = true;
      s.referrerpolicy='same-origin'

      s.onload = function() {
          this.remove();
      };
      (document.head || document.documentElement).appendChild(s); 



chrome.storage.local.get('SCRAPE_LISTENING',res=>{
  const {SCRAPE_LISTENING} = res

  if(SCRAPE_LISTENING && SCRAPE_LISTENING == 'ON'){

     localStorage.setItem('SCRAPE_LISTENING',SCRAPE_LISTENING)

     console.log('SCRAPE_LISTENING',SCRAPE_LISTENING)

        window.addEventListener(
          "message",
          (event) => {
            const {data} =event

            const typeofData = typeof(data)

            if(typeofData == 'object'){
              const {allResults,operationName} = data 
              

              if(operationName){

                chrome.runtime.sendMessage({action:'allMeetupResults',result:allResults})

              }
            }
           
            
            
            
            // if(allResults)
          },
          false,
        );

     
  }else{
    localStorage.setItem('SCRAPE_LISTENING','OFF')
  }
})





chrome.storage.local.get(['scrapingTabs'],async res=>{
  const {scrapingTabs} =res

  if(scrapingTabs && scrapingTabs[0]){
    let urlsArr = scrapingTabs.map(item=>item.tabUrl)
    let index= urlsArr.indexOf(location.href)
    console.log(index)

    if(index!=-1){
      let scrapObj = scrapingTabs[index]
      console.log('PROCEEDING')
      const {type} = scrapObj
      console.log(scrapObj)

      if(type=='all'){
        const results = []
        let allItems = await scrapeAllMeetups()
        console.log(allItems)
        allItems.each(function () {
            const $a = $(this);
            const href = $a.attr('href');

            // console.log($a)
            // console.log(href)

            const image = $a.find('img')
            const image_url = image.attr('src')

            const h3 = $a.find('h3')
            const title = h3.text().trim(); 

             const time = $a.find('time')
            const timeText = time.text().trim(); 

            // console.log('HREF:', href);
            // console.log('image_url:', image_url);
            // console.log('title:', title);

            // console.log('timeText:', timeText);

            results.push({title,image_url,datetime:timeText})
           
        });
        console.log(results)
        chrome.runtime.sendMessage({action:"allMeetupResults",result:results})
        
      }
    }
   
  }
})


let handleScrolling = (top)=>{
  return new Promise(async(resolve, reject) => {
    let times = Math.ceil(top/100)
    console.log('times',times)
    while (times>0){
      times = times -1
      console.log('times',times)
      setTimeout(() => {
          window.scrollBy({top:100})
      }, 200);
    
    } 

    resolve('none')
  })
}

const scrapeAllMeetups =()=>{
  return new Promise(async(resolve, reject) => {
    window.scrollBy({top:600})
    // await handleScrolling(500)
    let gg = await loadSelector('a[href*="https://www.meetup.com"][data-event-label*="Revamp"]')

    console.log(gg)

    let allLinks = $('a[href*="https://www.meetup.com"][data-event-label*="Revamp"]')

    resolve(allLinks)

  })
  

}


const  loadSelector=async(selector,all)=> {
    var found = false;
    var raf;
    let el
    let times=0
    return new Promise((resolve,reject)=>{
        (async function check(){
            // el=document.querySelectorAll(selector)
            el=$(selector)
            times+=1

            console.log('trying',times)
            
            if (el && el[0]) {
                found = true;
                cancelAnimationFrame(raf);
                all?resolve(el):resolve(el[0])
                
                if(!found){
                raf = requestAnimationFrame(check);
                }
                
            
            } else if(times>=10){
                resolve(null)
            }
            else {
                await sleep(2500)
                raf = requestAnimationFrame(check);
                // console.log('Not found ',selector);
            }
            })();
    })
  }
const sleep=(ms)=>{
  return new Promise((resolve, reject) => {
    setTimeout(()=>{
      resolve(ms)
    },ms)
  })
}

const scrollWindow=(top)=>{
  return new Promise((resolve, reject) => {
    
  })
}

chrome.runtime.onMessage.addListener(async(msg, sender, sendResponse) => {
    console.log(msg);
    
   if(msg.action){
    const {action}=msg

    if(action =='scrapeAllMeetUps'){
      // const allLinks =  $('a[href*="https://www.meetup.com"]')
      const results = []
      let allItems = await scrapeAllMeetups()
        console.log(allItems)
        allItems.each(function () {
            const $a = $(this);
            const href = $a.attr('href');

            // console.log($a)
            // console.log(href)

            const image = $a.find('img')
            const image_url = image.attr('src')

            const h3 = $a.find('h3')
            const title = h3.text().trim(); 

             const time = $a.find('time')
            const timeText = time.text().trim(); 

            // console.log('HREF:', href);
            // console.log('image_url:', image_url);
            // console.log('title:', title);

            // console.log('timeText:', timeText);

            results.push({title,image_url,datetime:timeText})
           
        });
        console.log(results)
        chrome.runtime.sendMessage({action:"allMeetupResults",result:results})
    }

    if(action == 'scrapeByLocation'){
      const {locationString}=msg
      
      let locationInput = document.querySelector("input[name='locationPicker']")
      window.scrollBy({top:690,behavior:'smooth'})
      console.log(locationInput)
     
      // // locationInput.dispatchEvent(new Event('focus', { bubbles: true }));
      locationInput.click()
      
      for (const char of locationString) {
        let currentVal = locationInput.value
        console.log(currentVal)
        locationInput.value = currentVal + char
        locationInput.dispatchEvent(new Event('input', { bubbles: true }));
        await sleep(1500)
      }
     
      
      // await sleep(3000)
      // locationInput.value= locationString
      // locationInput.dispatchEvent(new Event('focus', { bubbles: true }));
      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13,
        bubbles: true,
      });

    //   $('div').filter(function () {
    //   return $(this).text().toLowerCase().includes(locationString);
    // }).css('background', 'yellow'); 
      // locationInput.dispatchEvent(enterEvent);

    }

    if(action=='searchKey'){
      let searchInput = document.querySelector("input[type='search']")
      searchInput.value= msg.keyword
      chrome.runtime.sendMessage({action:"typeSearch",result:'typed'})
    }

    if(action=='scrape'){
        let events = extractEvents()
        chrome.runtime.sendMessage({action:"scrapeResult",results:events})
    }


    if(action=='searchBoxPresent'){

      let searchInput = document.querySelector("input[type='search']")

      console.log(searchInput)

      while(!searchInput){
        searchInput = document.querySelector("input[type='search']")

        console.log(searchInput)
        await sleep(500)
      }

      chrome.runtime.sendMessage({action:"searchBoxPresent",result:'present'})

    }
   }



  })

function extractEvents() {
  // const eventCards = document.querySelectorAll('[data-event-id]');
  let eventCards = Array.from(document.querySelectorAll('li>div'));

  eventCards =eventCards.filter(div=>{
    let classstring= div.getAttribute('class')
    return classstring.toLowerCase().includes('search')

  })
   
  
  const events = [];


  console.log(eventCards)
  eventCards.forEach(card => {
    // const title = card.querySelector('div.eds-event-card-content__primary-content')?.innerText.trim();
    // const date = card.querySelector('div.eds-event-card-content__sub-content')?.innerText.split('•')[0].trim();
    // const category = card.querySelector('div.eds-event-card-content__sub-content')?.innerText.split('•')[1]?.trim();
    // const location = card.querySelector('div.card-text--truncated__one')?.innerText.trim();

    // if (title && date) {
    //   events.push({ title, date, category, location });
    // }
    let img = card.querySelector('img')
    let image_url = img?img.src:null
    let h3 = card.querySelector('h3')
    let title = h3.textContent
    
    let ps = card.querySelectorAll('p')
    let datetime = ps[0].innerText
    let location = ps[1].innerText
    let priceFrom = ps[2].innerText
    

    //    console.log('title',title)
    // console.log('image_url',image_url)
    // console.log('datetime',datetime)
    //       console.log('location',location)
    //       console.log('priceFrom',priceFrom)

    let hrefs = card.querySelectorAll('a')
    let url = hrefs[0].href
    // console.log('url',url)

    events.push({title,image_url,datetime,priceFrom,location,url})
  });


  // console.log(events)
  return events;
}

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.action === "scrape_events") {
    // const events = extractEvents();
    // sendResponse({ events });
  }
});

// setTimeout(() => {
//         extractEvents()
// }, 5000);


