/*
console.log('%c Volks Voltando ', 'color: orange; font-weight: bold;');
console.table(array);

console.time('looper');
let = 1; while(let<1000}let++;
consoletimeEnd('looper');

*/

/*
	Interface
*/
function Interface(){}
Interface.glebe;
Interface.growing;
Interface.production_in_ha;
Interface.active_truck_mercedes = false;
Interface.active_truck_volks = false;
Interface.first_truck_to_go;


Interface.update_all = function(){
	Interface.update_clock();
	Interface.update_machines();
	Interface.update_data_table();
	Interface.get_input();
	Interface.update_glebe_information();
	Interface.show_operations();
}

Interface.update_clock = function(){
	document.getElementById('clock_current_time').innerHTML = '&#128338;'+Clock.get_current();
}

Interface.update_machines = function(){
	// atualiza conforme caminhões disponíveis
	// qual caminhão não está em uso? pinta fundo escuro se não estiver em uso
	// mercedes?
	if(Interface.active_truck_volks){
		//document.getElementById("data_table_volks").style.backgroundColor = 'white';
		document.getElementById("drawing_table_volks").style.backgroundColor = 'white';
	}else{
		//document.getElementById("data_table_volks").style.backgroundColor = '#767676';
		document.getElementById("drawing_table_volks").style.backgroundColor = '#767676';
	}
	// volks?
	if(Interface.active_truck_mercedes){
		//document.getElementById("data_table_mercedes").style.backgroundColor = 'white';
		document.getElementById("drawing_table_mercedes").style.backgroundColor = 'white';
	}else{
		//document.getElementById("data_table_mercedes").style.backgroundColor = '#767676';
		document.getElementById("drawing_table_mercedes").style.backgroundColor = '#767676';
	}
	// se os dois caminhões estão em uso
	if(
		Interface.active_truck_mercedes
		&& Interface.active_truck_volks
	){
		// mostra opção de escolher caminhão preferencial
		document.getElementById("first_truck_to_go").disabled = false;
	// se um ou mais cmainhões não estão em uso
	}else{
		// não mostra opção de qual caminhão é preferencial a sair
		document.getElementById("first_truck_to_go").disabled = true;
		//deixa marcado como primeiro caminhão a sair aquele único disponível
		if(Interface.active_truck_volks)
			document.getElementById("first_truck_to_go").value = "volks";
		else
			document.getElementById("first_truck_to_go").value = "mercedes";
	}
	// se o volks vai ser usado
	// configura a posição dele
	var img = document.getElementById('img_volks');
	if(Simulator.truck_volks.location == Constant.LOCATION_GARAGE){
		document.getElementById('img_volks').style.display = 'none';
	}else{
		document.getElementById('img_volks').style.display = 'block';
		// na lavoura
		if(Simulator.truck_volks.location == Constant.LOCATION_HARVEST){
			img.innerHTML = '<img src=img/volks_indo.png>';
			document.getElementById('img_volks').style.left = 0;
			if(Simulator.truck_volks.charge == Constant.CHARGE_EMPTY){
				pvs = 'linear-gradient(to top, rgb(255,255,255), rgb(255,255,255))';
			}else if(Simulator.truck_volks.charge == Constant.CHARGE_WITH_CHARGE){
				pvs = parseInt( (Simulator.truck_volks.current_charge/Simulator.truck_volks.capacity) * 100);
				pvs = 'linear-gradient(to top, rgba(0,255,0,1), rgba(0,255,0,0) '+pvs+'%)';
			}
		}else{
			// na estrada
			var p = -500;
			// se está indo pro armazém
			if(Simulator.truck_volks.time_to_discharge_running < (Simulator.truck_volks.time_to_discharge / 2)){
				img.innerHTML = '<img src=img/volks_indo.png>';
				p = Simulator.truck_volks.time_to_discharge / 2;
				p = Simulator.truck_volks.time_to_discharge_running / p;
				p = p * -500;
				p = parseInt(p);
				pvs = 'linear-gradient(to top, orange, orange)';
				//console.log('volks indo, posição: '+p);
			//se está voltando
			}else{
				img.innerHTML = '<img src=img/volks_voltando.png>';
				p = Simulator.truck_volks.time_to_discharge / 2;
				p = p / Simulator.truck_volks.time_to_discharge_running;
				p = p * -500;
				p = parseInt(p);
				pvs = '';
				//console.log('volks voltando, posição: '+p);
			}
			document.getElementById('img_volks').style.left = p;
		}
		document.getElementById('img_volks').style.backgroundImage = pvs;
	}

	// se o mercedes vai ser usado
	// configura a posição dele
	img = document.getElementById('img_mercedes');
	if(Simulator.truck_mercedes.location == Constant.LOCATION_GARAGE){
		document.getElementById('img_mercedes').style.display = 'none';
	}else{
		document.getElementById('img_mercedes').style.display = 'block';
		// na lavoura
		if(Simulator.truck_mercedes.location == Constant.LOCATION_HARVEST){
			img.innerHTML = '<img src=img/mercedes_indo.png>';
			document.getElementById('img_mercedes').style.left = 0;
			if(Simulator.truck_mercedes.charge == Constant.CHARGE_EMPTY){
				pvs = 'linear-gradient(to top, rgb(255,255,255), rgb(255,255,255))';
			}else if(Simulator.truck_mercedes.charge == Constant.CHARGE_WITH_CHARGE){
				pvs = parseInt( (Simulator.truck_mercedes.current_charge/Simulator.truck_mercedes.capacity) * 100);
				pvs = 'linear-gradient(to top, rgba(0,255,0,1), rgba(0,255,0,0) '+pvs+'%)';
			}
		}else{
			// na estrada
			var p = -500;
			// se está indo pro armazém
			if(Simulator.truck_mercedes.time_to_discharge_running < (Simulator.truck_mercedes.time_to_discharge / 2)){
				img.innerHTML = '<img src=img/mercedes_indo.png>';
				p = Simulator.truck_mercedes.time_to_discharge / 2;
				p = Simulator.truck_mercedes.time_to_discharge_running / p;
				p = p * -500;
				pvs = 'linear-gradient(to top, orange, orange)';
				//console.log('mercedes indo, posição: '+p);
			//se está voltando
			}else{
				img.innerHTML = '<img src=img/mercedes_voltando.png>';
				p = Simulator.truck_mercedes.time_to_discharge / 2;
				p = p / Simulator.truck_mercedes.time_to_discharge_running;
				p = p * -500;
				p = parseInt(p);
				pvs = '';
				//console.log('mercedes voltando, posição: '+p);
			}
			document.getElementById('img_mercedes').style.left = p;
		}
		document.getElementById('img_mercedes').style.backgroundImage = pvs;
	}


	// imagem do tanque móvel
	var ptm;
	switch(Simulator.movable_tank.charge){
		case Constant.CHARGE_EMPTY: ptm = 'linear-gradient(to top, rgb(255,255,255), rgb(255,255,255))';break;
		case Constant.CHARGE_WITH_CHARGE:
			ptm = parseInt( (Simulator.movable_tank.current_charge/Simulator.movable_tank.capacity) * 100);
			ptm = 'linear-gradient(to top, rgba(0,255,0,1), rgba(0,255,0,0) '+ptm+'%)';
		break;
		case Constant.CHARGE_FULL: ptm = 'linear-gradient(to top, rgb(255,0,0), rgb(255,0,0))'; break;
	}
	// pinta o nível de enchimento do tanque
	document.getElementById('img_movable_tank').style.backgroundImage = ptm;

	// imagem da seifa
	var pcs;
	switch(Simulator.harvester.charge){
		case Constant.CHARGE_EMPTY: pcs = 'linear-gradient(to top, rgb(255,255,255), rgb(255,255,255))';break;
		case Constant.CHARGE_WITH_CHARGE:
			pcs = parseInt( (Simulator.harvester.current_charge/Simulator.harvester.capacity) * 100);
			pcs = 'linear-gradient(to top, rgba(0,255,0,1), rgba(0,255,0,0) '+pcs+'%)';
		break;
		case Constant.CHARGE_FULL: pcs = 'linear-gradient(to top, rgb(255,0,0), rgb(255,0,0))'; break;
	}
	// se a seifa ta parada deixa vermelha, se não, tem uma cor
	if(Simulator.harvester.stopped) document.getElementById('img_harvester').style.backgroundImage = 'linear-gradient(to top, rgb(255,0,0), rgb(255,0,0))';
	else document.getElementById('img_harvester').style.backgroundImage = pcs;
}

