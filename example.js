var web3 = require('web3');
var eth = web3.eth;
var fs = require('fs');
var path = require('path');
var repl = require('repl');

web3.setProvider(new web3.providers.HttpProvider('http://localhost:8101'));


function readSol(path) {
	return fs.readFileSync(path, 'utf-8').replace(/(\r\n|\n|\r)/gm," ");
}



var tokenSource = readSol('token.sol');
var tokenCompiled = web3.eth.compile.solidity(tokenSource);

var supply = 10000;
var tokenContract = web3.eth.contract(tokenCompiled.token.info.abiDefinition);
var token = tokenContract.new(
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

			}

		}
	})


var _voterShareAddress = token.address;
var _minimumQuorum = 2; // Minimum amount of voter tokens the proposal needs to pass
var _debatingPeriod = 0.1; // debating period, in minutes;


var daoSource = readSol('democracy.sol');
var daoCompiled = web3.eth.compile.solidity(daoSource);
var democracyContract = web3.eth.contract(daoCompiled.Democracy.info.abiDefinition);

var democracy = democracyContract.new(
	_voterShareAddress, 
	_minimumQuorum, 
	_debatingPeriod, 
	{
		from:web3.eth.accounts[0], 
		data:daoCompiled.Democracy.code, 
		gas: 3000000
	}, function(e, contract){
		if(!e) {

			if(!contract.address) {
				console.log("Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");

			} else {
				console.log("Democracy Contract mined! Address: " + contract.address);

				setTimeout(function() {
					console.log('LETS ROCK THIS TOWN');

					var event = democracy.ProposalAdded({}, '', function(error, result){
						if (!error)
							console.log("New Proposal #"+ result.args.proposalID +"!\n Send " + web3.fromWei(result.args.amount, "ether") + " ether to " + result.args.recipient.substring(2,8) + "... for " + result.args.description  )
					});
					var eventVote = democracy.Voted({}, '', function(error, result){
						if (!error)
							var opinion = "";
							if (result.args.position > 0) { 
										opinion = "in favor" 
									} else if (result.args.position < 0) { 
												opinion = "against" 
											} else { 
														opinion = "abstaining" 
													}

							console.log("Vote on Proposal #"+ result.args.proposalID +"!\n " + result.args.voter + " is " + opinion )
					});
					var eventTally = democracy.ProposalTallied({}, '', function(error, result){
						if (!error)
							var totalCount = "";
							if (result.args.result > 1) { 
										totalCount = "passed" 
									} else if (result.args.result < 1) { 
												totalCount = "rejected" 
											} else { 
														totalCount = "a tie" 
													}
							console.log("Votes counted on Proposal #"+ result.args.proposalID +"!\n With a total of " + Math.abs(result.args.result) + " out of " + result.args.quorum + ", proposal is " + totalCount + ". Proposal is " + (result.args.active? " still on the floor" : "archived") )
					});
					// 1. send some tokens to the burgerys of our town

					token.sendCoin.sendTransaction(eth.accounts[1], 1000, {from: eth.accounts[0]});
					token.sendCoin.sendTransaction(eth.accounts[2], 1000, {from: eth.accounts[0]});
					token.sendCoin.sendTransaction(eth.accounts[3], 1000, {from: eth.accounts[0]});


					// 2. create a proposal
					
					var recipient = eth.accounts[2];
					var amount = web3.toWei(10, "ether");
					var shortNote = "Blowjob";

					democracy.newProposal.sendTransaction(recipient, amount, '', shortNote, {
						from: eth.accounts[0],
						gas: 1000000
					});

					checkAllProposals();

					var proposalID = 0;
					var position = 1; // +1 for voting yea, -1 for voting nay, 0 abstains but counts as quorum
					democracy.vote.sendTransaction(proposalID, position, {from: eth.accounts[0], gas: 1000000});

					var proposalID = 0;
					var position = 1; // +1 for voting yea, -1 for voting nay, 0 abstains but counts as quorum
					democracy.vote.sendTransaction(proposalID, position, {from: eth.accounts[1], gas: 1000000});

					var proposalID = 1;
					democracy.executeProposal.sendTransaction(proposalID, {from: eth.accounts[0], gas: 1000000});

				}, 500);
			}

		}
	});





function checkAllProposals() {
    console.log("Country Balance: " + web3.fromWei( eth.getBalance(democracy.address), "ether") );
    for (i = 0; i< (Number(democracy.numProposals())); i++ ) { 
		        var p = democracy.proposals(i); 
		        var timeleft = Math.floor(((Math.floor(Date.now() / 1000)) - Number(p[4]) - Number(democracy.debatingPeriod()))/60);  
		        console.log("Proposal #" + i + " Send " + web3.fromWei( p[1], "ether") + " ether to address " + p[0].substring(2,6) + " for "+ p[3] + ".\t Deadline:"+ Math.abs(Math.floor(timeleft)) + (timeleft>0?" minutes ago ":" minutes left ") + (p[5]? " Active":" Archived") ); 
		    }
}



var local = repl.start({
  prompt: 'Tims repl> ',
  input: process.stdin,
  output: process.stdout
});

local.context.token = token;
local.context.eth = web3.eth;
local.context.web3 = web3;
local.context.democracy = democracy;
