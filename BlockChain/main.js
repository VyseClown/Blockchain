
const SHA256 = require("crypto-js/sha256");

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }
    //é necessario ter uma quantidade de 0 na frente do calculo de hash para provar(proof of work que realmente foi usado muito poder computacional, complicando também cada vez mais o calculo a ser feito
    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;//nonce é o numero que é modificado até o conjunto dar um hash começando com a quantidade de zeros que a dificuldade estipular, já que o conteúdo do bloco não pode ser modificado
            this.hash = this.calculateHash();
        }

        console.log("Bloco minerado: " + this.hash);
    }
}


class Blockchain{
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 0.1;
    }

    createGenesisBlock() {
        return new Block(Date.parse("2017-01-01"), [], "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        console.log('Bloco minerado com sucesso !');
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }

                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    isChainValid() {//validar se o hash do ultimo bloco é o que veio para a criação desse novo bloco e se o bloco atual tem o mesmo hash se for feito o mesmo calculo novamente
        for (let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

let dicoin = new Blockchain();
dicoin.createTransaction(new Transaction('address1', 'address2', 1000));//seriam os endereços das carteiras publicas
dicoin.createTransaction(new Transaction('address2', 'address1', 50));
dicoin.createTransaction(new Transaction('address2', 'address1', 50));
dicoin.createTransaction(new Transaction('address2', 'address1', 50));
dicoin.createTransaction(new Transaction('address2', 'address1', 50));
dicoin.createTransaction(new Transaction('address2', 'address1', 50));
dicoin.createTransaction(new Transaction('address2', 'address1', 50));
dicoin.createTransaction(new Transaction('address2', 'address1', 50));
dicoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\n Starting the miner...');
dicoin.minePendingTransactions('Vyse-address');

console.log('\nBalance of Vyse is', dicoin.getBalanceOfAddress('Vyse-address'));

console.log('\n Starting the miner again...');
dicoin.minePendingTransactions('Vyse-address');

console.log('\n O balanço do minerador é ', dicoin.getBalanceOfAddress('Vyse-address'));
console.log('\nO balanço do Rodrigo Brandão é ', dicoin.getBalanceOfAddress('address2'));

console.log('\nA blockchain é valida ?\n' + dicoin.isChainValid());

//menu aqui


dicoin.chain[2].transactions = {amount:100};//pode mudar a quantidade novamente para 50, apenas o fato de ter mudado a data fará com que o conjunto de fatores não dê mais o hash correto
console.log('\nA blockchain é valida ?\n' + dicoin.isChainValid());
