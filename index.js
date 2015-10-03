
var web3 = require('web3');
var eth = web3.eth;
var fs = require('fs');
var path = require('path');
var repl = require('repl');
var Q = require('q');

web3.setProvider(new web3.providers.HttpProvider('http://localhost:8101'));


function readSol(path) {
	return fs.readFileSync(path, 'utf-8').replace(/(\r\n|\n|\r)/gm," ");
}

var token = null;
var labelforce = null;

Q.all([startToken(), startLabelforce()])
.then(function success(res) {
	console.log(res);
	console.log('WHOOPPYYYY');
	compiled();
}, function fail() {
	console.log('fail');
})


function compiled() {
	// lets do the shiat

	console.log('running compiled()');

	attachListeners(labelforce);

	// 1. send some tokens to the burgerys of our town

	var from		= { from: eth.accounts[0] };
	var fromGas = { from: eth.accounts[0], gas: 100000000 };

	//token.sendCoin.sendTransaction(eth.accounts[1], 1000, from);
	//token.sendCoin.sendTransaction(eth.accounts[2], 1000, from);
	//token.sendCoin.sendTransaction(eth.accounts[3], 1000, from);


	// 2. create a proposal

	console.log('executing "newImage"');
	var status = labelforce.newImage.sendTransaction(1, {
		from: eth.accounts[0],
		gas: 100000000
	});

	console.log(status);

	// img 1 is label 1
	status = labelforce.vote.sendTransaction(1, 1, true, fromGas);
	console.log(status);


	labelforce.checkImage.sendTransaction(1, fromGas);


	console.log('RUN FOREST RUN');
}

