var data=[2,3,4,5,6,7];
d3.select(".grafica")
  .selectAll("div")
    .data(data)
  .enter().append("div")
    .style("width",function(d){return d*10+"px";})
    .text(function(d){return d;});