Interface.update_data_table = function(){
	/*
		Dados de cada máquina
		// quanto aguenta carregar
		.current_charge = 0; // quanto carrega no momento
		.carga_entregue = 0; // quanto já passou pra frente
		.carga_no_dia = 0; // quanto já recebeu no dia
		.entregas_no_dia = 0; // quantas descarregadas deu no dia
		// quanto tempo a máquina já ficou parada por estar cheia e não ter onde descarregar
		.tempo_parada = 0;
	*/
	//document.getElementById('volks_delivered_charge').innerHTML = parseInt(Simulator.truck_volks.delivered_charge/60)+'sc';
	//document.getElementById('volks_delivered_charge').innerHTML += ' / '+Simulator.truck_volks.travels+' cargas';
	//document.getElementById('volks_travels').innerHTML = Simulator.truck_volks.travels+' entrega(s)';
	//document.getElementById('volks_current_charge').innerHTML = parseInt(Simulator.truck_volks.current_charge/60)+'sc';
	//document.getElementById('volks_capacity').innerHTML = parseInt(Simulator.truck_volks.capacity/60)+'sc';
	//document.getElementById('volks_capacity').innerHTML += ' / '+Simulator.glebe.delivery_time+'m';
	// se o volks vai ser usado
	/*if(Simulator.truck_volks.location != Constant.LOCATION_GARAGE){
		switch(Simulator.truck_volks.charge){
			case Constant.CHARGE_EMPTY: document.getElementById('data_table_volks').style.backgroundColor = 'white'; break;
			case Constant.CHARGE_WITH_CHARGE: document.getElementById('data_table_volks').style.backgroundColor = '#00de00'; break;
			case Constant.CHARGE_FULL: document.getElementById('data_table_volks').style.backgroundColor = 'orange'; break;
		}
	}*/
	//document.getElementById('mercedes_delivered_charge').innerHTML = parseInt(Simulator.truck_mercedes.delivered_charge/60)+'sc';
	//document.getElementById('mercedes_delivered_charge').innerHTML += ' / '+Simulator.truck_mercedes.travels+' cargas';
	//document.getElementById('mercedes_travels').innerHTML = Simulator.truck_mercedes.travels+' entrega(s)';
	//document.getElementById('mercedes_current_charge').innerHTML = parseInt(Simulator.truck_mercedes.current_charge/60)+'sc';
	//document.getElementById('mercedes_capacity').innerHTML = parseInt(Simulator.truck_mercedes.capacity/60)+'sc';
	//document.getElementById('mercedes_capacity').innerHTML += ' / '+Simulator.glebe.delivery_time+'m';
	// se o mercedes vai ser usado
	/*if(Simulator.truck_mercedes.location != Constant.LOCATION_GARAGE){
		switch(Simulator.truck_mercedes.charge){
			case Constant.CHARGE_EMPTY: document.getElementById('data_table_mercedes').style.backgroundColor = 'white'; break;
			case Constant.CHARGE_WITH_CHARGE: document.getElementById('data_table_mercedes').style.backgroundColor = '#00de00'; break;
			case Constant.CHARGE_FULL: document.getElementById('data_table_mercedes').style.backgroundColor = 'orange'; break;
		}
	}*/
	// tanque móvel
	//document.getElementById('movable_tank_current_charge').innerHTML = parseInt(Simulator.movable_tank.current_charge/60)+'sc';
	//document.getElementById('movable_tank_capacity').innerHTML = parseInt(Simulator.movable_tank.capacity/60)+'sc';
	//document.getElementById('movable_tank_capacity').innerHTML += ' / '+Simulator.movable_tank.time_to_discharge+'m';
	document.getElementById('img_movable_tank_img').title = 'Capacidade: ' + parseInt(Simulator.movable_tank.capacity/60)+'sc';
	document.getElementById('img_movable_tank_img').title += '\nTempo de descarga: ' + Simulator.movable_tank.time_to_discharge+'m';

	// seifa
	//document.getElementById('harvester_delivered_charge').innerHTML = parseInt(Simulator.harvester.delivered_charge/60)+'sc';
	//document.getElementById('harvester_delivered_charge').innerHTML += ' / '+Simulator.harvester.travels+' cargas';
	//document.getElementById('harvester_current_charge').innerHTML = parseInt(Simulator.harvester.current_charge/60)+'sc';
	//document.getElementById('harvester_capacity').innerHTML = parseInt(Simulator.harvester.capacity/60)+'sc';
	//document.getElementById('harvester_capacity').innerHTML += ' / '+Simulator.harvester.time_to_discharge+'m';
	
	document.getElementById('harvester_information').innerHTML = 'Seifa';
	document.getElementById('harvester_information').innerHTML += '<br>Total colhido: ' + parseInt(Simulator.glebe.production_current/60)+'sc ('+parseInt(Simulator.glebe.production_current/Simulator.glebe.production_in_ha) +'ha)';
	document.getElementById('harvester_information').innerHTML += '<br><b>Carga atual: </b>' + parseInt(Simulator.harvester.current_charge/60)+'sc';
	document.getElementById('harvester_information').innerHTML += '<br><b>Tempo parada: </b>' + Simulator.harvester.stopped_time+'m (' + parseInt((Simulator.harvester.harvest_velocity * Simulator.harvester.stopped_time)/60) + 'sc)';
	document.getElementById('img_harvester_img').title = 'Capacidade: ' + parseInt(Simulator.harvester.capacity/60)+'sc';
	document.getElementById('img_harvester_img').title += '\nTempo de descarga: ' + Simulator.harvester.time_to_discharge+'m';
	
	// volks
	document.getElementById('volks_information').innerHTML = 'Volks (cap. ' + parseInt(Simulator.truck_volks.capacity/60)+'sc)<br>Entregas: ' + Simulator.truck_volks.travels + ' (' + parseInt(Simulator.truck_volks.delivered_charge/60) + 'sc)<br>';
	if(Simulator.truck_volks.location == Constant.LOCATION_ROAD)
		document.getElementById('volks_information').innerHTML += 'ENTREGANDO';
	else
		document.getElementById('volks_information').innerHTML += 'Carga atual: ' + parseInt(Simulator.truck_volks.current_charge/60)+'sc';
	
	// mercedes
	document.getElementById('mercedes_information').innerHTML = 'Mercedes (cap. ' + parseInt(Simulator.truck_mercedes.capacity/60) + 'sc)<br>Entregas: ' + Simulator.truck_mercedes.travels + ' (' + parseInt(Simulator.truck_mercedes.delivered_charge/60) + 'sc)<br>';
	if(Simulator.truck_mercedes.location == Constant.LOCATION_ROAD)
		document.getElementById('mercedes_information').innerHTML += 'ENTREGANDO';
	else
		document.getElementById('mercedes_information').innerHTML += 'Carga atual: ' + parseInt(Simulator.truck_mercedes.current_charge/60)+'sc';

	// total entregue no armazém	
	document.getElementById('silo_armazem_entregue').innerHTML = '<b>Entregue: </b>'+parseInt(Simulator.agrodanieli.received_charge/60)+'sc';

	// diversos
	//document.getElementById('information').innerHTML = '<b>Total colhido: </b>'+parseInt(Simulator.glebe.production_current/60)+'sc ('+parseInt(Simulator.glebe.production_current/Simulator.glebe.production_in_ha) +'ha)';
	//document.getElementById('information').innerHTML += ' | <b>Total entregue: </b>'+parseInt(Simulator.agrodanieli.received_charge/60)+'sc';
	//document.getElementById('information').innerHTML += ' | <b>Seifa parada: </b>'+Simulator.harvester.stopped_time+'m';
}

