
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
	var width = 960,
	    height = 500;

	var y = d3.scale.linear()
	    .range([height, 0]);
	
	//asignacion de la clase y del tamaño del lienzo
	var lienzo = d3.select(".lienzo")
	    .attr("width", width)
	    .attr("height", height);
	//asignacion de la informacion requerida
	//data = data.datas[2008];
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
	    .attr("transform", function(d, i) {return "translate(" + i * barWidth + ",0)"; });
	bar.append("rect")
	    .attr("class", color)
	    .attr("y", function(d) { var y1= y(d);return y1; })
	    .attr("height", function(d) { return height - y(d); })
	    .attr("width", barWidth - 1);
	 
	bar.append("text")
	    .attr("x", barWidth / 2)
	    .attr("y", function(d) { return y(d) + 3; })
	    .attr("dy", ".75em")
	    .text(function(d) { return d; });
	}

/** filtro
* Esta funcion se encarga de filtrar la infomacion solicitada para ser graficada.
* @return: contenedor: es una matriz con los elementos necesarios a retornar.
*/
function filtro(data){
	//llaves externas del diccionario data
	var llaves = Object.keys(data);
	//contenedor que tendra la informacion a retornar
	var contenedor = new Array();
	//llaves mas pequeñas del diccionario, seran los datos en el eje x
	var subllaves = new Array();
	//arreglo que contiene el año y el dato 
	var tupla = null;
	//variable que insertara los datos en el contenedor
	var aux = null;
	//asignacion de las llaves mas pequeñas de un arreglo
	subllaves = Object.keys(data[llaves[0]]);
	//se hace el filtro
	for (var i = 0; i < subllaves.length ; i++) {
		//se crea un nuevo arreglo
		aux = new Array();
		//se accede al dato necesario en el diccionario en cada año
		for(var j=0;j<llaves.length;j++){
			tupla = new Array();
			//se asigna el año
			tupla[0]=llaves[j];
			//se asigna el dato
			tupla[1]=data[llaves[j]][subllaves[i]];
			//se asigna la tupla al respectivo dato filtrado
			aux[j] = tupla;
			tupla = null;
		}
		//se asigna el filtro asignado en auxiliar al contenedor
		contenedor[i]=aux;
		aux=null;
	}
	//se ordenan los datos antes de ser retornados
	for(var n=0;n<contenedor.length;n++){
		contenedor[n]=ordenar(contenedor[n]);
	}
	return contenedor;
}

/** ordenar
* Esta funcion se encarga  de ordenar los datos mediante insecion antes de ser graficados
*/
function ordenar(dato){
	var tam = dato.length;
	var temp,temp2,j;
	console.log(dato);
	for(var i = 0;i<tam;i++){
		temp = dato[i][1];
		temp2 = dato[i];
		for(j = i-1;j>=0&&dato[j][1]>temp;j--){
			dato[j+1]=dato[j];
		}
		dato[j+1]=temp2;
	}
	return dato;
}


