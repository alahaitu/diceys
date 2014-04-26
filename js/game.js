(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'diceys');

  // Game States
  game.state.add('afterbikelane', require('./states/afterbikelane'));
  game.state.add('bikelane', require('./states/bikelane'));
  game.state.add('boot', require('./states/boot'));
  game.state.add('frontyard', require('./states/frontyard'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('home', require('./states/home'));
  game.state.add('iceCream', require('./states/iceCream'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  game.state.add('thinking', require('./states/thinking'));
  game.state.add('trampoline', require('./states/trampoline'));
  game.state.add('veggieGameWin', require('./states/veggieGameWin'));
  game.state.add('veggiePatch', require('./states/veggiePatch'));
  game.state.add('walkingout', require('./states/walkingout'));
  

  game.state.start('boot');
};
},{"./states/afterbikelane":3,"./states/bikelane":4,"./states/boot":5,"./states/frontyard":6,"./states/gameover":7,"./states/home":8,"./states/iceCream":9,"./states/menu":10,"./states/play":11,"./states/preload":12,"./states/thinking":13,"./states/trampoline":14,"./states/veggieGameWin":15,"./states/veggiePatch":16,"./states/walkingout":17}],2:[function(require,module,exports){
'use strict';

var Stone = function(game, x, y, frame, speed) {
  var ySpeed = speed;
  Phaser.Sprite.call(this, game, x, y, 'bikelane_stone1', frame);

  // initialize your prefab here
  this.game.physics.arcade.enableBody(this);

};

Stone.prototype = Object.create(Phaser.Sprite.prototype);
Stone.prototype.constructor = Stone;
Stone.prototype.create = function() {}
Stone.prototype.update = function() {
  
  // Spawn stones into game world
  if (this.body.y > 769) {
    this.body.y = 0-this.height;
    this.body.x = this.game.rnd.integerInRange(190, 834-this.width);
    this.loadTexture('bikelane_stone' + this.game.rnd.integerInRange(1,3), 0);
  }
  else {
    this.body.y += 4;
  }
};

module.exports = Stone;
},{}],3:[function(require,module,exports){
'use strict';
  function Afterbikelane() {}
  Afterbikelane.prototype = {
    create: function() {
      this.add.button(0, 0, 'after_bike_lane', this.startIceCream, this);
    },
    startIceCream: function() {
      this.game.state.start('trampoline');
    }
  };
module.exports = Afterbikelane;

},{}],4:[function(require,module,exports){
'use strict';
var Stone = require('../prefabs/stone');
  function Bikelane() {}
  var speed = 4;
  var isColliding;
  Bikelane.prototype = {
    create: function() {

      isColliding = false;

      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      this.add.sprite(0, 0, 'bikelane_bg');

      // Scrolling stones      
      this.stone1 = new Stone(this.game, 642, 0, 1, this.speed);
      this.game.add.existing(this.stone1);
      
      // Scrolling trees
      this.tree1 = this.add.tileSprite(0, 0, 190, 768, 'bikelane_trees1');
      this.tree2 = this.add.tileSprite(834, 0, 190, 768, 'bikelane_trees2');

      // Player setup
      this.player = this.add.sprite(this.game.width/2, (this.game.height-113), 'bikelane_alien');
      this.player.anchor.setTo(0.5, 0.5);

      this.game.physics.enable([this.player, this.stone1], Phaser.Physics.ARCADE);
      this.player.body.collideWorldBounds = true;
      this.player.body.setSize(33, this.player.height, 0, 0);
      this.player.body.immovable = true;
      this.player.body.allowGravity = false;
      this.player.body.allowRotation = false;

      this.collisionsound = this.add.audio('collision_sound');
      this.cursors = this.game.input.keyboard.createCursorKeys();

      // Timer setup
      this.game.time.events.add(Phaser.Timer.SECOND * 15, this.afterBikelane, this);

      this.leftButton = this.add.button(25, 304, 'bikelane_left_button', this.moveLeft, this);
      this.rightButton = this.add.button(840, 304, 'bikelane_right_button', this.moveRight, this);

    },
    update: function() {
      
      //Player controls
      if (this.cursors.left.isDown)
      {
        this.moveLeft();
      }
      else if (this.cursors.right.isDown)
      {
        this.moveRight();
      }
      this.game.physics.arcade.collide(this.stone1, this.player, this.collisionHandler, null, this);

      if (!this.isColliding) {
        this.tree1.tilePosition.y += speed;
        this.tree2.tilePosition.y += speed;
      }

      this.isColliding = false;
    
    },
    moveLeft: function() {
      if (this.player.x > 190+(this.player.width/2)) {
        this.player.x = this.player.x - 8;
      }
    },
    moveRight: function() {
      if (this.player.x < 834-(this.player.width/2)) {
        this.player.x = this.player.x + 8;
      }
    },
    collisionHandler: function (obj1, obj2) {
      this.isColliding = true;
      //this.collisionsound.play();
    },
    afterBikelane: function(){
      this.game.state.start('afterbikelane');
    },
    render: function() {
      //this.game.debug.body(this.player);
      //this.game.debug.body(this.stone1);
    }
  };
module.exports = Bikelane;
},{"../prefabs/stone":2}],5:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
    preload: function() {
      this.load.image('preloader', 'assets/LoadingPage/LoadingPage.png');
    },
    create: function() {
      this.game.input.maxPointers = 1;
      this.stage.disableVisibilityChange = true;
      if (this.game.device.desktop)
      {
          this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
          this.scale.minWidth = 480;
          this.scale.minHeight = 260;
          this.scale.maxWidth = 1024;
          this.scale.maxHeight = 768;
          this.scale.pageAlignHorizontally = true;
          this.scale.pageAlignVertically = true;
          this.scale.setScreenSize(true);
      }
      else
      {
          this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
          this.scale.minWidth = 480;
          this.scale.minHeight = 260;
          this.scale.maxWidth = 1024;
          this.scale.maxHeight = 768;
          this.scale.pageAlignHorizontally = true;
          this.scale.pageAlignVertically = true;
          this.scale.forceOrientation(true, false);
          this.scale.hasResized.add(this.gameResized, this);
          this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
          this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
          this.scale.setScreenSize(true);
      }

      this.game.state.start('preload');
    },
    gameResized: function (width, height) {
        //  This could be handy if you need to do any extra processing if the game resizes.
        //  A resize could happen if for example swapping orientation on a device.
    },
    enterIncorrectOrientation: function () {
        BasicGame.orientated = false;
        document.getElementById('orientation').style.display = 'block';
    },
    leaveIncorrectOrientation: function () {
        BasicGame.orientated = true;
        document.getElementById('orientation').style.display = 'none';
    }
};

