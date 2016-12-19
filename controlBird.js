var deltaY = 40;
var g = 2; //重力加速度
var v = 0;
var birdWidth = 48
var birdY = 100;
var birdX = 40; // 小鸟的初始位置
var canvas = document.getElementById("canvas")
var scoreDiv = document.getElementById("score")
var ctx = canvas.getContext("2d")
ctx.textAlign = "center"
ctx.textBaseLine = "middle"
ctx.font = "bold 20px Microsoft YaHei"
var balkStartX = 120//开头障碍物的位置
var balks=[] //障碍物
var balkSpace = 100
var balkWidth = 52
var balkSpeed = 2
var score = 0
var bird = new Image()
var bgImg = new Image()
var landImg = new Image()
var pipeUp = new Image()
var pipeDown = new Image()

var pre = -1
window.onload = function(){
	//初始化
	init()
	
	document.onkeydown = function(event){
		event = window.event || event
		if(event.keyCode == 38){
			birdY -= deltaY
			v = 0  // 如果按下向上键，使小鸟的y坐标向上移动deltaY，同时，将速度置为0
		}
	}

	var timer = setInterval(function(){
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		update()
		draw()
		if(isOver()){
			ctx.fillStyle = "rgba(255, 255, 255, 0.6)"
			ctx.fillRect(0, 0, canvas.width, canvas.height)	
			ctx.beginPath()
			ctx.moveTo(canvas.width/2, 0)
			ctx.lineTo(canvas.width/2, canvas.height)
			ctx.moveTo(0, canvas.height/2)
			ctx.lineTo(canvas.width, canvas.height/2)
			ctx.closePath()
			ctx.fillStyle = "rgba(0, 0, 0, 1)"
			scoreString = "Your score: " + score
			ctx.fillText(scoreString, canvas.width/2, canvas.height/2)
			document.onkeydown = null
			clearInterval(timer)
		}
			
	}, 50)	
}


function draw(){
	//绘制背景
	ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height)
	
	//绘制小鸟
	ctx.fillStyle = "red"
	// ctx.drawIm(birdX, birdY, 20, 20)
	ctx.drawImage(bird, birdX, birdY)
	
	ctx.fillStyle = "green"
	for(var i = 0; i < balks.length; i++){
		ctx.drawImage(pipeDown, balks[i].balkX, balks[i].balkTopH-pipeDown.height)
		ctx.drawImage(pipeUp, balks[i].balkX, balks[i].balkTopH+balks[i].balkDis)
	}
	ctx.drawImage(landImg, 0, canvas.height-landImg.height)

}

function init(){
	//初始化图片

	bird.src = "./source/flappybird/bird1_0.png"
	bgImg.src = "./source/flappybird/bg_day.png"
	landImg.src = "./source/flappybird/land.png"
	pipeUp.src = "./source/flappybird/pipe_up.png"
	pipeDown.src = "./source/flappybird/pipe_down.png" //上面绘制的障碍物
	//初始化障碍物
	balks[0] = {
		balkX: balkStartX,
		balkTopH:Math.ceil(Math.random()*100 + 100),
		balkDis:Math.ceil(Math.random()*100 +100)
	}
	for (var i = 1; i < 3; i++) {
		// balkX += balkStartX + (balkSpace + balkWidth) * i
		balkX = balks[i-1].balkX + Math.ceil(Math.random()*50 + 150)
		var balk = {
			balkX: balkX,
			balkTopH:Math.ceil(Math.random()*100 + 100),
			balkDis:Math.ceil(Math.random()*100 +100)
		}
		balks[i] = balk
	}

}
function isOver(){
	for (var i = 0; i < balks.length; i++) {
		if(balks[i].balkX == birdX + birdWidth-10 && (((birdY + birdWidth-10) < balks[i].balkTopH+balks[i].balkDis && birdY + 9 > balks[i].balkTopH) ? false : true) )
			return true
		if((birdX + birdWidth-10 > balks[i].balkX && birdX + 10 < balks[i].balkX + balkWidth) &&((birdY + birdWidth - 10 < balks[i].balkTopH+balks[i].balkDis && birdY + 9 > balks[i].balkTopH) ? false : true)){
			// console.log(balks[i].balkX)
			// console.log((birdX + birdWidth-5) + " " + balks[i].balkX)
			// console.log((birdX -5) + " " +  (balks[i].balkX + balkWidth))
			// console.log((birdY + birdWidth - 10) + " " + (balks[i].balkTopH+balks[i].balkDis))
			// console.log((birdY + 9) + " " + (balks[i].balkTopH))
			return true
		}
			
	}
	if(birdY > canvas.height-landImg.height - bird.height) return true

	return false
}
//更新小鸟和障碍物的位置
function update(){
	updateBalk()
	updateBird()
	scoreDiv.innerHTML = "Score： " + score
}

function updateBird(){
	dy = v + g /2
	birdY += dy
	v = v + g
}
function updateBalk(){
	// console.log(balks[0].balkX + balkWidth + " " + balks[1].balkX > birdX + birdWidth)
	// if(balks[0].balkX + balkWidth < birdX-10 && balks[1].balkX > birdX + birdWidth){
	// 	score++
	// }
	for (var i = 0; i < balks.length; i++) {
		if((balks[i].balkX + balkWidth < birdX-10) && pre != i){
			score++
			pre = i
		}
	}
		
	for (var i = 0; i < balks.length; i++) {
		balks[i].balkX -= balkSpeed
	}
	
	if(balks[0].balkX < -1 * balkWidth){
		balks.shift()
		new_BalkX = balks[balks.length-1].balkX + Math.ceil(Math.random()*50 + 100) + balkWidth
		new_balk = {
			balkX: new_BalkX,
			balkTopH:Math.ceil(Math.random()*100+ 100),
			balkDis:Math.ceil(Math.random()*100 +100)
		}
		balks.push(new_balk)
		pre = -1
	}
}