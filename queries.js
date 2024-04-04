const { request, response } = require('express')

const Pool = require('pg').Pool

const fs = require('fs')

// psql -h database-1.cf4kmyk6aptl.us-east-2.rds.amazonaws.com -p 5432 -U postgres -d postgres

const pool = new Pool({
    user: 'postgres',
    host: "database-1.c1h1sdcooewq.us-east-1.rds.amazonaws.com",
    database: 'contacts',
    // password: 'gweDoYX8UhAuYajABciX',
    password: 'postgres',
    port: 5432,
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync('us-east-1 bundle.pem').toString()
    }
})

pool.connect((error, client, release) => {
    if (error) {
        console.error("error connecting to db", error);
    }
    console.log("connected to db")
})

const getContacts = (request, response) => {
    pool.query('SELECT * FROM people',
    (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const addContact = (req, res) => {
    try {
        const { name, email_address, age } =
        req.body;
        pool.query(
            `INSERT INTO people (name, email_address, age) VALUES ($1, $2, $3) RETURNING *` ,
            [name, email_address, age],
            (error, results) => {
                if (error) {
                    throw error
                }
                console.log('Contact added successfully')
                console.log(`Results are: ${results}`)
                res.status(201).json(results.rows[0])
            }
        )
    } catch (error) {   
        throw error   
    }
}

const updateContact = (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { name, email_address, age } = req.body;
        pool.query('UPDATE people SET name = $1, email_address = $2, age = $3 WHERE id = $4', 
        [name, email_address, age, id],
        (error) => {
            if (error) {
                throw error
            }
            res.status(200).send(`Contact changed with ID: ${id}`)
        })
    } catch (error) {
        throw error
    }
}

const deleteContact = (req, res) => {
    try {
        const id = parseInt(req.params.id);
        pool.query('DELETE FROM people WHERE id = $1', 
        [id],
        (error) => {
            if (error) {
                throw error
            }
            res.status(200).send(`Contact deleted with ID: ${id}`)
        })
    } catch (error) {
        throw error
    }
}

const getContactById = (req, res) => {
    try {
        const id = parseInt(req.params.id);
        pool.query('SELECT * FROM people WHERE id = $1',
        [id],
        (error, results) => {
            if (error) {
                throw error
            }
            res.status(200).json(results.rows)
        })
    } catch (error) {
        throw error
    }
}

module.exports = {
    getContacts,
    addContact,
    deleteContact,
    getContactById,
    updateContact
}