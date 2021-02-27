/*
	Clock
*/
function Clock(){}
Clock.start = 570; // 9:30
Clock.end = 1260; // 21h
Clock.current = Clock.start;
Clock.speed; // quantas interações (que representam 1 minuto na realidade) são feitas por segundo
Clock.get_current = function(){
	//console.log(Tempo.atual);
	var t = Clock.current+1;
	var h = parseInt(t/60);
	if(h < 10) h = '0'+h;
	var m = t%60;
	var r = h+':';
	if(m < 10) r += '0'+m;else r += m;
	return r;
}