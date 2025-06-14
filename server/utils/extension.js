const {sendMessage,sendMessageToClient,onMessage,connectedClients}=require('../app')

const pendingClients=[]

const getBestClient=(messageObj)=>{
    return new Promise(async(resolve, reject) => {
        let availableClients=[]
        let chosenClient
        connectedClients.forEach((value,key)=>{
            if(!pendingClients.includes(key)){
                availableClients.push(key)
            }
            chosenClient=key
        })

        if(availableClients[0]){
            chosenClient=availableClients[0]
        }
        pendingClients.push(chosenClient)

        resolve(chosenClient)

    })
}

const askforEvents=(getProfObj)=>{
    const {profile_id,bypass_cache,reqId:theId}=getProfObj
    return new Promise(async(resolve, reject) => {
        // console.log(connectedClients);
        
        let chosenClient=await getBestClient()
        console.log(chosenClient)

        let message={
            getEvent:getProfObj,
            clientId:chosenClient
        }
       

        sendMessageToClient(chosenClient,`${JSON.stringify(message)}`)

        onMessage(function(message) {
            message = message.toString('utf8');
            let feedback=JSON.parse(message)
            const {clientId,events}=feedback
           
            let ind=pendingClients.indexOf(clientId)
                pendingClients.splice(ind, 1);
                resolve(events)
            
            
        });

       
    })
}

const askForCompany=(getCompObj)=>{
    const {company_id,bypass_cache,reqId:theId}=getCompObj
    return new Promise(async(resolve, reject) => {
        let chosenClient=await getBestClient()
        console.log(chosenClient)

        let message={
            getCompany:getCompObj,
            clientId:chosenClient
        }

        sendMessageToClient(chosenClient,`${JSON.stringify(message)}`)

        onMessage(function(message) {
            console.log('RECEVIED FEEDBACK');
            message = message.toString('utf8');
            let feedback=JSON.parse(message)
            const {clientId,getId,reqId}=feedback

            if(reqId===theId){
                const theOther=feedback.profile || feedback.company || feedback.searchResults

                let ind=pendingClients.indexOf(clientId)
                pendingClients.splice(ind, 1);
                resolve(theOther)
            }
            
            
            
        });
       
    })
}

const askForPeopleSearch=(paramObject)=>{
    const {reqId:theId}=paramObject
    return new Promise(async(resolve, reject) => {

        
        let chosenClient=await getBestClient()

        let message={
            peopleSearch:paramObject,
            clientId:chosenClient
        }
       

        sendMessageToClient(chosenClient,`${JSON.stringify(message)}`)

        onMessage(function(message) {
            message = message.toString('utf8');
            let feedback=JSON.parse(message)
            const {clientId,reqId}=feedback

            if(theId===reqId){
                const theOther=feedback.profile || feedback.company || feedback.searchResults

                let ind=pendingClients.indexOf(clientId)
                pendingClients.splice(ind, 1);
                resolve(theOther)
            }
            
            
            
        });
    })
}

const askForCompanySearch=(paramObject)=>{
    const {reqId:theId}=paramObject
    return new Promise(async(resolve, reject) => {
        let chosenClient=await getBestClient()

        let message={
            companySearch:paramObject,
            clientId:chosenClient
        }

        sendMessageToClient(chosenClient,`${JSON.stringify(message)}`)

        onMessage(function(message) {
            message = message.toString('utf8');
            let feedback=JSON.parse(message)
            const {clientId,reqId}=feedback

            if(theId===reqId){
                const theOther=feedback.profile || feedback.company || feedback.searchResults

                let ind=pendingClients.indexOf(clientId)
                pendingClients.splice(ind, 1);
                resolve(theOther)
            }
            
            
        });
     
    })
}

const askForPostsSearch=(paramObject)=>{
    const {reqId:theId}=paramObject
    return new Promise(async(resolve, reject) => {
        let chosenClient=await getBestClient()

        let message={
            postsSearch:paramObject,
            clientId:chosenClient
        }

        sendMessageToClient(chosenClient,`${JSON.stringify(message)}`)

        onMessage(function(message) {
            message = message.toString('utf8');
            let feedback=JSON.parse(message)
            const {clientId,reqId}=feedback
            
            if(theId===reqId){
                const theOther=feedback.profile || feedback.company || feedback.searchResults

                let ind=pendingClients.indexOf(clientId)
                pendingClients.splice(ind, 1);
                resolve(theOther)
            }
            
        });
    })
}

const askForJobSearch=(paramObject)=>{
    const {reqId:theId}=paramObject
    return new Promise(async(resolve, reject) => {
        let chosenClient=await getBestClient()

        let message={
            jobSearch:paramObject,
            clientId:chosenClient
        }

        sendMessageToClient(chosenClient,`${JSON.stringify(message)}`)

        onMessage(function(message) {
            message = message.toString('utf8');
            let feedback=JSON.parse(message)
            const {clientId,reqId}=feedback
            
            if(theId===reqId){
                const theOther=feedback.profile || feedback.company || feedback.searchResults

                let ind=pendingClients.indexOf(clientId)
                pendingClients.splice(ind, 1);
                resolve(theOther)
            }
            
        });
    })
}

