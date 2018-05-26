var mysql = require('mysql');

module.exports = {
    start: function(){
        return mysql.createConnection({
            host     : 'localhost',
            user     : 'root',
            password : 'root',
            database : 'bitstamp'
        });
    }
}