module.exports = Boot;

},{}],6:[function(require,module,exports){
'use strict';
  function Frontyard() {}
  Frontyard.prototype = {
    create: function () {
      this.add.sprite(0, 0, 'frontyard_bg');
      
      this.bicycle = this.add.sprite(54, 294, 'frontyard_bicycle');
      this.bicycle.inputEnabled = true;
      this.bicycle.events.onInputDown.add(this.helmetAnimation, this);
      
      this.add.sprite(0, 0, 'frontyard_tree');
      
      this.helmet = this.add.sprite(201, 150, 'frontyard_helmet_animation', 1);
      this.helmet.inputEnabled = true;
      this.helmet.events.onInputDown.add(this.wearHelmet, this);

      this.helmetAnim = this.helmet.animations.add('swing');

      this.patch = this.add.sprite(849, 353, 'frontyard_patch');
      this.patch.inputEnabled = true;
      this.patch.events.onInputDown.add(this.startVeggiePatch, this);
      
      this.alien = this.add.sprite(470, 91, 'frontyard_alien');

      this.branchsound = this.add.audio('branch1_sound');
      this.helmetsound = this.add.audio('helmet_on_sound');
      this.bicyclesound = this.add.audio('bicycle_bell_sound');
    },
    shutdown: function() {
      this.bicycle.destroy();
      this.alien.destroy();
    },
    startBikeLane: function(){
      this.bicyclesound.play();
      this.game.state.start('bikelane');
    },
    startVeggiePatch: function() {
      this.game.state.start('veggiePatch');
    },
    helmetAnimation: function(){
        this.helmetAnim.play(8, false);
        this.helmetAnim.stop;
        this.branchsound.play();
    },
    wearHelmet: function(){
      this.helmet.kill();
      this.helmetsound.play();
      this.alien.y = 159;
      this.alien.loadTexture('frontyard_alien_helmet', 0);
      //this.add.button(873, 614, 'frontyard_button', this.startBikeLane, this);
      this.bicycle.events.onInputDown.remove(this.helmetAnimation, this);
      this.bicycle.events.onInputDown.add(this.startBikeLane, this);
    }
  };
module.exports = Frontyard;

},{}],7:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You Win!', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],8:[function(require,module,exports){
'use strict';
  function Home() {}
  Home.prototype = {
    create: function() {
      this.add.sprite(0, 0, 'home_bg');
      this.add.sprite(45, 465, 'home_bag');
      this.add.button(220, 70, 'home_door', this.startWalkingOutHouse, this);
      this.add.sprite(764, 63, 'home_cupboard');
      this.add.sprite(368, 185, 'home_alien');
      this.doorsound = this.add.audio('home_door_open');
    },
    startWalkingOutHouse: function(){
      this.doorsound.play();
      this.game.state.start('walkingout');
    }
  };
