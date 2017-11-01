let dataSet;
function callAPI() {
  const link =
    "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json";
  
  var getData = new XMLHttpRequest();
  getData.onreadystatechange = function() {
    if (getData.readyState === 4) {
      if (getData.status === 200) {
        dataSet = getData.responseText;
        dataSet = JSON.parse(dataSet);
        makeIt(dataSet);
      } else {
        console.log("Error is a " + getData.statusText);
      }
    }
  };
  getData.open("Get", link);
  getData.send();
}
function makeIt(data) {
  const baseTemp = data.baseTemperature;
   function computeTemp (n) {
    let x = n + baseTemp;
    return x.toFixed(2);
  }
  function colorClass(n) {
    if (n > 12.6669) {
      return "t127";
    }else if (n > 11.59999) {
      return "t116";
      }else if (n > 10.49999){
        return "t105";
      }else if (n > 9.39999) {
        return "t94"
      }else if (n > 8.29999){
        return "t83";
      }else if (n > 7.19999){
        return "t72";
      }else if (n > 6.0999){
        return "t61";
      }else if (n > 4.9999){
        return "t5";
      }else if (n > 3.8999) {
        return "t39";
      }else if (n > 2.6999){
        return "t27";
      }else {
        return "t0";
      }
  }
 // console.log(computeTemp(-0.11));
  const monthly = {
      "1": "January",
      "2": "Febuary",
      "3": "March",
      "4": "April",
      "5": "May",
      "6": "June",
      "7": "July",
      "8": "August",
      "9": "September",
      "10": "October",
      "11": "November",
      "12": "December"
    };
  //layout
  const margin = {top: 30, right: 20, bottom: 30, left: 50}
  let width = $(window).width();
  let height = $(window).height();
height = height  - margin.top - margin.bottom - 100;
width = width - margin.right - margin.left;

let rectWidth = parseInt(width / 262);
let rectHeight = parseInt((height-30)/12);
//handrolled Y axis scale definatly could have been done better.  
  let magicNum =[];
  let hat= rectHeight/2;
  magicNum.push(hat)
    for(var i = 0; i<11; i++) {
    hat =  rectHeight + hat;
    magicNum.push(hat);
  }
    
    let scaleX = d3.scaleLinear()
    .domain([1753, 2015])
    .range([50, (width-rectWidth)]);
 var vScale = d3.scaleLinear()
  .domain([1, 12])
  .range([0, height]); 
  var monthScale = d3.scaleOrdinal()
  .domain(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"])
  .range(magicNum);
   var vAxis = d3.axisLeft()
  .scale(monthScale)
  .ticks(12)
  .tickPadding(5);
  var axisX = d3.axisBottom()
  .scale(scaleX)
  .ticks(10)
  .tickPadding(5)
  .tickFormat(d3.format("d"));
  //

  
   var svg = d3.select("#heatMap")
  .append("svg")
  .attr("width", width )
  .attr("height", height);
    var axisGroup = svg.append("g")
.attr("class", "ax")
.attr('transform', 'translate(47 , 0)')
  .call(vAxis);
   var axisBot = svg.append("g")
 .attr("class", "ax")
 .attr('transform', 'translate(0,' + (height  - 30) +')')
 .call(axisX)
  
  svg.selectAll("rect")
   .data(data.monthlyVariance)
   .enter()
   .append("rect")
   .attr("y", function(d, i){if (i === 0) {return 0 }else if (i===1){return parseInt(rectHeight)}else{ return parseInt(rectHeight * (d.month - 1))}})
   .attr("x", function(d,i){return scaleX(d.year) })
   .attr("width", rectWidth )
   .attr("height", rectHeight)
   .attr("class", function(d,i){ return colorClass(computeTemp(d.variance))})
   .on("mouseover", function(d) {		
            tipsy.transition()		
                .duration(200)		
                .style("opacity", .9);		
            tipsy.html(monthly[d.month] + "<br/>"  + d.year	+ "<br/>"  + d.variance +" ℃"+ "<br/>"  + computeTemp(d.variance) + " ℃")
                .style("left", (d3.event.pageX)- 60 + "px")		
                .style("top", (d3.event.pageY) - 120 + "px");	
            })					
        .on("mouseout", function(d) {		
            tipsy.transition()		
                .duration(500)		
                .style("opacity", 0);	
        });
  console.log();
  
  var tipsy = d3.select("#tipo").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);
  
}

callAPI();
var resizeTimer;

$(window).on('resize', function(e) {

  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function() {
$("#heatMap").empty();
    makeIt(dataSet);
    
    
            
  }, 250);

});