class UserInterface {
    constructor(game, hero, images) {
        // constructor properties
        this.game = game;
        this.ctx = game.GAME_CONTEXT;
        this.hero = hero;
        this.images = images;

        // UI resources
        this.coinImage = this.images["./res/img/coin.png"];
        this.heartImage = this.images["./res/img/heart.png"];
        this.digitsFontImage = this.images["./res/img/digits.png"];
        this.lettersFontImage = this.images["./res/img/letters.png"];
        this.upgradeBarImage = this.images["./res/img/upgrade-bar.png"];
        this.cursor = this.images["./res/img/blinking-dot.png"];
        this.smallKey = this.images["./res/img/smallkey.png"]; // 7 x 14
        this.bossKey = this.images["./res/img/bosskey.png"]; // 9 x 14


        this.keyJImage = this.images["./res/img/keyJ.png"];
        this.keyKImage = this.images["./res/img/keyK.png"];


        // HERO's health and currency properties
        this.health;
        this.coins;

        // encoded digits for indexing sprite sheet
        this.d1;
        this.d10;
        this.d100;

        // encoded message for indexing sprite sheet
        this.msgEncoded = [];

        // variables for managing transactions
        this.strokeStyle = 'yellow';
        this.selectionBoxY = 280;
        this.transactionState = 'browse'; // browse, select, pay, exit

        /**
         * if browse press k -> exit
         * if select press k -> browse
         * if browse press j -> select
         * if select press j -> pay
         */

        // variables for managing weapon swapping
        // relevant properties from hero
        // >>>>> this.hero.inventory, this.hero.equipJ, this.hero.equipK
        this.availableWeapons = [];
        this.indexKeyJ;
        this.indexKeyK;
        this.currentJ;
        this.currentK;
        this.cursorX = 120 + 216 + 60 + 120;
        this.cursorY = 305; // 305 or 324
        this.cursorSX = 0;  // for indexing sprite sheet
        this.cursorTime = 0;


        this.colorIndex = 0;
        this.colorIndexHelper = 0;
        this.colorIncrement = true;
    }