module.exports = Home;

},{}],9:[function(require,module,exports){
'use strict';
  function IceCream() {}
  IceCream.prototype = {
    create: function() {
      this.add.button(0, 0, 'ice_cream_ph', this.startAfterBikelane, this);
    },
    startAfterBikelane: function() {
      this.game.state.start('afterbikelane');
    }
  };
module.exports = IceCream;

},{}],10:[function(require,module,exports){

'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    this.background = this.game.add.sprite(0, 0, 'menu_bg');
    this.add.sprite(79, 93, 'green');
    var yellow = this.add.button(732, 57, 'yellow' , this.startYellow, this);
    var button = this.add.button(457, 550, 'button', this.startClick, this);
    //game.add.audio('menumusic', 1, true).play('', 0, 1, true);
    this.add.sprite(116, 187, 'title');
    this.add.sprite(721, 470, 'purple');
    this.add.sprite(132, 487, 'blue');
    },
  update: function() {
    /*if(game.input.activePointer.justPressed()) {
      game.state.start('play');
    }*/
  },
  startClick: function() {
    this.game.state.start('veggiePatch');
  },
  startYellow: function() {
    this.game.state.start('thinking');
  }
};

module.exports = Menu;

},{}],11:[function(require,module,exports){

  'use strict';
  function Play() {}
  Play.prototype = {
    create: function() {
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      this.sprite = this.game.add.sprite(this.game.width/2, this.game.height/2, 'yeoman');
      this.sprite.inputEnabled = true;
      
      this.game.physics.arcade.enable(this.sprite);
      this.sprite.body.collideWorldBounds = true;
      this.sprite.body.bounce.setTo(1,1);
      this.sprite.body.velocity.x = this.game.rnd.integerInRange(-500,500);
      this.sprite.body.velocity.y = this.game.rnd.integerInRange(-500,500);

      this.sprite.events.onInputDown.add(this.clickListener, this);
    },
    update: function() {

    },
    clickListener: function() {
      this.game.state.start('gameover');
    }
  };
  
  module.exports = Play;
},{}],12:[function(require,module,exports){

'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
      this.game.stage.backgroundColor = '#ffd45d';
      this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
      this.asset.anchor.setTo(0.0, 0.0);

      this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
      this.load.setPreloadSprite(this.asset);
      this.load.image('yeoman', 'assets/yeoman-logo.png');

      // Preload assets
      // Main menu assets
      this.load.image('menu_bg', 'assets/TitlePage/TitlePage_BG.png');
      this.load.image('green', 'assets/TitlePage/TitlePage_AlienGreenRV1.png');
      this.load.image('yellow', 'assets/TitlePage/TitlePage_AlienYellowRV1.png');
      this.load.image('title', 'assets/TitlePage/TitlePage_DiceyTitle.png');
      this.load.image('button', 'assets/TitlePage/TitlePage_PlayStoryRV1.png');
      this.load.image('blue', 'assets/TitlePage/TitlePage_AlienBlueRV1.png');
      this.load.image('purple', 'assets/TitlePage/TitlePage_AlienPurpleRV1.png');
      
      // Cutscene assets
      this.load.image('thinking', 'assets/Animation_Stills/S3_Thinking.png');
      this.load.image('walking_out_house', 'assets/Animation_Stills/S5_WalkingOutHouse.png');
      this.load.image('after_bike_lane', 'assets/PlayG_IceCream/PlayG_IceCream_Visual.png');
      this.load.image('trampoline_bg', 'assets/Animation_Stills/S7_Trampoline.png');

      // Mini game placeholders
      this.load.image('veggie_patch_ph', 'assets/FrontYard/MiniGames/VeggiePatch.png');
      this.load.image('ice_cream_ph', 'assets/PlayG_IceCream/IceCream.png');

      // Getting Ready at Home assets
      this.load.image('home_bg', 'assets/GettingReadyAtHome/GettingReady_BG.png');
      this.load.image('home_alien', 'assets/GettingReadyAtHome/GettingReady_Alien.png');
      this.load.image('home_bag', 'assets/GettingReadyAtHome/GettingReady_Bag.png');
      this.load.image('home_door', 'assets/GettingReadyAtHome/GettingReady_Door.png');
      this.load.image('home_cupboard', 'assets/GettingReadyAtHome/GettingReady_Cupboard.png');
      this.load.audio('home_door_open', 'assets/sounds/door-open.wav')

      // Front yard assets
      this.load.image('frontyard_bg', 'assets/FrontYard/FrontYard_BG_RV1.png');
      this.load.image('frontyard_bicycle', 'assets/FrontYard/FrontYard_Bicycle.png');
      this.load.image('frontyard_patch', 'assets/FrontYard/FrontYard_VeggiePatch.png');
      this.load.image('frontyard_alien', 'assets/FrontYard/FrontYard_AlienNoHelmet.png');
      this.load.image('frontyard_alien_helmet', 'assets/FrontYard/FrontYard_AlienWithHelmet.png');
      this.load.image('frontyard_tree', 'assets/FrontYard/FrontYard_Tree.png');
      this.load.image('frontyard_button', 'assets/FrontYard/FrontYard_BicycleButton.png');
      this.load.spritesheet('frontyard_helmet_animation', 'assets/FrontYard/Helmet_SpriteMap.png', 150, 150, 9);
      this.load.audio('helmet_on_sound', 'assets/sounds/helmet_on.wav');
      this.load.audio('branch1_sound', 'assets/sounds/branch1.wav');
      this.load.audio('bicycle_bell_sound', 'assets/sounds/bicycle_bell.wav');

      // Veggie patch mini game assets
      this.load.image('veggiep_bg', 'assets/FrontYard/MiniGames/VeggiePatch/VeggieP_Background.png');
      this.load.image('veggiep_button', 'assets/FrontYard/MiniGames/VeggiePatch/VeggieP_BackButton.png');
      this.load.image('veggiep_carrot', 'assets/FrontYard/MiniGames/VeggiePatch/VeggieP_Carrot.png');
      this.load.image('veggiep_potato', 'assets/FrontYard/MiniGames/VeggiePatch/VeggieP_Potato.png');
      this.load.image('veggiep_tomato', 'assets/FrontYard/MiniGames/VeggiePatch/VeggieP_Tomato.png');
      this.load.image('veggiep_score_meter', 'assets/FrontYard/MiniGames/VeggiePatch/VeggieP_ScoreMeter.png');
      this.load.image('veggiep_score_pointer', 'assets/FrontYard/MiniGames/VeggiePatch/VeggieP_ScorePointer.png');
      this.load.image('veggiep_score_basket', 'assets/FrontYard/MiniGames/VeggiePatch/VeggieP_ScoreBasket.png');
      this.load.image('veggiep_slice1', 'assets/FrontYard/MiniGames/VeggiePatch/VeggieP_Slice1.png');
      this.load.image('veggiep_slice2', 'assets/FrontYard/MiniGames/VeggiePatch/VeggieP_Slice2.png');
      this.load.image('veggiep_slice3', 'assets/FrontYard/MiniGames/VeggiePatch/VeggieP_Slice3.png');
      this.load.image('veggiep_slice4', 'assets/FrontYard/MiniGames/VeggiePatch/VeggieP_Slice4.png');
      this.load.image('veggie_game_win', 'assets/FrontYard/MiniGames/VeggiePatch/VeggieP_Win.png');
      this.load.audio('applause_sound', 'assets/sounds/applause.wav');

      // Bike lane assets
      this.load.image('bikelane_bg', 'assets/BikeLane/BikeLane_BG.png');
      this.load.image('bikelane_alien', 'assets/BikeLane/BikeLane_Alien.png');
      this.load.image('bikelane_end', 'assets/BikeLane/BikeLane_Stone1.png');
      this.load.image('bikelane_stone1', 'assets/BikeLane/BikeLane_Stone1.png');
      this.load.image('bikelane_stone2', 'assets/BikeLane/BikeLane_Stone2.png');
      this.load.image('bikelane_stone3', 'assets/BikeLane/BikeLane_Stone3.png');    
      this.load.image('bikelane_trees1', 'assets/BikeLane/BikeLane_TreeSide_L.png');
      this.load.image('bikelane_trees2', 'assets/BikeLane/BikeLane_TreeSide_R.png');
      this.load.audio('collision_sound', 'assets/sounds/collision.wav');
      this.load.image('bikelane_left_button', 'assets/BikeLane/BikeLane_ButtonLeft.png');
      this.load.image('bikelane_right_button', 'assets/BikeLane/BikeLane_ButtonRight.png');

      console.log("Yo dawg. Preloader preloaded.");

    },
    create: function() {
      this.asset.cropEnabled = false;
    },
    update: function() {
      if(!!this.ready) {
        this.game.state.start('menu');
      }
    },
    onLoadComplete: function() {
      this.ready = true;
    }
};

