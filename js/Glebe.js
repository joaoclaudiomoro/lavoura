/*
	Glebe
	Glebas disponíveis para simulação
*/
function Glebe(){
	this.name; // nome/apelido da gleba
	this.size_ha = 0; // tamanho da gleba em hectare
	this.distance_from_agrodanieli = 0; // distância da lavoura até o agrodanieli
	this.distance_from_farm_storage = 0; // distância da lavoura até o silo
	this.delivery_time = 0; // tempo da lavoura até o depósito
	this.production_in_ha = 0; // produção por hectare
	this.production_current = 0; // quanto já foi colhido
	this.production_prevision = 0; // quanto se espera colher em toda área
}
// lista de glebas cadastrada
Glebe.glebes = new Array();

// adiciona um mapa a lista de mapas do jogo
Glebe.add = function(G){
	//console.log('Carregando mapa '+M.name);
	// salva referência do mapa
	Glebe.glebes[G.name] = G;
}

// configura uma gleba específica
Glebe.set = function(name, production_in_ha){
	var G;
	switch(name){
		default:
		case "sede": G = new SedeGlebe(); break;
		case 'fontana': G = new FontanaGlebe(); break;
		case 'giba': G = new GibaGlebe(); break;
		case 'caixa_dagua': G = new CaixaDaguaGlebe(); break;
		case 'fazendinha': G = new FazendinhaGlebe(); break;
		case 'parque': G = new ParqueGlebe(); break;
		case 'tondelo': G = new TondeloGlebe(); break;
		case 'campo': G = new CampoGlebe(); break;
		case 'coleginho': G = new ColeginhoGlebe(); break;
		case 'acude': G = new AcudeGlebe(); break;
	}
	G.production_in_ha = production_in_ha;
	G.production_prevision = G.size_ha * production_in_ha;
	return G;
}
