//Import Express
import express from 'express';
import mariadb from 'mariadb';
// import function from the file
import { validateForm } from './services/validation.js';

import dotenv from 'dotenv';
dotenv.config();

// Make a pool of connections that you can go in and grab
const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// Dont know when we're gonna finish connecting
// await waits for you to get connected. pauses
async function connect() {
    try {
        const conn = await pool.getConnection();
        console.log('Connected to the database!')
        return conn;
    } catch (err) {
        console.log(`Error connecting to the database: ${err}`)
    }
}

//Instantiate an Express application
const app = express();

//Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Set the view engine for our application
app.set('view engine', 'ejs');

//Serve static files from the 'public' directory
app.use(express.static('public'));

//Define a port number for our server to listen on
const PORT = process.env.APP_PORT || 3000;

//Define a "default" route for our home page
app.get('/', (req, res) => {

    // Send our home page as a response to the client
    res.render('home');
});

//Define an array to store pizza orders
//const orders = [];

//Define a "thank you" route
app.post('/thankyou', async (req, res) => {
    //console.log(req.body);
    const order = {
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        method: req.body.method,
        toppings: req.body.toppings,
        size: req.body.size
    };

    const result = validateForm(order);
    if (!result.isValid)
    {
        console.log(result.errors);
        res.send(result.errors);
        return;
    }

    //Add the order to our array: test as you go
    //orders.push(order);
    //console.log(orders);

    // Connect to the database
    const conn = await connect();

    // Convert toppings to a string
    if (order.toppings)
    {
        if (Array.isArray(order.toppings))
        {
            order.toppings = order.toppings.join(", ");
        }
    } else 
    {
        order.toppings = "";
    }

    // Add the order to our database
    const insertQuery = await conn.query(`INSERT INTO orders (firstName, lastName, email, method, toppings, size)  
        VALUES (?, ?, ?, ?, ?, ?)`,
        [order.fname, order.lname, order.email, order.method, order.toppings, order.size]);

    // Send our thank you page
    res.render('thankyou', { order });
});

// if await is red underlined, add async to function
app.get('/admin', async(req, res) => { // any route name can render any view name. dont have to be the same.
    
    const conn = await connect(); // now we're expecting a connection return

    const orders = await conn.query('SELECT * FROM orders;')

    console.log(orders);
    
    res.render('order-summary', { orders });
});

//Tell the server to listen on our specified port
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

