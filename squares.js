//set up margins
var margin = {top:10, right:10, bottom:40, left:32},
  width = 740- margin.left - margin.right,
  height = 500 - margin.left - margin.right;

//grid sizing
var squareSize = 6,
  squarePad = 2,
  //numPerRow = width/(squareSize + squarePad);
  numPerRow = 57,
  numPerRowC = 54,
  numPerRowCoi = 13,
  numPerRowMulti = 11,
  numPerRowPres = 4,
  numPerRowOther = 3;

var g = null;

var yBarScale = d3.scale.ordinal()
  .domain([0,1,2])
  .rangeBands([0, height - 50], 0.1, 0.1);

var colors = d3.scale.category10();
/*var colors = d3.scale.ordinal()
  .domain(["Catholic","Church Of Ireland","Multi Denominational","Presbyterian","Inter Denominational","Methodist","Jewish","Muslim","Quaker","Other/Unknown"])
  .range(['#8b0000','#c32b48','#e9647f','#fea0ac','#ffe1d2','#d8f6c4','#9edba4','#6fbd92','#449e87','#008080']);*/

var tooltip = d3.select("#tooltip")
  .style("opacity", 0);

//main viewing area
var svg = d3.select("#chart").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  //.style("margin-left" -margin.left + "px");

var g = svg.append("g");


var x = d3.scale.ordinal()
  .rangeRoundBands([0, width-150], .1);

var y = d3.scale.linear()
  .range([height, 0]);

var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom");

var yAxis = d3.svg.axis()
  .scale(y)
  .ticks(10)
  .tickFormat(d3.format("s"))
  .orient("left");

