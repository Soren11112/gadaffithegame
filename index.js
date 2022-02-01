var canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.position = 'absolute';
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style.width = '100%';
canvas.style.height = '100%';
document.body.appendChild(canvas);
var ctx = canvas.getContext('2d');
var size = 50;
var map = [];


var gadaffi_img = new Image();
gadaffi_img.src = 'gadaffi.png';

var mouth_img = new Image();
mouth_img.src = 'gadaffimouth.png';

var diesel_img = new Image();
diesel_img.src = 'diesel.png';

class Tile {
	constructor (color, x, y){
		this.color = color;
		this.x = x;
		this.y = y;
		this.gadaffi = false;
		this.diesel = false;
		this.mouth = false;
	}

	draw () {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, size, size);
		if (this.gadaffi) {
			if(this.mouth){
				ctx.drawImage(mouth_img, this.x, this.y, size, size);
			} else {
				ctx.drawImage(gadaffi_img, this.x, this.y, size, size);
			}
		} else if (this.diesel) {
			ctx.drawImage(diesel_img, this.x, this.y, size, size);
		}
		this.gadaffi = false;
		this.diesel = false;
		this.mouth = false;
	}
}

gadaffi_img.onload = () => {
	for (var i = 0; i < Math.floor(canvas.width / size) - 1; i++) {
		map.push([]);
		for (var j = 0; j < Math.floor(canvas.height / size) - 1; j++) {
			var x = (i+1) * size;
			var y = (j+1) * size;
			if ((i + j) % 2 == 0) {
				map[i].push(new Tile('#e0bf72', x, y));
			} else {
				map[i].push(new Tile('#a88e51', x, y));
			}
			map[i][j].draw();
		}
	}
	setInterval(gameStep, 100);
}

var last_button = "right";

var paused = false;

document.addEventListener('keydown', (e) => {
	switch(e.code){
		case 'KeyD':
		case 'ArrowRight':
			if(last_button !== 'left')
				last_button = 'right';
			break;
		case 'KeyS':
		case 'ArrowDown':
			if(last_button !== 'up')
				last_button = 'down';
			break;
		case 'KeyA':
		case 'ArrowLeft':
			if(last_button !== 'right')
				last_button = 'left';
			break;
		case 'KeyW':
		case 'ArrowUp':
			if(last_button !== 'down')
				last_button = 'up';
			break;
		case 'Escape':
			paused = !paused;
			break;
	}
});

var player = [[1, 1]];

var apple = [2, 2];
function moveApple(){
	apple[0] = Math.floor(Math.random() * map.length);
	apple[1] = Math.floor(Math.random() * map[0].length);
	for(let i = 0; i < player.length; i++){
		if(player[i][0] === apple[0] && player[i][1] === apple[1]){
			moveApple();
		}
	}
}

function gameStep () {
	if(!paused){
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		if(last_button === 'right'){
			player.unshift([player[0][0] + 1, player[0][1]]);
		} else if (last_button === "down") {
			player.unshift([player[0][0], player[0][1] + 1]);
		} else if (last_button === "left") {
			player.unshift([player[0][0] - 1, player[0][1]]);
		} else {
			player.unshift([player[0][0], player[0][1] - 1]);
		}
	
		if(player[0][0] === apple[0] && player[0][1] === apple[1]){
			moveApple();
			map[player[0][0]][player[0][1]].mouth = true;
		} else {
			player.pop();
		}
	
		for(let i = 0; i < player.length; i++){
			try {
				if(!map[player[i][0]][player[i][1]].gadaffi)
					map[player[i][0]][player[i][1]].gadaffi = true;
				else
					reset();
			} catch {
				reset();
			}
		}
	
		map[apple[0]][apple[1]].diesel = true;
	
		for(let x = 0; x < map.length; x++){
			for(let y = 0; y < map[0].length; y++){
				map[x][y].draw();
			}
		}
	}
}

function reset () {
	last_button = "right";
	player = [[1, 1]];
	moveApple();
}