    update() {
        // Fetch Hero's health and currency properties
        this.health = this.hero.health;
        this.coins = this.hero.coins;
        var coins = this.coins;

        // Encode numbers to index digits font sprite sheet
        for (var i=0; i<3; i++) {
            var digit = coins % 10;
            coins = Math.floor(coins / 10);
            if (i === 0) this.d1 = digit * 49.5;
            if (i === 1) this.d10 = digit * 49.5;
            if (i === 2) this.d100 = digit * 49.5;
        }
        // User presses the return key to switch the game state to Inventory
        if (!this.game.transition && !this.game.displayHomeScreen && !this.game.inInventory && !this.game.displayMessage && !this.game.displayTransaction && this.game.INPUTS["Enter"]) {
            this.game.INPUTS["Enter"] = false;
            this.game.pause = true;
            this.game.inInventory = true;
        }

        // EXIT INVENTORY AND RETURN TO THE GAME
        if (this.game.pause && this.game.inInventory) {
            if (this.game.INPUTS["Enter"]) {
                this.game.INPUTS["Enter"] = false;
                this.game.pause = false;
                this.game.inInventory = false;
            }

            // cursor animation operations
            this.cursorTime += this.game.clockTick;
            this.cursorSX = 12 * Math.floor(Math.floor(this.cursorTime / 0.5) % 2);

            // INVENTORY OPERATIONS
            this.indexKeyJ = this.hero.inventory.indexOf(this.hero.equipJ);
            this.indexKeyK = this.hero.inventory.indexOf(this.hero.equipK);
            //this.availableWeapons = this.hero.inventory.filter(weapon => weapon !== this.hero.equipJ || weapon !== this.hero.equipK);

            // handle key inputs
            // cursor first

            if (this.game.INPUTS["KeyW"]) {
                this.game.INPUTS["KeyW"] = false;
                if (this.cursorY === 305) {
                    // do nothing
                } else {
                    this.cursorY = 305;
                }
            }

            if (this.game.INPUTS["KeyS"]) {
                this.game.INPUTS["KeyS"] = false;
                if (this.cursorY === 324) {
                    // do nothing
                } else {
                    this.cursorY = 324;
                }
            }

            if (this.game.INPUTS["KeyA"]) {
                this.game.INPUTS["KeyA"] = false;
                if (this.cursorY === 305) {
                    // key J selection
                    if (this.indexKeyJ === 0) {
                        this.indexKeyJ = this.hero.inventory.length - 1;
                    } else {
                        this.indexKeyJ--;
                    }

                } else {
                    if (this.indexKeyK === 0) {
                        this.indexKeyK = this.hero.inventory.length - 1;
                    } else {
                        this.indexKeyK--;
                    }
                }
            }

            if (this.game.INPUTS["KeyD"]) {
                this.game.INPUTS["KeyD"] = false;
                if (this.cursorY === 305) {
                    if (this.indexKeyJ === this.hero.inventory.length - 1) {
                        this.indexKeyJ = 0;
                    } else {
                        this.indexKeyJ++;
                    }
                } else {
                    if (this.indexKeyK === this.hero.inventory.length - 1) {
                        this.indexKeyK = 0;
                    } else {
                        this.indexKeyK++;
                    }
                }
            }


            this.currentJ = this.hero.inventory[this.indexKeyJ];
            this.currentK = this.hero.inventory[this.indexKeyK];
            this.hero.equipJ = this.currentJ;
            this.hero.equipK = this.currentK;
        }

        // EXIT MESSAGE AND RETURN TO THE GAME
        if (this.game.pause && this.game.displayMessage) {
            if (this.game.INPUTS["Enter"]) {
                this.game.INPUTS["Enter"] = false;
                this.game.pause = false;
                this.game.displayMessage = false;
                this.msgEncoded = [];
            }
        }

        if (this.game.pause && this.game.displayHomeScreen) {

            if (this.game.INPUTS["click"] && (this.game.INPUTS["coord"].x > 240 && this.game.INPUTS["coord"].x < 480 && this.game.INPUTS["coord"].y > 494 && this.game.INPUTS["coord"].y < 518 )){
                this.game.INPUTS["click"] = false;
                this.game.pause = false;
                this.game.displayHomeScreen = false;
            }

            this.colorIndexHelper++;
            if (this.colorIndexHelper % 3 === 0) {
                if (this.colorIncrement) {
                    this.colorIndex++;
                    if (this.colorIndex === 32) {
                        this.colorIncrement = false;
                        this.colorIndex = 30;
                    }
                } else {
                    this.colorIndex--;
                    if (this.colorIndex === -1) {
                        this.colorIncrement = true;
                        this.colorIndex = 1;
                    }
                }
            }
        }
        // PROCESS TRANSACTION AND RETURN TO THE GAME
        if (this.game.pause && this.game.displayTransaction) {

            if (this.transactionState === 'browse')
            {
                if (this.game.INPUTS["KeyW"]) {
                    if (this.selectionBoxY === 280)
                    {
                        // do nothing
                    } else {
                        this.selectionBoxY -= 48;
                        this.game.INPUTS["KeyW"] = false;
                    }
                }
                if (this.game.INPUTS["KeyS"]) {
                    if (this.selectionBoxY === 424)
                    {
                        // do nothing
                    } else {
                        this.selectionBoxY += 48;
                        this.game.INPUTS["KeyS"] = false;
                    }
                }
                if (this.game.INPUTS["KeyJ"])
                {
                    this.game.INPUTS["KeyJ"] = false;
                    this.transactionState = 'select';
                    this.strokeStyle = 'green';
                }
                if (this.game.INPUTS["Enter"])
                {
                    this.game.INPUTS["Enter"] = false;
                    this.game.pause = false;
                    this.game.displayTransaction = false;
                }
            } else if (this.transactionState === 'select') {
                if (this.game.INPUTS["KeyK"])   // deselect
                {
                    this.game.INPUTS["KeyK"] = false;
                    this.strokeStyle = 'yellow';
                    this.transactionState = 'browse';
                }
                if (this.game.INPUTS["KeyJ"])   // buy
                {
                    var itemIndex = (this.selectionBoxY - 280) / 48;
                    var purchasedItem = this.game.goods[itemIndex].name;
                    if (this.hero.coins >= this.game.goods[itemIndex].price) {

                        this.game.INPUTS["KeyJ"] = false;
                        // use the selectionBoxY value to translate to an array index
                        // index the this.game.goods to access the price
                        // this.hero.coins - price
                        this.strokeStyle = 'yellow';
                        this.transactionState = 'browse';
                        this.hero.coins -= this.game.goods[itemIndex].price;
                        //280, 328, 376, 424, 472
                        if (purchasedItem === 'heart') {
                            this.hero.health += 1;
                        } else {
                            this.hero.inventory.push(purchasedItem);
                        }
                    } else if (purchasedItem === 'arrows') {

                    } else {
                        this.game.INPUTS["KeyJ"] = false;
                        this.strokeStyle = 'yellow';
                        this.transactionState = 'browse';
                    }
                }
            }
        }
    }

