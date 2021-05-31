const fs = require('fs');
let student=JSON.parse(fs.readFileSync(
'C:/data2/secret3.txt'));
//console.log(student);
const projectId = student.projectId;

const sleepSecond=60*1;

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const dbjson='./public/db2.json';
const adapter = new FileSync(dbjson)	;
const db = low(adapter);

const erc20abi = require('../abi/erc20-abi.js');

const Web3 = require('web3');
const { promises } = require('dns');
//const web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/" + (projectId) + ""));
const factoryAddress = '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73';

const web3 = new Web3('https://bsc-dataseed1.binance.org:443');

let ignoreArr=[] ;
var index3 = ignoreArr.length ;
ignoreArr[index3++]=
'0x0d3648bd0f6ba80134a33ba9275ac585d9d315f0ad8355cddefde31afa28d0e9';
ignoreArr[index3++]=
'0x000000000000000000000000bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c';

//console.log(ignoreArr)
  
async function getToken(arr){	
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

	let name0='noname';
	try {
		name0 =  await token0contract.methods.name().call();		
	} catch (e) {		
	}	
	//console.log(arr);
	//console.log(name0);

	arr['title'] = 'P#' + name0 ;
	let wib = new Date();wib.setHours(wib.getHours() + (7) );
	arr['inputDt'] = wib.valueOf();
	arr['inputDt2'] = wib;	
	arr['inputDt3'] = new Date();
	arr['inputDtUnix'] = new Date().valueOf();

	//console.log(arr);
	var rv = {};
	Object.keys(arr).forEach(function (key) {
		rv[key] = arr[key];
		// do something with obj[key]
	});
	//console.log(rv);	

	db.read();

	var a1= await db.get('tokens')
	.find({ addressUniq: token0Add })
	.value()  ;

	if (!a1) {
		await db.get('tokens')
		.push( rv  )
		.write();
		console.log( token0Add , name0) ;
	}else{
		console.log('already',a1.addressUniq,a1.title);
	}

	return name0 ;
}

const getPastLogs = async (address, fromBlock, toBlock) => {
	let index2 = 0 ;
	let arr2=[] ;
	let latestBlock = 0 ;
					
	try {
		const response = await web3.eth.getPastLogs({
			fromBlock,
			toBlock,
			address
		});

		//const updatedEvents = [...events];

		console.log(response.length,'found new token' ) ;
		
		for (let el of response) {
			//console.log(el);
			el.topics.forEach(element => {
				if(ignoreArr.indexOf(element) !== -1){
					//console.log(1);				
				} else{
					let arr=[] ;
					latestBlock = el.blockNumber ;
					arr['addressUniq']=element.replace( '0x000000000000000000000000','0x');
					arr2[index2]=arr ;
				}
			});
			if (index2>=10) {
			  break;
			}
			index2++ ;
		  }
		  console.log('finish response');
		  
		 if (latestBlock !== 0) {
			fs.writeFile('./logs/lastBlock.js', 
			(latestBlock.toString()) , error => {
				if (error) {
					console.log(error);
				}
				console.log('writeFile' , latestBlock );
			});			 
		 } 	

	} catch (error) {
		console.log(error);
		console.log(projectId,'projectId');
	}

	return arr2 ;
};

//getPastLogs(factoryAddress, events[events.length - 1].blockNumber + 1, 'latest');

async function who(array) {
	//console.log(array)

	let length1 = array.length ;

	let e2 ;

	for (let index = 0; index < length1; index++) {
		const element = array[index];
		e2 = await getToken(element);
		//element.title = e2 ;
	}
	console.log('finish get name');

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

	//console.log('await getLastBlock');
	let lastBlock = await getLastBlock();
	//lastBlock = Number (lastBlock)
	//console.log(`${ lastBlock } `);
	console.log(lastBlock,'begin cek from <= this block to latest');

	let retval1 = await getPastLogs(factoryAddress, 
		(lastBlock+1)  , 
		'latest');

	// retval1 is array

	const a = await who(retval1);
	const b = await what();
	let d=[] ;
	d.what = b ;
	d.who = a ;
	const c = await where(d);
  
	//console.log(`${ a } ${ b } ${ c }`);
	console.log('');
	var t = new Date();
	t.setSeconds(t.getSeconds() + sleepSecond);
	t.setHours(t.getHours() + 7);
	console.log(t,'sleep ' ) ;
	setTimeout(() => {
		msg() ;	}, sleepSecond*1000 );

  }

async function msg2(params) {
	// params is object
	//console.log(params) ;

	let blockNumber1 = 0 ;
	let latest = -1;

	try {
		latest = await web3.eth.getBlockNumber() ;
		console.log(latest,'latest getBlockNumber') ;			
	} catch (er) {
		console.error(er);
		console.log(student.projectId,'web3 fail');		
	}

	let fromBlock = latest - 100 ; // 11188003	
	/**	
	let toBlock = 'latest'  ;
	let address = params.address1 ;
	//console.log(address)
	blockNumber1 = await web3.eth.getPastLogs({
		fromBlock,
		toBlock,
		address
	}, function(error, result){		
		if(!error){
		}
		else{
		}
	});	
	//let blockNumber2=blockNumber1[blockNumber1.length-1].blockNumber ;
	//console.log( blockNumber2 ,'' )
	 * 
	 */
	if (latest !== -1) {
		console.log( fromBlock ,'write this to lastBlock.js') ;
		fs.writeFile('./logs/lastBlock.js', 
		(fromBlock.toString()) , error => {
			if (error) {
				console.log(error);
			}
			msg();
		});			
	}

}
  
msg2({
	address1:factoryAddress,
}) ;
//msg(); // 🤡 lurks in the shadows <-- after 1 second

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
//  console.log(timeConverter(0));