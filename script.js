
function updateTime(){
  const now = new Date();
  const clock = {
    weekday : "long",
    hour : "2-digit",
    minute: "2-digit"};
  let curTime = now.toLocaleString("en-US",clock)
  document.getElementById("time").textContent =curTime;

}
setInterval(updateTime,1000)


//link : https://docs.google.com/spreadsheets/d/e/2PACX-1vSzVOY3ul6m0PHSS3TT9WjVyZ3-qlIUcZXe-13xkJsyUKYRl8VVIAzyS_gX26a5bVy7zM2cQ3OqLory/pub?gid=2119881206&single=true&output=csv
//fetch data and check if correct
//fetch data from google sheet and match the day together to find the schoolDay and lunch option
async function fetchCSV() {
    // Replace 'your_published_sheet_url' with the URL of your published sheet in CSV format
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSzVOY3ul6m0PHSS3TT9WjVyZ3-qlIUcZXe-13xkJsyUKYRl8VVIAzyS_gX26a5bVy7zM2cQ3OqLory/pub?gid=0&single=true&output=csv'; 
    const imageUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSzVOY3ul6m0PHSS3TT9WjVyZ3-qlIUcZXe-13xkJsyUKYRl8VVIAzyS_gX26a5bVy7zM2cQ3OqLory/pub?gid=2119881206&single=true&output=csv';
    try {
        var response = await fetch(sheetUrl);
        var response1 = await fetch(imageUrl);
        var data = await response.text();
        var data1 = await response1.text();
        updateLunchOption(data);
        getImageArray(data1);
    } catch (error) {
        console.error('Error fetching:', error);
    }
}

// Function to parse CSV data and update the lunch option
function updateLunchOption(csvData) {
    // Convert CSV text to an array of objects, each representing a row
  //document.write(rows)
  
    const rows = csvData.split('\n').slice(1); //skip header row
    const today = new Date().toLocaleString('en-us', { weekday: 'long' }).toLowerCase(); //we get the weekday 
     
  //for each row convert them into three object
    for (let row of rows) {
        console.log(row);
        let [Day, schooDay,extraBlock, Lunch] = row.split(',');
        // = weekday.trim().toLowerCase();
       // print(today);

        if (Day === today) {
            console.log(Day);
            console.log(schooDay, Lunch); 
          //make the text the files i gave
            document.getElementById('schoolDay').textContent = schooDay;
          document.getElementById('extraBlock').textContent = extraBlock;
            document.getElementById('lunchOption').textContent = Lunch;
        }
    }
  
}



function getImageArray(csvData) {
    // Convert CSV text to an array of objects, each representing a row
  //document.write(rows)
  // rows of link and caption
// create an array
  
   const rows = csvData.split('\n').slice(1); //skip header row
   const imageCollection = [];

  //for each row convert them into three object
   for (let row of rows) {
        //console.log(row);
      let [link, sentence]= row.split(',');
      if (link) {
         link = convertToDirectLink(link);  // Convert Google Drive shared link to direct link
      }

       console.log(link);
      imageCollection.push({link, sentence});
    }
      console.log(imageCollection.length);
     if(imageCollection.length>0){updateDisplay(imageCollection);}
     

}

//update the iamges and do the rotaqtion 
let index =0;

function updateDisplay(images){
  console.log(images);

  var imageRot = document.getElementById('dailyImage');
  var captionRot = document.getElementById('caption');

  if(index >= images.length){
    index = 0; //if index is more than the limit, it resets
  }
  const{link,sentence} = images[index];
  console.log("Updating to image:", link, "Caption:", sentence);
  imageRot.src = link;
  console.log(imageRot.src);
  captionRot.textContent = sentence;
  index++;
  setTimeout(() => updateDisplay(images), 5000);//update every 5s
  
}

//modify the link
function convertToDirectLink(sharedLink) {
    const fileId = sharedLink.match(/file\/d\/(.*?)(\/|$|\?)/)[1];
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
}


//run function moment
fetchCSV();
updateTime();
