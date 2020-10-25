const Web3 = require('web3');
const fs = require('fs');
const events = require('../logs/eventsTpl.js');
const { promises } = require('dns');
/**
const web3 = new Web3('ws://localhost:8546'); */
const web3 = new Web3(
new Web3.providers.HttpProvider(
"https://mainnet.infura.io/v3/c6807416c10d4086977491f564e48de3"
));

const factoryAddress = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';

const getPastLogs = async (address, fromBlock, toBlock) => {
	//console.log(fromBlock)
	
	try {
		const response = await web3.eth.getPastLogs({
			fromBlock,
			toBlock,
			address
		});

		const updatedEvents = [...events];
		let latestBlock = 0 ; // let bisa dirubah nanti

		//console.log('step 1')

		response.forEach(item => {
			updatedEvents.push(item);
			console.log(`🦄 pair #${updatedEvents.length} deployed in block #${item.blockNumber}`);
			latestBlock = item.blockNumber ; 
		});

		if(latestBlock!==0){
			console.log(latestBlock)

		fs.writeFile('./logs/events' + latestBlock + '.js', await `module.exports = ${JSON.stringify(updatedEvents)}`, error => {
			if (error) {
				console.log(error);
			}
		});

		fs.writeFile('./logs/lastBlock.js', latestBlock , error => {
			if (error) {
				console.log(error);
			}
		});
		
			console.log('updated')
			
		} else {
			console.log('tidak ada token baru')			
		}


	} catch (error) {
		console.log(error);
	}

	console.log('npm run update \r\n')

	setTimeout(() => {
		//console.log('updated');
		// process.exit();
		
		msg();

	}, 5*1000);
};

function getLastBlock(arrData) {
	return new Promise(resolve => {		
		fs.readFile('./logs/lastBlock.js', 'utf8', function (err,data) {
			if (err) {
				return console.log(err);
			}
			setTimeout(() => {resolve( Number( data));}, 3*1000 );
		});
	});
}

async function msg() {
  const b = await getLastBlock([]);

  console.log(b);

  getPastLogs(factoryAddress, b + 1, 'latest');
  
}
msg();

//getPastLogs(factoryAddress, events[events.length - 1].blockNumber + 1, 'latest');
