
var player;

Entity = function(type,id,x,y,width,height,img){
	var self = {
		type:type,
		id:id,
		x:x,
		y:y,
		width:width,
		height:height,
		img:img,
	};
	self.update = function(){
		self.updatePosition();
		self.draw();
	}
	self.draw = function(){
		ctx.save();
		var x = self.x - player.x;
		var y = self.y - player.y;
		
		x += WIDTH/2;
		y += HEIGHT/2;
		
		x -= self.width/2;
		y -= self.height/2;
		
		ctx.drawImage(self.img,
			0,0,self.img.width,self.img.height,
			x,y,self.width,self.height
		);
		
		ctx.restore();
	}
	self.getDistance = function(entity2){	// ## ANURAG ##return distance (number)
		var vx = self.x - entity2.x;
		var vy = self.y - entity2.y;
		return Math.sqrt(vx*vx+vy*vy);
	}

	self.testCollision = function(entity2){	// ## ANURAG ##return if colliding (true/false)
		var rect1 = {
			x:self.x-self.width/2,
			y:self.y-self.height/2,
			width:self.width,
			height:self.height,
		}
		var rect2 = {
			x:entity2.x-entity2.width/2,
			y:entity2.y-entity2.height/2,
			width:entity2.width,
			height:entity2.height,
		}
		return testCollisionRectRect(rect1,rect2);
		
	}
	self.updatePosition = function(){}
	
	return self;
}




Player = function(){
	var self = Actor('player','myId',50,40,50*1.5,70*1.5,Img.player,10,1);
	self.maxMoveSpd = 10;
	self.pressingMouseLeft = false;
	self.pressingMouseRight = false;
	
	var super_update = self.update;
    
  // ## ANURAG ##   self.performAttack=function(){

  // ## ANURAG ##   	if(self.attackCounter > 25){	// ## ANURAG ##every 1 sec
		// ## ANURAG ## 	self.attackCounter = 0;
			

		// ## ANURAG ## 	Bullet.generateBullet2(self);
		// ## ANURAG ## }
  // ## ANURAG ##   }

	self.update = function(){
		super_update();
		if(self.pressingRight || self.pressingLeft || self.pressingDown || self.pressingUp)
			self.spriteAnimCounter += 0.2;
		if(self.pressingMouseLeft){

			playSound(bSound);

			 self.performAttack();
		}
		if(self.pressingMouseRight){

			playSound(specialBSound);
			self.performSpecialAttack();
		}
	}	
	
	
	self.onDeath = function(){

		var timeSurvived = Date.now() - timeWhenGameStarted;	

  // ## ANURAG ##       var restart_div=document.getElementById("restart_div");
  // ## ANURAG ##       var restart_btn=document.getElementById("restart");

		// ## ANURAG ## // ## ANURAG ## show restart divvvvvvv
  // ## ANURAG ##       restart_div.slideDown();
  // ## ANURAG ##       restart_btn.focus();
        	
		console.log("You lost! You survived for " + timeSurvived + " ms.");		
		 // ## ANURAG ## startNewGame();
		 restartNewGame();

	}
	
	
	
	return self;
	
}



// ## ANURAG ## sound implementation


var bSound;
var specialBSound;

    bSound = new sound("sounds/shoot.mp3");
    specialBSound = new sound("sounds/explosion.mp3");


function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

function playSound(myMusic) {
    
    myMusic.play();
   
}

function stopSound(myMusic){
	myMusic.stop();
}