Interface.get_input = function(){
	Interface.glebe = document.getElementById("glebe").value;
	//Interface.growing = document.getElementById("growing").value;
	Interface.production_in_ha = parseInt(document.getElementById("production_in_ha").value);
	if(Interface.production_in_ha < 6000) Interface.growing = 'soy';
	else Interface.growing = 'corn';
	Clock.start = parseInt(document.getElementById("clock_start").value);
	Clock.end = parseInt(document.getElementById("clock_end").value);
	Interface.active_truck_mercedes = document.getElementById("active_truck_mercedes").checked;
	Interface.active_truck_volks = document.getElementById("active_truck_volks").checked;
	Interface.first_truck_to_go = document.getElementById("first_truck_to_go").value;
}

Interface.update_glebe_information = function(){
	var growing = (Interface.growing == 'soy') ? 'Soja' : 'Milho';
	var prod_estim = parseInt(Simulator.glebe.production_prevision/60); //("/60" converte kg em saca e minuto em hr(próxima variável))
	var horas_estim = parseInt(prod_estim/Simulator.harvester.harvest_velocity);
	document.getElementById('glebe_info').innerHTML = Simulator.glebe.name+' '+Simulator.glebe.size_ha+'ha (' + Simulator.glebe.delivery_time + ' minutos do armazém) | ' + growing + ' ' + parseInt(Simulator.glebe.production_in_ha/60)+'sc/ha ('+prod_estim+'sc colhidos em '+horas_estim+'hrs)';
	// troca a imagem
	document.getElementById('glebe_image').src = 'img/Glebe_' + Interface.glebe + '.png';
}

Interface.operations = new Array();
Interface.add_operation = function(description){
	if(Constant.SHOW_OPERATIONS_IN_CONSOLE == true) console.log(Clock.get_current()+': '+description);
	Interface.operations.push("<tr><td>"+Clock.get_current()+"</td><td>"+description+"</td></tr>");
}
Interface.show_operations = function(){
	// cria tabela com operações a serem mostradas
	var tabela_inner = "<table><tr><td>HORÁRIO</td><td>OPERAÇÃO</td></tr>";
	Interface.operations.forEach(function (item, indice, array) {
		tabela_inner += item;
	});
	document.getElementById('result').innerHTML = tabela_inner;
}