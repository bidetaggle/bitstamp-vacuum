var Pusher = require('pusher-js');
var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'bitstamp'
});

connection.connect();


var pusher = new Pusher('de504dc5763aeef9ff52');
var channel = pusher.subscribe('live_trades');
channel.bind('trade', function(data){
	console.log(data);
	connection.query(`INSERT INTO btc_usd (amount, buy_order_id, sell_order_id, price, timestamp, type, id) VALUES ('${data.amount}', '${data.buy_order_id}', '${data.sell_order_id}', '${data.price}', '${data.timestamp}', '${data.type}', '${data.id}');`,
    function (error, results, fields) {
		if (error) throw error;
        else {
            data.id_local = results.insertId;
            console.log(data);
        }
	});
});

//connection.end();
