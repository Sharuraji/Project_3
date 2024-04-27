//let cropSeasonProduction;

let cropName='Arecanut';

function getCropNames() {
  let queryUrl = `http://127.0.0.1:5000/api/season/production/cropName`
  fetch(queryUrl)
    .then(response => {
      if (!response.ok){
        throw new Error('Network response was not ok');
      }
        return response.json();
      })
      .then(data => {
          console.log(data.length);
          // Clear any existing list items
          
          const dataList = document.getElementById("myList");
          dataList.innerHTML = '';
          data.forEach(item => {
          const listItem = document.createElement('li');
          listItem.textContent = item.Crop;
          dataList.appendChild(listItem);
          
         });
        

          let listItems = dataList.getElementsByTagName('li');
          for (let i = 0; i<listItems.length; i++){
            listItems[i].onclick = function() {
              cropName=this.textContent;
              getInputValue(cropName);
            };
          }
    
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }

    getCropNames() ;


function getInputValue(el) {
  cropName = el;
 console.log(cropName);
  let queryUrl = `http://127.0.0.1:5000/api/season/production/${cropName}`
console.log(queryUrl)
// Make a GET request
fetch(queryUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log(data.length);
    //cropSeasonProduction=data; 
    let Trace1 = {
      x : [],
      y : [],
      text : [],
      name : "Kharif",
      type : "bar"
  };
  // trace2
  let Trace2 = {
      x : [],
      y : [],
      text : [],
      name : "Rabi",
      type : "bar"
  };
  
  let Trace3 = {
      x : [],
      y : [],
      text : [],
      name : "Autumn",
      type : "bar"
  };
  let Trace4 = {
      x : [],
      y : [],
      text : [],
      name : "Summer",
      type : "bar"
  };

    for (let i = 0 ; i < data.length; i++)
    { 
  
      
       console.log(data[i].Crop+' ,' +data[i].Crop_Year+' ,' +data[i].District+' ,' +data[i].Production+' ,' +data[i].Season+' ,' +data[i].State);
       if (data[i].Season.trim() === "Kharif")
       {
           Trace1.x.push(data[i].Crop_Year);
           Trace1.y.push(data[i].Production);
           Trace1.text.push(data[i].Crop.trim());
           console.log('From Kharif :'+data[i].Crop_Year+', '+data[i].Production+', '+data[i].Crop+', '+ data[i].Season.trim());
       }
       else if (data[i].Season.trim() === "Rabi")
       {
           Trace2.x.push(data[i].Crop_Year);
           Trace2.y.push(data[i].Production);
           Trace2.text.push(data[i].Crop.trim());
           console.log('From Rabi :'+data[i].Crop_Year+', '+data[i].Production+', '+data[i].Crop+', '+ data[i].Season.trim());
       }
       else if (data[i].Season.trim() === "Autumn")
       {
           Trace3.x.push(data[i].Crop_Year);
           Trace3.y.push(data[i].Production);
           Trace3.text.push(data[i].Crop.trim());
           console.log('From Autumn :'+data[i].Crop_Year+', '+data[i].Production+', '+data[i].Crop+', '+ data[i].Season.trim());
           //console.log(row.Season.trim());
       }
       else if (data[i].Season.trim() === "Summer")
       {
           Trace4.x.push(data[i].Crop_Year);
           Trace4.y.push(data[i].Production);
           Trace4.text.push(data[i].Crop.trim());
           console.log('From Summer :'+data[i].Crop_Year+', '+data[i].Production+', '+data[i].Crop+', '+ data[i].Season.trim());
          // console.log(row.Season.trim());
       }
    }

            // Plot barchart
        let trace_data = [
          Trace1,
          Trace2,
          Trace3,
          Trace4
        ];


        // Make a title
        let title = `${cropName} Production `
        // Apply a title to the layout
        let layout = {
        title: title,
        barmode: "group",
        // Include margins in the layout so the x-tick labels display correctly
        margin: {
          l: 50,
          r: 50,
          b: 200,
          t: 50,
          pad: 4
        }
        };

        Plotly.newPlot("plot",trace_data,layout);

  })

  .catch(error => {
    console.error('Error:', error);
  });

  }



const params={
  param1:''
}   

// Store API endpoint as queryUrl