//need a async call for data here
d3.csv("scoil.csv", function(data) {


  //need to map d.x2 & d.y2 onto the object for the second
  //position when grid move is triggered, use if statement
  //to determine 'origin' point based on d.ethos
  //Font: Use PT Sans for caps, & Roboto in general

    var processedData = data.map(function(d,i){
      d.col = i % numPerRow;
      d.x = d.col * (squareSize + squarePad);
      d.row = Math.floor(i / numPerRow);
      d.y = d.row * (squareSize + squarePad);
      return d;
    });


    var barData = [{
      "Size": "0_9",
      "Count": d3.sum(data, function(d) {return +d.Class_size_0_9;})},
      {
        "Size": "10_19",
        "Count": d3.sum(data, function(d) {return +d.Class_size_10_19;})},
      {
        "Size": "20_24",
        "Count": d3.sum(data, function(d) {return +d.Class_size_20_24;})},
      {
        "Size": "25_29",
        "Count": d3.sum(data, function(d) {return +d.Class_size_25_29;})},
      {
        "Size": "30_34",
        "Count": d3.sum(data, function(d) {return +d.Class_size_30_34;})},
      {
        "Size": "35_39",
        "Count": d3.sum(data, function(d) {return +d.Class_size_35_39;})},
      {
        "Size": "40_45",
        "Count": d3.sum(data, function(d) {return +d.Class_size_40_45;})}
    ];


    //setup initial square grid
    var squares = g.selectAll(".square").data(processedData);
    squares.enter()
      .append("rect")
      .attr("width", squareSize)
      .attr('height', squareSize)
      .attr("fill", "#ccc")
      .classed("square", true)
      .classed("catholic", function(d) {
        if (d.Ethos === 'Catholic') {return true}
        })
      .classed("coi", function(d) {
        if (d.Ethos === 'Church Of Ireland') {return true}
      })
      .classed("pres", function(d) {
        if (d.Ethos === 'Presbyterian') {return true}
      })
      .classed("other", function(d) {
        if (d.Ethos === 'Other/Unknown') {return true}
      })
      .classed("muslim", function(d) {
        if (d.Ethos === 'Muslim') {return true}
      })
      .classed("multi", function(d) {
        if (d.Ethos === 'Multi Denominational') {return true}
      })
      .classed("inter", function(d) {
        if (d.Ethos === 'Inter Denominational') {return true}
      })
      .classed("quaker", function(d) {
        if (d.Ethos === 'Quaker') {return true}
      })
      .classed("method", function(d) {
        if (d.Ethos === 'Methodist') {return true}
      })
      .classed("jew", function(d) {
        if (d.Ethos === 'Jewish') {return true}
      })
      .attr("x", function (d) {return d.x; })
      .attr("y", function (d) {return d.y; })
      .attr("opacity", 0)
      .on("mouseover", mouseover)
      .on("mouseout", mouseout);


  //fill in squares
    g.selectAll(".square")
      .transition()
      .duration(600)
      .delay(function (d, i) {
        return 12 * d.row;
      })
      .attr("opacity", 1.0)
      .attr("fill", "#ddd");

  g.append("defs").append("marker")
    .attr("id", "arrowhead")
    .attr("refX", 6 + 3) /*must be smarter way to calculate shift*/
    .attr("refY", 2)
    .attr("markerWidth", 6)
    .attr("markerHeight", 4)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M 0,0 V 4 L6,2 Z")//this is actual shape for arrowhead
    .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5");

  g.append("line")
    .attr("class", "caption")
    .classed("step_1", true)
    .attr("x1", -18)
    .attr("y1", height-140)
    .attr("x2", -18)
    .attr("y2", 0)
    .attr("stroke-width", 0.75)
    .attr("marker-end", "url(#arrowhead)")
    .attr("stroke", "#ccc");

  g.append("line")
    .attr("class", "caption")
    .classed("step_1", true)
    .attr("x1", 170)
    .attr("y1", height+20)
    .attr("x2", height)
    .attr("y2", height+20)
    .attr("stroke-width", 0.75)
    .attr("marker-end", "url(#arrowhead)")
    .attr("stroke", "#ccc");



   g.append("text")
    .attr("transform", "rotate(-90)")
     .attr("class", "caption")
     .classed("step_1", true)
    .attr("y", -22)
    .attr("dy", ".71em")
     .attr("x", -340)
    .style("text-anchor", "end")
     .style("fill", "#ccc")
    .text("increasing school size");

  g.append("text")
    .attr("class", "caption")
    .classed("step_1", true)
    .attr("x", 125)
    .attr("y", height+24)
    .style("text-anchor", "end")
    .style("fill", "#ccc")
    .text("decreasing school size");

  //initial caption
    g.append("text")
      .attr("transform", "translate(" + margin.left + "," + (margin.top+10) + ")")
      .attr("class", "caption")
      .classed("step_1", true)
      .attr("x", 450)
      .attr("y", height/2)
      .attr("opacity", 0)
      .style("fill", "#666666")
      .html('3,277 primary schools in Ireland')
      .transition()
      .duration(600)
      .delay(1200)
      .attr("opacity", 1);

    /////////////////////////////////////////////////////////////////////////////
    //******************* setup bar chart ***************************************
    x.domain(barData.map(function(d) { return d.Size; }));
    y.domain([0, d3.max(barData, function(d) { return d.Count; })]);

    g.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .attr("opacity", 0);
      /*.append("text")
      .style("text-anchor", "end")
      .attr("dx", width-410)
      .attr("dy", 35)
      .text("class size");*/

    g.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .attr("opacity", 0)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("nr. of students");

    g.selectAll(".bar")
      .data(barData)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.Size); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.Count); })
      .attr("height", function(d) { return height - y(d.Count); })
      .attr("opacity", 0);

    /////////////////////////////////////////////////////////////////////////////

    /*USE this to test function calls
      svg.append("circle")
        .attr("id", "step1")
        .attr("class","step-link")
        .attr("cx", 650)
        .attr("cy", 300)
        .attr("r", 10)
        .style("fill", "steelblue")
        .on("click",moveBack());
*/

  });

