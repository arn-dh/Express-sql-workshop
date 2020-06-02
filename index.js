const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT;
const connection = require('./conf');
require('dotenv').config();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

//GET - Retrieve all of the data from your table
app.get('/api/', (request, response) => {
    connection.query('SELECT * FROM mylogbook', (err, results) => {
        if(err) {
            response.status(500).send('Internal Servor Error')
        } 
        response.json(results)
    })
});

//GET - Retrieve specific fields (i.e. id, names, dates, etc.)
app.get('/api/jumps', (request, response) => {
    const query = request.query;
    let sql = 'SELECT * FROM mylogbook WHERE ';
    let sqlValues = [];

    Object.keys(query).map((key, index) => {
        if (index === Object.keys(query).length -1) {
            sql += `${key} = ?`
        } else {
            sql += `${key} = ? AND `
        }
        sqlValues.push(query[key])
    });
    connection.query(sql, sqlValues, (err, results) => {
        if (err) {
            response.status(500).send('Internal Servor Error')
        } else {
            if(!results.length) {
                response.status(200).send(`No jump corresponding for ${sqlValues}`)
            }
            response.json(results)
        }
    })
});

//GET - Retrieve a data set with the following filters (use one route per filter type):
//A filter for data that contains... (e.g. name containing the string 'wcs')
app.get('/api/jumps/rio', (req, res) => {
    connection.query('SELECT * FROM mylogbook WHERE jump_location LIKE "%rio%"', (err, results) => {
        if (err) {
        res.status(500).send(`An error occurred: ${err.message}`);
        } else {
        res.json(results);
        }
    });
});
//A filter for data that starts with... (e.g. name beginning with 'campus')
app.get('/api/jumps/french-jumps', (req, res) => {
    connection.query('SELECT * FROM mylogbook WHERE country LIKE "F%"', (err, results) => {
        if (err) {
        res.status(500).send(`An error occurred: ${err.message}`);
        } else {
        res.json(results);
        }
    });
});

//A filter for data that is greater than... (e.g. date greater than 18/10/2010)
app.get('/api/jumps/high-jumps', (req, res) => {
    connection.query('SELECT * FROM mylogbook WHERE jump_height >= "200"', (err, results) => {
        if (err) {
            res.status(500).send(`An error occurred: ${err.message}`);
        } else {
            res.json(results);
        }
    });
});
//GET - Ordered data recovery (i.e. ascending, descending) - The order should be passed as a route parameter
app.get('/api/jumps/latest', (req, res) => {
    connection.query('SELECT * FROM mylogbook ORDER BY jump_date desc', (err, results) => {
        if (err) {
        res.status(500).send(`An error occurred: ${err.message}`);
        } else {
        res.json(results);
        }
    });
});
//POST - Insertion of a new entity
app.post('/api/jumps/', (req, res) => {

    const newJump = req.body;
    
    connection.query('INSERT INTO mylogbook SET ?', newJump, (err, results) => {
    
        if (err) {
        console.log(err);
        res.status(500).send("Error saving the jump");
        } else {
            res.status(200).send("Jumped Successfully added");        
        }
    });
});

//PUT - Modification of an entity
app.put('/api/jumps/:id', (req, res) => {

    const idJump = req.params.id;
    const formJump = req.body;

    console.log(formJump, idJump)
    
    connection.query('UPDATE mylogbook SET ? WHERE id = ?', [formJump, idJump], (err, results) => {
        if (err) {
            res.status(500).send("Error editing the jump");
        } else {
            res.status(200).send("Jumped Successfully modified");        
        }
    });
});
//PUT - Toggle a Boolean value
app.put('/api/jumps/gotbusted/:id', (req, res) => {

    const idJump = req.params.id;
    
    connection.query('UPDATE mylogbook SET got_busted = !got_busted WHERE id = ?', idJump, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error changing busted_status");
        } else {
            res.status(200).send("Busted_status Successfully modified");        
        }
    });
});

//DELETE - Delete an entity
app.delete("/api/jumps/:id", (req, res) => {
    
    const idJump = req.params.id;
    
    connection.query(
        "DELETE FROM mylogbook WHERE id = ?",
        [idJump],
        (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send("😱 Error deleting the jump");
        } else {
            res.status(200).send("🎉 Jump deleted from logbook!");
    
    
        }
        }
    );
});
//DELETE - Delete all entities where boolean value is false
app.delete("/api/jumps/", (req, res) => {

    
    connection.query(
        "DELETE FROM mylogbook WHERE got_busted = 0",
        (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send("😱 Error deleting the jump");
        } else {
            res.status(200).send("🎉 Jump deleted from logbook!");
    
    
        }
        }
    );
});

app.listen(process.env.PORT, (err) => {
    if(err) {
        console.log(err)
    } else {
        console.log(`The app is running at ${process.env.PORT}`)
    }
})