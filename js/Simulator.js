/*
	Simulator
*/
function Simulator(){}

// controle das interações/passos a serem executados
Simulator.interactions = null;
// estado atual da colheita
Simulator.state = Constant.HAVERSTER_STATE_STOPPED;
Simulator.glebe; // dados da lavoura a ser colhida
var res; // resultado na tela
// objetos que possuem capacidade de armazenamento
Simulator.harvester;
Simulator.agrodanieli;
Simulator.truck_volks;
Simulator.truck_mercedes;
Simulator.movable_tank;

Simulator.start = function(){
	// atualiza dados da tela
	Interface.get_input();
	// limpa operações a serem mostradas na tela
	Interface.operations = new Array();
//console.log(Interface);return;

	// configura velocidade da simulação
	Simulator.speed_set(2);
	
	// define especificações da Gleba
	Simulator.glebe = Glebe.set(Interface.glebe, Interface.production_in_ha);
//console.log(Interface.production_in_ha);return;
//console.log(glebe);return;

	// configura dados da lavoura e das máquinas

	// silo do agrodanieli tbém é uma máquina
	Simulator.agrodanieli = new Machine('agrodanieli');
	Simulator.agrodanieli.location = Constant.LOCATION_HARVEST;
	Simulator.agrodanieli.capacity = 999999999;
	
	// cria caminhões
	Simulator.truck_volks = new Machine('volks');
	Simulator.truck_volks.capacity = 19200; // 320sc
	Simulator.truck_volks.time_to_discharge = Simulator.glebe.delivery_time;
	Simulator.truck_mercedes = new Machine('mercedes');
	Simulator.truck_mercedes.capacity = 16200; // 270sc
	Simulator.truck_mercedes.time_to_discharge = Simulator.glebe.delivery_time;
	// tanque móvel
	Simulator.movable_tank = new Machine('movable_tank');
	Simulator.movable_tank.location = Constant.LOCATION_HARVEST;
	Simulator.movable_tank.capacity = 10200; // 170sc
	Simulator.movable_tank.time_to_discharge = 3;
	// seifa
	Simulator.harvester = new Machine('harvester');
	Simulator.harvester.location = Constant.LOCATION_HARVEST;
	Simulator.harvester.capacity = 5280; // 88sc
	// tempo de descarga da harvester depende da carga e posição dela na lavoura... se é no tancão ou no caminhão..
	Simulator.harvester.time_to_discharge = 3;
	// configura seifa (quantas sacas ela colhe por minuto)
	Simulator.harvester.harvest_set_up();

	// se o volks vai ser usado
	if(Interface.active_truck_volks) Simulator.truck_volks.location = Constant.LOCATION_HARVEST;
	else Simulator.truck_volks.location = Constant.LOCATION_GARAGE;
		
	// se o mercedes vai ser usado
	if(Interface.active_truck_mercedes) Simulator.truck_mercedes.location = Constant.LOCATION_HARVEST;
	else Simulator.truck_mercedes.location = Constant.LOCATION_GARAGE;
	
	// define configurações iniciais de tempo
	Clock.current = Clock.start;
	Simulator.state = Constant.HAVERSTER_STATE_RUNNING;
	console.log("Iniciando operações: Início: "+Clock.start+" Atual: "+Clock.current+" Fim: "+Clock.end);
	//console.log(Simulator.harvester); console.log(Simulator.movable_tank); console.log(Simulator.truck_mercedes); console.log(Simulator.truck_volks);return;
	Simulator.resume();
}

Simulator.stop = function(){
	clearInterval(Simulator.interactions);
	Interface.update_all();
	Interface.show_operations();
	Simulator.state = Constant.HAVERSTER_STATE_STOPPED;
}

Simulator.pause = function(){
	Interface.update_all();
	// se a simulacao estiver rodando
	if(Simulator.state == Constant.HAVERSTER_STATE_RUNNING){
	// para
		document.getElementById('clock_pause_resume').innerHTML = '&#9654;';
		Simulator.state = Constant.HAVERSTER_STATE_PAUSED;
		clearInterval(Simulator.interactions);
	}else{
	// senão, resume ela
		document.getElementById('clock_pause_resume').innerHTML = '&nbsp;&#9613;&#9613;';
		Simulator.state = Constant.HAVERSTER_STATE_RUNNING;
		Simulator.resume();
	}
}


Simulator.resume = function(){
	//console.log("Resumindo operações, tempos: Início: "+Clock.start+" Atual: "+Clock.current+" Fim: "+Clock.end);
	var tpi; //tempo_por_interacao;
	// velocidade de interações, quanto maior o número, mais rápido
	switch(Clock.speed){
		case 1: tpi = 150;break;
		case 2: tpi = 80;break;
		case 3: tpi = 25;break;
		case 4: tpi = 15;break;
		default: Clock.speed = 2; tpi = 80;
	}
	//console.log('Velocidade definida: '+Clock.speed);
	Simulator.state = Constant.HAVERSTER_STATE_RUNNING;
	clearInterval(Simulator.interactions);
	Simulator.interactions = setInterval(Simulator.step, tpi);
}

