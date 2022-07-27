const enemy = require("./Enemy");
const player = require("./Player");
const inquirer = require('inquirer');
const Enemy = require("./Enemy");
const Player = require("./Player");

function Game () {
    this.roundNumber = 0;
    this.isPlayerTurn = false;
    this.enemies = [];
    this.currentEnemy;
    this.player;
}

Game.prototype.initializeGame = function () {
    this.enemies.push(new Enemy('goblin', 'sword'));
    this.enemies.push(new Enemy('orc', 'baseball bat'));
    this.enemies.push(new Enemy('skeleton', 'death ray gun'));
    this.currentEnemy = this.enemies[0];

    // prompt user for name
    inquirer.prompt({
        type: 'text',
        name: 'name',
        message: 'what is your name?',

    })
    //destructure name from prompt object - the brackets make this possible
    // have to use arrow function, if said function the this would be out of lexical scope
    .then(({ name }) => {
        this.player = new Player(name);
    
        this.startNewBattle();
   
    });

};

Game.prototype.battle = function () {//resposible for each individual turn in the round
    if (this.isPlayerTurn){
        inquirer.prompt({
            type: 'list',
            message: 'What would you like to do?',
            name: 'action',
            choices: ['Attack', 'Use Potion']
        })
        .then(({action}) =>{
            if (action === 'Use Potion'){
                //potion logic
                if (!this.player.getInventory()){
                    console.log("You don't have any potions!");
                    return;
                }

                inquirer.prompt({
                    type:'list',
                    message:'Which potion would you like to use?',
                    name:'action',
                    choices: this.player.getInventory().map((item, index) => `${index + 1}: ${item.name}`)
                })
                .then(({action}) => {
                    const potionDetails = action.split(':');
                    this.player.usePotion(potionDetails[0]-1);
                    console.log(`You used a ${potionDetails[1]} potion.`);
                })
            } else {
                const damage = this.player.getAttackValue();
                this.currentEnemy.reduceHealth(damage);
        
                console.log(`You attacked the ${this.currentEnemy.name}`);
                console.log(this.currentEnemy.getHealth());
            }
        })
        // prompt to attack or use potion
        // potion options
        // attack subtract health from enemy
    } else {
        const damage = this.currentEnemy.getAttackValue();
        this.player.reduceHealth(damage);
        
        console.log(`You were attacked by the ${this.currentEnemy.name}`);
        console.log(this.player.getHealth());
    }

};

Game.prototype.checkEndOfBattle = function () {

};

Game.prototype.startNewBattle = function () { // decides turn, displays stats, starts a battle
    if (this.player.agility > this.currentEnemy.agility){
        this.isPlayerTurn = true;
    } else {
        this.isPlayerTurn = false;
    }
    console.log("Your stats are as follows:");
    console.table(this.player.getStats());
    console.log(this.currentEnemy.getDescription());
    this.battle();
};

module.exports = Game;