function barChart() {
  g.append("rect")
    .attr("class","screen")
    .attr("height", 500)
    .attr("width", 600)
    .attr("opacity", 0);

  g.selectAll(".caption")
    .transition()
    .duration(600)
    .delay(200)
    .attr("opacity", 0);

 /* g.selectAll(".square")
    .transition()
    .duration(200)
    .attr("opacity", 0);*/
  g.selectAll(".square")
    .transition()
    .duration(800)
    .delay(function (d, i) {
      return 15 * d.row;
    })
    .attr("x", 0)
    .attr("y", function(d,i){
      return yBarScale(i % 3) + yBarScale.rangeBand() / 2;
    })
    /*.attr("x", function(d,i){
      return yBarScale(i % 7) + x.rangeBand();
    })*/
    .attr("y", height)
    .transition()
    .duration(100)
    .attr("opacity", 0);

  g.selectAll(".bar")
    .transition()
    .duration(600)
    .delay(200)
    .style("fill", "steelblue")
    .attr("opacity", 1);

  g.selectAll(".x.axis")
    .transition()
    .duration(800)
    .delay(800)
    .attr("opacity", 1);

  g.selectAll(".y.axis")
    .transition()
    .duration(800)
    .delay(800)
    .attr("opacity", 1);
}


function highlightGrid() {

  g.selectAll(".square")
    .transition("move_back")
    .duration(800)
    .delay(function (d, i) {
      return 15 * d.row;
    })
    .attr("transform", "translate(0,0)")
    .attr("x", function (d) {return d.x; })
    .attr("y", function (d) {return d.y; });

  g.selectAll(".step_2")
    .transition()
    .duration(1200)
    .attr("opacity", 0);

  g.selectAll(".step_1")
    .transition()
    .duration(1200)
    .attr("opacity", 1);

 // g.selectAll(".screen").remove();


//*********clear barchart & axes 1st

  g.selectAll(".bar")
    .transition()
    .duration(600)
    .style("fill", "steelblue")
    .attr("opacity", 0);

  g.selectAll(".x.axis")
    .transition()
    .duration(600)
    .delay(1200)
    .attr("opacity", 0);

  g.selectAll(".y.axis")
    .transition()
    .duration(600)
    .delay(1200)
    .attr("opacity", 0);
//************************************
  g.selectAll(".square")
    .transition()
    .duration(1200)
    .delay(function (d, i) {
      return 15 * d.row;
    })
    .attr("opacity", .65)
    .attr("fill", function(d){return colors(d.Ethos)});

}