    parse(string) {
        var stringEncoded = [];
        var stringUpperCase = string.toUpperCase();
        for (var i=0; i<string.length; i++)
        {
            var ch = stringUpperCase[i];
            var letterIndex = ch.charCodeAt(0);
            if (letterIndex > 64 && letterIndex < 91)
            {
                letterIndex -= 65;
            }
            else if (letterIndex === 10)
            {
                letterIndex = 30;
            } else {
                letterIndex = 29;
            }
            stringEncoded.push(letterIndex);
        }
        return stringEncoded;
    }

    parseTransaction() {

        for (var i=0; i<this.game.goods.length; i++)
        {
            var itemName = this.game.goods[i].name;
            this.game.goods[i].encoded = this.parse(itemName);
            while (this.game.goods[i].encoded.length < 20) {
                this.game.goods[i].encoded.push(29);
            }
        }

        this.game.newTransaction = false;
        this.game.pause = true;
        this.game.displayTransaction = true;

    }

    parseMessage() {
        var msgString = this.game.msg;
        for (var i = 0; i < msgString.length; i++) {
            var ch = msgString[i];
            var letterIndex = ch.charCodeAt(0);

            if (letterIndex > 64 && letterIndex < 91) {
                letterIndex -= 65;
            } else if (letterIndex === 10) {
                letterIndex = 30;
            } else {
                letterIndex = 29;
            }
            this.msgEncoded.push(letterIndex);
        }

        this.game.newMsg = false;
        this.game.pause = true;
        this.game.displayMessage = true;
    }

    displayMessage() {

        // Message Display "Board" coordinates and dimensions
        var dx = 120;
        var dy = 240;
        var width = 60;
        var height = 60;
        var step = 60;  // for sprite sheet
        var leftMargin = 120;
        var rightMargin = 600;
        var topMargin = 240;
        var bottomMargin = 480;

        // Message Display "Board" is a transparent black rectangle for now
        this.ctx.globalAlpha = 0.9;
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(leftMargin - 20, topMargin - 20, 520, 280);

        for (var i = 0; i < this.msgEncoded.length; i++) {
            var ch = this.msgEncoded[i];
            if (ch === 30) {
                dy += 13;
                dx = leftMargin;
            } else if (ch === 29) {
                dx += 12;
            } else {
                this.ctx.drawImage(this.lettersFontImage, ch * step, 0, 60, 60, dx, dy, 12, 12);
                dx += 12;
            }
        }
    }

