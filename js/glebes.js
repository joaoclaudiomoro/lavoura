/*
	Sede
Sede -> Agro: 5m
Agro -> Sede: 3m
480s
*/
function SedeGlebe(){
	this.name = 'Sede';
	this.size_ha = 22; // tamanho da gleba em hectare
	this.distance_from_agrodanieli = 1.5; // distância da lavoura até o silo
	this.distance_from_farm_storage = 0; // distância da lavoura até o silo
	this.delivery_time = 8; // tempo da entrega
	this.production_in_ha = 0; // produção por hectare
	this.production_current = 0; // quanto já foi colhido
	this.production_prevision = 0; // quanto se espera colher em toda área
}SedeGlebe.prototype = new Glebe();SedeGlebe.prototype.constructor = SedeGlebe;

/*
	Fontana
*/
function FontanaGlebe(){
	this.name = 'Fontana';
	this.size_ha = 13;
	this.distance_from_farm_storage = 0.3;
	this.distance_from_agrodanieli = 1.2;
	this.delivery_time = 8;
	
}FontanaGlebe.prototype = new Glebe();FontanaGlebe.prototype.constructor = FontanaGlebe;

/*
	Giba
*/
function GibaGlebe(){
	this.name = 'Giba';
	this.size_ha = 12;
	this.distance_from_farm_storage = 0.5;
	this.distance_from_agrodanieli = 1;
	this.delivery_time = 8;
	
}GibaGlebe.prototype = new Glebe();GibaGlebe.prototype.constructor = GibaGlebe;

/*
	Caixa D'água
Agrodanieli - Caixa D'água (estrada): ida 8:30, volta 6:30
Agro -> Caixa (estrada): 7:00
Caixa (baixada) -> Agro: 9:00
960s
*/
function CaixaDaguaGlebe(){
	this.name = 'Caixa D\'água';
	this.size_ha = 50.5;
	this.distance_from_farm_storage = 0;
	this.distance_from_agrodanieli = 0;
	this.delivery_time = 16;
	
}CaixaDaguaGlebe.prototype = new Glebe();CaixaDaguaGlebe.prototype.constructor = CaixaDaguaGlebe;

/*
	Fazendinha
Agrodanieli - Fazendinha: ida 8:00, volta 8:30
990s
*/
function FazendinhaGlebe(){
	this.name = 'Fazendinha';
	this.size_ha = 16;
	this.distance_from_farm_storage = 0;
	this.distance_from_agrodanieli = 0;
	this.delivery_time = 17;
	
}FazendinhaGlebe.prototype = new Glebe();FazendinhaGlebe.prototype.constructor = FazendinhaGlebe;

/*
	Parque
Agrodanieli - Parque (fundos): ida 10:45, volta 15:00
Sede - Parque (estrada): ida 12:30m, volta 9:30
1320s

parque fundos -> agro SD saindo: 44m
Sd -> parque: 1:05h
*/
function ParqueGlebe(){
	this.name = 'Parque';
	this.size_ha = 55;
	this.distance_from_farm_storage = 0;
	this.distance_from_agrodanieli = 0;
	this.delivery_time = 26;
	
}ParqueGlebe.prototype = new Glebe();ParqueGlebe.prototype.constructor = ParqueGlebe;

/*
	Tondelo
Agrodanieli - Tondelo: ida 40:00, volta ?
Sede - Tondelo: ida ?, volta 33:00
4380s
Tondelo Volks Sede: 14:10-14:47-15:25
Levar plataforma milho da sede até tondelo 80 minutos
*/
function TondeloGlebe(){
	this.name = 'Tondelo';
	this.size_ha = 70;
	this.distance_from_farm_storage = 0;
	this.distance_from_agrodanieli = 0;
	this.delivery_time = 75;
	
}TondeloGlebe.prototype = new Glebe();TondeloGlebe.prototype.constructor = TondeloGlebe;

/*
	Campo
Sede - Campo: ida 35:20, volta 27:00
3740
*/
function CampoGlebe(){
	this.name = 'Campo';
	this.size_ha = 80;
	this.distance_from_farm_storage = 0;
	this.distance_from_agrodanieli = 0;
	this.delivery_time = 63;
	
}CampoGlebe.prototype = new Glebe();CampoGlebe.prototype.constructor = CampoGlebe;

/*
	Coleginho
Sede - Coleginho: ida ?, volta 22:00
1680s
*/
function ColeginhoGlebe(){
	this.name = 'Coleginho';
	this.size_ha = 32.5;
	this.distance_from_farm_storage = 0;
	this.distance_from_agrodanieli = 0;
	this.delivery_time = 39;
	
}ColeginhoGlebe.prototype = new Glebe();ColeginhoGlebe.prototype.constructor = ColeginhoGlebe;

/*
	Açude
Agrodanieli - Açude: ida 24:00, volta 19:50
2630s

Bracatinga-acude 7 minutos
Bracatinga-cidade 27:30
Bracatinga-cidade saida 31:30
Bracatinga sede 35m

Sede-cidade 2:30
Sede cidade saída 6m
Sede açude 20:45
23
Sede bracatinga 26:30
*/
function AcudeGlebe(){
	this.name = 'Açude';
	this.size_ha = 65;
	this.distance_from_farm_storage = 0;
	this.distance_from_agrodanieli = 0;
	this.delivery_time = 44;
	
}AcudeGlebe.prototype = new Glebe();AcudeGlebe.prototype.constructor = AcudeGlebe;

/*
// Sede - São Domingos: 27:24/29:11, volta 22:34
// Carregando caminhão com concha mercedes 270sc: 19:20
// Descarregando: Agrodanieli AS: 10/12m, Sede: 5m
*/