function moveEthos (){
  //fade out intial caption
  g.selectAll(".step_1")
    .transition()
    .duration(1200)
    .attr("opacity", 0);
//fade out barchart
  g.selectAll(".bar")
    .transition()
    .duration(600)
    .style("fill", "steelblue")
    .attr("opacity", 0);

  g.selectAll(".x.axis")
    .transition()
    .duration(600)
    .delay(1200)
    .attr("opacity", 0);

  g.selectAll(".y.axis")
    .transition()
    .duration(600)
    .delay(1200)
    .attr("opacity", 0);

  //move squares into clusters
  console.log(numPerRowC)
  g.selectAll(".catholic")
    .transition()
    .duration(800)
    .delay(function (d, i) {
      return 15 * d.row;
    })
    //.attr("transform", "translate(280,0)")
    .attr("x", function(d,i){
      d.col = i % numPerRowC;
      d.x2 = d.col * (squareSize + squarePad);
      return d.x2;
    })
    .attr("y", function(d,i){
      d.row = Math.floor(i / numPerRowC);
      d.y2 = d.row * (squareSize + squarePad);
      return d.y2;
    });

  g.selectAll(".coi")
    .transition()
    .duration(800)
    .delay(function (d, i) {
      return 15 * d.row;
    })
    .attr("transform", "translate(470,0)")
    .attr("x", function(d,i){
      d.col = i % numPerRowCoi;
      d.x2 = d.col * (squareSize + squarePad);
      return d.x2;
    })
    .attr("y", function(d,i){
      d.row = Math.floor(i / numPerRowCoi);
      d.y2 = d.row * (squareSize + squarePad);
      return d.y2;
    });


  g.selectAll(".multi")
    .transition()
    .duration(800)
    .delay(function (d, i) {
      return 15 * d.row;
    })
    .attr("transform", "translate(470,130)")
    .attr("x", function(d,i){
      d.col = i % numPerRowMulti;
      d.x2 = d.col * (squareSize + squarePad);
      return d.x2;
    })
    .attr("y", function(d,i){
      d.row = Math.floor(i / numPerRowMulti);
      d.y2 = d.row * (squareSize + squarePad);
      return d.y2;
    });

  g.selectAll(".inter")
    .transition()
    .duration(800)
    .delay(function (d, i) {
      return 15 * d.row;
    })
    .attr("transform", "translate(470,235)")
    .attr("x", function(d,i){
      d.col = i % numPerRowPres;
      d.x2 = d.col * (squareSize + squarePad);
      return d.x2;
    })
    .attr("y", function(d,i){
      d.row = Math.floor(i / numPerRowPres);
      d.y2 = d.row * (squareSize + squarePad);
      return d.y2;
    });

  g.selectAll(".pres")
    .transition()
    .duration(800)
    .delay(function (d, i) {
      return 15 * d.row;
    })
    .attr("transform", "translate(470,292)")
    .attr("x", function(d,i){
      d.col = i % numPerRowPres;
      d.x2 = d.col * (squareSize + squarePad);
      return d.x2;
    })
    .attr("y", function(d,i){
      d.row = Math.floor(i / numPerRowPres);
      d.y2 = d.row * (squareSize + squarePad);
      return d.y2;
    });

  g.selectAll(".other")
    .transition()
    .duration(800)
    .delay(function (d, i) {
      return 15 * d.row;
    })
    .attr("transform", "translate(470,339)")
    .attr("x", function(d,i){
      d.col = i % numPerRowOther;
      d.x2 = d.col * (squareSize + squarePad);
      return d.x2;
    })
    .attr("y", function(d,i){
      d.row = Math.floor(i / numPerRowOther);
      d.y2 = d.row * (squareSize + squarePad);
      return d.y2;
    });

  g.selectAll(".muslim")
    .transition()
    .duration(800)
    .delay(function (d, i) {
      return 15 * d.row;
    })
    .attr("transform", "translate(470,388)")
    .attr("x", function(d,i){
      d.col = i % numPerRowOther;
      d.x2 = d.col * (squareSize + squarePad);
      return d.x2;
    })
    .attr("y", function(d,i){
      d.row = Math.floor(i / numPerRowOther);
      d.y2 = d.row * (squareSize + squarePad);
      return d.y2;
    });

  g.selectAll(".quaker")
    .transition()
    .duration(800)
    .delay(function (d, i) {
      return 15 * d.row;
    })
    .attr("transform", "translate(470,413)")
    .attr("x", function(d,i){
      d.col = i % numPerRowOther;
      d.x2 = d.col * (squareSize + squarePad);
      return d.x2;
    })
    .attr("y", function(d,i){
      d.row = Math.floor(i / numPerRowOther);
      d.y2 = d.row * (squareSize + squarePad);
      return d.y2;
    });

  g.selectAll(".method")
    .transition()
    .duration(800)
    .delay(function (d, i) {
      return 15 * d.row;
    })
    .attr("transform", "translate(478,413)")
    .attr("x", function(d,i){
      d.col = i % numPerRowOther;
      d.x2 = d.col * (squareSize + squarePad);
      return d.x2;
    })
    .attr("y", function(d,i){
      d.row = Math.floor(i / numPerRowOther);
      d.y2 = d.row * (squareSize + squarePad);
      return d.y2;
    });

  g.selectAll(".jew")
    .transition()
    .duration(800)
    .delay(function (d, i) {
      return 15 * d.row;
    })
    .attr("transform", "translate(486,413)")
    .attr("x", function(d,i){
      d.col = i % numPerRowOther;
      d.x2 = d.col * (squareSize + squarePad);
      return d.x2;
    })
    .attr("y", function(d,i){
      d.row = Math.floor(i / numPerRowOther);
      d.y2 = d.row * (squareSize + squarePad);
      return d.y2;
    });


  g.append("text")
    .attr("transform", "translate(" + margin.left + "," + (margin.top+10) + ")")
    .attr("class", "caption")
    .classed("step_2", true)
    .attr("x", 130)
    .attr("y", height-25)
    .style("fill","#666666")
    .attr("opacity", 0)
    .html('Catholic')
    .transition()
    .duration(800)
    .delay(1200)
    .attr("opacity", 1);

  g.append("text")
    .attr("transform", "translate(400,0)")
    .attr("class", "caption")
    .classed("step_2", true)
    .attr("x", 69)
    .attr("y", 123)
    .style("fill","#666666")
    .attr("opacity", 0)
    .html('Church of Ireland')
    .transition()
    .duration(800)
    .delay(1200)
    .attr("opacity", 1);

  g.append("text")
    .attr("transform", "translate(400,100)")
    .attr("class", "caption")
    .classed("step_2", true)
    .attr("x", 69)
    .attr("y", 127)
    .style("fill","#666666")
    .attr("opacity", 0)
    .html('Multi-denominational')
    .transition()
    .duration(800)
    .delay(1200)
    .attr("opacity", 1);

  g.append("text")
    .attr("transform", "translate(400,100)")
    .attr("class", "caption")
    .classed("step_2", true)
    .attr("x", 69)
    .attr("y", 185)
    .style("fill","#666666")
    .attr("opacity", 0)
    .html('Inter-denominational')
    .transition()
    .duration(800)
    .delay(1200)
    .attr("opacity", 1);

  g.append("text")
    .attr("transform", "translate(400,100)")
    .attr("class", "caption")
    .classed("step_2", true)
    .attr("x", 69)
    .attr("y", 234)
    .style("fill","#666666")
    .attr("opacity", 0)
    .html('Presbyterian')
    .transition()
    .duration(800)
    .delay(1200)
    .attr("opacity", 1);

  g.append("text")
    .attr("transform", "translate(400,100)")
    .attr("class", "caption")
    .classed("step_2", true)
    .attr("x", 69)
    .attr("y", 280)
    .style("fill","#666666")
    .attr("opacity", 0)
    .html('Other/unknown')
    .transition()
    .duration(800)
    .delay(1200)
    .attr("opacity", 1);

  g.append("text")
    .attr("transform", "translate(400,100)")
    .attr("class", "caption")
    .classed("step_2", true)
    .attr("x", 69)
    .attr("y", 305)
    .style("fill","#666666")
    .attr("opacity", 0)
    .html('Muslim')
    .transition()
    .duration(800)
    .delay(1200)
    .attr("opacity", 1);

  g.append("text")
    .attr("transform", "translate(400,100)")
    .attr("class", "caption")
    .classed("step_2", true)
    .attr("x", 69)
    .attr("y", 330)
    .style("fill","#666666")
    .attr("opacity", 0)
    .html('Methodist, Jewish, & Quaker')
    .transition()
    .duration(800)
    .delay(1200)
    .attr("opacity", 1);


//var ethos =  ['Catholic','Church Of Ireland','Presbyterian','Other/Unknown','Muslim','Multi Denominational','Inter Denominational','Quaker','Methodist','Jewish'];



}



