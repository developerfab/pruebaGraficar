
var bar =null;

/** solicitud
*Esta funcion se encarga de realizar la solicitud al servidor
*/
function solicitud(frase){
	//contenedor que contendra la informacion filtrada y organizada
	var contenedor = new Array();
	//consulta y asignacion
	contenedor=filtro(frase.datas);
	console.log(contenedor);
	//el largo total de años a graficar en un solo dato
	var largo_subllave = contenedor[0].length;
	//cantidad total de datos a plasmar en el eje x
	var cant_datos = contenedor.length;

	var aux;
	for(i=cant_datos-1;i>=0;i--){
		for(j=largo_subllave-1;j>=0;j--){
			//console.log(i,j,contenedor[i][j]);
			aux = contenedor[i][j][1];
			carga(aux,asig_color(contenedor[i][j][0]),cant_datos,i);
		}
	}
	//$.get(frase,carga);
}
function cargar_bar(lienzo,data,pos_dato,barWidth){
	if(bar!=null){
		bar=bar.data([data])
	    	.enter().append("g")
	    	.attr("transform", function(d) {return "translate(" + pos_dato * barWidth + ",0)"; });
		return bar;
	}
	else{
		bar = lienzo.selectAll("g")
	    	.data([data])
	    	.enter().append("g")
	    	.attr("transform", function(d) {return "translate(" + pos_dato * barWidth + ",0)"; });
	   	return bar;
	}
	
}
/** carga
* Esta funcion se encarga de graficar los datos enviados a través del parametro
* data.
*/
function carga(data,color,cant_datos,pos_dato){
//Tamaño del lienzo	
	//console.log(data, color,cant_datos,pos_dato);

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
	/*var llaves = Object.keys(data);
	var claves= new Array;
	for(var i=0;i<llaves.length;i++){
		claves[i]=data[llaves[i]];
	}*/
	//--------------------- GRAFICACION ---------------------------
	//dominio de la grafica
	y.domain([0, cant_datos/*d3.max(data, function(d) { return d; })*/]);
	var barWidth = width / /*Object.keys(data).length;*/cant_datos;
	console.log('barWidth: '+barWidth);
	cargar_bar(lienzo,data,pos_dato,barWidth);
	
	console.log('bar: '+bar);
	bar.append("rect")
	    .attr("class", color)
	    .attr("y", function(d) {var n = y(d);console.log('n: '+n); return n; })
	    .attr("height", function(d) { var x=height-y(d);console.log('x: '+x);return x; })
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

/** color
* Esta funcion se encarga de asignar el color deseado a cada dato
*/
function asig_color(anio){
	var color_r= "negro";
	switch(anio){
		case '2006': 
					color_r = "rojo";
					break;
		case '2007':
					color_r = "azul";
					break;
		case '2008':
					color_r = "verde";
					break;
		case '2009':
					color_r = "amarillo";
					break;
		case '2010':
					color_r = "negro";
					break;
		case '2011':
					color_r = "morado";
					break;
		case '2012':
					color_r = "rosa";
					break;
		default:
					color_r="negro";
					break;
	}
	return color_r;

}
