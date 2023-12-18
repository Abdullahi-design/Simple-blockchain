const crypto = require('crypto');

class Block {
  constructor(index, previousHash, timestamp, data, hash, nonce) {
    this.index = index;
    this.previousHash = previousHash.toString();
    this.timestamp = timestamp;
    this.data = data;
    this.hash = hash.toString();
    this.nonce = nonce;
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2; // Adjust the difficulty for PoW
  }

  createGenesisBlock() {
    return new Block(0, '0', new Date().toISOString(), 'Genesis Block', '0', 0);
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  mineBlock(data) {
    const previousBlock = this.getLastBlock();
    const index = previousBlock.index + 1;
    const timestamp = new Date().toISOString();
    let nonce = 0;
    let hash = this.calculateHash(index, previousBlock.hash, timestamp, data, nonce);

    while (hash.substring(0, this.difficulty) !== '0'.repeat(this.difficulty)) {
      nonce++;
      hash = this.calculateHash(index, previousBlock.hash, timestamp, data, nonce);
    }

    const newBlock = new Block(index, previousBlock.hash, timestamp, data, hash, nonce);
    this.chain.push(newBlock);
    return newBlock;
  }

  calculateHash(index, previousHash, timestamp, data, nonce) {
    return crypto
      .createHash('sha256')
      .update(index + previousHash + timestamp + data + nonce)
      .digest('hex');
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }

      const hash = this.calculateHash(
        currentBlock.index,
        currentBlock.previousHash,
        currentBlock.timestamp,
        currentBlock.data,
        currentBlock.nonce
      );

      if (hash.substring(0, this.difficulty) !== '0'.repeat(this.difficulty)) {
        return false;
      }
    }

    return true;
  }
}

// Example Usage
const myBlockchain = new Blockchain();

console.log('Mining block 1...');
myBlockchain.mineBlock('Transaction Data 1');

console.log('Mining block 2...');
myBlockchain.mineBlock('Transaction Data 2');

console.log('Mining block 3...');
myBlockchain.mineBlock('Transaction Data 3');

console.log('Blockchain:', JSON.stringify(myBlockchain, null, 2));

console.log('Is Blockchain Valid?', myBlockchain.isChainValid());
