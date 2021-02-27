/*
	Constant
*/
function Constant(){}

// se o console está ativo para operações mostradas na tela
Constant.SHOW_OPERATIONS_IN_CONSOLE = true;

// pode sair até com X sacos a menos q o caminhão carrega, se ainda caber mais que isso a seifa colhe um pouco e completa
Constant.CHARGE_TOLERANCE = 10;

// estado da colheita
Constant.HAVERSTER_STATE_STOPPED = 0;
Constant.HAVERSTER_STATE_PAUSED = 1;
Constant.HAVERSTER_STATE_RUNNING = 2;
Constant.HAVERSTER_STATE_SHUTTING_DOWN = 3;

// posição da máquina na simulação
Constant.LOCATION_GARAGE = 0;
Constant.LOCATION_HARVEST = 1;
Constant.LOCATION_ROAD = 2;

// carga da máquina
Constant.CHARGE_EMPTY = 0;
Constant.CHARGE_WITH_CHARGE = 1;
Constant.CHARGE_FULL = 2;