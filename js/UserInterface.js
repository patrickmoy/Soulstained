class UserInterface
{
    constructor(game, hero, images) {
        this.game = game;
        this.ctx = game.GAME_CONTEXT;
        this.hero = hero;
        this.images = images;
        this.currencyImage = this.images["./res/img/currency.png"];
        this.heartImage = this.images["./res/img/shinyHeart.png"];
        this.digitsFontImage = this.images["./res/img/digits.png"];
        this.lettersFontImages = this.images["./res/img/letters.png"];
        this.keyJImage = this.images["./res/img/keyJ.png"];
        this.keyKImage = this.images["./res/img/keyK.png"];
        this.swordPrototype = this.images["./res/img/swordPrototype.png"];
        this.whipPrototype = this.images["./res/img/whipPrototype.png"];

        this.currentDialogue = false;

        this.hp;
        this.currency;
        this.d1;
        this.d10;
        this.d100;
    }

    update() {
        //console.log(this.currency);
        this.hp = this.hero.health;
        this.currency = this.hero.coins;
        var coins = this.currency;
        for (var i=0; i<3; i++) {
            var digit = coins % 10;
            coins = Math.floor(coins / 10);
            if (i === 0) this.d1 = digit * 49.5;
            if (i === 1) this.d10 = digit * 49.5;
            if (i === 2) this.d100 = digit * 49.5;
        }

        /**
         * Check for messages
         *
         *  this.game.
         *
         *
         *
         *
         *
         */
    }

    draw() {
        /**
         * Hearts Image
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
        /**
         * Coin Image and Amount
         */
        this.ctx.drawImage(this.currencyImage, 0, 0, 11, 11, 345, 0, 30, 30);
        this.ctx.drawImage(this.digitsFontImage, this.d100, 0, 49.5, 45, 327, 30, 22, 20);
        this.ctx.drawImage(this.digitsFontImage, this.d10, 0, 49.5, 45, 349, 30, 22, 20);
        this.ctx.drawImage(this.digitsFontImage, this.d1, 0, 49.5, 45, 371, 30, 22, 20);
        /**
         * Keys Image, Weapons base
         */
        this.ctx.drawImage(this.keyJImage, 0, 0, 264, 268, 540, 30, 30, 30);
        this.ctx.drawImage(this.keyKImage, 0, 0, 268, 269, 660, 30, 30, 30);
        this.ctx.drawImage(this.whipPrototype, 0, 0, 60, 60, 510, 15, 45, 45);
        this.ctx.drawImage(this.swordPrototype, 0, 0, 60, 60, 630, 15, 45, 45);




    }
}