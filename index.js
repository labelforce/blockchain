
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
}, function fail() {
	console.log('fail');
})


function compiled() {
	// lets do the shiat

	attachListeners(labelforce);

	// 1. send some tokens to the burgerys of our town

	token.sendCoin.sendTransaction(eth.accounts[1], 1000, {from: eth.accounts[0]});
	token.sendCoin.sendTransaction(eth.accounts[2], 1000, {from: eth.accounts[0]});
	token.sendCoin.sendTransaction(eth.accounts[3], 1000, {from: eth.accounts[0]});


	// 2. create a proposal
	
	var recipient = eth.accounts[2];
	var amount = web3.toWei(10, "ether");
	var shortNote = "Blowjob";

	labelforce.newProposal.sendTransaction(recipient, amount, '', shortNote, {
		from: eth.accounts[0],
		gas: 1000000
	});

	checkAllProposals();

	var proposalID = 0;
	var position = 1; // +1 for voting yea, -1 for voting nay, 0 abstains but counts as quorum
	labelforce.vote.sendTransaction(proposalID, position, {from: eth.accounts[0], gas: 1000000});

	var proposalID = 0;
	var position = 1; // +1 for voting yea, -1 for voting nay, 0 abstains but counts as quorum
	labelforce.vote.sendTransaction(proposalID, position, {from: eth.accounts[1], gas: 1000000});

	var proposalID = 1;
	labelforce.executeProposal.sendTransaction(proposalID, {from: eth.accounts[0], gas: 1000000});
	console.log('RUN FOREST RUN');
}

function startLabelforce() {

	var _voterShareAddress = token.address;
	var _minimumQuorum = 2; // Minimum amount of voter tokens the proposal needs to pass
	var _debatingPeriod = 0.1; // debating period, in minutes;


	var source = readSol('labelforce.sol');
	var compiled = web3.eth.compile.solidity(source);
	var contract = web3.eth.contract(compiled.LabelForce.info.abiDefinition);

	return new Promise(function(resolve, reject) {
		labelforce = contract.new(
			_voterShareAddress, 
			_minimumQuorum, 
			_debatingPeriod, 
			{
				from: web3.eth.accounts[0], 
				data: compiled.LabelForce.code, 
				gas: 3000000
			}, function(err, contract){
				if(!err) {

					if(!contract.address) {
						console.log("Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");

					} else {
						console.log("LabelForce Contract mined! Address: " + contract.address);

						setTimeout(function() {
							console.log('LETS ROCK THIS TOWN');

							resolve(contract);

						}, 500);
					}

				}
			});
	});
}

function attachListeners(labelforce) {

	labelforce.ProposalAdded({}, '', function(error, result){
		if (err) return console.log(err);

		console.log('proposal added', res);
	});

	labelforce.Voted({}, '', function(err, res){
		if (err) return console.log(err);

		console.log('voted', res);
	});

	labelforce.ProposalTallied({}, '', function(error, result){

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
