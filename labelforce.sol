
contract token { mapping (address => uint) public coinBalanceOf;   function token() { }   function sendCoin(address receiver, uint amount) returns(bool sufficient) {  } }


contract LabelForce {

    uint public minVotes;
	uint private minMajority;
    token public voterShare;
    address public founder;
    Image[] public images;
    uint public numImages;
	uint public numLabels;

	mapping (address => int) balances;
	

		event Yeo();
    event ImageAdded(uint imageID);
    event NoImageAdded(uint imageID);
    event Voted(uint imageID, uint label, bool is_label, address voter);
    event ImageDone(uint imageID, uint resultLabel, uint numPro, address[] winners, address[] loosers, bool active);
		event ImageNotDone();

    struct Image {
				uint imgID;
        uint creationDate;
        bool active;
        Vote[] votes;
				mapping (uint => uint) labels;
        mapping (address => bool) voted;
    }

    struct Vote {
        uint label;
				bool is_label;
        address voter;
    }

    function LabelForce(token _voterShareAddress, uint _minVotes, uint _numLabels) {
        founder = msg.sender;  
        voterShare = token(_voterShareAddress);

				minVotes = 3;
				if (_minVotes > 0) minVotes = _minVotes;

				numLabels = 10;
				if (_numLabels > 0) numLabels = _numLabels;
	
				minMajority = (minVotes / 2) + 1;
				
				// Math.floor
				minMajority = minMajority - (minMajority % 1);

    }


    function newImage(uint _imageID) {
				Yeo();
        if (voterShare.coinBalanceOf(msg.sender)>0) {
					uint index = images.length++;
					Image img = images[index];
					img.imgID = _imageID;
					img.creationDate = now;
					img.active = true;
					ImageAdded(_imageID);
        } else {
					NoImageAdded(_imageID);
				}
    }

    function vote(uint _imageID, uint _label, bool _is_label) returns (uint voteID){
			Yeo();

			if (_label <= 10) {

				Image img = images[_imageID];

				// if user already voted, return
				if (img.voted[msg.sender] == true) return;

				voteID = img.votes.length++;

				img.votes[voteID] = Vote({label: _label, is_label: _is_label, voter: msg.sender});
				img.voted[msg.sender] = true;

				img.labels[_label] += 1;

				// fire event
				Voted(_imageID, _label, _is_label, msg.sender);

			}

    }


		function withdraw(uint amount) {
        // Skip if someone tries to withdraw 0 or if they don't have enough Ether to make the withdrawal.

        if (balances[msg.sender] < 0 || balances[msg.sender] < int(amount) || amount == 0) {
          return;
				}

        balances[msg.sender] -= int(amount);
        msg.sender.send(amount);
    }

    function checkImage(uint _imageID) returns (int result) {
				Image img = images[_imageID];


				result = 0;

        if (img.active){   
					for (uint i = 0; i <= numLabels; i++) {
						if (img.labels[i] >= minMajority) {

							// this is the winning label. let's get the winners and loosers

							address[] _winners;
							address[] _loosers;

							for (uint j = 0; j < img.votes.length; j++) {
								
								Vote v = img.votes[j];
                                uint index = 0;

								if (v.label == j) {
									if (v.is_label) {
										index = _winners.length++;
										_winners[index] = v.voter;
									} else {
										index = _loosers.length++;
										_loosers[index] = v.voter;
									}
								}

							}

							// reward / penalty

							for (j = 0; j < _winners.length; j++) {
								address winner = _winners[j];

								balances[winner] += 100;
							}


							for (j = 0; j < _loosers.length; j++) {
							
								address looser = _loosers[j];

								balances[looser] -= 100;
							}

							result = 1;
							img.active = false;


							// event ImageDone(uint imageID, uint resultLabel, uint numPro, address[] winners, address[] loosers, bool active);

							ImageDone(_imageID, i, img.labels[i], _winners, _loosers, false);
							return;
							
						}
					}
        }
			ImageNotDone();
    }
}

