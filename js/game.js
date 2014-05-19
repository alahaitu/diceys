(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var music = null;

//global variables
window.onload = function () {
  var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'diceys');

  // Game States
  game.state.add('afterbikelane', require('./states/afterbikelane'));
  game.state.add('bagGame', require('./states/bagGame'));
  game.state.add('bikelane', require('./states/bikelane'));
  game.state.add('boot', require('./states/boot'));
  game.state.add('cyclingOut', require('./states/cyclingOut'));
  game.state.add('flyingKite', require('./states/flyingKite'));
  game.state.add('frontyard', require('./states/frontyard'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('helmetOff', require('./states/helmetOff'));
  game.state.add('home', require('./states/home'));
  game.state.add('iceCream', require('./states/iceCream'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('playground', require('./states/playground'));
  game.state.add('preload', require('./states/preload'));
  game.state.add('story', require('./states/story'));
  game.state.add('thinking', require('./states/thinking'));
  game.state.add('trampoline', require('./states/trampoline'));
  game.state.add('trampolineCutscene', require('./states/trampolineCutscene'));
  game.state.add('trampolineGameWin', require('./states/trampolineGameWin'));
  game.state.add('veggieGameWin', require('./states/veggieGameWin'));
  game.state.add('veggiePatch', require('./states/veggiePatch'));
  game.state.add('walkingout', require('./states/walkingout'));
  

  game.state.start('boot');
};
},{"./states/afterbikelane":3,"./states/bagGame":4,"./states/bikelane":5,"./states/boot":6,"./states/cyclingOut":7,"./states/flyingKite":8,"./states/frontyard":9,"./states/gameover":10,"./states/helmetOff":11,"./states/home":12,"./states/iceCream":13,"./states/menu":14,"./states/play":15,"./states/playground":16,"./states/preload":17,"./states/story":18,"./states/thinking":19,"./states/trampoline":20,"./states/trampolineCutscene":21,"./states/trampolineGameWin":22,"./states/veggieGameWin":23,"./states/veggiePatch":24,"./states/walkingout":25}],2:[function(require,module,exports){
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
      this.add.sprite(0, 0, 'after_bikelane_bg');
      this.add.button(0, 104, 'after_bikelane_playground', this.startTrampoline);
      this.add.button(614, 15, 'after_bikelane_icecream', this.startIceCream);
    },
    startIceCream: function() {
      this.game.state.start('iceCream');
    },
    startTrampoline: function() {
      this.game.state.start('helmetOff');
    }
  };
module.exports = Afterbikelane;

},{}],4:[function(require,module,exports){
'use strict';
  function BagGame() {}
  BagGame.prototype = {
    create: function() {
      this.add.sprite(0, 0, 'bag_game_ph');
      this.add.button(899, 23, 'exit_btn', this.exitScene, this); 
    },
    exitScene: function() {
      this.game.state.start('home');
    }
  };
module.exports = BagGame;

},{}],5:[function(require,module,exports){
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
      this.game.time.events.add(Phaser.Timer.SECOND * 30, this.afterBikelane, this);

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
        this.game.add.tween(this.player).to( { x: this.player.x - 25 }, 240, Phaser.Easing.Linear.None, true);
      }
    },
    moveRight: function() {
      if (this.player.x < 834-(this.player.width/2)) {
        this.game.add.tween(this.player).to( { x: this.player.x + 25 }, 240, Phaser.Easing.Linear.None, true);
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
},{"../prefabs/stone":2}],6:[function(require,module,exports){

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

},{}],7:[function(require,module,exports){
'use strict';
  function CyclingOut() {}
  CyclingOut.prototype = {
    create: function() {
      this.add.sprite(0, 0, 'cycling_out_bg');
      this.cyclingAlien = this.add.sprite(410, 468, 'cycling_out_alien');
      this.tween = this.game.add.tween(this.cyclingAlien).to( { y: 80 }, 2400, Phaser.Easing.Linear.None, true);

    },
    update: function() {
      if (this.cyclingAlien.y < 81){
        this.game.state.start('bikelane');
      }
    }
  };
module.exports = CyclingOut;

},{}],8:[function(require,module,exports){
'use strict';
  function FlyingKite() {}
  FlyingKite.prototype = {
    create: function() {
      this.add.sprite(0, 0, 'flying_kite_bg');
      this.add.button(850, 600, 'fwd_button', this.exitScene, this);  
    },
    exitScene: function() {
      this.game.state.start('menu');
    }
  };
module.exports = FlyingKite;

},{}],9:[function(require,module,exports){
'use strict';
  function Frontyard() {}
  Frontyard.prototype = {
    create: function () {
      this.add.sprite(0, 0, 'frontyard_bg');

      this.bicycle = this.add.sprite(54, 294, 'frontyard_bicycle');
      this.bicycle.inputEnabled = true;
      this.bicycle.events.onInputDown.add(this.helmetAnimation, this);
      
      this.add.sprite(0, 0, 'frontyard_tree');
      this.add.sprite(439, 39, 'frontyard_nest');
      
      this.helmet = this.add.sprite(201, 150, 'frontyard_helmet_animation', 1);
      this.helmet.inputEnabled = true;
      this.helmet.events.onInputDown.add(this.wearHelmet, this);

      this.helmetAnim = this.helmet.animations.add('swing');

      this.patch = this.add.sprite(844, 380, 'patch_bg');
      this.patch.inputEnabled = true;
      this.patch.events.onInputDown.add(this.startVeggiePatch, this);

      this.carrot = this.add.sprite(844, 380, 'jumping_carrot', 1);
      this.carrotAnim = this.carrot.animations.add('jump');
      this.carrotAnimation();
      
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
      this.game.state.start('cyclingOut');
    },
    startVeggiePatch: function() {
      this.game.state.start('veggiePatch');
    },
    helmetAnimation: function(){
        this.helmetAnim.play(8, false);
        this.helmetAnim.stop;
        this.branchsound.play();
    },
    carrotAnimation: function(){
      this.carrotAnim.play(13, true);
    },
    wearHelmet: function(){
      this.helmet.kill();
      this.helmetsound.play();
      this.alien.y = 159;
      this.alien.loadTexture('frontyard_alien_helmet', 0);
      this.bicycle.loadTexture('frontyard_bicycle_active');
      //this.add.button(873, 614, 'frontyard_button', this.startBikeLane, this);
      this.bicycle.events.onInputDown.remove(this.helmetAnimation, this);
      this.bicycle.events.onInputDown.add(this.startBikeLane, this);
    }
  };
module.exports = Frontyard;

},{}],10:[function(require,module,exports){

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

},{}],11:[function(require,module,exports){
'use strict';
  function HelmetOff() {}
  HelmetOff.prototype = {
    create: function() {
      this.add.sprite(0, 0, 'helmet_off_bg');
      this.helmet_off_alien = this.add.sprite(212, 48, 'helmet_off_anim', 1);
      this.helmetOffSound = this.add.audio('helmet_on_sound');

      this.helmetOffAnim = this.helmet_off_alien.animations.add('off');
      this.game.time.events.add(Phaser.Timer.SECOND * 1, this.helmetAnimation, this);
    },
    helmetAnimation: function(){
      this.helmetOffAnim.play(16, false);
      this.helmetOffSound.play();
      this.game.time.events.add(Phaser.Timer.SECOND * 2, this.startNext, this);
    },
    startNext: function() {
      this.game.state.start('playground');
    }
  };
module.exports = HelmetOff;

},{}],12:[function(require,module,exports){
'use strict';
  function Home() {}
  Home.prototype = {
    create: function() {
      this.add.sprite(0, 0, 'home_bg');
      this.add.button(45, 465, 'home_bag', this.startBagGame, this);
      this.add.button(220, 70, 'home_door', this.startWalkingOutHouse, this);
      this.add.sprite(764, 63, 'home_cupboard');
      this.add.sprite(368, 185, 'home_alien');
      this.doorsound = this.add.audio('home_door_open');
    },
    startWalkingOutHouse: function(){
      this.doorsound.play();
      this.game.state.start('walkingout');
    },
    startBagGame: function() {
      this.game.state.start('bagGame');
    }
  };
module.exports = Home;

},{}],13:[function(require,module,exports){
'use strict';
  function IceCream() {}
  IceCream.prototype = {
    create: function() {
      this.add.sprite(0, 0, 'ice_cream_ph');
      this.add.button(899, 23, 'exit_btn', this.exitScene, this); 
    },
    exitScene: function() {
      this.game.state.start('afterbikelane');
    }
  };
module.exports = IceCream;

},{}],14:[function(require,module,exports){

'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    this.background = this.game.add.sprite(0, 0, 'menu_bg');
    this.add.sprite(79, 93, 'green');
    this.add.sprite(116, 187, 'title');
    this.add.sprite(721, 470, 'purple');
    this.add.sprite(132, 487, 'blue');
    var yellow = this.add.button(732, 57, 'yellow' , this.startYellow, this);
    var button = this.add.button(457, 550, 'button', this.startClick, this);

    },
  update: function() {
  },
  startClick: function() {
    this.game.state.start('helmetOff');
  },
  startYellow: function() {
    this.game.state.start('thinking');
  }
};