    displayTransaction() {
        var merchantSpeak = "ANYTHING CAN BE YOURS FOR THE RIGHT PRICE";
        var merchantSpeakEncoded = this.parse(merchantSpeak);

        // Message board dimensions
        var dx =  120;
        var dy = 240;
        var width = 60;
        var height = 60;
        var step = 60;  // for font sprite sheet
        var leftMargin = 120;
        var rightMargin = 600;
        var topMargin = 240;
        var bottomMargin = 480;

        this.ctx.globalAlpha = 0.9;
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(leftMargin - 20, topMargin - 20, 520, 280);

        // DRAW MERCHANT SPEAK
        for (var j=0; j<merchantSpeakEncoded.length; j++) {
            var ch = merchantSpeakEncoded[j];
            if (ch === 30) {
                dy += 13;
                dx = leftMargin;
            }
            else if (ch === 29) {
                dx += 12;
            }
            else {
                this.ctx.drawImage(this.lettersFontImage, ch*step, 0, 60, 60, dx, dy, 12, 12);
                dx += 12;
            }
        }

        // make a new line , carriage return
        dy = 280;
        // TAB
        dx = 140;

        // DRAW MERCHANT'S GOODS, ITEM NAMES AND PRICES
        for (var k=0; k<this.game.goods.length; k++)
        {
            // IMAGE
            var path = "./res/img/" + this.game.goods[k].name + ".png";
            var img = this.game.ASSETS_LIST[path];
            this.ctx.drawImage(img, 0, 0, 30, 30, dx, dy, 48, 48);
            this.ctx.strokeStyle = 'gray';
            this.ctx.strokeRect(dx, dy, 48, 48);
            dx += 48;
            dy += 24;

            dx += 24;
            // NAME
            for (var l=0; l<this.game.goods[k].encoded.length; l++)
            {
                var letterIndex = this.game.goods[k].encoded[l];
                if (letterIndex === 29)
                {
                    dx += 12; // SPACE CHARACTER
                } else {
                    this.ctx.drawImage(this.lettersFontImage, letterIndex * step, 0, 60, 60, dx, dy, 12, 12);
                    dx += 12;
                }
            }
            dx+=12;

            // PRICE
            var merchantPrice = this.game.goods[k].price;
            var d1;
            var d10;
            var d100;
            for (var i=0; i<3; i++) {
                var digit = merchantPrice % 10;
                merchantPrice = Math.floor(merchantPrice / 10);
                if (i === 0) d1 = digit * 49.5;
                if (i === 1) d10 = digit * 49.5;
                if (i === 2) d100 = digit * 49.5;
            }

            // draw coin
            this.ctx.drawImage(this.coinImage, 0, 0, 11, 11, dx, dy, 12, 12);
            dx+=12;
            this.ctx.drawImage(this.digitsFontImage, d100, 0, 49.5, 45, dx, dy, 12, 10.9);
            dx+=12;
            this.ctx.drawImage(this.digitsFontImage, d10, 0, 49.5, 45, dx, dy, 12, 10.9);
            dx+=12;
            this.ctx.drawImage(this.digitsFontImage, d1, 0, 49.5, 45, dx, dy, 12, 10.9);
            dy += 24;
            dx = 140;
        }
        var instructions = "PRESS K TO SELECT AND BUY    PRESS J TO DESELECT AND EXIT";
        var instructionsEncoded = this.parse(instructions);

        // draw selection box
        this.ctx.strokeStyle = this.strokeStyle;
        this.ctx.strokeRect(140, this.selectionBoxY, 48, 48);
    }