const askForEventsSearch=(paramObject)=>{
    const {reqId:theId}=paramObject
    return new Promise(async(resolve, reject) => {
        let chosenClient=await getBestClient()

        let message={
            eventSearch:paramObject,
            clientId:chosenClient
        }

        sendMessageToClient(chosenClient,`${JSON.stringify(message)}`)

        onMessage(function(message) {
            message = message.toString('utf8');
            let feedback=JSON.parse(message)
            const {clientId,reqId}=feedback
            
            if(theId===reqId){
                const theOther=feedback.profile || feedback.company || feedback.searchResults

                let ind=pendingClients.indexOf(clientId)
                pendingClients.splice(ind, 1);
                resolve(theOther)
            }
            
        });
    })
}

const askForServicesSearch=(paramObject)=>{
    const {reqId:theId}=paramObject
    return new Promise(async(resolve, reject) => {
        let chosenClient=await getBestClient()

        let message={
            serviceSearch:paramObject,
            clientId:chosenClient
        }

        sendMessageToClient(chosenClient,`${JSON.stringify(message)}`)

        onMessage(function(message) {
            message = message.toString('utf8');
            let feedback=JSON.parse(message)
            const {clientId}=feedback
            
            if(theId===reqId){
                const theOther=feedback.profile || feedback.company || feedback.searchResults

                let ind=pendingClients.indexOf(clientId)
                pendingClients.splice(ind, 1);
                resolve(theOther)
            }
            
            
        });
    })
}

const askForLocation=(paramObject)=>{
    const {reqId:theId}=paramObject
    return new Promise(async(resolve, reject) => {
        let chosenClient=await getBestClient()

        let message={
            locationItem:paramObject,
            clientId:chosenClient
        }

        sendMessageToClient(chosenClient,`${JSON.stringify(message)}`)

        onMessage(function(message) {
            message = message.toString('utf8');
            let feedback=JSON.parse(message)
            const {clientId,reqId}=feedback
            
            if(theId===reqId){
                const theOther=feedback.profile || feedback.company || feedback.searchResults

                let ind=pendingClients.indexOf(clientId)
                pendingClients.splice(ind, 1);
                resolve(theOther)
            }
            
            
        });
    })
}

const askForIndustry=(paramObject)=>{
    const {reqId:theId}=paramObject
    return new Promise(async(resolve, reject) => {
        let chosenClient=await getBestClient()

        let message={
            industryItem:paramObject,
            clientId:chosenClient
        }

        sendMessageToClient(chosenClient,`${JSON.stringify(message)}`)

        onMessage(function(message) {
            message = message.toString('utf8');
            let feedback=JSON.parse(message)
            const {clientId,reqId}=feedback
            
            if(theId===reqId){
                const theOther=feedback.profile || feedback.company || feedback.searchResults

                let ind=pendingClients.indexOf(clientId)
                pendingClients.splice(ind, 1);
                resolve(theOther)
            }
            
            
        });
    })
}

const askForCompanyUrn=(paramObject)=>{
    const {reqId:theId}=paramObject
    return new Promise(async(resolve, reject) => {
        let chosenClient=await getBestClient()

        let message={
            companyItem:paramObject,
            clientId:chosenClient
        }

        sendMessageToClient(chosenClient,`${JSON.stringify(message)}`)

        onMessage(function(message) {
            message = message.toString('utf8');
            let feedback=JSON.parse(message)
            const {clientId,reqId}=feedback
            
            if(theId===reqId){
                const theOther=feedback.profile || feedback.company || feedback.searchResults

                let ind=pendingClients.indexOf(clientId)
                pendingClients.splice(ind, 1);
                resolve(theOther)
            }
            
            
        });
    })
}

const askForServiceUrn=(paramObject)=>{
    const {reqId:theId}=paramObject
    return new Promise(async(resolve, reject) => {
        let chosenClient=await getBestClient()

        let message={
            serviceItem:paramObject,
            clientId:chosenClient
        }

        sendMessageToClient(chosenClient,`${JSON.stringify(message)}`)

        onMessage(function(message) {
            message = message.toString('utf8');
            let feedback=JSON.parse(message)
            const {clientId,reqId}=feedback
            
            if(theId===reqId){
                const theOther=feedback.profile || feedback.company || feedback.searchResults

                let ind=pendingClients.indexOf(clientId)
                pendingClients.splice(ind, 1);
                resolve(theOther)
            }
            
            
        });
    })
}









module.exports={askforEvents,askForCompany,askForCompanySearch,
    askForPeopleSearch,askForPostsSearch,askForJobSearch,
    askForEventsSearch,askForServicesSearch,
    askForLocation,askForIndustry,askForCompanyUrn,askForServiceUrn}