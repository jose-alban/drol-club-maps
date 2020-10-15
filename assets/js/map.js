
var mapScale = 1;
var dragScale = 1;
var mapBase = [];
var mapCities = [];
var mapKingdoms = [];
var client = {};
var gps = false;

var isDragging = false;

function setup() {
    if(document.getElementById('map-holder')) {
    	var size = document.getElementById('map-holder').offsetWidth;
        var canvas = createCanvas(size, size);
        canvas.parent('map-holder');
        client.pos = createVector(document.getElementById('x').value,document.getElementById('y').value);
        $(document).trigger('map-init');
        gps = true;
	} else {
        var canvas = createCanvas(window.innerWidth, window.innerHeight);
        client.pos = createVector(0,0);
	}
   	for(tiles=0; tiles < 36; tiles++) {
   		mapBase[tiles] = loadImage("assets/textures/base/map-texture_"+tiles+".png");
	}
	for(tiles=0; tiles < 36; tiles++) {
   		mapCities[tiles] = loadImage("assets/textures/cities/map-cities_"+tiles+".png");
	}
	for(tiles=0; tiles < 36; tiles++) {
   		mapKingdoms[tiles] = loadImage("assets/textures/kingdoms/map-kingdoms_"+tiles+".png");
	}

}

function draw() {
    background(30);
	translate(width/2,height/2);
	push();
	scale(mapScale);
	var y = -1;
    for(tiles=0; tiles < 36; tiles++) {
    	if(tiles%6==0)
    		y++;
        image(mapBase[tiles],
				(client.pos.x + (704 * (tiles%6))) ,
				(client.pos.y + (704 * y)),
				704,
				704
		);
    }
    y = -1;
    for(tiles=0; tiles < 36; tiles++) {
    	if(tiles%6==0)
    		y++;
        image(mapCities[tiles],
				(client.pos.x + (704 * (tiles%6))) ,
				(client.pos.y + (704 * y)),
				704,
				704
		);
    }
    /*
    y = -1;
    for(tiles=0; tiles < 36; tiles++) {
    	if(tiles%6==0)
    		y++;
        image(mapKingdoms[tiles],
				(client.pos.x + (704 * (tiles%6))) ,
				(client.pos.y + (704 * y)),
				704,
				704
		);
    }
    */

    pop();
    if(gps==true) {
    	strokeWeight(1);
        stroke(0,255,255);
        //noFill();
        //rect(-15,-15,30,30);
        fill(0,255,255);
        text(client.pos.x,-width/2+10,height/2-40);
        text(client.pos.y,-width/2+10,height/2-28);
        line(0,-height/2,0,height/2);
        line(-width/2,0,width/2,0);
	}
}

function windowResized() {
    if(!document.getElementById('map-holder')) {
        resizeCanvas(windowWidth, windowHeight);
    }
}

function mouseWheel(event) {
    if(event.delta < 0 && mapScale < 6) {
        mapScale *= 1.05;
        dragScale *= 0.95;
	}
    else if(mapScale > 0.1) {
        mapScale *= 0.95;
        dragScale *= 1.05;
	}
}

function mousePressed() {
    let m = createVector(Math.trunc(mouseX*dragScale), Math.trunc(mouseY*dragScale));
	clickOffset = p5.Vector.sub(client.pos, m);
    $(document).trigger('map-move');
	isDragging = true;
}

function mouseDragged() {
	if(isDragging) {
		let m = createVector(Math.trunc(mouseX*dragScale), Math.trunc(mouseY*dragScale));
		client.pos.set(m).add(clickOffset);
        $(document).trigger('map-move');
	}
}

function mouseReleased() {
	isDragging = false;
}

$(document).on('ready',function(){
	$('.zoom .minus').on('click',function(){
        if(mapScale > 0.1){
            mapScale *= 0.9;
        }
	});
	$('.zoom .plus').on('click',function(){
        if(mapScale < 6){
		  mapScale *= 1.1;
        }
	});
	$('.gps').on('click',function(){
		if(gps) gps = false;
		else gps = true;
	});
});