    displayInventory() {
        // Message board dimensions
        var dx =  120;
        var dy = 240;
        var width = 60;
        var height = 60;
        var step = 60;  // for font sprite sheet
        var leftMargin = 120;
        var rightMargin = 600;
        var topMargin = 240;
        var bottomMargin = 480;

        this.ctx.globalAlpha = 0.95;
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(leftMargin - 20, topMargin - 20, 520, 280);

        // draw word "inventory" center-aligned on the first line
        dx += 186;
        var self = this;
        var wordInventory = this.parse("INVENTORY");
        wordInventory.forEach(function(letterIndex) {
            self.ctx.drawImage(self.lettersFontImage, letterIndex*step, 0, 60, 60, dx, dy, 12, 12);
            dx+=12;
        });

        // 3 newlines and carriage return
        dy += 39;
        dx = 120;
        // 2 space characters, each character's width 12px
        dx += 24;
        // draw words "weapon selection" left-aligned (col1)
        var wordWeaponSelection = this.parse("WEAPON SELECTION");
        wordWeaponSelection.forEach(function(letterIndex) {
            self.ctx.drawImage(self.lettersFontImage, letterIndex*step, 0, 60, 60, dx, dy, 12, 12);
            dx+=12;
        });

        // 2 newlines and a carriage return
        dy += 26;
        dx = 120;
        // 8 space characters
        dx += 96;
        // draw words "Key J Slot" left-aligned (col1)
        var wordKeyJSlot = this.parse("KEY J SLOT");
        wordKeyJSlot.forEach(function(letterIndex) {
            self.ctx.drawImage(self.lettersFontImage, letterIndex*step, 0, 60, 60, dx, dy, 12, 12);
            dx += 12;
        });

        // 1 newline (1.5 line spacing) and a carriage return
        dy += 19;
        dx = 120;
        // 8 space characters
        dx += 96;
        // draw words "Key K Slot" left-aligned (col1)
        var wordKeyKSlot = this.parse("KEY K SLOT");
        wordKeyKSlot.forEach(function(letterIndex) {
            self.ctx.drawImage(self.lettersFontImage, letterIndex*step, 0, 60, 60, dx, dy, 12, 12);
            dx += 12;
        });

        // 2 newlines and carriage return
        dy += 52;
        dx = 120;
        // 3 space characters
        dx += 36;
        // draw words "weapon upgrades" left-aligned (col1)
        var wordWeaponUpgrades = this.parse("WEAPON UPGRADES");
        wordWeaponUpgrades.forEach(function(letterIndex) {
            self.ctx.drawImage(self.lettersFontImage, letterIndex*step, 0, 60, 60, dx, dy, 12, 12);
            dx+=12;
        });

        // col1 left-alignment rules
        // the width of the spacing and characters must sum to 216
        // 216 => 18 "characters"
        // 2 newlines and a carriage return

        dy += 26;
        dx = 120;
        var wordWhip = this.parse("              WHIP");
        wordWhip.forEach(function(letterIndex) {
            self.ctx.drawImage(self.lettersFontImage, letterIndex * step, 0, 60, 60, dx, dy, 12, 12);
            dx += 12;
        });

        // 1 newline (1.5 line spacing) and a carriage return
        dy += 19;
        dx = 120;
        var wordBow = this.parse("               BOW");
        wordBow.forEach(function(letterIndex) {
            self.ctx.drawImage(self.lettersFontImage, letterIndex * step, 0, 60, 60, dx, dy, 12, 12);
            dx += 12;
        });

        // 1 newline (1.5 line spacing) and a carriage return
        dy += 19;
        dx = 120;
        var wordWeaponC = this.parse("");
        wordWeaponC.forEach(function(letterIndex) {
            self.ctx.drawImage(self.lettersFontImage, letterIndex * step, 0, 60, 60, dx, dy, 12, 12);
            dx += 12;
        });

        // 1 newline (1.5 line spacing) and a carriage return
        dy += 19;
        dx = 120;
        var wordBow = this.parse("");
        wordWeaponC.forEach(function(letterIndex) {
            self.ctx.drawImage(self.lettersFontImage, letterIndex * step, 0, 60, 60, dx, dy, 12, 12);
            dx += 12;
        });

        // COLUMN 2
        // dx = 120 + 216 + W
        // KEY J SLOT dy = 305
        // KEY K SLOT dy = 324
        // WHIP dy = 402
        // BOW dy = 421
        // WEAPON C  dy = 440
        // WEAPON D dy = 459

        // weapon selection
        // KEY J SELECTION
        dx = 120 + 216 + 60;
        dy = 305;
        var wordCurrentJ = this.parse(this.currentJ);
        wordCurrentJ.forEach(function(letterIndex) {
            self.ctx.drawImage(self.lettersFontImage, letterIndex * step, 0, 60, 60, dx, dy, 12, 12);
            dx += 12;
        });

        // KEY K SELECTION
        dx = 120 + 216 + 60;
        dy = 324;
        var wordCurrentK = this.parse(this.currentK);
        wordCurrentK.forEach(function(letterIndex) {
            self.ctx.drawImage(self.lettersFontImage, letterIndex * step, 0, 60, 60, dx, dy, 12, 12);
            dx += 12;
        });

        // DRAW CURSOR
        this.ctx.drawImage(this.cursor, this.cursorSX, 0, 12, 12, this.cursorX, this.cursorY, 12, 12);

        // upgrade bars - sprite sheet step is 141, dimensions 846 x 13
        dx = 120 + 216 + 60;
        dy = 402;
        for (var i = 0; i < 4; i++) {
            var lvl = this.hero.upgrades[i];
            this.ctx.drawImage(this.upgradeBarImage, lvl*141, 0, 141, 13, dx, dy, 141, 13);
            dy += 19;
        }
    }

