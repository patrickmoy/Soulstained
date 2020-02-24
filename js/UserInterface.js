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
        this.keyJImage = this.images["./res/img/keyJ.png"];
        this.keyKImage = this.images["./res/img/keyK.png"];
        this.swordPrototype = this.images["./res/img/swordPrototype.png"];
        this.whipPrototype = this.images["./res/img/whipPrototype.png"];

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

        // EXIT MESSAGE AND RETURN TO THE GAME
        if (this.game.pause && this.game.displayMessage) {
            if (this.game.INPUTS["KeyK"]) {
                this.game.pause = false;
                this.game.displayMessage = false;
                this.msgEncoded = [];
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
        this.ctx.globalAlpha = 0.8;
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

        this.ctx.globalAlpha = 0.8;
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

    draw() {
        /**
         * draw hearts
         */
        var dx = 22;
        var dy = 0;
        for (var i = 0; i < this.health; i++) {
            this.ctx.drawImage(this.heartImage, 0, 0, 30, 30, dx, dy, 30, 30);
            dx += 40;
            if (i === 4) {
                dy += 30;
                dx = 22;
            }
        }

        // draw coin and amount
        this.ctx.drawImage(this.coinImage, 0, 0, 11, 11, 345, 0, 30, 30);
        this.ctx.drawImage(this.digitsFontImage, this.d100, 0, 49.5, 45, 327, 30, 22, 20);
        this.ctx.drawImage(this.digitsFontImage, this.d10, 0, 49.5, 45, 349, 30, 22, 20);
        this.ctx.drawImage(this.digitsFontImage, this.d1, 0, 49.5, 45, 371, 30, 22, 20);

        // draw keys and weapons
        // this.ctx.drawImage(this.keyJImage, 0, 0, 264, 268, 540, 30, 30, 30);
        // this.ctx.drawImage(this.keyKImage, 0, 0, 268, 269, 660, 30, 30, 30);
        // this.ctx.drawImage(this.whipPrototype, 0, 0, 60, 60, 510, 15, 45, 45);
        // this.ctx.drawImage(this.swordPrototype, 0, 0, 60, 60, 630, 15, 45, 45);

        // draw message
        if (this.game.pause && this.game.displayMessage) {
            this.displayMessage();
        }

        if (this.game.pause && this.game.displayTransaction) {
            this.displayTransaction();
        }
    }
}