Actor = function(type,id,x,y,width,height,img,hp,atkSpd){
	var self = Entity(type,id,x,y,width,height,img);
	
	self.hp = hp;
	self.hpMax = hp;
	self.atkSpd = atkSpd;
	self.attackCounter = 0;
	self.aimAngle = 0;
	
	self.spriteAnimCounter = 0;
	
	self.pressingDown = false;
	self.pressingUp = false;
	self.pressingLeft = false;
	self.pressingRight = false;
	self.maxMoveSpd = 3;
	
	self.draw = function(){
		ctx.save();
		var x = self.x - player.x;
		var y = self.y - player.y;
		
		x += WIDTH/2;
		y += HEIGHT/2;
		
		x -= self.width/2;
		y -= self.height/2;
		
		var frameWidth = self.img.width/3;
		var frameHeight = self.img.height/4;
		
		var aimAngle = self.aimAngle;
		if(aimAngle < 0)
			aimAngle = 360 + aimAngle;

		
		var directionMod = 1;	// ## ANURAG ##draw right

		if(aimAngle >= 45 && aimAngle < 135)	// ## ANURAG ##down
			directionMod = 2;
		else if(aimAngle >= 135 && aimAngle < 225)	// ## ANURAG ##left
			directionMod = 3;
		else if(aimAngle >= 225 && aimAngle < 315)	// ## ANURAG ##up
			directionMod = 0;
		
		var walkingMod = Math.floor(self.spriteAnimCounter) % 3;// ## ANURAG ##1,2
		
		ctx.drawImage(self.img,
			walkingMod*frameWidth,directionMod*frameHeight,frameWidth,frameHeight,
			x,y,self.width,self.height
		);
		
		ctx.restore();
	}
	
	self.updatePosition = function(){
		var leftBumper = {x:self.x - 40,y:self.y};
		var rightBumper = {x:self.x + 40,y:self.y};
		var upBumper = {x:self.x,y:self.y - 16};
		var downBumper = {x:self.x,y:self.y + 64};
		
		if(Maps.current.isPositionWall(rightBumper)){
			self.x -= 5;
		} else {
			if(self.pressingRight)
				self.x += self.maxMoveSpd;			
		}
		
		if(Maps.current.isPositionWall(leftBumper)){
			self.x += 5;
		} else {
			if(self.pressingLeft)
				self.x -= self.maxMoveSpd;
		}
		if(Maps.current.isPositionWall(downBumper)){
			self.y -= 5;
		} else {
			if(self.pressingDown)
				self.y += self.maxMoveSpd;
		}
		if(Maps.current.isPositionWall(upBumper)){
			self.y += 5;
		} else {
			if(self.pressingUp)
				self.y -= self.maxMoveSpd;
		}
		
		// ## ANURAG ##ispositionvalid
		if(self.x < self.width/2)
			self.x = self.width/2;
		if(self.x > Maps.current.width-self.width/2)
			self.x = Maps.current.width - self.width/2;
		if(self.y < self.height/2)
			self.y = self.height/2;
		if(self.y > Maps.current.height - self.height/2)
			self.y = Maps.current.height - self.height/2;

	}
	
	var super_update = self.update;
	self.update = function(){
		super_update();
		self.attackCounter += self.atkSpd;
		if(self.hp <= 0)
			self.onDeath();
	}
	self.onDeath = function(){};
	
	self.performAttack = function(){
		if(self.attackCounter > 25){	// ## ANURAG ##every 1 sec
			self.attackCounter = 0;

			Bullet.generate(self);
		}
	}


	// ## ANURAG ## special attack for moouse right click 
	
	self.performSpecialAttack = function(){
		if(self.attackCounter > 50){	// ## ANURAG ##every 1 sec
			self.attackCounter = 0;
			/*
			for(var i = 0 ; i < 360; i++){
				Bullet.generate(self,i);
			}
			*/
			Bullet.generate(self,self.aimAngle - 5);
			Bullet.generate(self,self.aimAngle);
			Bullet.generate(self,self.aimAngle + 5);
		}
	}

	
	return self;
}

// ## ANURAG #######

Enemy = function(id,x,y,width,height,img,hp,atkSpd){
	var self = Actor('enemy',id,x,y,width,height,img,hp,atkSpd);
	Enemy.list[id] = self;
	
	self.toRemove = false;
	
	var super_update = self.update; 
	self.update = function(){
		super_update();
		self.spriteAnimCounter += 0.2;
		self.updateAim();
		self.updateKeyPress();
		self.performAttack();
	}
	self.updateAim = function(){
		var diffX = player.x - self.x;
		var diffY = player.y - self.y;
		
		self.aimAngle = Math.atan2(diffY,diffX) / Math.PI * 180
	}
	self.updateKeyPress = function(){
		var diffX = player.x - self.x;
		var diffY = player.y - self.y;

		self.pressingRight = diffX > 3;
		self.pressingLeft = diffX < -3;
		self.pressingDown = diffY > 3;
		self.pressingUp = diffY < -3;
	}
	
	
	var super_draw = self.draw; 
	self.draw = function(){
		super_draw();
		var x = self.x - player.x + WIDTH/2;
		var y = self.y - player.y + HEIGHT/2 - self.height/2 - 20;
		
		ctx.save();
		ctx.fillStyle = 'red';
		var width = 100*self.hp/self.hpMax;
		if(width < 0)
			width = 0;
		ctx.fillRect(x-50,y,width,10);
		
		ctx.strokeStyle = 'black';
		ctx.strokeRect(x-50,y,100,10);
		
		ctx.restore();
	
	}
	
	self.onDeath = function(){
		self.toRemove = true;
	}
	
}

Enemy.list = {};

Enemy.update = function(){
	if(frameCount % 100 === 0)	// ## ANURAG ##every 4 sec
		Enemy.randomlyGenerate();
	for(var key in Enemy.list){
		Enemy.list[key].update();
	}
	for(var key in Enemy.list){
		if(Enemy.list[key].toRemove){

			score+=100;
			delete Enemy.list[key];
		}
	}
}

