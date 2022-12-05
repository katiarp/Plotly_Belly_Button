console.log("working")

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    let samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    let samplesArray = samples.filter(s => s.id == sample); 
    //  5. Create a variable that holds the first sample in the array.
    let firstSample = samplesArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otu_ids =firstSample.otu_ids;
    let otu_labels= firstSample.otu_labels;
    let sample_values=firstSample.sample_values;


    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    let top10 = otu_ids.slice(0,10).reverse().map(s=>"OTU "+ s);
    console.log(top10)
    // var yticks = 

    // 8. Create the trace for the bar chart. 
    var trace = {
      x: sample_values.slice(0,10).reverse(),
      y: top10,
      type: 'bar',
      orientation: 'h',
      marker: {
        color: 'rgb(204, 17, 149)'
      },
     
    }

    var barData = [
       trace
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title:"Top 10 Bacteria Cultures Found",
      width:350,
      height: 390
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart.
    var trace2={
      x:otu_ids,
      y:sample_values,
      text:otu_labels,
      mode:'markers',
      marker:{
        colorscale:'Portland',
        color: otu_ids,
        colorscale:'Jet', //'Earth',  
        size: sample_values
      }
    }

    var bubbleData = [trace2];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      width: 1088, 
      height: 530 
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData,bubbleLayout); 

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    let metadataArray = data.metadata.filter(m=>m.id==sample);
  
    // 2. Create a variable that holds the first sample in the metadata array.
    let sampleMetadata = metadataArray[0];

    // 3. Create a variable that holds the washing frequency.
    let washingFrequency =  parseFloat(sampleMetadata.wfreq);
    
    // 4. Create the trace for the gauge chart.
    
    var trace3 ={
      value: washingFrequency,
      type: "indicator",
      mode: "gauge+number",
      title:{text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week"},
      gauge: {
        axis: { range: [0, 10]},
        bar: { color: "black" },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lightgreen" },
          { range: [8, 10], color: "green" }
        ]
      }
    
    }

    var gaugeData = [trace3];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 400, 
      height: 390, 
      margin: { t: 0, b: 0 }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}


