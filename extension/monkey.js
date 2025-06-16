


const sleep=(ms)=>{
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(ms)
    }, ms);
  })
}

const processCloned =async(cl)=>{
   console.log('AAAAA',cl)

   try {
      const data = await cl.json()
      console.log('data',data)
   } catch (error) {
    console.log(error.message)
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

     console.log(method)

    // console.log('HERERERER',url,this, args)
    // Skip internal extension requests
    if (url.startsWith('chrome-extension://') || method.toUpperCase() !== 'POST') {
      console.log('ENDING HERE')
      return originalFetch.apply(this, args);
    }

    // Call the original fetch
    const response = await originalFetch.apply(this, args);

    // console.log('HHEEE')

    // Clone the response so we can read it without affecting the original response
    const clonedResponse = response.clone();
    processCloned(clonedResponse)
   
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