Simulator.speed_set = function(speed){
	switch(speed){
		case 1:
			Clock.speed = 1;
			document.getElementById('clock_speed_01').innerHTML = '&#9899;';
			document.getElementById('clock_speed_02').innerHTML = '&#9898;';
			document.getElementById('clock_speed_03').innerHTML = '&#9898;';
			document.getElementById('clock_speed_04').innerHTML = '&#9898;';
		break;
		case 3:
			Clock.speed = 3;
			document.getElementById('clock_speed_01').innerHTML = '&#9899;';
			document.getElementById('clock_speed_02').innerHTML = '&#9899;';
			document.getElementById('clock_speed_03').innerHTML = '&#9899;';
			document.getElementById('clock_speed_04').innerHTML = '&#9898;';
		break;
		case 4:
			Clock.speed = 4;
			document.getElementById('clock_speed_01').innerHTML = '&#9899;';
			document.getElementById('clock_speed_02').innerHTML = '&#9899;';
			document.getElementById('clock_speed_03').innerHTML = '&#9899;';
			document.getElementById('clock_speed_04').innerHTML = '&#9899;';
		break;
		default:
			Clock.speed = 2;
			document.getElementById('clock_speed_01').innerHTML = '&#9899;';
			document.getElementById('clock_speed_02').innerHTML = '&#9899;';
			document.getElementById('clock_speed_03').innerHTML = '&#9898;';
			document.getElementById('clock_speed_04').innerHTML = '&#9898;';
		break;
	}
	// se tá rodando, atualiza a velocidade
	if(Simulator.state == Constant.HAVERSTER_STATE_RUNNING) Simulator.resume();
}

/*Simulator.speed_decrease = function(){
	Clock.speed--;
	if(Clock.speed < 1)Clock.speed = 1;
	// se tá rodando, atualiza a velocidade
	if(Simulator.state == Constant.HAVERSTER_STATE_RUNNING) Simulator.resume();
}

Simulator.speed_increase = function(){
	Clock.speed++;
	if(Clock.speed > 4)Clock.speed = 4;
	// se tá rodando, atualiza a velocidade
	if(Simulator.state == Constant.HAVERSTER_STATE_RUNNING) Simulator.resume();
}*/


