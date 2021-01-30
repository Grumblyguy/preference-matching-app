// Example listener which listens to given url
// To install eventsource  run `npm install eventsource`

// Use other import if one doesn't work
// import EventSource from "eventsource"; 
var EventSource = require("eventsource"); 

const url = "http://localhost/user/test/listen"
// const url = "http://54.252.181.63/user/test/listen"
const evtSource = new EventSource(url);
   
evtSource.addEventListener('message', (event) => {
    console.log(event);
});

// Event handler
// evtSource.onmessage = function(event){
//     // Parse message
//     console.log(event)
//     console.log(event.data);
// }