function moveGrid (){
  g.selectAll(".bar")
    .transition()
    .duration(600)
    .style("fill", "steelblue")
    .attr("opacity", 0);

  g.selectAll(".x.axis")
    .transition()
    .duration(600)
    .delay(1200)
    .attr("opacity", 0);

  g.selectAll(".y.axis")
    .transition()
    .duration(600)
    .delay(1200)
    .attr("opacity", 0);

  g.selectAll(".square")
   .transition()
   .duration(800)
    .delay(function (d, i) {
      return 15 * d.row;
    })
    .attr("x", 0)
    .attr("y", function(d,i){
      return yBarScale(i % 3) + yBarScale.rangeBand() / 2;
    });
}

function moveBack (){
  g.selectAll(".square")
    .transition()
    .duration(800)
    .delay(function (d, i) {
      return 15 * d.row;
    })
    .attr("transform", "translate(0,0)")
    .attr("x", function (d) {return d.x; })
    .attr("y", function (d) {return d.y; });
}

function highlightIrish (){
  g.selectAll(".bar")
    .transition()
    .duration(600)
    .style("fill", "steelblue")
    .attr("opacity", 0);

  g.selectAll(".x.axis")
    .transition()
    .duration(600)
    .delay(1200)
    .attr("opacity", 0);

  g.selectAll(".y.axis")
    .transition()
    .duration(600)
    .delay(1200)
    .attr("opacity", 0);

  g.selectAll(".square")
    .transition()
    .duration(600)
    .delay(function (d, i) {
      return 12 * d.row;
    })
    .attr("opacity", 1.0)
    .attr("fill", function(d){
      if(d.Irish === "Part Irish") {return '#FF6600'}
      else if (d.Irish === "All Irish") {return '#008080'}
      else {return '#ddd'};
    });
}

