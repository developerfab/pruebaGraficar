
	/** solicitud
	*Esta funcion se encarga de realizar la solicitud al servidor
	*/


	function solicitud(frase){
		$.get(frase,carga);
	}

	/** carga
	* Esta funcion se encarga de graficar los datos enviados a través del parametro
	* data.
	*/
	function carga(data,color){
	//Tamaño del lienzo
		console.log("--------");
		var width = 960,
		    height = 500;

		var y = d3.scale.linear()
		    .range([height, 0]);
		console.log("--------");
		//asignacion de la clase y del tamaño del lienzo
		console.log("y="+y);
		var lienzo = d3.select(".lienzo")
		    .attr("width", width)
		    .attr("height", height);
	    //asignacion de la informacion requerida
		//data = data.datas[2008];
	   	console.log(data);
	  	console.log(color);
		//Se separan las llaves y los datos
		var llaves = Object.keys(data);
		var claves= new Array;

		for(var i=0;i<llaves.length;i++){
			claves[i]=data[llaves[i]];
		}
		//--------------------- GRAFICACION ---------------------------
		//dominio de la grafica
		y.domain([0, d3.max(claves, function(d) { return d; })]);
		var barWidth = width / Object.keys(data).length;
		
		var bar = lienzo.selectAll("g")
		    .data(claves)
		    .enter().append("g")
		    .attr("transform", function(d, i) { i=0;console.log('i: '+i);return "translate(" + i * barWidth + ",0)"; });
		bar.append("rect")
		    .attr("class", color)
		    .attr("y", function(d) { var y1= y(d);console.log('y: '+y1);return y1; })
		    .attr("height", function(d) { return height - y(d); })
		    .attr("width", barWidth - 1);
		 
		bar.append("text")
		    .attr("x", barWidth / 2)
		    .attr("y", function(d) { return y(d) + 3; })
		    .attr("dy", ".75em")
		    .text(function(d) { console.log(d);return d; });
		}

function filtro(data){
	
	var llaves = Object.keys(data);
	var contenedor = new Array(),subllaves = new Array();
	var aux = null;
	subllaves = Object.keys(data[llaves[0]]);
	for (var i = 0; i < subllaves.length ; i++) {
		aux = new Array();
		for(var j=0;j<llaves.length;j++){
			aux[j]=data[llaves[j]][subllaves[i]];
		}
		contenedor[i]=aux;
		aux=null;
	}
	return contenedor;
}