const upxWallet = require('uplexa-nodejs')
global.config = require('./config.json')
const { log, error, warn } = require('./log')

let div = 100 // pow(10^2)
let node
let port

// uPlexa-nodejs bug workaround..
const upxQuotient = 10000000000

if (global.config.coinConfig.netType == 'mainnet') {
  node = global.config.nodes.mainnet.rpcHost
  port = global.config.nodes.mainnet.rpcPort
}

if (global.config.coinConfig.netType == 'testnet') {
  node = global.config.nodes.testnet.rpcHost
  port = global.config.nodes.testnet.rpcPort
}

const Wallet = new upxWallet(node, port)
const mergeOuts = global.config.coinConfig.mergeOuts
const adjustFee = global.config.coinConfig.adjustFee

//Initiate wallet before any functions, only open once.
void (async () => Wallet.open_wallet(global.config.coinConfig.walletName))()

const sweep = async (tx, options) => {
  try {
    // We are using sweepAll here.
    const res = await Wallet.sweep_all(tx, options)
    return res
  } catch (err) {
    error(err)
    return false
  }
}

const getBalance = async function(Wallet) {
  return await Wallet.balance().then(function(balance) {
    return balance
  })
}

const churnOuts = async function(Wallet) {
  const gotBalance = await getBalance(Wallet)
  const totalBalance = gotBalance.balance / div
  const perOutTransfer = (totalBalance / mergeOuts) - adjustFee
  const amountFormatted = Number(perOutTransfer / upxQuotient)

  let address = await Wallet.address()
  address = address.address

  const transaction = {
    amount: amountFormatted || {},
    address
  }

  const options = {
    mixin: 10,
    priority: 0,
  }

  // Check unlocked balance before each transfer
  let unlockedBalance = gotBalance.unlocked_balance / div
  if(unlockedBalance >= perOutTransfer) {
   const walletRes = await sweep(address)
   //const walletRes = 1
   if (walletRes.error || walletRes === false) {
     if (walletRes.error.code === -37) error('-37') //return -37
     error(walletRes.error)
    //return false
    } else { log(walletRes.tx_hash_list) }
    log('Sent ' + perOutTransfer + '. Unlocked balance: ' + unlockedBalance)
  } else {
    warn('Not enough unlocked balance.')
  }
}

const runApp = async function(Wallet) {
  for(i=1; i <= mergeOuts; i++){
    await churnOuts(Wallet)
  }
}

runApp(Wallet)

const second = 1
const minute = 60 * second
const hour = 60 * minute
const day = 24 * hour
const week = 7 * day
const month = 30 * day
const year = 365 * day
//setInterval(runApp, week, Wallet)
