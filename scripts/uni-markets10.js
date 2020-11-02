const sleepSecond=60*5

const fs = require('fs');

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const dbjson='./public/db2.json';
const adapter = new FileSync(dbjson)	
const db = low(adapter)

const erc20abi = require('../abi/erc20-abi.js');

const Web3 = require('web3');
const web3 = new Web3(
new Web3.providers.HttpProvider(
"https://mainnet.infura.io/v3/c6807416c10d4086977491f564e48de3"
));
const factoryAddress = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';

let ignoreArr=[]
var index3 = ignoreArr.length
ignoreArr[index3++]=
'0x0d3648bd0f6ba80134a33ba9275ac585d9d315f0ad8355cddefde31afa28d0e9'
ignoreArr[index3++]=
'0x000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'

//console.log(ignoreArr)

async function getToken(arr){
	//console.log(arr)
	
	let token0Add = arr['addressUniq'];
	/**
	 * 
	token0Add = token0Add.replace('0x000000000000000000000000','0x');
	 */

	//token0Add = '0x5feda2ee8bec482279c1b3b5c3c162d5eb259e13'
			
	const token0contract = await new web3.eth.Contract(
		erc20abi,
		token0Add
	);

	const name0 =  await token0contract.methods.name().call();
	//console.log(name0)
	arr['title'] =  name0
	arr['inputDt'] = new Date().valueOf();

	var rv = {};
	Object.keys(arr).forEach(function (key) {
		rv[key] = arr[key];
		// do something with obj[key]
	});

	db.read()

	var a1= await db.get('tokens')
	.find({ addressUniq: token0Add })
	.value()  

	if (!a1) {
		console.log(arr)		
		db.get('tokens')
		.push( rv  )
		.write()
	}else{
		console.log('already ' , arr.title )
	}

	return name0 
}

const getPastLogs = async (address, fromBlock, toBlock) => {
	let index2 = 0
	let arr2=[]
	let latestBlock = 0
					
	try {
		const response = await web3.eth.getPastLogs({
			fromBlock,
			toBlock,
			address
		});

		//const updatedEvents = [...events];

		console.log(response.length )
		for (let el of response) {
			//console.log(el);
			el.topics.forEach(element => {
				if(ignoreArr.indexOf(element) !== -1){
					//console.log(1);				
				} else{
					let arr=[]
					latestBlock = el.blockNumber
					//console.log(element);				
					//console.log(el.blockNumber);
					arr['addressUniq']=
					element.replace('0x000000000000000000000000','0x');

					//arr['blockNumber']=el.blockNumber
					//var name2 = getToken(arr)
					//console.log(name2);				
					arr2[index2]=arr
					//console.log( arr2[index2] );					
				}
			});
			if (index2>=3) {
			  break;
			}
			index2++
		  }
		  console.log(' ');
		  
		 if (latestBlock !== 0) {
			fs.writeFile('./logs/lastBlock.js', 
			(latestBlock) , error => {
				if (error) {
					console.log(error);
				}
			});			 
		 } 
	

		//response.forEach(item => {
			//updatedEvents.push(item);
			//console.log(`🦄 pair #${updatedEvents.length} deployed in block #${item.blockNumber}`);
			//console.log( item.blockNumber )
		//});

		//fs.writeFile('./logs/events.js', await `module.exports = ${JSON.stringify(updatedEvents)}`, error => {
		//	if (error) {
		//		console.log(error);
		//	}
		//});

	} catch (error) {
		console.log(error);
	}

	//setTimeout(() => {
	//	console.log('updated');
		//process.exit();
	//}, 2000);

	return arr2

};

//getPastLogs(factoryAddress, events[events.length - 1].blockNumber + 1, 'latest');

async function who(array) {
	//console.log(array)

	let length1 = array.length

	let e2

	for (let index = 0; index < length1; index++) {
		const element = array[index];
		//console.log(element[0])
		e2 = await getToken(
			element
		)
		element.title = e2
		//console.log(element)
	}

	return new Promise(resolve => {
	  setTimeout(() => {
		resolve(' joker ' + e2 );
	  }, 2);
	});
}
  
  function what(array) {
	return new Promise(resolve => {
	  setTimeout(() => {
		resolve('lurks');
	  }, 3);
	});
  }
  
  function where(array) {
	//console.log(array)
	return new Promise(resolve => {
	  setTimeout(() => {
		resolve('in the shadows');
	  }, 5);
	});
  }

function getLastBlock(){
	return new Promise(resolve => {		
		fs.readFile('./logs/lastBlock.js', 'utf8', 
		function (err,data) {
			if (err) {
				return console.log(err);
			}
			setTimeout(() => {resolve( Number( data));}, 1*2 );
		});
	});
}

  async function msg() {

	let lastBlock = await getLastBlock();
	//lastBlock = Number (lastBlock)
	//console.log(`${ lastBlock } `);

	let retval1 = await getPastLogs(factoryAddress, 
		(lastBlock+1)  , 
		'latest');

	const a = await who(retval1);
	const b = await what();
	let d=[]
	d.what = b
	d.who = a
	const c = await where(d);
  
	//console.log(`${ a } ${ b } ${ c }`);
	console.log('');
	var t = new Date();
	t.setSeconds(t.getSeconds() + sleepSecond);
	t.setHours(t.getHours() + 7);
	console.log('sleep ' , t )
	setTimeout(() => {
		msg()	}, sleepSecond*1000 );

  }
  
  msg(); // 🤡 lurks in the shadows <-- after 1 second

  function timeConverter(UNIX_timestamp){
	var a = new Date(UNIX_timestamp * 1000);
	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	var year = a.getFullYear();
	var month = months[a.getMonth()];
	var date = a.getDate();
	var hour = a.getHours();
	var min = a.getMinutes();
	var sec = a.getSeconds();
	var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
	return time;
  }
  console.log(timeConverter(0));