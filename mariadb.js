var mariadb = require('mariadb')

mariadb.createConnection({ // Open a new connection                                                                                                                                           
    user: 'sctuser',
    host: '172.30.124.102',
    password: "secret",
    database: "sct",
    port: 3306
})
    .then(conn => {
        conn.query('SELECT "Hello world!" as my_message') // Execute a query                                                                                                                                
            .then(result => { // Print the results                                                                                                                                            
                for (row of result) {
                    console.log(row)
                }
            })
            .then(conn.destroy()) // Close the connection                                                                                                                                     
    })