const sleep=(ms)=>{
  return new Promise((resolve, reject) => {
    setTimeout(()=>{
      resolve(ms)
    },ms)
  })
}

chrome.runtime.onMessage.addListener(async(msg, sender, sendResponse) => {
    console.log(msg);
    
   if(msg.action){
    const {action}=msg

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


