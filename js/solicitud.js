
var bar =null;

var eje = false;
//Tamaño del lienzo	

var margen = {top: 0, right: 0, bottom: 2, left: 30},
    	width = 960 - margen.left - margen.right,
    	height = 500 - margen.top - margen.bottom;

var y = d3.scale.linear()
	    .range([height, 0]);

var x = d3.scale.ordinal()
	  	.rangeRoundBands([0, width], .1);

var pos_actual=0;

function aniovsDato(frase){
	//diccionario con todos los datos
	var data = frase.datas;
	var llave = Object.keys(data);
	var contenedor = new Array();
	var tupla = new Array();
	var subllaves = null;
	var aux = new Array();
	//tupla = new Array();
	//		aux = new Array();
	console.log('llave ',llave);
	for(var i = 0; i<llave.length;i++){
		
		subllaves = Object.keys(data[llave[i]]);
		console.log('subllaves ', subllaves);
		for(var j = 0 ; j<subllaves.length;j++){

			//anio en cuestion
			tupla[0] = llave[i];
			//subllave
			tupla[1] = subllaves[j];
			//dato de la subllave
			tupla[2] = data[llave[i]][subllaves[j]];
			aux[j]=tupla;
		}
		contenedor[i]=aux;		
	}
	console.log('contenedor ', contenedor);
}

/** solicitud
*Esta funcion se encarga de realizar la solicitud al servidor para grafica dato vs cantidad
*/
function solicitud(frase){
	
	//contenedor que contendra la informacion filtrada y organizada
	var contenedor = new Array();
	//consulta y asignacion
	contenedor=filtro(frase.datas);
	//el largo total de años a graficar en un solo dato
	var largo_subllave = contenedor[0].length;
	//cantidad total de datos a plasmar en el eje x
	var cant_datos = contenedor.length;
	var maximo=0;
	var aux,pos_dato;
	
	//se calcula el valor maximo contenido en el arreglo

	for(var x = 0;x<cant_datos;x++){
		if(maximo<contenedor[x][largo_subllave-1][1]){
				maximo=contenedor[x][largo_subllave-1][1];
			}
	}
	maximo *= 1.3;

	//se grafican los datos
	for(i = largo_subllave-1;i>=0;i--){
		for(j=0;j<cant_datos;j++){
			
			pos_dato = j;
			aux = contenedor[j][i][1];
			carga(aux,asig_color(contenedor[j][i][0]),cant_datos,pos_dato,maximo);
		}
	}
	
	//se establecen los valores o limites a escribir en el eje y
	maximo= maximo/10;
	var valor_ejeY = new Array();
	for(var i =0;i<=10;i++){
		valor_ejeY[i]=maximo*i;
	}
	margenEje(valor_ejeY);

}
/** margenEje
* Esta funcion se encarga de pintar los ejes en la grafica
*/
function margenEje(max){

	var width = 980,
    height = 500;
	/*   margenes y ejes   */
	
    var margen_lienzo= d3.select(".lienzo")
    	.attr("width", width + margen.left + margen.right)
    	.attr("height", height + margen.top + margen.bottom)
  		.append("g")
    	.attr("transform", "translate(" + margen.left + "," + margen.top + ")");
    var ejeX = d3.svg.axis()
    	.scale(x)
    	.orient("bottom")
    	.tickValues([1,2,3]);
    var ejeY = d3.svg.axis()
    	.scale(y)
    	.orient("left")
    	.tickValues(max)
    	.ticks(10,'g');
    margen_lienzo.append("g")
    	.attr("class", "eje x")
    	.attr("transform", "translate(0," + height + ")")
   		.call(ejeX);
	margen_lienzo.append("g")
      	.attr("class", "eje y")
      	.call(ejeY)
      .append('text')
      	.attr("transform", "rotate(-90)")
    	.attr("y", 6)
    	.attr("dy", ".71em")
    	.style("text-anchor", "end")
    	.text("frecuencia");

    eje = true;
}

/**cargar_bar
* Esta function se encarga de crear los espacios para pintar las barras en la grafica
*/

function cargar_bar(lienzo,data,pos_dato,barWidth){
	if(bar!=null){
		bar=bar.data(data);
	    bar=bar.attr("transform", function(d) {return "translate(" + 0 + ",0)"; });
		return bar;
	}
	else{
		bar = lienzo.selectAll("g")
	    	.data(data)
	    	.enter().append("g")
	    	.attr("transform", function(d) {return "translate(" + 0 + ",0)"; });
	   	return bar;
	}
	
}
/** carga
* Esta funcion se encarga de graficar los datos enviados a través del parametro
* valor_dato: Es el valor a graficar
* color: color del que se graficara el valor
* cant_datos: es la cantidad de datos a lo largo del eje x a graficar (dominio)
* pos_dato: es la posicion del dato en la que se debe graficar
* maximo: Es el mayor de todos los datos, su funcion es establecer la regla para determinar el rango
*/
function carga(valor_dato,color,cant_datos,pos_dato,maximo){
	var data = [valor_dato]
	
   	var width = 960,
    height = 500;
	
	var y = d3.scale.linear()
	    .range([height, 0]);
	//asignacion de la clase y del tamaño del lienzo
	var lienzo = d3.select(".lienzo")
	    .attr("width", width)
	    .attr("height", height);

	//--------------------- GRAFICACION ---------------------------
	//dominio de la grafica
	y.domain([0, maximo]);

	var barWidth = width / cant_datos;
	
	cargar_bar(lienzo,data,pos_dato,barWidth);
	
	bar.append("rect")
	    .attr("class", color)
	    .attr("x", function(d) { return 30+ barWidth*(pos_dato +0.1); })
	    .attr("y", function(d) { return y(d); })
	    .attr("height", function(d) { return height-y(d); })
	    .attr("width", barWidth*0.8);
	 
	bar.append("text")
	    .attr("x", barWidth*pos_dato+30+barWidth/2)
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

	var tmp=null;
	//se comprueba si el es arreglo mas largo
	for(var i = 1; i<llaves.length;i++){
		tmp = Object.keys(data[llaves[i]]);
		for(var j = 0;j<tmp.length;j++){
			if(subllaves[tmp[j]]==undefined){
				subllaves.push(tmp[j]);
			}
		}
		
	}
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
			//si el dato es indefinido se resigna el dato
			if(tupla[1]==undefined){
				tupla[1]=0;
		}
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
* Esta funcion se encarga  de ordenar los datos mediante insercion antes de ser graficados
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
					//$('#referencia').append("div").attr("class=",color_r);
					break;
		case '2007':
					color_r = "azul";
					//$('#referencia').append("div").attr("class=",color_r);
					break;
		case '2008':
					color_r = "verde";
					//$('#referencia').append("div").attr("class=",color_r);
					break;
		case '2009':
					color_r = "amarillo";
					//$('#referencia').append("div").attr("class=",color_r);
					break;
		case '2010':
					color_r = "negro";
					//$('#referencia').append("div").attr("class=",color_r);
					break;
		case '2011':
					color_r = "morado";
					//$('#referencia').append("div").attr("class=",color_r);
					break;
		case '2012':
					color_r = "rosa";
					//$('#referencia').append("div").attr("class=",color_r);
					break;
		default:
					color_r="negro";
					//$('#referencia').append("div").attr("class=",color_r);
					break;
	}
	return color_r;

}