module.exports = Menu;

},{}],15:[function(require,module,exports){

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
},{}],16:[function(require,module,exports){
'use strict';
  function Playground() {}
  Playground.prototype = {
    create: function() {
      this.add.sprite(0, 0, 'playground_bg');
      this.add.sprite(0, 572, 'playground_alien');
      this.add.button(509, 130, 'playground_trampoline', this.startTrampolineGame);
      this.add.button(195, 40, 'playground_kite', this.startKite);
      this.add.button(0, 205, 'playground_elephant', this.startElephant);
    },
    startKite: function() {
      this.game.state.start('flyingKite');
    },
    startElephant: function() {
      console.log("start elephant");
    },
    startTrampolineGame: function() {
      this.game.state.start('trampolineCutscene');
    }
  };
module.exports = Playground;

},{}],17:[function(require,module,exports){

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
      this.load.image('back_button', 'assets/FrontYard/MiniGames/VeggiePatch/VeggieP_BackButton.png');

      // Storyline assets
      this.load.image('storyscene1', 'assets/DiceyLanding_Story/MTDiceys_1.png');
      this.load.image('storyscene2', 'assets/DiceyLanding_Story/MTDiceys_2.png');
      this.load.image('storyscene3', 'assets/DiceyLanding_Story/MTDiceys_3.png');
      this.load.image('storyscene4', 'assets/DiceyLanding_Story/MTDiceys_4.png');
      this.load.image('storyscene5', 'assets/DiceyLanding_Story/MTDiceys_5.png');
      this.load.image('storyscene6', 'assets/DiceyLanding_Story/MTDiceys_6.png');
      this.load.image('storyscene7', 'assets/DiceyLanding_Story/MTDiceys_7.png');
      this.load.image('storyscene8', 'assets/DiceyLanding_Story/MTDiceys_8.png');
      this.load.image('storyscene9', 'assets/DiceyLanding_Story/MTDiceys_9.png');
      this.load.image('storyscene10', 'assets/DiceyLanding_Story/MTDiceys_10.png');
      this.load.image('storyscene11', 'assets/DiceyLanding_Story/MTDiceys_11.png');
      this.load.image('storyscene12', 'assets/DiceyLanding_Story/MTDiceys_12.png');

      // Common assets
      this.load.image('score_meter', 'assets/FrontYard/MiniGames/VeggiePatch/VeggieP_ScoreMeter.png');
      this.load.image('score_pointer', 'assets/FrontYard/MiniGames/VeggiePatch/VeggieP_ScorePointer.png');
      this.load.image('score_basket', 'assets/FrontYard/MiniGames/VeggiePatch/VeggieP_ScoreBasket.png');
      this.load.image('exit_btn', 'assets/Playground/Trampoline/TrampolineG_xButton.png');
      this.load.audio('bg_music', 'assets/sounds/Tukes_ background1.mp3');
      this.load.audio('minigame_music', 'assets/sounds/Tukes_uptempo_minigame.mp3');
      
      // Cutscene assets
      this.load.image('thinking', 'assets/CutScene_Thinking/Thinking_BG.png');
      this.load.audio('thinking_sound', 'assets/sounds/Hmmm1.mp3');
      this.load.spritesheet('fwd_button', 'assets/CutScene_Thinking/Thinking_ButtonSprite.png', 150, 150, 1);
      this.load.image('walking_out_house', 'assets/Animation_Stills/S5_WalkingOutHouse.png');
      this.load.image('helmet_off_bg', 'assets/CutScene_HelmetOff/HelmetOff_BG.png');
      this.load.spritesheet('helmet_off_anim', 'assets/CutScene_HelmetOff/HelmetOff_SpriteMap1.png', 522, 722, 16);

      // Mini game placeholders
      this.load.image('veggie_patch_ph', 'assets/FrontYard/MiniGames/VeggiePatch.png');
      this.load.image('ice_cream_ph', 'assets/PlayG_IceCream/IceCream.png');
      this.load.image('bag_game_ph', 'assets/GettingReadyAtHome/BagGame.png');

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
      this.load.image('frontyard_bicycle_active', 'assets/FrontYard/FrontYard_Bicycle_White.png');
      this.load.image('frontyard_patch', 'assets/FrontYard/FrontYard_VeggiePatch.png');
      this.load.image('frontyard_alien', 'assets/FrontYard/FrontYard_AlienNoHelmet.png');
      this.load.image('frontyard_alien_helmet', 'assets/FrontYard/FrontYard_AlienWithHelmet.png');
      this.load.image('frontyard_tree', 'assets/FrontYard/FrontYard_Tree.png');
      this.load.image('frontyard_button', 'assets/FrontYard/FrontYard_BicycleButton.png');
      this.load.image('patch_bg', 'assets/FrontYard/CarrotSprite_BG.png');
      this.load.spritesheet('frontyard_helmet_animation', 'assets/FrontYard/Helmet_SpriteMap.png', 150, 150, 9);
      this.load.audio('helmet_on_sound', 'assets/sounds/helmet_on.wav');
      this.load.audio('branch1_sound', 'assets/sounds/branch1.wav');
      this.load.audio('bicycle_bell_sound', 'assets/sounds/bicycle_bell.wav');
      this.load.spritesheet('jumping_carrot', 'assets/FrontYard/CarrotSprite_Animate.png', 180, 300, 18);
      this.load.image('frontyard_nest', 'assets/FrontYard/FrontYard_BirdNest.png');

      // Veggie patch mini game assets
      this.load.image('veggiep_bg', 'assets/FrontYard/MiniGames/VeggiePatch/VeggieP_Background.png');
      this.load.image('veggiep_carrot', 'assets/FrontYard/MiniGames/VeggiePatch/VeggieP_Carrot.png');
      this.load.image('veggiep_potato', 'assets/FrontYard/MiniGames/VeggiePatch/VeggieP_Potato.png');
      this.load.image('veggiep_tomato', 'assets/FrontYard/MiniGames/VeggiePatch/VeggieP_Tomato.png');
      this.load.image('veggiep_slice1', 'assets/FrontYard/MiniGames/VeggiePatch/VeggieP_Slice1.png');
      this.load.image('veggiep_slice2', 'assets/FrontYard/MiniGames/VeggiePatch/VeggieP_Slice2.png');
      this.load.image('veggiep_slice3', 'assets/FrontYard/MiniGames/VeggiePatch/VeggieP_Slice3.png');
      this.load.image('veggiep_slice4', 'assets/FrontYard/MiniGames/VeggiePatch/VeggieP_Slice4.png');
      this.load.image('veggie_game_win', 'assets/FrontYard/MiniGames/VeggiePatch/VeggieP_Win.png');
      this.load.audio('applause_sound', 'assets/sounds/applause.wav');

      // Cycling out
      this.load.image('cycling_out_bg', 'assets/CutScene_CyclingOut/CyclingOut_BG.png');
      this.load.image('cycling_out_alien', 'assets/CutScene_CyclingOut/CyclingOut_Alien.png');

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

      // After bike lane
      this.load.image('after_bikelane_playground', 'assets/PlayG_IceCream/Playground.png');
      this.load.image('after_bikelane_icecream', 'assets/PlayG_IceCream/PlayG_IceCreamStall.png');
      this.load.image('after_bikelane_bg', 'assets/PlayG_IceCream/PlayG_IceCreamBG.png');

      // Trampoline cutscene
      this.load.image('trampoline_bg', 'assets/CutScene_Trampoline/Trampoline_BG.png');
      this.load.image('trampoline_front', 'assets/CutScene_Trampoline/Trampoline_Half_Front.png');
      this.load.image('trampoline_back', 'assets/CutScene_Trampoline/Trampoline_Half_Back.png');
      this.load.spritesheet('trampoline_jumping', 'assets/CutScene_Trampoline/Trampoline_JumpSprite.png', 300, 560, 15);
      this.load.audio('youre_next_fi', 'assets/sounds/youre_next_fi.mp3');

      // Playground
      this.load.image('playground_bg', 'assets/Playground/PlayG/PlayG_BG.png');
      this.load.image('playground_elephant', 'assets/Playground/PlayG/PlayG_Elephant.png');
      this.load.image('playground_kite', 'assets/Playground/PlayG/PlayG_Kite.png');
      this.load.image('playground_trampoline', 'assets/Playground/PlayG/PlayG_Trampoline.png');
      this.load.image('playground_alien', 'assets/Playground/PlayG/PlayG_AlienBicycle.png')

      // Trampoline game
      this.load.image('trampoline_game_bg', 'assets/Playground/Trampoline/TrampolineG_BG.png');
      this.load.image('trampoline_game_alien', 'assets/Playground/Trampoline/TrampolineG_Alien.png');
      this.load.image('trampoline_game_bee', 'assets/Playground/Trampoline/TrampolineG_Bee.png');
      this.load.image('trampoline_game_cherry', 'assets/Playground/Trampoline/TrampolineG_Cherries.png');
      this.load.image('trampoline_game_grape', 'assets/Playground/Trampoline/TrampolineG_Grapes.png');
      this.load.image('trampoline_game_strawberry', 'assets/Playground/Trampoline/TrampolineG_Strawberry.png');
      this.load.image('trampoline_game_jump_button', 'assets/Playground/Trampoline/TrampolineG_JumpButton.png');  
      this.load.audio('bee_sound', 'assets/sounds/Tukes_bee_sfx.mp3');
      this.load.image('trampoline_game_win', 'assets/Playground/Trampoline/TrampolineG_Win.png');
      this.load.image('trampoline_rbutton', 'assets/Playground/Trampoline/TrampolineG_RightButton.png');
      this.load.image('trampoline_lbutton', 'assets/Playground/Trampoline/TrampolineG_LeftButton.png');

      // Flying kite cutscene
      this.load.image('flying_kite_bg', 'assets/End_FlyingKite/FlyingKite_Visual.png');

      this.music = this.add.audio('bg_music');
      this.music.play('',0,1,true);
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

},{}],18:[function(require,module,exports){
'use strict';
  function Story() {}
  Story.prototype = {

    create: function() {
      this.currentScene = this.add.sprite(0, 0, 'storyscene1');
      this.game.time.events.add(Phaser.Timer.SECOND * 3, this.nextScene2, this);
      this.game.time.events.add(Phaser.Timer.SECOND * 6, this.nextScene3, this);
      this.game.time.events.add(Phaser.Timer.SECOND * 9, this.nextScene4, this);
      this.game.time.events.add(Phaser.Timer.SECOND * 12, this.nextScene5, this);
      this.game.time.events.add(Phaser.Timer.SECOND * 15, this.nextScene6, this);
      this.game.time.events.add(Phaser.Timer.SECOND * 18, this.nextScene7, this);
      this.game.time.events.add(Phaser.Timer.SECOND * 21, this.nextScene8, this);
      this.game.time.events.add(Phaser.Timer.SECOND * 24, this.nextScene9, this);
      this.game.time.events.add(Phaser.Timer.SECOND * 27, this.nextScene10, this);
      this.game.time.events.add(Phaser.Timer.SECOND * 30, this.nextScene11, this);
      this.game.time.events.add(Phaser.Timer.SECOND * 33, this.nextScene12, this);
      this.game.time.events.add(Phaser.Timer.SECOND * 36, this.exitScene, this);

      this.add.button(899, 23, 'exit_btn', this.exitScene, this);
    },
    nextScene2: function() {
      this.currentScene.loadTexture(('storyscene2'), 0);
    },
    nextScene3: function() {
      this.currentScene.loadTexture(('storyscene3'), 0);
    },
    nextScene4: function() {
      this.currentScene.loadTexture(('storyscene4'), 0);
    },
    nextScene5: function() {
      this.currentScene.loadTexture(('storyscene5'), 0);
    },
    nextScene6: function() {
      this.currentScene.loadTexture(('storyscene6'), 0);
    },
    nextScene7: function() {
      this.currentScene.loadTexture(('storyscene7'), 0);
    },
    nextScene8: function() {
      this.currentScene.loadTexture(('storyscene8'), 0);
    },
    nextScene9: function() {
      this.currentScene.loadTexture(('storyscene9'), 0);
    },
    nextScene10: function() {
      this.currentScene.loadTexture(('storyscene10'), 0);
    },
    nextScene11: function() {
      this.currentScene.loadTexture(('storyscene11'), 0);
    },
    nextScene12: function() {
      this.currentScene.loadTexture(('storyscene12'), 0);
    },
    exitScene: function() {
      this.game.state.start('menu');
    }   
  };
module.exports = Story;

},{}],19:[function(require,module,exports){
'use strict';
  function Thinking() {}
  Thinking.prototype = {
    create: function() {
      this.add.sprite(0, 0, 'thinking');
      this.add.button(850, 600, 'fwd_button', this.startClick, this);
      this.add.audio('thinking_sound').play();
    },
    startClick: function() {
      this.game.state.start('home');
    }
  };
module.exports = Thinking;

},{}],20:[function(require,module,exports){
'use strict';
  function Trampoline() {}
  Trampoline.prototype = {
    create: function() {
      this.add.sprite(0, 0, 'trampoline_game_bg');
      this.cherry = this.add.sprite(400, 140, 'trampoline_game_cherry');
      this.strawberry = this.add.sprite(600, 140, 'trampoline_game_strawberry');
      this.grape = this.add.sprite(800, 140, 'trampoline_game_grape');
      this.player = this.add.sprite(426, 502, 'trampoline_game_alien');
      this.bee = this.add.sprite(1024, 80, 'trampoline_game_bee');
      this.add.sprite(119, 38, 'score_meter');
      this.scorePointer = this.add.sprite(114, 21, 'score_pointer');
      this.add.sprite(40, 35, 'score_basket');
      this.add.button(850, 590, 'trampoline_game_jump_button', this.playerJump, this);
      this.add.button(25, 590, 'trampoline_lbutton', this.playerLeft, this);
      this.add.button(220, 590, 'trampoline_rbutton', this.playerRight, this);
      this.add.button(899, 23, 'exit_btn', this.exitScene, this);    

      this.beeSound = this.add.audio('bee_sound');
      this.popSound = this.add.audio('helmet_on_sound');

      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      this.game.physics.enable([this.player, this.bee, this.cherry, this.strawberry, this.grape]);
      this.player.body.velocity.setTo(200, 200);
      this.player.body.collideWorldBounds = true;
      this.player.body.bounce.set(0.8);
      this.player.body.gravity.set(0, 180);

      this.player.body.immovable = true;
      this.bee.body.immovable = true;

    },
    update: function() {
      if (this.bee.x > 0-this.bee.width) {
        this.bee.x -= 3;
      }
      else {
        this.game.time.events.add(Phaser.Timer.SECOND * this.game.rnd.integerInRange(0.5, 1.5), this.resetBee, this);
      }

      this.game.physics.arcade.collide(this.player, this.bee, this.beeCollision, null, this);
      this.game.physics.arcade.collide(this.player, this.cherry, this.pickCherry, null, this);
      this.game.physics.arcade.collide(this.player, this.strawberry, this.pickStrawberry, null, this);
      this.game.physics.arcade.collide(this.player, this.grape, this.pickGrape, null, this);

      if (this.scorePointer.x > 672) {
         this.game.state.start('trampolineGameWin');
      }

    },
    pickCherry: function() {
      this.popSound.play();
      this.scorePointer.x += 28;
      this.cherry.kill();
      this.game.time.events.add(Phaser.Timer.SECOND * 3, this.resetCherry, this);
    },
    pickStrawberry: function() {
      this.popSound.play();
      this.scorePointer.x += 28;
      this.strawberry.kill();
      this.game.time.events.add(Phaser.Timer.SECOND * 3, this.resetStrawberry, this);
    },
    pickGrape: function() {
      this.popSound.play();
      this.scorePointer.x += 28;
      this.grape.kill();
      this.game.time.events.add(Phaser.Timer.SECOND * 3, this.resetGrape, this);
    },
    resetCherry: function() {
      this.cherry.reset(this.game.rnd.integerInRange(0, 1024-this.cherry.body.width), this.game.rnd.integerInRange(140, 400));
    },
    resetStrawberry: function() {
      this.strawberry.reset(this.game.rnd.integerInRange(0, 1024-this.strawberry.body.width), 140);
    },
    resetGrape: function() {
      this.grape.reset(this.game.rnd.integerInRange(0, 1024-this.grape.body.width), 140);
    },
    beeCollision: function() {
      console.log("sting!");
      //this.beeSound.play();
    },
    resetBee: function() {
      this.bee.reset(1024, this.game.rnd.integerInRange(100, 400));
      //this.beeSound.play();
    },
    playerJump: function() {
      this.player.body.velocity.y = 600;
    },
    playerLeft: function() {
      if (this.player.body.velocity.x > 0)
        this.player.body.velocity.x = -(this.player.body.velocity.x)
    },
    playerRight: function() {
      if (this.player.body.velocity.x < 0)
      this.player.body.velocity.x = -(this.player.body.velocity.x);
    },
    exitScene: function() {
      this.game.state.start('playground');
    }
  };
module.exports = Trampoline;

},{}],21:[function(require,module,exports){
'use strict';
  function TrampolineCutscene() {}
  TrampolineCutscene.prototype = {
    create: function() {
      this.add.sprite(0, 0, 'trampoline_bg');
      this.add.sprite(93, 110, 'trampoline_back');
      this.jumping = this.add.sprite(250, 0, 'trampoline_jumping', 1);
      this.add.sprite(93, 100, 'trampoline_front');
      this.add.button(850, 600, 'fwd_button', this.startTrampoline, this);
      this.game.time.events.add(Phaser.Timer.SECOND * 0.5, this.trampolineKidSay, this);

      this.trampolineKidSound = this.add.audio('youre_next_fi');

      this.jumpingAnim = this.jumping.animations.add('jumps');
      this.jumpingAnimation();
    },
    trampolineKidSay: function() {
      this.trampolineKidSound.play();
    },
    jumpingAnimation: function(){
      this.jumpingAnim.play(16, true);
    },
    startTrampoline: function() {
      this.game.state.start('trampoline');
    }
  };
module.exports = TrampolineCutscene;

},{}],22:[function(require,module,exports){
'use strict';
  function TrampolineGameWin() {}
  TrampolineGameWin.prototype = {
    create: function() {
      this.add.sprite(0, 0, 'trampoline_game_win');
      this.applauseSound = this.add.audio('applause_sound');
      this.game.time.events.add(Phaser.Timer.SECOND * 3, this.startPlayground, this);
      this.applauseSound.play();
    },
    startPlayground: function() {
      this.game.state.start('playground');
    }
  };
module.exports = TrampolineGameWin;

},{}],23:[function(require,module,exports){
'use strict';
  function VeggieGameWin() {}
  VeggieGameWin.prototype = {
    create: function() {
      this.add.sprite(0, 0, 'veggie_game_win');
      this.applauseSound = this.add.audio('applause_sound');
      this.game.time.events.add(Phaser.Timer.SECOND * 3, this.startFrontYard, this);
      this.applauseSound.play();
    },
    startFrontYard: function() {
      this.game.state.start('frontyard');
    }
  };
module.exports = VeggieGameWin;

},{}],24:[function(require,module,exports){
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
      this.backButton = this.add.button(899, 23, 'exit_btn' , this.startFrontYard, this);
      this.add.sprite(155, 20, 'score_basket');
      this.add.sprite(225, 30, 'score_meter');
      this.scorePointer = this.add.sprite(220, 24, 'score_pointer');

      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      this.game.physics.enable([this.potato, this.tomato, this.carrot], Phaser.Physics.ARCADE);

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

      /*var mgMusic = this.add.audio('minigame_music', 1);
      mgMusic.play();*/

    },
    update: function() {
      if (this.scorePointer.x > 757.5) {
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
      bounce.loop();
      bounce.start();
    },
    startFrontYard: function() {
      console.log("foo");
      this.game.state.start('frontyard');
    }
  };
module.exports = VeggiePatch;

},{}],25:[function(require,module,exports){
'use strict';
  function Walkingout() {}
  Walkingout.prototype = {
    create: function() {
      this.add.sprite(0, 0, 'walking_out_house');
      this.game.time.events.add(Phaser.Timer.SECOND * 2.5, this.startFrontYard, this);
    },
    startFrontYard: function() {
      this.game.state.start('frontyard');
    }
  };
module.exports = Walkingout;

},{}]},{},[1])