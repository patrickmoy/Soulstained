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
        if (!this.game.displayHomeScreen && this.game.INPUTS["Enter"]) {
            this.game.pause = true;
            this.game.inInventory = true;
            this.game.INPUTS["Enter"] = false;
        }
        // EXIT INVENTORY AND RETURN TO THE GAME
        if (this.game.pause && this.game.inInventory) {
            if (this.game.INPUTS["KeyK"]) {
                this.game.pause = false;
                this.game.inInventory = false;
                this.game.INPUTS["KeyK"] = false;
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
            if (this.game.INPUTS["KeyK"]) {
                this.game.INPUTS["KeyK"] = false;
                this.game.pause = false;
                this.game.displayMessage = false;
                this.msgEncoded = [];
            }
        }

        if (this.game.pause && this.game.displayHomeScreen) {
            if (this.game.INPUTS["KeyK"]) {
                this.game.INPUTS["KeyK"] = false;
                this.game.pause = false;
                this.game.displayHomeScreen = false;
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
                if (this.game.INPUTS["KeyK"])
                {
                    this.game.INPUTS["KeyK"] = false;
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

    /**
     * Fetches the message from the game engine and encodes the message to indexes of the letters font sprite sheet
     */
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

        var homeScreenMessage = "HOW TO PLAY SOUL STAINED\n\n\n\n" +
            "Use WASD keys to control your movement\n\n" +
            "USE J AND K KEYS TO ATTACK AND ALSO\n\n" +
            "TO SELECT MENU OPTIONS OR EXIT\n\n" +
            "USE RETURN KEY TO ACCESS INVENTORY";

        var msgEncoded = this.parse(homeScreenMessage);

        for (var i = 0; i < msgEncoded.length; i++) {
            var ch = msgEncoded[i];
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
        for (var i = 0; i < this.health; i++) {
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
        if (this.hero.equipK !== "empty") {
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
            console.log("inventory draw");
            this.displayInventory();
        }

        if (this.game.pause && this.game.displayHomeScreen) {
            console.log("home screen draw");
            this.displayHomeScreen();
        }

    }
}