Enemy.randomlyGenerate = function(){
	// ## ANURAG ##Math.random() returns a number between 0 and 1
	var x = Math.random()*Maps.current.width;
	var y = Math.random()*Maps.current.height;
	var height = 64*1.5;
	var width = 64*1.5;
	var id = Math.random();
	// ## ANURAG ## if(Math.random() < 0.5)
	// ## ANURAG ## 	Enemy(id,x,y,width,height,Img.bat,2,1);
	// ## ANURAG ## else
	// ## ANURAG ## 	Enemy(id,x,y,width,height,Img.bee,1,3);


	if(id < 0.33)
		Enemy(id,x,y,width,height,Img.bat,2,1);
	else if (id>0.33 && id <0.66)
		Enemy(id,x,y,width,height,Img.bee,1,3);
	else{
        Enemy(id,x,y,width,height,Img.mons,1,1);
		
	}
}

// ## ANURAG #######
Upgrade = function (id,x,y,width,height,category,img){
	var self = Entity('upgrade',id,x,y,width,height,img);
	
	self.category = category;
	Upgrade.list[id] = self;
}

Upgrade.list = {};

Upgrade.update = function(){
	if(frameCount % 75 === 0)	// ## ANURAG ##every 3 sec
		Upgrade.randomlyGenerate();
	for(var key in Upgrade.list){
		Upgrade.list[key].update();
		var isColliding = player.testCollision(Upgrade.list[key]);
		if(isColliding){
			if(Upgrade.list[key].category === 'score'){
                
                player.hp+=4;
				// ## ANURAG ## score += 1000;
			}
			// ## ANURAG ## purple one 
			if(Upgrade.list[key].category === 'atkSpd')
				player.atkSpd += 3;
			delete Upgrade.list[key];
		}
	}
}	

Upgrade.randomlyGenerate = function(){
	// ## ANURAG ##Math.random() returns a number between 0 and 1
	var x = Math.random()*Maps.current.width;
	var y = Math.random()*Maps.current.height;
	var height = 32;
	var width = 32;
	var id = Math.random();
	
	if(Math.random()<0.5){
		var category = 'score';
		var img = Img.upgrade1;
	} else {
		var category = 'atkSpd';
		var img = Img.upgrade2;
	}
	
	Upgrade(id,x,y,width,height,category,img);
}

// ## ANURAG #######
Bullet = function (id,x,y,spdX,spdY,width,height,combatType){
var self;

     if(combatType=='player'){
     	self = Entity('bullet',id,x,y,width,height,Img.bullet);
     }
     else{
     	self = Entity('bullet',id,x,y,width,height,Img.bullet2);
     }
	
	
	self.timer = 0;
	self.combatType = combatType;
	self.spdX = spdX;
	self.spdY = spdY
	self.toRemove = false;
	
	var super_update = self.update;
	self.update = function(){
		super_update();
		var toRemove = false;
		self.timer++;
		if(self.timer > 75)
			self.toRemove = true;
		
		// ## ANURAG ##if an enemy was shot to dead
		
		if(self.combatType === 'player'){	// ## ANURAG ##bullet was shot by player
			for(var key2 in Enemy.list){
				if(self.testCollision(Enemy.list[key2])){
					self.toRemove = true;
					Enemy.list[key2].hp -= 1;
				}				
			}
		} else if(self.combatType === 'enemy'){
			if(self.testCollision(player)){
				self.toRemove = true;
				player.hp -= 1;
			}
		}	
		if(Maps.current.isPositionWall(self)){
			self.toRemove = true;
		}
		
	}
	
	self.updatePosition = function(){
		self.x += self.spdX;
		self.y += self.spdY;
				
		if(self.x < 0 || self.x > Maps.current.width){
			self.spdX = -self.spdX;
		}
		if(self.y < 0 || self.y > Maps.current.height){
			self.spdY = -self.spdY;
		}
	}
	
	
	Bullet.list[id] = self;
}

Bullet.list = {};

Bullet.update = function(){
	for(var key in Bullet.list){
		var b = Bullet.list[key];
		b.update();
		
		if(b.toRemove){
			delete Bullet.list[key];
		}
	}
}

Bullet.generate = function(actor,aimOverwrite){
	// ## ANURAG ##Math.random() returns a number between 0 and 1
	var x = actor.x;
	var y = actor.y;
	var height = 24;
	var width = 24;
	var id = Math.random();
	
	var angle;
	if(aimOverwrite !== undefined)
		angle = aimOverwrite;
	else angle = actor.aimAngle;
	
	var spdX = Math.cos(angle/180*Math.PI)*5;
	var spdY = Math.sin(angle/180*Math.PI)*5;
	Bullet(id,x,y,spdX,spdY,width,height,actor.type);
}