    displayHomeScreen() {
        var frequency = 0.1;
        var red   = Math.sin(frequency*this.colorIndex + 0) * 85 + 170; // 55 200
        var green = Math.sin(frequency*this.colorIndex + 2) * 85 + 170;
        var blue  = Math.sin(frequency*this.colorIndex + 4) * 85 + 170;
        this.ctx.globalAlpha = 0.8;
        this.ctx.fillStyle = this.RGB2Color(red,green,blue);
        this.ctx.fillRect(0, 0, 720, 720);

        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(216, 120, 288,24);
        var title = this.parse("SOUL STAINED");
        var dx = 216;
        var dy = 120;
        for (var i=0; i<title.length; i++)
        {
            if (title[i] === 29) dx += 24;
            else {
                this.ctx.drawImage(this.lettersFontImage, title[i] * 60, 0, 60, 60, dx, dy, 24, 24);
                dx += 24;
            }
        }

        this.ctx.fillRect(264, 156 + 12, 192,12);
        dx = 264;
        dy = 156 + 12;
        var devTeam = this.parse("DEVELOPMENT TEAM");
        for (var j=0; j<devTeam.length; j++)
        {
            if (devTeam[j] === 29) dx += 12;
            else {
                this.ctx.drawImage(this.lettersFontImage, devTeam[j] * 60, 0, 60, 60, dx, dy, 12, 12);
                dx += 12;
            }
        }

        this.ctx.fillRect(288, 156 + 24 + 2, 144, 12);
        dx = 288;
        dy = 156 + 24 + 2;
        var david = this.parse("DAVID SAELEE");
        for (var k=0; k<david.length; k++)
        {
            if (david[k] === 29) dx += 12;
            else {
                this.ctx.drawImage(this.lettersFontImage, david[k] * 60, 0, 60, 60, dx, dy, 12, 12);
                dx += 12;
            }
        }

        this.ctx.fillRect(294, 156 + 24 + 2 + 12 + 2, 132, 12);
        dx = 294;
        dy = 156 + 24 + 2 + 12 + 2;
        var patrick = this.parse("PATRICK MOY");
        for (var l=0; l<patrick.length; l++)
        {
            if (patrick[l] === 29) dx += 12;
            else {
                this.ctx.drawImage(this.lettersFontImage, patrick[l] * 60, 0, 60, 60, dx, dy, 12, 12);
                dx += 12;
            }
        }

        this.ctx.fillRect(294, 156 + 24 + 2 + 12 + 2 + 12 + 2, 132, 12);
        dx = 294;
        dy = 156 + 24 + 2 + 12 + 2 + 12 + 2;
        var steven = this.parse("STEVEN TRAN");
        for (var m=0; m<steven.length; m++)
        {
            if (steven[m] === 29) dx += 12;
            else {
                this.ctx.drawImage(this.lettersFontImage, steven[m] * 60, 0, 60, 60, dx, dy, 12, 12);
                dx += 12;
            }
        }

        this.ctx.fillRect(312, 156 + 24 + 2 + 12 + 2 + 12 + 2 + 12 + 2, 96, 12);
        dx = 312;
        dy = 156 + 24 + 2 + 12 + 2 + 12 + 2 + 12 + 2;
        var yung = this.parse("YUNG KOO");
        for (var n=0; n<yung.length; n++)
        {
            if (yung[n] === 29) dx += 12;
            else {
                this.ctx.drawImage(this.lettersFontImage, yung[n] * 60, 0, 60, 60, dx, dy, 12, 12);
                dx += 12;
            }
        }

        this.ctx.fillRect(300, 156 + 24 + 2 + 12 + 2 + 12 + 2 + 12 + 2 + 24, 120, 12);
        dx = 300;
        dy = 156 + 24 + 2 + 12 + 2 + 12 + 2 + 12 + 2 + 24;
        var supervisor = this.parse("SUPERVISOR");
        for (var o=0; o<supervisor.length; o++)
        {
            if (supervisor[o] === 29) dx += 12;
            else {
                this.ctx.drawImage(this.lettersFontImage, supervisor[o] * 60, 0, 60, 60, dx, dy, 12, 12);
                dx += 12;
            }
        }

        this.ctx.fillRect(276, 156 + 24 + 2 + 12 + 2 + 12 + 2 + 12 + 2 + 24 + 12 + 2, 168, 12);
        dx = 276;
        dy = 156 + 24 + 2 + 12 + 2 + 12 + 2 + 12 + 2 + 24 + 12 + 2;
        var chris = this.parse("CHRIS MARRIOTT");
        for (var p=0; p<chris.length; p++)
        {
            if (chris[p] === 29) dx += 12;
            else {
                this.ctx.drawImage(this.lettersFontImage, chris[p] * 60, 0, 60, 60, dx, dy, 12, 12);
                dx += 12;
            }
        }

        this.ctx.fillRect(264, 156 + 24 + 2 + 12 + 2 + 12 + 2 + 12 + 2 + 24 + 12 + 48, 192, 24);
        dx = 264;
        dy = 156 + 24 + 2 + 12 + 2 + 12 + 2 + 12 + 2 + 24 + 12 + 48;
        var controls = this.parse("CONTROLS");
        for (var q=0; q<controls.length; q++)
        {
            if (controls[q] === 29) dx += 24;
            else {
                this.ctx.drawImage(this.lettersFontImage, controls[q] * 60, 0, 60, 60, dx, dy, 24, 24);
                dx += 24;
            }
        }

        this.ctx.fillRect(288, 156 + 24 + 2 + 12 + 2 + 12 + 2 + 12 + 2 + 24 + 12 + 48 + 48, 144, 12);
        dx = 288;
        dy = 156 + 24 + 2 + 12 + 2 + 12 + 2 + 12 + 2 + 24 + 12 + 48 + 48;
        var wsad = this.parse("W S A D KEYS");
        for (var r=0; r<wsad.length; r++)
        {
            if (wsad[r] === 29) dx += 12;
            else {
                this.ctx.drawImage(this.lettersFontImage, wsad[r] * 60, 0, 60, 60, dx, dy, 12, 12);
                dx += 12;
            }
        }

        this.ctx.fillRect(312, 156 + 24 + 2 + 12 + 2 + 12 + 2 + 12 + 2 + 24 + 12 + 48 + 48 + 12 + 2, 96, 12);
        dx = 312;
        dy = 156 + 24 + 2 + 12 + 2 + 12 + 2 + 12 + 2 + 24 + 12 + 48 + 48 + 12 + 2;
        var movement = this.parse("MOVEMENT");
        for (var s=0; s<movement.length; s++)
        {
            if (movement[s] === 29) dx += 12;
            else {
                this.ctx.drawImage(this.lettersFontImage, movement[s] * 60, 0, 60, 60, dx, dy, 12, 12);
                dx += 12;
            }
        }

        this.ctx.fillRect(312, 156 + 24 + 2 + 12 + 2 + 12 + 2 + 12 + 2 + 24 + 12 + 48 + 48 + 12 + 2 + 24, 96, 12);
        dx = 312;
        dy = 156 + 24 + 2 + 12 + 2 + 12 + 2 + 12 + 2 + 24 + 12 + 48 + 48 + 12 + 2 + 24;
        var jk = this.parse("J K KEYS");
        for (var t=0; t<jk.length; t++)
        {
            if (jk[t] === 29) dx += 12;
            else {
                this.ctx.drawImage(this.lettersFontImage, jk[t] * 60, 0, 60, 60, dx, dy, 12, 12);
                dx += 12;
            }
        }

        this.ctx.fillRect(222, 156 + 24 + 2 + 12 + 2 + 12 + 2 + 12 + 2 + 24 + 12 + 48 + 48 + 12 + 2 + 24 + 12 + 2, 276, 12);
        dx = 222;
        dy = 156 + 24 + 2 + 12 + 2 + 12 + 2 + 12 + 2 + 24 + 12 + 48 + 48 + 12 + 2 + 24 + 12 + 2;
        var attack = this.parse("ATTACK AND MENU OPTIONS");
        for (var u=0; u<attack.length; u++)
        {
            if (attack[u] === 29) dx += 12;
            else {
                this.ctx.drawImage(this.lettersFontImage, attack[u] * 60, 0, 60, 60, dx, dy, 12, 12);
                dx += 12;
            }
        }

        this.ctx.fillRect(306, 156 + 24 + 2 + 12 + 2 + 12 + 2 + 12 + 2 + 24 + 12 + 48 + 48 + 12 + 2 + 24 + 12 + 2 +24, 108, 12);
        dx = 306;
        dy = 156 + 24 + 2 + 12 + 2 + 12 + 2 + 12 + 2 + 24 + 12 + 48 + 48 + 12 + 2 + 24 + 12 + 2 + 24;
        var enter = this.parse("ENTER KEY");
        for (var v=0; v<enter.length; v++)
        {
            if (enter[v] === 29) dx += 12;
            else {
                this.ctx.drawImage(this.lettersFontImage, enter[v] * 60, 0, 60, 60, dx, dy, 12, 12);
                dx += 12;
            }
        }

        this.ctx.fillRect(180, 156 + 24 + 2 + 12 + 2 + 12 + 2 + 12 + 2 + 24 + 12 + 48 + 48 + 12 + 2 + 24 + 12 + 2 + 24 + 12 + 2, 360, 12);
        dx = 180;
        dy = 156 + 24 + 2 + 12 + 2 + 12 + 2 + 12 + 2 + 24 + 12 + 48 + 48 + 12 + 2 + 24 + 12 + 2 + 24 + 12 + 2;
        var inventory = this.parse("ACCESS INVENTORY AND EXIT MENU");
        for (var w=0; w<inventory.length; w++)
        {
            if (inventory[w] === 29) dx += 12;
            else {
                this.ctx.drawImage(this.lettersFontImage, inventory[w] * 60, 0, 60, 60, dx, dy, 12, 12);
                dx += 12;
            }
        }

        this.ctx.fillRect(240, 156 + 24 + 2 + 12 + 2 + 12 + 2 + 12 + 2 + 24 + 12 + 48 + 48 + 12 + 2 + 24 + 12 + 2 + 24 + 12 + 2 + 48, 240, 24);
        dx = 240;
        dy = 156 + 24 + 2 + 12 + 2 + 12 + 2 + 12 + 2 + 24 + 12 + 48 + 48 + 12 + 2 + 24 + 12 + 2 + 24 + 12 + 2 + 48;
        var start = this.parse("START GAME");
        for (var x=0; x<start.length; x++)
        {
            if (start[x] === 29) dx += 24;
            else {
                this.ctx.drawImage(this.lettersFontImage, start[x] * 60, 0, 60, 60, dx, dy, 24, 24);
                dx += 24;
            }
        }
    }