function startLabelforce() {



	//var source = readSol('labelforce.sol');
	//var compiled = web3.eth.compile.solidity(source);
	//var compiled = fs.readFileSync('./labelforce.sol', 'utf-8');
	//var contract = web3.eth.contract(compiled.LabelForce.info.abiDefinition);

	var _voterShareAddress = token.address;
	var _minVotes = 3;
	var _numLabels = 10;

	return new Promise(function(resolve, reject) {
		//labelforce = contract.new(
			//_voterShareAddress, 
			//_minVotes,
			//_numLabels,
			//{
				//from: web3.eth.accounts[0], 
				//data: compiled, 
				//gas: 3000000
			//}, function(err, contract){
				//if(!err) {

					//if(!contract.address) {
						//console.log("Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");

					//} else {
						//console.log("LabelForce Contract mined! Address: " + contract.address);

						//setTimeout(function() {
							//console.log('LETS ROCK THIS TOWN');

							//resolve(contract);

						//}, 500);
					//}

				//}
			//});


var labelforceContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"_imageID","type":"uint256"}],"name":"checkImage","outputs":[{"name":"result","type":"int256"}],"type":"function"},{"constant":true,"inputs":[],"name":"numImages","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"minVotes","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"founder","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"_imageID","type":"uint256"}],"name":"newImage","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_imageID","type":"uint256"},{"name":"_label","type":"uint256"},{"name":"_is_label","type":"bool"}],"name":"vote","outputs":[{"name":"voteID","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"images","outputs":[{"name":"imgID","type":"uint256"},{"name":"numPro","type":"uint256"},{"name":"numCon","type":"uint256"},{"name":"creationDate","type":"uint256"},{"name":"active","type":"bool"}],"type":"function"},{"constant":true,"inputs":[],"name":"numLabels","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"voterShare","outputs":[{"name":"","type":"address"}],"type":"function"},{"inputs":[{"name":"_voterShareAddress","type":"address"},{"name":"_minVotes","type":"uint256"},{"name":"_numLabels","type":"uint256"}],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"imageID","type":"uint256"}],"name":"ImageAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"imageID","type":"uint256"}],"name":"NoImageAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"imageID","type":"uint256"},{"indexed":false,"name":"label","type":"uint256"},{"indexed":false,"name":"is_label","type":"bool"},{"indexed":false,"name":"voter","type":"address"}],"name":"Voted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"imageID","type":"uint256"},{"indexed":false,"name":"resultLabel","type":"uint256"},{"indexed":false,"name":"numPro","type":"uint256"},{"indexed":false,"name":"winners","type":"address[]"},{"indexed":false,"name":"loosers","type":"address[]"},{"indexed":false,"name":"active","type":"bool"}],"name":"ImageDone","type":"event"}]);
labelforce = labelforceContract.new(
   _voterShareAddress,
   _minVotes,
   _numLabels,
   {
     from: web3.eth.accounts[0], 
     data: '6060604052604051606080610f08833981016040528080519060200190919080519060200190919080519060200190919050505b33600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555082600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550600360006000508190555060008211156100a857816000600050819055505b600a60066000508190555060008111156100c757806006600050819055505b600160026000600050540401600160005081905550600160016000505406600160005054036001600050819055505b505050610e01806101076000396000f3606060405236156100a0576000357c010000000000000000000000000000000000000000000000000000000090048063110e6c84146100a257806328d936fe146100ce5780632e1a7d4d146100f15780633cc228fd146101095780634d853ee51461012c5780636293dfe9146101655780636a18ff7a1461017d57806384856482146101bb5780639730337714610203578063fd46146a14610226576100a0565b005b6100b8600480803590602001909190505061058b565b6040518082815260200191505060405180910390f35b6100db6004805050610582565b6040518082815260200191505060405180910390f35b610107600480803590602001909190505061025f565b005b6101166004805050610353565b6040518082815260200191505060405180910390f35b61013960048050506104fd565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61017b600480803590602001909190505061038b565b005b6101a56004808035906020019091908035906020019091908035906020019091905050610ab7565b6040518082815260200191505060405180910390f35b6101d16004808035906020019091905050610523565b604051808681526020018581526020018481526020018381526020018281526020019550505050505060405180910390f35b6102106004805050610382565b6040518082815260200191505060405180910390f35b610233600480505061035c565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6000600760005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505412806102cb575080600760005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054125b806102d65750600081145b156102e057610350565b80600760005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505403925050819055503373ffffffffffffffffffffffffffffffffffffffff16600082604051809050600060405180830381858888f19350505050505b50565b60006000505481565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60066000505481565b60006000600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663bbd39ac033604051827c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1681526020019150506020604051808303816000876161da5a03f115610002575050506040515111156104c057600460005082815481101561000257906000526020600020906008020160005b50905042816003016000508190555060018160040160006101000a81548160ff021916908302179055507f2d97d9a9c8a811cafc5d871f1fda0a5458873d1d4e9d5be5fdeff87520ce9bb0826040518082815260200191505060405180910390a16104f8565b7fb3ae95da4c9323ae838f73ece7b6266d53c734c855cf716bc54066caa238545c826040518082815260200191505060405180910390a15b5b5050565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600460005081815481101561000257906000526020600020906008020160005b915090508060000160005054908060010160005054908060020160005054908060030160005054908060040160009054906101000a900460ff16905085565b60056000505481565b600060006000600060006000600060006000600060046000508b815481101561000257906000526020600020906008020160005b5098506000995089508860040160009054906101000a900460ff1615610aa857600097505b60066000505488111515610aa7576001600050548960060160005060008a815260200190815260200160002060005054101515610a9957600094505b886005016000508054905085101561080c578860050160005085815481101561000257906000526020600020906002020160005b5093506000925084846000016000505414156107fe578360010160009054906101000a900460ff16156107415786805480919060010190908154818355818115116106d1578183600052602060002091820191016106d091906106b2565b808211156106cc57600081815060009055506001016106b2565b5090565b5b505050925082508360010160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff168784815481101561000257906000526020600020900160005b6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055506107fd565b8580548091906001019090815481835581811511610791578183600052602060002091820191016107909190610772565b8082111561078c5760008181506000905550600101610772565b5090565b5b505050925082508360010160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff168684815481101561000257906000526020600020900160005b6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b5b5b8480600101955050610620565b6000945084505b86805490508510156108a4578685815481101561000257906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1691506064600760005060008473ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055505b8480600101955050610813565b6000945084505b858054905085101561093c578585815481101561000257906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690506064600760005060008373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505403925050819055505b84806001019550506108ab565b60019950895060008960040160006101000a81548160ff021916908302179055507fa851c6eaf76700db2b7343361c430bb45625e895efc309cca94dc55100aadc218b898b60060160005060008c8152602001908152602001600020600050548a8a60006040518087815260200186815260200185815260200180602001806020018481526020018381038352868181548152602001915080548015610a2157602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16815260200190600101908083116109ed575b50508381038252858181548152602001915080548015610a8057602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681526020019060010190808311610a4c575b50509850505050505050505060405180910390a1610aa9565b5b87806001019850506105e4565b5b5b505050505050505050919050565b600060006000600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663bbd39ac033604051827c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1681526020019150506020604051808303816000876161da5a03f1156100025750505060405151118015610b705750600a8411155b15610df857600460005085815481101561000257906000526020600020906008020160005b50905060018160070160005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161415610be157610df9565b8060050160005080548091906001019090815481835581811511610c7c57600202816002028360005260206000209182019101610c7b9190610c1e565b80821115610c7757600060008201600050600090556001820160006101000a81549060ff02191690556001820160016101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905550600101610c1e565b5090565b5b50505091508150606060405190810160405280858152602001848152602001338152602001508160050160005083815481101561000257906000526020600020906002020160005b506000820151816000016000505560208201518160010160006101000a81548160ff0219169083021790555060408201518160010160016101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555090505060018160070160005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083021790555060018160060160005060008681526020019081526020016000206000828282505401925050819055507f07678e29746e6a183bd25134bc8ca37ca2287f74ac964b896f86e16d8d4ba78785858533604051808581526020018481526020018381526020018273ffffffffffffffffffffffffffffffffffffffff16815260200194505050505060405180910390a15b5b50939250505056', 
     gas: 1000000000
   }, function(e, contract){

		 console.log(e, contract);
    if (typeof contract.address != 'undefined') {
			resolve(contract);
      console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
    
			
		}
 })



	});



}

