const express = require('express');
const router = express.Router();
const pool = require('../database');
// IMPORTS 


// ----------------------------- ROUTE FOR ADDING MOVES  --------------------

// HTTP METHOD "GET" FOR GETTING THE FORM
router.get('/add', (req, res)=>{
    res.render('moves/add');
});

// HTTP METHOD "POST" FOR SENDING THE USER DATA TO DATABASE
router.post('/add', async (req, res) => {

// GETTING THE DATA FROM THE FORM (JSON)
    const { concepto, monto, fecha, tipo} = req.body; 
    const newMove = {
        concepto,
        monto,
        fecha,
        tipo
    };

    // QUERY FOR ADD A NEW MONEY MOVEMENT
    
    await pool.query('INSERT INTO moves set ?', [newMove]);

    // UPDATING THE CURRENT USER BALANCE AFTER ADDING A NEW MOVEMENT

    // (GETTING THE NEW MOVE DATA AND UPDATING THE CURRENT USER BALANCE)
    let tipoOperacion = newMove.tipo;

    let numeroMonto = parseInt(newMove.monto);

    let nuevoSaldo = await pool.query('SELECT users.saldo FROM USERS');


    let numeroSaldo = (nuevoSaldo[0].saldo);

    if (tipoOperacion == 'INGRESO'){
        numeroSaldo += numeroMonto;

    } else{
        numeroSaldo -= numeroMonto;
    };

    await pool.query('UPDATE users SET saldo = ?', [numeroSaldo]);

    //FEEDBACK
    req.flash('success', 'Operación registrada con éxito.');

    //REDIRECT TO MOVEMENTS LIST
    res.redirect('/moves');
    
});

// ---------- "HOME" ROUTE AND LAST 10 MOVEMENTS LIST -------------

// GET FOR GETTING THE LAST 10 MOVEMENTS AND USER BALANCE
router.get('/', async (req, res) => {

    // QUERYS
    const moves = await pool.query("SELECT * FROM moves ORDER BY id DESC LIMIT 10");
    const saldo = await pool.query('SELECT * FROM users');
    
    // SENDING THE DATA FROM THE QUERYS TO -> (views/moves/list.hbs) 
    res.render('moves/list', {moves, saldo: saldo[0], move: moves[0]});
});

// GET FOR GETTING ALL MOVEMENTS 

router.get('/todas', async (req, res) => {

    // QUERYS
    const moves = await pool.query("SELECT * FROM moves ORDER BY id DESC");
    const saldo = await pool.query('SELECT * FROM users');
    
    // SENDING THE DATA FROM THE QUERYS TO -> (views/moves/list.hbs)  
    res.render('moves/list', {moves, saldo: saldo[0], move: moves[0]});
});

// GET FOR GETTING "EGRESOS" ONLY
router.get('/egresos', async (req, res) => {

    // BALANCE AND "EGRESOS" QUERY
    const moves = await pool.query("SELECT * FROM moves WHERE tipo = 'EGRESO' ORDER BY id DESC");
    const saldo = await pool.query('SELECT * FROM users');
    
    //  SENDING THE DATA FROM THE QUERYS TO -> (views/moves/list.hbs) 
    res.render('moves/list', {moves, saldo: saldo[0], move: moves[0]});
});
// GET FOR GETTING "INGRESOS" ONLY
router.get('/ingresos', async (req, res) => {

    // BALANCE AND "INGRESOS" QUERY
    const moves = await pool.query("SELECT * FROM moves WHERE tipo = 'INGRESO' ORDER BY id DESC");
    const saldo = await pool.query('SELECT * FROM users');
    
    // SENDING THE DATA FROM THE QUERYS TO -> (views/moves/list.hbs) 
    res.render('moves/list', {moves, saldo: saldo[0], move: moves[0]});
});


// ------------------------------- DELETING A MOVEMENT ----------------------------------------------

router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;

    // GETTING QUERYS 
    let getMonto = await pool.query('SELECT monto FROM moves WHERE id = ?', [id]);
    
    let nuevoSaldo = await pool.query('SELECT users.saldo FROM USERS');
    
    let getOpType = await pool.query('SELECT tipo FROM moves WHERE id = ?', [id]);

    let numeroSaldo = (nuevoSaldo[0].saldo); // GETTING THE QUERYS VALUES 
    let numeroGetMonto = (getMonto[0].monto);  
    let stringGetOpType = (getOpType[0].tipo); 

    // UPDATING THE ACCOUNT BALANCE
    
    if (stringGetOpType == 'INGRESO'){
        numeroSaldo -= numeroGetMonto
     
    } else {
        numeroSaldo += numeroGetMonto
    }
    
    await pool.query('UPDATE users SET saldo = ?', [numeroSaldo]);

    await pool.query('DELETE FROM moves WHERE ID = ?', [id]);

    //FEEDBACK
    req.flash('success', 'Operación borrada con éxito');

    // REDIRECT TO THE MOVES LIST
    res.redirect('/moves');
});

// ---------------------------  EDITING AN OLD MOVEMENT --------------------------------------------

// GETTING THE OLD DATA TO SHOW IT ON THE FORM
router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;

    const moves = await pool.query('SELECT * FROM moves WHERE id = ?', [id]);

    // // SENDING THE DATA FROM THE QUERYS TO -> (views/moves/edit.hbs)
    res.render('moves/edit', {move: moves[0]} );
});

//POST FOR UPDATE THE NEW USER DATA ON THE DATABASE
router.post('/edit/:id', async (req, res) => {

    const { id } = req.params;
    const { concepto, monto, fecha, tipo} = req.body; 
    const newMove = {
        concepto,
        monto,
        fecha,
        tipo 
    };

    
    let montoViejo = await pool.query('SELECT monto FROM moves WHERE id = ?', [id])
 
    await pool.query('UPDATE moves set ? WHERE id = ?', [newMove, id]);
    
    // UPDATING THE USER BALANCE WITH THE CHANGES THAT THE USER WANT

    
    let nuevoSaldo = await pool.query('SELECT users.saldo FROM USERS');

    let numeroSaldo = (nuevoSaldo[0].saldo);

    let numeroMontoViejo = (montoViejo[0].monto);

    let tipoOperacion = newMove.tipo;

    let numeroMonto = parseInt(newMove.monto);

    
    if (tipoOperacion == 'INGRESO'){

        numeroSaldo -= numeroMontoViejo

        numeroSaldo += numeroMonto
    
    } else{
        
        numeroSaldo += numeroMontoViejo

        numeroSaldo -= numeroMonto
    }

    await pool.query('UPDATE users SET saldo = ?', [numeroSaldo]);

    //FEEDBACK
    req.flash('success', 'Operación modificada con éxito.');

    //REDIRECT TO (home)
    res.redirect('/moves');
});

module.exports = router;