const SHA256 = require('crypto-js/sha256');
class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

}
class Block{
    constructor(timestamp, transactions, previousHash = ''){
        this.timestamp = timestamp;
        this.data = transactions;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){//a assinatura digital
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    //é necessario ter uma quantidade de 0 na frente do calculo de hash para provar que realmente foi usado muito poder computacional, complicando também cada vez mais o calculo a ser feito
    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("BLOCK MINED: " + this.hash);
    }

}
class Blockchain{
    constructor(){//criar o primeiro bloco
        this.chain = [this.createGenesisBlock];
        this.difficulty = 2;
    }

    createGenesisBlock(){//primeiro bloco
        return new Block("01/04/2018", "Genesis Block", "0");
    }

    getLatestBlock(){//pegar o ultimo bloco
        return this.chain[this.chain.length-1];
    }

    addBlock(newBlock){//adicionar um novo bloco
        newBlock.previousHash = this.getLatestBlock().hash;
        //newBlock.hash = newBlock.calculateHash();
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid(){//validar se o hash do ultimo bloco é o que veio para a criação desse novo bloco e se o bloco atual tem o mesmo hash se for feito o mesmo calculo novamente
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }

        return true;
    }
}

