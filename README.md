# uPlexa Churn App

This script, will sweep a multitude of smaller outputs into larger outputs in-order to allow larger TX's (withdraws) from the Graviex exchange (or other systems).

This is a churning script and is not advised for absolute privacy. This is only
to effectively merge smaller outputs to make larger amounts spendable for service-based wallets in which require larger amounts of uPlexa to be sent in one singular transaction (for tracking purposes). 


# Notes:
We will be using the SWEEP_ALL function of the uPlexa wallet unlike master branch where we use transfer_split.
This should only be used when withdraws become a problem over specific amounts.

# How it works:
* Checks balance of wallet
* Takes balance, divides by X (X being the amount of outgoing TX's you need to be able to handle per 20 minutes) - default: 32
* Runs a transfer_split of ```balance / X - Y``` (Y = to assume for fees) (runs: X amount of times)



# How to setup & run
* Edit ```config.demo.json``` and move it to ```config.json```:
```vi config.demo.json```
```mv config.demo.json config.json```

Next, you will need to run the RPC wallet in ~/bin. This is statically compiled and should work on most *nix environments. However, if not, you may have to compile your own:
https://github.com/uplexa/uplexa

The command for ```uplexa-wallet-rpc```:
```
./bin/uplexa-wallet-rpc --daemon-address remote.uplexa.com:21061 --wallet-dir wallets --rpc-bind-port 21065 --disable-rpc-login
```

Now, at the bottom of app.js you may configure this to run indefinitely with a loop of X hours/days/weeks/months. Or, (default) to just run this script once


# Final notes
This application is a simple solution for services in which receive a high volume of small outputs to their wallets whom are looking to send large TX's. This should only be ran when withdraws over a particular amount becomes problematic. This should not be ran weekly.

After running this script, withdraws/sending TX's may not work for ~20 minutes as all balance is lockedfor 20 minutes. TO avoid a withdraw downtime of 20 minutes, you could set the ```adjustFee``` to something higher so whatever adjustFee*mergeOuts is, will be the wallets unlocked balance after the script runs (minus TX fees)