Simulator.step = function(){
	// se nenhum caminhão estiver selecionado, estão todos na garagem.. para tudo... precisa de um caminhão ao menos
	if(
		Simulator.truck_mercedes.location == Constant.LOCATION_GARAGE
		&& Simulator.truck_volks.location == Constant.LOCATION_GARAGE
	){
		Interface.add_operation("Precisa ter ao menos um caminhão disponível para puxar a safra!");
		Simulator.stop();
		return;
	}	
	// controle de segurança.. não queremos travar o navegador
	if(Clock.current > 1600){
		console.log('Tempo atual em ('+Clock.current+'), estourou por demais o tempo final ('+Clock.end+')');
		Simulator.stop();
		return;
	}
	// se passou do tempo definido
	if(Clock.current > Clock.end){
		// pede pra terminar todas operações abertas
		console.log('Tempo limite, encerrando as operações abertas');
		Simulator.state = Constant.HAVERSTER_STATE_SHUTTING_DOWN;
		// se todas máquinas estão vazias, então todas operações foram encerradas
		if(Simulator.harvester.charge == Constant.CHARGE_EMPTY
		&& Simulator.movable_tank.charge == Constant.CHARGE_EMPTY
		&& Simulator.truck_volks.charge == Constant.CHARGE_EMPTY
		&& Simulator.truck_mercedes.charge == Constant.CHARGE_EMPTY
		){
			// encerra tudo
			console.log('Tempo limite, todas operações foram encerradas');
			Simulator.stop();
			return;
		}
	}
	// se já colheu tudo e todas máquinas estão vazias
	if(
		Simulator.glebe.production_current >= Simulator.glebe.production_prevision
		&& Simulator.harvester.charge == Constant.CHARGE_EMPTY
		&& Simulator.movable_tank.charge == Constant.CHARGE_EMPTY
		&& Simulator.truck_volks.charge == Constant.CHARGE_EMPTY
		&& Simulator.truck_mercedes.charge == Constant.CHARGE_EMPTY
	){
		console.log('('+Clock.get_current()+') Terminou a colheita antes de terminar o dia');
		Simulator.stop();
		return;
	}

	// um passo do relógio
	Clock.current++
	//console.log('tempo atual: '+Clock.current+' tempo fim:'+Clock.end+' velocidade: '+Clock.speed);

	// atualiza estado das máquinas
	Simulator.truck_mercedes.set_state();
	Simulator.truck_volks.set_state();
	Simulator.movable_tank.set_state();
	Simulator.harvester.set_state();

	// atualiza a interface
	Interface.update_all();

	// se não está se encerrando tudo...
	if(Simulator.state != Constant.HAVERSTER_STATE_SHUTTING_DOWN){
		// manda a seifa colher
		Simulator.harvester.harvest(glebe);
	}

	// se a seifa está cheia
	// ou o tempo da colheita terminou e ela não está vazia
	// ou foi colhido tudo e ela não está vazia
	if(
		Simulator.harvester.charge == Constant.CHARGE_FULL
		|| (
			Simulator.state == Constant.HAVERSTER_STATE_SHUTTING_DOWN
			&& Simulator.harvester.charge == Constant.CHARGE_WITH_CHARGE
		)
		|| (
			(Simulator.harvester.current_charge + Simulator.harvester.delivered_charge >= Simulator.glebe.production_prevision)
			&& Simulator.harvester.charge == Constant.CHARGE_WITH_CHARGE
		)
	){
		// tenta descarregar no tanque móvel
		//Interface.add_operation('<b>Seifa cheia ou terminou a colheita! Tentando descarregar no tanque móvel!');
		Simulator.harvester.discharge(Simulator.movable_tank);
	}

	// se tem algo no tancão, e existe algum caminhão disponível, tenta passar para um caminhão
	if(
		(
			Simulator.movable_tank.charge == Constant.CHARGE_WITH_CHARGE
			|| Simulator.movable_tank.charge == Constant.CHARGE_FULL
		)
		&& (
			Simulator.truck_mercedes.location == Constant.LOCATION_HARVEST
			|| Simulator.truck_volks.location == Constant.LOCATION_HARVEST
		)
	){
		// se tiver algum na lavoura com carga
		if(
			Simulator.truck_mercedes.location == Constant.LOCATION_HARVEST
			&& Simulator.truck_mercedes.charge == Constant.CHARGE_WITH_CHARGE
		){
			//console.log('mercedes na lavoura e com carga, descarregando nele...');
			Simulator.movable_tank.discharge(Simulator.truck_mercedes);
		}else if(
			Simulator.truck_volks.location == Constant.LOCATION_HARVEST
			&& Simulator.truck_volks.charge == Constant.CHARGE_WITH_CHARGE
		){
			//console.log('volks na lavoura e com carga, descarregando nele...');
			Simulator.movable_tank.discharge(Simulator.truck_volks);
		// se não pega o preferencial que estiver na lavoura
		}else if(
			Simulator.truck_mercedes.location == Constant.LOCATION_HARVEST
			&& Interface.first_truck_to_go == 'mercedes'
		){
			//console.log('mercedes preferencial recebendo carga do tanque móvel...');
			Simulator.movable_tank.discharge(Simulator.truck_mercedes);
		}else if(
			Simulator.truck_volks.location == Constant.LOCATION_HARVEST
			&& Interface.first_truck_to_go == 'volks'
		){
			//console.log('volks preferencial recebendo carga do tanque móvel...');
			Simulator.movable_tank.discharge(Simulator.truck_volks);
		// em último caso pega um que estiver vazio na lavoura
		}else if(
			Simulator.truck_volks.charge == Constant.CHARGE_EMPTY
			&& Simulator.truck_volks.location == Constant.LOCATION_HARVEST
		){
			//console.log('volks vazio na lavoura, recebendo carga do tanque móvel...');
			Simulator.movable_tank.discharge(Simulator.truck_volks);
		}else if(
			Simulator.truck_mercedes.charge == Constant.CHARGE_EMPTY
			&& Simulator.truck_mercedes.location == Constant.LOCATION_HARVEST
		){
			//console.log('mercedes vazio na lavoura, recebendo carga do tanque móvel...');
			Simulator.movable_tank.discharge(Simulator.truck_mercedes);
		}
	}
	// se está se encerrando tudo...
	if(Simulator.state == Constant.HAVERSTER_STATE_SHUTTING_DOWN){
		// se o tanque móvel está vazio, manda todos caminhões com carga pra estrada
		if(Simulator.movable_tank.charge == Constant.CHARGE_EMPTY){
			if(Simulator.truck_volks.charge != Constant.CHARGE_EMPTY) Simulator.truck_volks.location = Constant.LOCATION_ROAD;
			if(Simulator.truck_mercedes.charge != Constant.CHARGE_EMPTY) Simulator.truck_mercedes.location = Constant.LOCATION_ROAD;
		}
	}
	// se algum caminhão está na estrada, manda ele descarregar
	// MERCEDES
	if(Simulator.truck_mercedes.location == Constant.LOCATION_ROAD){
		Simulator.truck_mercedes.discharge(Simulator.agrodanieli);
	}
	// VOLKS
	if(Simulator.truck_volks.location == Constant.LOCATION_ROAD){
		Simulator.truck_volks.discharge(Simulator.agrodanieli);
	}
	//console.log('Já foi colhido '+glebe.production_current+'sc. Colheita prevista em '+glebe.production_prevision+'scs. Não tem mais o que colher!');
}