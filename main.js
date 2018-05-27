const Pusher = require('pusher-js');

const connection = require('./connection').start();

var pusher = new Pusher('de504dc5763aeef9ff52');

const pairsList = ['btc_usd', 'eth_usd', 'btc_eur'];

pairsList.forEach(function(pair,n){
	//channels subscription
	let channelName = 'live_trades';
	if(pair != 'btc_usd') {
		let pairSplit = pair.split("_");
		channelName = 'live_trades_'+pairSplit[0]+pairSplit[1];
	}
	var channel = pusher.subscribe(channelName);

	//Listening and storage
	channel.bind('trade', function(data){
		connection.query(`INSERT INTO transactions (pair ,amount, buy_order_id, sell_order_id, price, timestamp, type, id) VALUES ('${pair}', '${data.amount}', '${data.buy_order_id}', '${data.sell_order_id}', '${data.price}', '${data.timestamp}', '${data.type}', '${data.id}');`,
	    function (error, results, fields) {
			if (error) throw error;
	        else {
	            data.id_local = results.insertId;
				data.pair = pair;
	            console.log(data);
	        }
		});
	});
});

/*
var channel_btcusd = pusher.subscribe('live_trades');
var channel_ethusd = pusher.subscribe('live_trades_ethusd');

channel_btcusd.bind('trade', function(data){
	connection.query(`INSERT INTO btc_usd (pair ,amount, buy_order_id, sell_order_id, price, timestamp, type, id) VALUES ('btc_usd', '${data.amount}', '${data.buy_order_id}', '${data.sell_order_id}', '${data.price}', '${data.timestamp}', '${data.type}', '${data.id}');`,
    function (error, results, fields) {
		if (error) throw error;
        else {
            data.id_local = results.insertId;
			data.pair = 'btc_usd';
            console.log(data);
        }
	});
});

channel_ethusd.bind('trade', function(data){
	connection.query(`INSERT INTO btc_usd (pair, amount, buy_order_id, sell_order_id, price, timestamp, type, id) VALUES ('eth_usd', '${data.amount}', '${data.buy_order_id}', '${data.sell_order_id}', '${data.price}', '${data.timestamp}', '${data.type}', '${data.id}');`,
    function (error, results, fields) {
		if (error) throw error;
        else {
            data.id_local = results.insertId;
			data.pair = 'eth_usd';
            console.log(data);
        }
	});
});
*/
//connection.end();
