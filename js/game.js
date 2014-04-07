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
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  game.state.add('thinking', require('./states/thinking'));
  game.state.add('walkingout', require('./states/walkingout'));
  

  game.state.start('boot');
};
},{"./states/afterbikelane":3,"./states/bikelane":4,"./states/boot":5,"./states/frontyard":6,"./states/gameover":7,"./states/home":8,"./states/menu":9,"./states/play":10,"./states/preload":11,"./states/thinking":12,"./states/walkingout":13}],2:[function(require,module,exports){
'use strict';

var Stone = function(game, x, y, frame) {
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
    this.body.y += 3.3;
  }
};

module.exports = Stone;

},{}],3:[function(require,module,exports){
'use strict';
  function Afterbikelane() {}
  Afterbikelane.prototype = {
    preload: function() {
      // Override this method to add some load operations. 
      // If you need to use the loader, you may need to use them here.
    },
    create: function() {
      // This method is called after the game engine successfully switches states. 
      // Feel free to add any setup code here (do not load anything here, override preload() instead).
    },
    update: function() {
      // state update code
    },
    paused: function() {
      // This method will be called when game paused.
    },
    render: function() {
      // Put render operations here.
    },
    shutdown: function() {
      // This method will be called when the state is shut down 
      // (i.e. you switch to another state from this one).
    }
  };
module.exports = Afterbikelane;

},{}],4:[function(require,module,exports){
'use strict';
var Stone = require('../prefabs/stone')
  function Bikelane() {}
    var player;
    var tree1;
    var speed = 4;
  Bikelane.prototype = {
    create: function() {

      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      this.add.sprite(0, 0, 'bikelane_bg');

      // Scrolling stones      
      this.stone1 = new Stone(this.game, 642, 0, 1);
      this.stone2 = new Stone(this.game, 370, 0, 2);
      this.stone3 = new Stone(this.game, 260, 0, 3);

      this.game.add.existing(this.stone1);
      //game.add.existing(this.stone2);
      //game.add.existing(this.stone3);
      
      // Scrolling trees      
      this.tree1 = this.add.tileSprite(0, 0, 190, 768, 'bikelane_trees1');
      this.tree2 = this.add.tileSprite(834, 0, 190, 768, 'bikelane_trees2');
      this.tree1.autoScroll(0, 200);
      this.tree2.autoScroll(0, 200);

      // Player setup
      this.player = this.add.sprite(this.game.width/2, (this.game.height-113), 'bikelane_alien');
      this.player.anchor.setTo(0.5, 0.5);


      this.game.physics.enable([this.player, this.stone1], Phaser.Physics.ARCADE);
      this.player.body.collideWorldBounds = true;
      this.player.body.immovable = true;

      this.collisionsound = this.add.audio('collision_sound');
      this.cursors = this.game.input.keyboard.createCursorKeys();

    },
    update: function() {
      
      //Player controls
      if (this.cursors.left.isDown)
      {
        if (this.player.x > 190+(this.player.width/2)) {
          this.player.x = this.player.x - 4
        }
      }
      else if (this.cursors.right.isDown)
      {
        if (this.player.x < 834-(this.player.width/2)) {
          this.player.x = this.player.x + 4
        }
      }
      this.game.physics.arcade.collide(this.stone1, this.player, this.collisionHandler, null, this);

    },
    collisionHandler: function (obj1, obj2) {

      //this.collisionsound.play();
      console.log("collide");
      this.tree1.autoScroll(0, 0);
      this.tree2.autoScroll(0, 0);
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

      this.anim = this.helmet.animations.add('swing');

      this.add.sprite(849, 353, 'frontyard_patch');
      this.alien = this.add.sprite(470, 91, 'frontyard_alien');

      this.branchsound = this.add.audio('branch1_sound');
      this.helmetsound = this.add.audio('helmet_on_sound');
      this.bicyclesound = this.add.audio('bicycle_bell_sound');
    },
    startBikeLane: function(){
      this.bicyclesound.play();
      this.game.state.start('bikelane');
    },
    helmetAnimation: function(){
      this.anim.play(8, false);
      this.anim.stop;
      this.branchsound.play();
    },
    wearHelmet: function(){
      this.helmet.destroy();
      this.helmetsound.play();
      this.alien.y = 159;
      this.alien.loadTexture('frontyard_alien_helmet', 0);
      this.add.button(873, 614, 'frontyard_button', this.startBikeLane, this);
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
      this.add.button(220, 83, 'home_door', this.startWalkingOutHouse, this);
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
    this.game.state.start('bikelane');
  },
  startYellow: function() {
    this.game.state.start('thinking');
  }
};

module.exports = Menu;

},{}],10:[function(require,module,exports){

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
},{}],11:[function(require,module,exports){

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

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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