module.exports = Preload;

},{}],13:[function(require,module,exports){
'use strict';
  function Thinking() {}
  Thinking.prototype = {
    create: function() {
      this.add.button(0, 0, 'thinking', this.startClick, this);
    },
    startClick: function() {
      this.game.state.start('home');
    }
  };
module.exports = Thinking;

},{}],14:[function(require,module,exports){
'use strict';
  function Trampoline() {}
  Trampoline.prototype = {
    create: function() {
      this.add.button(0, 0, 'trampoline_bg', this.startAfterBikelane, this);
    },
    startAfterBikelane: function() {
      this.game.state.start('afterbikelane');
    }
  };
module.exports = Trampoline;

},{}],15:[function(require,module,exports){
'use strict';
  function VeggieGameWin() {}
  VeggieGameWin.prototype = {
    create: function() {
      this.add.button(0, 0, 'veggie_game_win', this.startFrontYard, this);
      this.applauseSound = this.add.audio('applause_sound');
      this.game.time.events.add(Phaser.Timer.SECOND * 3, this.startFrontYard, this);
      this.applauseSound.play();
    },
    startFrontYard: function() {
      this.game.state.start('frontyard');
    }
  };
module.exports = VeggieGameWin;

},{}],16:[function(require,module,exports){
'use strict';
  function VeggiePatch() {}
  VeggiePatch.prototype = {
    create: function() {
      this.add.sprite(0, 0, 'veggiep_bg');
      this.add.sprite(0, 0, 'veggiep_slice1');
      this.carrot = this.add.sprite(150, 187, 'veggiep_carrot');
      this.add.sprite(0, 258, 'veggiep_slice2');
      this.potato = this.add.sprite(674, 368, 'veggiep_potato');
      this.add.sprite(0, 438, 'veggiep_slice3');
      this.tomato = this.add.sprite(105, 518, 'veggiep_tomato');
      this.add.sprite(0, 618, 'veggiep_slice4');
      this.backButton = this.add.button(40, 20, 'veggiep_button' , this.startFrontYard, this);
      this.add.sprite(205, 20, 'veggiep_score_basket');
      this.add.sprite(275, 30, 'veggiep_score_meter');
      this.scorePointer = this.add.sprite(270, 24, 'veggiep_score_pointer');
      /*this.add.sprite(65, 26, 'veggiep_score_carrot1');
      this.add.sprite(150, 40, 'veggiep_score_carrot2');
      this.add.sprite(315, 52, 'veggiep_score_potato1');
      this.add.sprite(412, 40, 'veggiep_score_potato2');
      this.add.sprite(587, 52,'veggiep_score_tomato1');
      this.add.sprite(674, 40, 'veggiep_score_tomato2');*/

      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      this.game.physics.enable([this.potato, this.tomato, this.carrot], Phaser.Physics.ARCADE);

      //this.carrotSpawner = this.game.time.events.loop(Phaser.Timer.SECOND * 1.25, this.spawnCarrot, this);
      //this.carrotSpawner.timer.start();

      //this.potato.body.velocity.y = -100; 
      //this.tomato.body.velocity.y = -100; 
      //this.carrot.body.velocity.y = -100;   
      this.bounceCarrot(this.carrot);
      this.bounceCarrot(this.tomato);
      this.bounceCarrot(this.potato);

      this.potato.inputEnabled = true;
      this.carrot.inputEnabled = true;
      this.tomato.inputEnabled = true;
      this.potato.events.onInputDown.add(this.clickPotato, this);
      this.carrot.events.onInputDown.add(this.clickCarrot, this);
      this.tomato.events.onInputDown.add(this.clickTomato, this);

      this.popSound = this.add.audio('helmet_on_sound');
      //this.popSound.volume = -0.5;

    },
    update: function() {
      if (this.scorePointer.x > 807.5) {
         this.game.state.start('veggieGameWin');
      }
    },
    resetPotato: function() {
      this.randX = this.randomX();
      this.potato.reset(this.randX, 367);
    },
    resetCarrot: function() {
      this.randX = this.randomX();
      this.carrot.reset(this.randX, 187);
    },
    resetTomato: function() {
      this.randX = this.randomX();
      this.tomato.reset(this.randX, 518);
    },
    randomX: function() {
      this.xArray = [150,414,679];
      this.xCoord = this.game.rnd.pick(this.xArray);
      return this.xCoord;
    },
    clickPotato: function() {
      this.popSound.play();
      this.scorePointer.x += 28;
      this.potato.kill();
      this.game.time.events.add(Phaser.Timer.SECOND * 2, this.resetPotato, this);
    },
    clickCarrot: function() {
      this.popSound.play();
      this.carrot.kill();
      this.scorePointer.x += 28;
      this.game.time.events.add(Phaser.Timer.SECOND * 2, this.resetCarrot, this);
    },
    clickTomato: function() {
      this.popSound.play();
      this.tomato.kill();
      this.scorePointer.x += 28;
      this.game.time.events.add(Phaser.Timer.SECOND * 2, this.resetTomato, this);
    },
    bounceCarrot: function(item) {
      var bounce = this.game.add.tween(item);
      bounce.to({ y: (item.y-150) }, 1000 + Math.random() * 3000, Phaser.Easing.Bounce.Out)
      .to({ y: item.y+150 }, 1000 + Math.random() * 3000, Phaser.Easing.Bounce.Out);
      //bounce.onComplete.add(this.spawnCarrot, this)
      bounce.loop();
      bounce.start();
    },
    startFrontYard: function() {
      console.log("foo");
      this.game.state.start('frontyard');
    }
  };
module.exports = VeggiePatch;

},{}],17:[function(require,module,exports){
'use strict';
  function Walkingout() {}
  Walkingout.prototype = {
    create: function() {
      this.add.button(0, 0, 'walking_out_house', this.startFrontYard, this);
      this.game.time.events.add(Phaser.Timer.SECOND * 3, this.startFrontYard, this);
    },
    startFrontYard: function() {
      this.game.state.start('frontyard');
    }
  };
module.exports = Walkingout;

},{}]},{},[1])