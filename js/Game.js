class Game {
  constructor() {
    this.resetButton = createButton("reset")
    this.reset=createElement("h2")
    this.leaderboard=createElement("h2")
    this.leader1=createElement("h2")
    this.leader2=createElement("h2")
  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }
  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("car1", car1_img);
    car1.scale = 0.07;

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2", car2_img);
    car2.scale = 0.07;

    cars = [car1, car2];

    fuel=new Group()
    coin=new Group()

    this.addSprites(35,powerCoinImage,0.09,coin)
    this.addSprites(6,fuelImage,0.03,fuel)
  }

 
  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");
  }

  play() {
    this.handleElements();
    this.handleResetButton();

    Player.getPlayersInfo();

    if (allPlayers !== undefined) {
      //experiment with height
      image(track, 0, -height * 5, width, height * 6);

      //index of the array
      var index = 0;
      for (var plr in allPlayers) {
        //add 1 to the index for every loop
        index = index + 1;

        //use data form the database to display the cars in x and y direction
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;
      
        if (index===player.index){
          fill("red")
          ellipse(x,y,60)
          camera.position.x=width/2
          camera.position.y=cars[index-1].position.y
          this.handleFuel(index)
          this.handlePowerCoins(index)
        }

      }

      // handling keyboard events
      if (keyIsDown(UP_ARROW)) {
        player.positionY += 10;
        player.update();
      }

      drawSprites();
    }

  }

  handleFuel(index) {
    cars[index-1].overlap(fuel,function(collector,collected){
      player.fuel=200
      collected.remove()
    })
  }
 
  handlePowerCoins(index) {
    cars[index-1].overlap(coin,function(collector,collected){
      player.score+=10
      player.update()
      collected.remove()
    })
  }

  addSprites(numberOfSprites,spriteImg,s,spriteGroup){
   
  for (var i=0;i<numberOfSprites;i++){
    var x,y
    x= random(width/2+150,width/2-150)
    y= random(-height*5,height-400)

    var sprite= createSprite(x,y)
    sprite.addImage(spriteImg)
    sprite.scale=s

    spriteGroup.add(sprite)
  } 

  }

  handleElements(){
    form.hide()
    this.reset.html("Reset Game")
    this.reset.position(width/2,40)
    this.resetButton.position(width/2,100)
    this.leaderboard.html("Leaderboard")
    this.leaderboard.position(width/3-60,40)
    this.leader1.position(width/3-50,80)
    this.leader2.position(width/3-50,130)
  }

  handleResetButton(){
    this.resetButton.mousePressed(()=>{
      database.ref('/').set({
        playerCount:0,
        gameState:0,
        players:{}
      })
      window.location.reload()
    })
  }

  showLeaderboard(){
    var leader1, leader2

    var players=object.values(allPLayers)
    if (players[0].rank===0&&players[1].rank===0||players[0]===1){
      leader1=
      players[0].rank+"&emsp"+players[0].name+"&emsp"+players[0].score;
      leader2=
      players[1].rank+"&emsp"+players[1].name+"&emsp"+players[1].score;
    }
    if (players[1].rank===1){
      leader2=
      players[0].rank+"&emsp"+players[0].name+"&emsp"+players[0].score;
      leader1=
      players[1].rank+"&emsp"+players[1].name+"&emsp"+players[1].score;
    }
    this.leader2.html(leader2)
    this.leader1.html(leader1)
  }
}