    draw() {

        /**
         * distracts too much from the game play
         */
        /*
        this.ctx.globalAlpha = 0.7;
        this.ctx.fillStyle = 'teal';
        this.ctx.fillRect(0, 0, 720, 75);
        */


        /**
         * draw hearts
         */
        var dx = 22;
        var dy = 0;
        let healthToDraw = Math.min(this.hero.maxHealth, this.health);
        for (var i = 0; i < healthToDraw; i++) {
            this.ctx.drawImage(this.heartImage, 0, 0, 30, 30, dx, dy, 40, 40);
            dx += 50;
            if (i === 4) {
                dy += 30;
                dx = 22;
            }
        }

        // draw coin and amount
        this.ctx.drawImage(this.coinImage, 0, 0, 11, 11, 345, 5, 30, 30);
        this.ctx.drawImage(this.digitsFontImage, this.d100, 0, 49.5, 45, 327, 37, 22, 20);
        this.ctx.drawImage(this.digitsFontImage, this.d10, 0, 49.5, 45, 349, 37, 22, 20);
        this.ctx.drawImage(this.digitsFontImage, this.d1, 0, 49.5, 45, 371, 37, 22, 20);

        // draw arrows
        this.ctx.drawImage(this.images["./res/img/arrowsUI.png"], 0, 0, 18, 18, 420, 5, 30, 30);
        this.ctx.drawImage(this.digitsFontImage, this.hero.arrows, 0, 49.5, 45, 425, 37, 22, 20);


        // draw keys
        this.ctx.drawImage(this.smallKey, 0, 0, 7, 14, 462, 5, 15, 30);
        this.ctx.drawImage(this.digitsFontImage, this.hero.smallKeys * 49.5, 0, 49.5, 45,  460, 37, 22, 20);

        this.ctx.drawImage(this.bossKey, 0, 0, 9, 14, 492, 5, 19,30);
        if (this.hero.hasBossKey) {
            this.ctx.drawImage(this.digitsFontImage, 49.5, 0, 49.5, 45, 490, 37, 22, 20);
        } else {
            this.ctx.drawImage(this.digitsFontImage, 0, 0, 49.5, 45, 490, 37, 22, 20);
        }

        // draw keys and weapons
        this.ctx.drawImage(this.keyJImage, 0, 0, 264, 268, 600, 30, 30, 30);
        this.ctx.drawImage(this.keyKImage, 0, 0, 268, 269, 660, 30, 30, 30);

        if (this.hero.equipJ !== "empty") {
            var weaponJ = "./res/img/" + this.hero.equipJ + "UI.png";
            this.ctx.drawImage(this.images[weaponJ], 0, 0, 30, 30, 570, 0, 60, 60);
        }
        if (this.hero.equipK !== "empty" && this.hero.equipK) {
            var weaponK = "./res/img/" + this.hero.equipK + "UI.png";
            this.ctx.drawImage(this.images[weaponK], 0, 0, 30, 30, 630, 0, 60, 60);
        }


        // draw message
        if (this.game.pause && this.game.displayMessage) {
            this.displayMessage();
        }

        // draw transaction
        if (this.game.pause && this.game.displayTransaction) {
            this.displayTransaction();
        }

        // draw inventory
        if (this.game.pause && this.game.inInventory) {
            this.displayInventory();
        }

        if (this.game.pause && this.game.displayHomeScreen) {
            this.displayHomeScreen();
        }

    }

    RGB2Color(r, g, b) {
        return '#' + this.byte2Hex(r) + this.byte2Hex(g) + this.byte2Hex(b);
    }

    byte2Hex(n) {
        var nybHexString = "0123456789ABCDEF";
        return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1)
    }
}
