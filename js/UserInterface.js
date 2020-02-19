class UserInterface
{
    pages;
    constructor(game, hero, images) {
        // constructor properties
        this.game = game;
        this.ctx = game.GAME_CONTEXT;
        this.hero = hero;
        this.images = images;

        // UI resources
        this.currencyImage = this.images["./res/img/currency.png"];
        this.heartImage = this.images["./res/img/shinyHeart.png"];
        this.digitsFontImage = this.images["./res/img/digits.png"];
        this.lettersFontImage = this.images["./res/img/letters.png"];
        this.keyJImage = this.images["./res/img/keyJ.png"];
        this.keyKImage = this.images["./res/img/keyK.png"];
        this.swordPrototype = this.images["./res/img/swordPrototype.png"];
        this.whipPrototype = this.images["./res/img/whipPrototype.png"];

        // HERO's health and currency properties
        this.hp;
        this.currency;

        // encoded digits for indexing sprite sheet
        this.d1;
        this.d10;
        this.d100;

        // encoded message for indexing sprite sheet
        this.msgEncoded = [];
    }

    update() {
        // Fetch Hero's health and currency properties
        this.hp = this.hero.health;
        this.currency = this.hero.coins;
        var coins = this.currency;

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
            }
        }
    }

    /**
     * Fetches the message from the game engine and encodes the message to indexes of the letters font sprite sheet
     */
    parseMessage() {
        var msgString = this.game.msg;
        for (var i=0; i<msgString.length; i++)
        {
            var ch = msgString[i];
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
            this.msgEncoded.push(letterIndex);
        }

        this.game.newMsg = false;
        this.game.pause = true;
        this.game.displayMessage = true;
    }

    displayMessage() {

        // Message Display "Board" coordinates and dimensions
        var dx =  120;
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

        for (var i=0; i<this.msgEncoded.length; i++) {
            var ch = this.msgEncoded[i];
            if (ch === 30) {
                dy += 13;
                dx = leftMargin;
            }
            else if (ch === 29) {
                dx += 12;
            }
            else {
                this.ctx.drawImage(this.lettersFontImage, ch * step, 0, 60, 60, dx, dy, 12, 12);
                dx += 12;
            }
        }
    }

    draw() {
        /**
         * draw hearts
         */
        var dx = 22;
        var dy = 0;
        for (var i=0; i < this.hp; i++) {
            this.ctx.drawImage(this.heartImage, 0, 0, 200, 167, dx, dy, 36, 30);
            dx += 40;
            if (i === 4) {
                dy += 30;
                dx = 22;
            }
        }

        // draw coin and amount
        this.ctx.drawImage(this.currencyImage, 0, 0, 11, 11, 345, 0, 30, 30);
        this.ctx.drawImage(this.digitsFontImage, this.d100, 0, 49.5, 45, 327, 30, 22, 20);
        this.ctx.drawImage(this.digitsFontImage, this.d10, 0, 49.5, 45, 349, 30, 22, 20);
        this.ctx.drawImage(this.digitsFontImage, this.d1, 0, 49.5, 45, 371, 30, 22, 20);

        // draw keys and weapons
        this.ctx.drawImage(this.keyJImage, 0, 0, 264, 268, 540, 30, 30, 30);
        this.ctx.drawImage(this.keyKImage, 0, 0, 268, 269, 660, 30, 30, 30);
        this.ctx.drawImage(this.whipPrototype, 0, 0, 60, 60, 510, 15, 45, 45);
        this.ctx.drawImage(this.swordPrototype, 0, 0, 60, 60, 630, 15, 45, 45);

        // draw message
        if (this.game.pause && this.game.displayMessage) {
            this.displayMessage();
        }
    }
}