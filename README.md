# blockchain
Here resides the ethereum blockchain part of our HackZurich Hack.

In `labelforce.sol` is the Ethereum Smart Contract, that then is deployed to the blockchain with the `web3` client of ethereum in the `index.js`.

You can run your own version of this with an installed `cpp-ethereum` and `go-ethereum`:

```sh
$ mkdir ~/ethtemp
$ geth --datadir="~/ethtemp" -verbosity 6 --ipcdisable --port 30302 --rpcport 8102 --networkid 73 --genesis ./genesisblock.json --maxpeers 0 --nodiscover --rpc --rpccorsdomain "*" console 2>>geth.log

-> Then in another tab or window:
node index.js

-> Have fun :)
```


## License
MIT