function attachListeners(labelforce) {

	console.log('attaching listeners');



	labelforce.ImageAdded({}, '', function(error, result){
		if (err) return console.log(err);

		console.log('image added', res);
	});

	labelforce.NoImageAdded({}, '', function(error, result){
		if (err) return console.log(err);

		console.log('no image added', res);
	});

	labelforce.Voted({}, '', function(err, res){
		if (err) return console.log(err);

		console.log('voted', res);
	});

	labelforce.ImageDone({}, '', function(error, result){

		if (err) return console.log(err);

		console.log('tally tally ;)', res);
	});
}


function checkAllProposals() {
    console.log("Country Balance: " + web3.fromWei( eth.getBalance(labelforce.address), "ether") );
    for (i = 0; i< (Number(labelforce.numProposals())); i++ ) { 
		        var p = labelforce.proposals(i); 
		        var timeleft = Math.floor(((Math.floor(Date.now() / 1000)) - Number(p[4]) - Number(labelforce.debatingPeriod()))/60);  
		        console.log("Proposal #" + i + " Send " + web3.fromWei( p[1], "ether") + " ether to address " + p[0].substring(2,6) + " for "+ p[3] + ".\t Deadline:"+ Math.abs(Math.floor(timeleft)) + (timeleft>0?" minutes ago ":" minutes left ") + (p[5]? " Active":" Archived") ); 
		    }
}

function startToken() {

	var tokenSource = readSol('token.sol');
	var tokenCompiled = web3.eth.compile.solidity(tokenSource);

	var supply = 10000;
	var tokenContract = web3.eth.contract(tokenCompiled.token.info.abiDefinition);

	return new Promise(function(resolve, reject) {
		
		token = tokenContract.new(
			supply,
			{
				from:web3.eth.accounts[0], 
				data:tokenCompiled.token.code, 
				gas: 1000000
			}, function(e, contract){
				if(!e) {

					if(!contract.address) {
						console.log("Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");

					} else {
						console.log("Token Contract mined! Address: " + contract.address);
						console.log(token.coinBalanceOf(web3.eth.accounts[0]) + " tokens");
						resolve(contract);

					}

				}
			});
	});
}

var local = repl.start({
  prompt: 'Tims repl> ',
  input: process.stdin,
  output: process.stdout
});

local.context.token = token;
local.context.eth = web3.eth;
local.context.web3 = web3;
local.context.labelforce = labelforce;
