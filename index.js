
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
	try {


		attachListeners(labelforce);

		// 1. send some tokens to the burgerys of our town

		var from		= { from: eth.accounts[0] };
		var fromGas = { from: eth.accounts[0], gas: 100000000 };

		token.sendCoin.sendTransaction(eth.accounts[1], 1000, from);
		token.sendCoin.sendTransaction(eth.accounts[2], 1000, from);
		token.sendCoin.sendTransaction(eth.accounts[3], 1000, from);


		// 2. create a proposal

		console.log('executing "newImage"');
		var status = labelforce.newImage.sendTransaction(1, {
			from: eth.accounts[0],
			gas: 100000000
		});

		console.log(status);

		// img 1 is label 1
		status = labelforce.vote.sendTransaction(0, 1, true, fromGas);
		status = labelforce.vote.sendTransaction(0, 1, true, {from: eth.accounts[1], gas: 1000000});
		status = labelforce.vote.sendTransaction(0, 1, true, {from: eth.accounts[2], gas: 1000000});
		console.log(status);


		labelforce.checkImage.sendTransaction(0, fromGas);


		console.log('RUN FOREST RUN');
	} catch (e) {
		console.log(e.stack);
	}
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


var labelforceContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"_imageID","type":"uint256"}],"name":"checkImage","outputs":[{"name":"result","type":"int256"}],"type":"function"},{"constant":true,"inputs":[],"name":"numImages","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"minVotes","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"founder","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"_imageID","type":"uint256"}],"name":"newImage","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_imageID","type":"uint256"},{"name":"_label","type":"uint256"},{"name":"_is_label","type":"bool"}],"name":"vote","outputs":[{"name":"voteID","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"images","outputs":[{"name":"imgID","type":"uint256"},{"name":"creationDate","type":"uint256"},{"name":"active","type":"bool"}],"type":"function"},{"constant":true,"inputs":[],"name":"numLabels","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"voterShare","outputs":[{"name":"","type":"address"}],"type":"function"},{"inputs":[{"name":"_voterShareAddress","type":"address"},{"name":"_minVotes","type":"uint256"},{"name":"_numLabels","type":"uint256"}],"type":"constructor"},{"anonymous":false,"inputs":[],"name":"Yeo","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"imageID","type":"uint256"}],"name":"ImageAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"imageID","type":"uint256"}],"name":"NoImageAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"imageID","type":"uint256"},{"indexed":false,"name":"label","type":"uint256"},{"indexed":false,"name":"is_label","type":"bool"},{"indexed":false,"name":"voter","type":"address"}],"name":"Voted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"imageID","type":"uint256"},{"indexed":false,"name":"resultLabel","type":"uint256"},{"indexed":false,"name":"numPro","type":"uint256"},{"indexed":false,"name":"winners","type":"address[]"},{"indexed":false,"name":"loosers","type":"address[]"},{"indexed":false,"name":"active","type":"bool"}],"name":"ImageDone","type":"event"},{"anonymous":false,"inputs":[],"name":"ImageNotDone","type":"event"}]);
labelforce = labelforceContract.new(
   _voterShareAddress,
   _minVotes,
   _numLabels,
   {
	      from: web3.eth.accounts[0], 
	      data: '6060604052604051606080610fdc833981016040528080519060200190919080519060200190919080519060200190919050505b33600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555082600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550600360006000508190555060008211156100a857816000600050819055505b600a60066000508190555060008111156100c757806006600050819055505b600160026000600050540401600160005081905550600160016000505406600160005054036001600050819055505b505050610ed5806101076000396000f3606060405236156100a0576000357c010000000000000000000000000000000000000000000000000000000090048063110e6c84146100a257806328d936fe146100ce5780632e1a7d4d146100f15780633cc228fd146101095780634d853ee51461012c5780636293dfe9146101655780636a18ff7a1461017d57806384856482146101bb57806397303377146101f5578063fd46146a14610218576100a0565b005b6100b8600480803590602001909190505061097a565b6040518082815260200191505060405180910390f35b6100db60048050506102f3565b6040518082815260200191505060405180910390f35b6101076004808035906020019091905050610886565b005b6101166004805050610251565b6040518082815260200191505060405180910390f35b6101396004805050610280565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61017b6004808035906020019091905050610305565b005b6101a560048080359060200190919080359060200190919080359060200190919050506105bd565b6040518082815260200191505060405180910390f35b6101d160048080359060200190919050506102a6565b60405180848152602001838152602001828152602001935050505060405180910390f35b61020260048050506102fc565b6040518082815260200191505060405180910390f35b610225600480505061025a565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b60006000505481565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600460005081815481101561000257906000526020600020906006020160005b915090508060000160005054908060010160005054908060020160009054906101000a900460ff16905083565b60056000505481565b60066000505481565b600060007fc8d804293eb55ba63772e227c69fb45babbe873d0376c37695f833f331237d5a60405180905060405180910390a16000600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663bbd39ac033604051827c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1681526020019150506020604051808303816000876161da5a03f1156100025750505060405151111561057f576004600050805480919060010190908154818355818115116104e8576006028160060283600052602060002091820191016104e79190610420565b808211156104e3576000600082016000506000905560018201600050600090556002820160006101000a81549060ff021916905560038201600050805460008255600202906000526020600020908101906104d8919061047b565b808211156104d457600060008201600050600090556001820160006101000a81549060ff02191690556001820160016101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690555060010161047b565b5090565b5b5050600101610420565b5090565b5b5050509150600460005082815481101561000257906000526020600020906006020160005b50905082816000016000508190555042816001016000508190555060018160020160006101000a81548160ff021916908302179055507f2d97d9a9c8a811cafc5d871f1fda0a5458873d1d4e9d5be5fdeff87520ce9bb0836040518082815260200191505060405180910390a16105b7565b7fb3ae95da4c9323ae838f73ece7b6266d53c734c855cf716bc54066caa238545c836040518082815260200191505060405180910390a15b5b505050565b600060007fc8d804293eb55ba63772e227c69fb45babbe873d0376c37695f833f331237d5a60405180905060405180910390a1600a8411151561087d57600460005085815481101561000257906000526020600020906006020160005b50905060018160050160005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1614156106665761087e565b80600301600050805480919060010190908154818355818115116107015760020281600202836000526020600020918201910161070091906106a3565b808211156106fc57600060008201600050600090556001820160006101000a81549060ff02191690556001820160016101000a81549073ffffffffffffffffffffffffffffffffffffffff0219169055506001016106a3565b5090565b5b50505091508150606060405190810160405280858152602001848152602001338152602001508160030160005083815481101561000257906000526020600020906002020160005b506000820151816000016000505560208201518160010160006101000a81548160ff0219169083021790555060408201518160010160016101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555090505060018160050160005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083021790555060018160040160005060008681526020019081526020016000206000828282505401925050819055507f07678e29746e6a183bd25134bc8ca37ca2287f74ac964b896f86e16d8d4ba78785858533604051808581526020018481526020018381526020018273ffffffffffffffffffffffffffffffffffffffff16815260200194505050505060405180910390a15b5b509392505050565b6000600760005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505412806108f2575080600760005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054125b806108fd5750600081145b1561090757610977565b80600760005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505403925050819055503373ffffffffffffffffffffffffffffffffffffffff16600082604051809050600060405180830381858888f19350505050505b50565b600060006000600060006000600060006000600060046000508b815481101561000257906000526020600020906006020160005b5098506000995089508860020160009054906101000a900460ff1615610e9757600097505b60066000505488111515610e96576001600050548960040160005060008a815260200190815260200160002060005054101515610e8857600094505b8860030160005080549050851015610bfb578860030160005085815481101561000257906000526020600020906002020160005b509350600092508484600001600050541415610bed578360010160009054906101000a900460ff1615610b30578680548091906001019090815481835581811511610ac057818360005260206000209182019101610abf9190610aa1565b80821115610abb5760008181506000905550600101610aa1565b5090565b5b505050925082508360010160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff168784815481101561000257906000526020600020900160005b6101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550610bec565b8580548091906001019090815481835581811511610b8057818360005260206000209182019101610b7f9190610b61565b80821115610b7b5760008181506000905550600101610b61565b5090565b5b505050925082508360010160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff168684815481101561000257906000526020600020900160005b6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b5b5b8480600101955050610a0f565b6000945084505b8680549050851015610c93578685815481101561000257906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1691506064600760005060008473ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055505b8480600101955050610c02565b6000945084505b8580549050851015610d2b578585815481101561000257906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690506064600760005060008373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505403925050819055505b8480600101955050610c9a565b60019950895060008960020160006101000a81548160ff021916908302179055507fa851c6eaf76700db2b7343361c430bb45625e895efc309cca94dc55100aadc218b898b60040160005060008c8152602001908152602001600020600050548a8a60006040518087815260200186815260200185815260200180602001806020018481526020018381038352868181548152602001915080548015610e1057602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681526020019060010190808311610ddc575b50508381038252858181548152602001915080548015610e6f57602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681526020019060010190808311610e3b575b50509850505050505050505060405180910390a1610ec7565b5b87806001019850506109d3565b5b7fa83801d03bdab22cb89f7ae74ad38c5fc3d89c55380381b924dc99442dc8783d60405180905060405180910390a15b50505050505050505091905056', 
	      gas: 100000000
	    }, function(e, contract){
			    if (typeof contract.address != 'undefined') {
						resolve();
					         console.log(e, contract);
					         console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
					    }
			 })
	});



}

function attachListeners(labelforce) {

	console.log('attaching listeners');


	labelforce.ImageAdded({}, '', function(err, res){
		if (err) return console.log(err);

		console.log('image added', res);
	});

	labelforce.NoImageAdded({}, '', function(err, res){
		if (err) return console.log(err);

		console.log('no image added', res);
	});

	labelforce.Voted({}, '', function(err, res){
		if (err) return console.log(err);

		console.log('voted', res);
	});

	labelforce.ImageDone({}, '', function(err, res){

		if (err) return console.log(err);

		console.log('tally tally ;)', res);
	});

	labelforce.ImageNotDone({}, '', function(err, res) {

		if (err) return console.log(err);

		console.log('image not done', res);
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
