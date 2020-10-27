var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});

const erc20abi = require('../abi/erc20-abi.js');

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


const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const dbjson=
'C:/g/skim/public/db2.json';
const adapter = new FileSync(dbjson)	
const db = low(adapter)


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
			addNewTokenArr(item.topics);
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

	//addToJsonFile0([]);

	setTimeout(() => {
		//console.log('updated');
		// process.exit();
		
		msg();

	}, 60*1000);
};

function getLastBlock(arrData){
	return new Promise(resolve => {

		

		fs.readFile('./logs/lastBlock.js', 'utf8', function (err,data) {
			if (err) {
				return console.log(err);
			}
			setTimeout(() => {resolve( Number( data));}, 1*1000 );
		});
	});
}

async function addNewTokenArr(array) {
	db.read()

	let isposts = db.has('tokens')
	.value();
	console.log(isposts)
  
	if(!isposts){
	  db.set('tokens', [])
	  .write()
	}else{
		
		for (let index = 0; index < array.length; index++) {
			const element = 
			 array[index].replace('0x000000000000000000000000','0x');

			var a1= await db.get('tokens')
			.find({ addressUniq: element })
		   .value()  
	   
			 if(!a1){
				console.log('add new')

				let nama = await getToken([element , 2]);
				console.log('nama', nama )

				let timestampId = new Date().valueOf();
				db.get('tokens')
				.push({ id: timestampId + '' + (index+1001) , 
					title: nama ,
					addressUniq : element ,
					inHits : 1 ,
					inputDt : getDateTime() ,
				})
				.write()	  

			 }else{

				let inHits2 = 1 ;
				if(a1.inHits){
					inHits2 = a1.inHits+1 ;
				}
				console.log('update',inHits2)

				db.get('tokens')
				.find({ addressUniq: element })
				.assign({ inHits: inHits2 })
				.write()

			 }
	   

			
		}

	}
}

function getDateTime(jamOnly='y') {
	var date = new Date();
	
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec  = date.getSeconds();
	sec = (sec < 10 ? "0" : "") + sec;

	if(jamOnly=='h' )return "" + hour + ":" + min + ":" + sec;
	
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    return year + ":" + month + ":" + day + " " + hour + ":" + min + ":" + sec;
}

async function getToken(arr){
	const token0Add = arr[0];
			
	const token0contract = await new web3.eth.Contract(
		erc20abi,
		token0Add
	);

	const name0 =  
		await token0contract.methods.name().call();
		return name0 
}

async function msg(){

  const b = await getLastBlock([]);
  console.log(b);

  //getPastLogs(factoryAddress, b + 1, 'latest');
  
}
msg();

//getPastLogs(factoryAddress, events[events.length - 1].blockNumber + 1, 'latest');
