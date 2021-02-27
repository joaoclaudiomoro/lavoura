/*
	Machine
	Máquinas
*/
function Machine(name){
	this.name = name;
	this.capacity = 0; // quanto aguenta carregar
	this.current_charge = 0; // quanto carrega no momento
	this.delivered_charge = 0; // quanto já passou pra frente
	this.location = Constant.LOCATION_GARAGE; // local onde a máquina se encontra
	this.received_charge = 0; // quanto já recebeu no dia
	//this.is_active = false; // se a máquina está sendo usada
	this.travels = 0; // quantas descarregadas deu no dia
	this.charge = Constant.CHARGE_EMPTY;
	// se a máquina está parada por estar cheia e não ter onde descarregar
	this.stopped = false;
	this.stopped_time = 0;
	// tempo necessário para descarregar a carga
	this.time_to_discharge = 10;
	// tempo necessário para descarregar a carga já corridos
	this.time_to_discharge_running = 0;
	// velocidade de colheita (sacas/minuto)
	this.harvest_velocity = 0;
	

	// define a carga da máquina e a localização
	this.set_state = function(){
		/*
			Define a carga (VAZIA, COM CARGA ou CHEIO)
		*/
		// se está vazio
		if(this.current_charge == 0){
			this.charge = Constant.CHARGE_EMPTY;
		}else if(this.current_charge >= (this.capacity - Constant.CHARGE_TOLERANCE)){
			// se está cheio
			this.charge = Constant.CHARGE_FULL;
		}else{
			// tem alguma carga
			this.charge = Constant.CHARGE_WITH_CHARGE;
		}
		/*
			Define a localização (GARAGE, ROAD ou HARVEST)
		*/
		// se tá na garage... tá na garage, não sai mais dai...
		if(this.location == Constant.LOCATION_GARAGE){
			return true;
		}
		// se está vazio, está na lavoura
		if(this.charge == Constant.CHARGE_EMPTY){
			this.location = Constant.LOCATION_HARVEST;
			return;
		}
		// se está com a carga cheia ou
		// se terminou a colheita e o tanque móvel está vazio
		// deve estar na estrada para descarregar
		if(
			(this.charge == Constant.CHARGE_FULL)
			|| (
				Simulator.glebe.production_current >= Simulator.glebe.production_prevision
				&& Simulator.movable_tank.charge == Constant.CHARGE_EMPTY
			)
		){
			//Interface.add_operation('<b>'+this.name+' na estrada para descarregar ..');
			this.location = Constant.LOCATION_ROAD;
		}
	}

	// função de descarregar o que está carregando
	this.discharge = function(destiny){
		//Interface.add_operation('<b>'+this.name+' com '+this.current_charge+'sc tenta descarregar em '+destiny.name+' (carga atual: '+destiny.current_charge+'sc, capacidade: '+destiny.capacity+')!');
		// se não tiver nada para descarregar
		if(this.current_charge == 0){
			Interface.add_operation('<b>'+this.name+' pensou em descarregar algo em '+destiny.name+', mas não tem o que descarregar!');
			return false;
		}
		// se precisa de tempo antes de descarregar (está indo em direção do ponto de descarga)
		if(this.time_to_discharge_running < this.time_to_discharge){
			//console.log(this.name+' está indo em direção de '+destiny.name+' para descarregar.. faltam ainda '+(this.time_to_discharge - this.time_to_discharge_running)+' minutos para conseguir descarregar..');
			this.time_to_discharge_running++;
			return false;
		}
		// se o destino não tiver capacity de receber nada
		if(destiny.current_charge >= destiny.capacity){
			//Interface.add_operation(Clock.get_current(),'<b>'+this.name+' pensou em descarregar algo em '+destiny.name+', mas não tem o que descarregar!');
			// marca esta máquina como parada
			this.stopped = true;
			// se não estiver em processo de encerramento
			if(Simulator.state != Constant.HAVERSTER_STATE_SHUTTING_DOWN){
				// marca como tempo perdido, essa máquina ficou parada nesse minuto
				this.stopped_time++;
			}
			//Interface.add_operation('<b>'+destiny.name+' não tem como receber a carga de '+this.name+'!');
			return false;
		}
		// se tava marcada como parada, agora está ativa
		this.stopped = false;

		// quanto foi descarregado
		var discharged = 0;
		// enquanto tiver espaço no destino
		while(this.current_charge > 0 && (destiny.current_charge < destiny.capacity)){
			//console.log(Clock.get_current()+' - Origem carga: '+this.current_charge+', destino carga: '+destiny.current_charge);
			// vai passando a carga
			this.current_charge--;
			this.delivered_charge++;
			destiny.current_charge++;
			destiny.received_charge++;
			discharged++;
		}
		//Interface.add_operation(this.name+' descarrega '+discharged+'sc em '+destiny.name);
		// reinicia o tempo necessário para o destino (já descarregou, está de volta na lavoura)
		this.time_to_discharge_running = 0;

		// manda atualizar estado das máquinas quanto à carga e posição entre carga e descarga
		this.set_state();
		destiny.set_state();

		// mais uma carga descarregada
		// aqui viagens pode significar tanto caminhão->silo como seifa->tanque móvel, etc
		this.travels++;
		// está no ponto inicial de carga novamente, está longe do ponto de descarga
		//this.time_to_discharge_running = 3;
		return discharged;
	}
	
	// configura a seifa
	this.harvest_set_up = function(){
/*
Colheita milho Jhon Deere
1 graneleiro 150sc/ha
15:35m
14:45m

Caixa d'água
9025
Encher graneleiro
12:50m

Descarregar graneleiro
2:15


Campo fundos - agrodanieli: 25:15
Descarregar: 34:30
Voltar: 56:30


13m graneleiro

seifa descarregar milho 1:40 à 1:50m

fazendinha -> são domingos = 31m
são domingos -> fazendinha = 31m

são domingos -> giba = 22m

fontana -> são domingos = 26m
descarregar em são domingos = 13m

5m até silo
7:30 a 10:00m descarregar no danieli
3m voltar

46m carga de 260sc
5.7sc por minuto

15 minutos
110sc
		*/
		switch(Simulator.glebe.production_in_ha){
			// soja
			case 2400: this.harvest_velocity = 144; break; // 40sc/ha 2.4sc/minuto confirmado
			case 3000: this.harvest_velocity = 160; break; // 50sc/ha
			case 3300: this.harvest_velocity = 170; break; // 55sc/ha
			case 3600: this.harvest_velocity = 180; break; // 60sc/ha 3sc/minuto confirmado
			case 3900: this.harvest_velocity = 190; break; // 65sc/ha
			case 4100: this.harvest_velocity = 200; break; // 70sc/ha
			// milho
			case 5700: this.harvest_velocity = 210; break; // 95sc/ha 3.5sc/minuto confirmado
			case 7800: this.harvest_velocity = 223; break; // 100sc/ha
			case 7800: this.harvest_velocity = 234; break; // 110sc/ha
			case 7800: this.harvest_velocity = 245; break; // 120sc/ha
			case 7800: this.harvest_velocity = 255; break; // 130sc/ha
			case 8400: this.harvest_velocity = 266; break; // 140sc/ha
			case 9000: this.harvest_velocity = 277; break; // 150sc/ha 4.6sc/minuto confirmado
			case 9600: this.harvest_velocity = 288; break; // 160sc/ha
			case 10200: this.harvest_velocity = 299; break; // 170sc/ha
			case 10800: this.harvest_velocity = 312; break; // 180sc/ha
			case 11400: this.harvest_velocity = 325; break; // 190sc/ha
			case 12000: this.harvest_velocity = 340; break; // 200sc/ha 5.7sc/minuto confirmado
		}
	}

	// função a ser executada em cada rodada pela seifa
	this.harvest = function(glebe){
		//console.log("colhendo");
		this.set_state();
		if(this.charge == Constant.CHARGE_FULL) return;

		// se já colheu o que tinha que colher para..
		if(Simulator.glebe.production_current >= Simulator.glebe.production_prevision){
			//if(!this.stopped)
				//Interface.add_operation(Clock.get_current(),
				//'<b>Seifa acabou de terminar de colher toda área de '+glebe.name+'!!</b> - Carga atual: '+this.current_charge+'sc');
			// marca que a seifa já está pronta pra descarregar..
			return;
		}
		// colhe o equivalente a um minuto de serviço
		this.current_charge += this.harvest_velocity;
		Simulator.glebe.production_current += this.harvest_velocity;
		//console.log('Carga atual da seifa '+this.current_charge);
		this.set_state();
	}
}