function highlightMix () {
  g.selectAll(".bar")
    .transition()
    .duration(600)
    .style("fill", "steelblue")
    .attr("opacity", 0);

  g.selectAll(".x.axis")
    .transition()
    .duration(600)
    .delay(1200)
    .attr("opacity", 0);

  g.selectAll(".y.axis")
    .transition()
    .duration(600)
    .delay(1200)
    .attr("opacity", 0);

  g.selectAll(".square")
    .transition()
    .duration(600)
    .delay(function (d, i) {
      return 12 * d.row;
    })
    .attr("opacity", 1.0)
    .attr("fill", function (d) {
      if (d.Total_Boys < 1) {
        return '#4682B4'
      }
      else if (d.Total_Girls < 1) {
        return '#FF00FF'
      }
      else {
        return '#ddd'
      }
    });
}

function highlightSpecial (){
  g.selectAll(".bar")
    .transition()
    .duration(600)
    .style("fill", "steelblue")
    .attr("opacity", 0);

  g.selectAll(".x.axis")
    .transition()
    .duration(600)
    .delay(1200)
    .attr("opacity", 0);

  g.selectAll(".y.axis")
    .transition()
    .duration(600)
    .delay(1200)
    .attr("opacity", 0);

  g.selectAll(".square")
   .transition()
   .duration(1200)
   .delay(function (d, i) {
   return 15 * d.row;
   })
   .attr("opacity", 1.0)
   .attr("fill", function(d){
   if(d.Type === "S") {return '#FF0000'}
   else {return '#ddd'}
   });
}


function mouseover(d) {
  tooltip.transition()
    .duration(50)
    .style("opacity", .9);

  tooltip.html(d.Name+"<br>"+"Total: "+ d.Total_Pupils);

 /* if (d3.event.pageX > (width - 20)) {
    tooltip.style("left", (d3.event.pageX - 120) + "px");
  } else {
    tooltip.style("left", (d3.event.pageX + 10) + "px")
      .style("top", (d3.event.pageY - 30) + "px");
  }

  if (d3.event.pageY > (height - 10)) {
    tooltip.style("top", (d3.event.pageY - 10) + "px");
  } else {
    tooltip.style("top", (d3.event.pageY + 10) + "px");
  }
}*/
  tooltip
    .style("left", (d3.event.pageX - 50) + "px")
    .style("top", (d3.event.pageY +20) + "px")
}

function mouseout(){
  tooltip.transition()
    .duration(500)
    .style("opacity", 1e-6);
}