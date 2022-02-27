const express = require('express');
const router = express.Router();
const pool = require('../database');
// IMPORTS 

// ----------------------------- RUTA PARA AGREGAR OPERACIONES --------------------



// GET PARA OBTENER LA VISTA DEL FORMULARIO
router.get('/add', (req, res)=>{
    res.render('moves/add');
});

// POST PARA EFECTUAR LOS CAMBIOS EN LA BASE DE DATOS
router.post('/add', async (req, res) => {
// OBTIENE LA INFORMACIÓN QUE COLOCÓ EL USUARIO DESDE EL BODY
    const { concepto, monto, fecha, tipo} = req.body; 
    const newMove = {
        concepto,
        monto,
        fecha,
        tipo
    };
    // QUERY PARA INSERTAR NUEVA OPERACIÓN EN LA BASE DE DATOS
    await pool.query('INSERT INTO moves set ?', [newMove]);

    // CODIGO PARA MODIFICAR EL SALDO EN BASE A LAS OPERACIONES REALIZADAS

    // OBTIENE EL TIPO DE OPERACION AGREGADA (INGRESO o EGRESO)
    let tipoOperacion = newMove.tipo;

    // OBTIENE EL MONTO DE LA OPERACION AGREGADA
    let numeroMonto = parseInt(newMove.monto);

    // OBTIENE UN QUERY DEL SALDO ANTES DE SER CAMBIADO
    let nuevoSaldo = await pool.query('SELECT users.saldo FROM USERS');

    // OBTIENE EL NÚMERO DEL SALDO DESDE EL QUERY EFECTUADO
    let numeroSaldo = (nuevoSaldo[0].saldo);

    // SI EL TIPO DE OPERACIÓN ES UN INGRESO, 
    // SUMAR AL NÚMERO DEL SALDO, EL NÚMERO DEL MONTO DE LA OPERACIÓN AGREGADA
    if (tipoOperacion == 'INGRESO'){
        numeroSaldo += numeroMonto;

    // SI EL TIPO DE OPERACIÓN ES UN EGRESO,
    // RESTAR AL NÚMERO DEL SALDO, EL NÚMERO DEL MONTO DE LA OPERACIÓN AGREGADA
    } else{
        numeroSaldo -= numeroMonto;
    };

    // ACTUALIZA EL SALDO CON EL NÚMERO OBTENIDO DE LA VARIABLE numeroSaldo
    await pool.query('UPDATE users SET saldo = ?', [numeroSaldo]);

    //FEEDBACK
    req.flash('success', 'Operación registrada con éxito.');

    //REDIRECCIONA A LA LISTA DE OPERACIONES
    res.redirect('/moves');
    
});

// --------------------- RUTA PARA EL "HOME" Y MOSTRAR LISTADO DE OPERACIONES ----------

// GET PARA OBTENER EL LISTADO DE OPERACIONES Y EL SALDO
router.get('/', async (req, res) => {

    // OBTIENE UN QUERY DE LOS MOVIMIENTOS Y LOS DATOS DEL USUARIO
    const moves = await pool.query("SELECT * FROM moves ORDER BY FIELD (tipo, 'INGRESO', 'EGRESO')");
    const saldo = await pool.query('SELECT * FROM users');
    
    // OBTIENE LOS DATOS DE LOS QUERYS Y LOS ENVIA A LA VIEW PRINCIPAL (list.hbs) 
    res.render('moves/list', {moves, saldo: saldo[0], move: moves[0]});
});

router.get('/egresos', async (req, res) => {

    // OBTIENE UN QUERY DE LOS MOVIMIENTOS Y LOS DATOS DEL USUARIO
    const moves = await pool.query("SELECT * FROM moves WHERE tipo = 'EGRESO'");
    const saldo = await pool.query('SELECT * FROM users');
    
    // OBTIENE LOS DATOS DE LOS QUERYS Y LOS ENVIA A LA VIEW PRINCIPAL (list.hbs) 
    res.render('moves/list', {moves, saldo: saldo[0], move: moves[0]});
});

router.get('/ingresos', async (req, res) => {

    // OBTIENE UN QUERY DE LOS MOVIMIENTOS Y LOS DATOS DEL USUARIO
    const moves = await pool.query("SELECT * FROM moves WHERE tipo = 'INGRESO'");
    const saldo = await pool.query('SELECT * FROM users');
    
    // OBTIENE LOS DATOS DE LOS QUERYS Y LOS ENVIA A LA VIEW PRINCIPAL (list.hbs) 
    res.render('moves/list', {moves, saldo: saldo[0], move: moves[0]});
});


// ------------------------------- RUTA PARA ELIMINAR OPERACIONES ----------------------------------------------

router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    // OBTIENE UN QUERY DEL MONTO DE LA OPERACION A ELIMINAR
    let getMonto = await pool.query('SELECT monto FROM moves WHERE id = ?', [id]);

    // OBTIENE UN QUERY DEL SALDO ANTES DE ELIMINAR LA OPERACION
    let nuevoSaldo = await pool.query('SELECT users.saldo FROM USERS');

    // OBTIENE UN QUERY DEL TIPO DE LA OPERACION A ELIMINAR (INGRESO O EGRESO)
    let getOpType = await pool.query('SELECT tipo FROM moves WHERE id = ?', [id]);

    let numeroSaldo = (nuevoSaldo[0].saldo); // ACCEDE AL NÚMERO OBTENIDO DEL QUERY 
    let numeroGetMonto = (getMonto[0].monto); // ACCEDE AL NÚMERO OBTENIDO DEL QUERY 
    let stringGetOpType = (getOpType[0].tipo); // OBTIENE EL STRING OBTENIDO DEL QUERY ('INGRESO' o 'EGRESO')

    // SI EL MOVIMIENTO A ELIMINAR ES UN INGRESO,
    // RESTAR EL MONTO DE ESA OPERACION A EL NÚMERO DEL SALDO
    if (stringGetOpType == 'INGRESO'){
        numeroSaldo -= numeroGetMonto
    // SI EL MOVIMIENTO A ELIMINAR ES UN EGRESO,
    // SUMAR EL MONTO DE ESA OPERACIÓN A EL NÚMERO DEL SALDO
    } else {
        numeroSaldo += numeroGetMonto
    }
    // ACTUALIZA EL SALDO CON EL NÚMERO OBTENIDO DE numeroSaldo
    await pool.query('UPDATE users SET saldo = ?', [numeroSaldo]);

    // ELIMINA LA OPERACIÓN DE LA BASE DE DATOS
    await pool.query('DELETE FROM moves WHERE ID = ?', [id]);

    //FEEDBACK
    req.flash('success', 'Operación borrada con éxito');

    // REDIRECCIONA A LA LISTA DE OPERACIONES
    res.redirect('/moves');
});

// ---------------------------  RUTA PARA EDITAR OPERACIONES --------------------------------------------

// OBTIENE LOS DATOS PARA MOSTRARLOS EN EL FORMULARIO DE EDICIÓN
router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;

    // OBTIENE LOS DATOS DE LA OPERACIÓN CON EL ID DE LA OPERACION A EDITAR
    const moves = await pool.query('SELECT * FROM moves WHERE id = ?', [id]);

    // ENVIA LOS DATOS DE LA OPERACION A EDITAR A LA VISTA DEL FORMULARIO DE EDICION (edit.hbs)
    res.render('moves/edit', {move: moves[0]} );
});

//POST PARA EFECTUAR LOS CAMBIOS EN LA BASE DE DATOS
router.post('/edit/:id', async (req, res) => {
    //OBTENCION DE DATOS ACTUALIZADOS POR EL USUARIO
    const { id } = req.params;
    const { concepto, monto, fecha, tipo} = req.body; 
    const newMove = {
        concepto,
        monto,
        fecha,
        tipo 
    };

    //OBTIENE EL MONTO DE LA OPERACION ANTES DE SER ACTUALIZADA
    let montoViejo = await pool.query('SELECT monto FROM moves WHERE id = ?', [id])

    //ACTUALIZA EL MOVIMIENTO CON LOS NUEVOS DATOS EN LA BASE DE DATOS 
    await pool.query('UPDATE moves set ? WHERE id = ?', [newMove, id]);
    
    // CODIGO PARA ACTUALIZAR EL SALDO EN BASE A LAS MODIFICACIONES EFECTUADAS

    // OBTIENE UN QUERY DEL SALDO ANTES DE SER MODIFICADO
    let nuevoSaldo = await pool.query('SELECT users.saldo FROM USERS');

    // OBTIENE EL NUMERO CONSEGUIDO DE ESA QUERY
    let numeroSaldo = (nuevoSaldo[0].saldo);

    // OBTIENE EL NUMERO DEL MONTO DEL QUERY DE LA OPERACION ANTES DE SER ACTUALIZADA
    let numeroMontoViejo = (montoViejo[0].monto);

    // OBTIENE EL TIPO DE OPERACION DESDE EL BODY
    let tipoOperacion = newMove.tipo;

    // OBTIENE EL NUEVO MONTO DESDE EL BODY
    let numeroMonto = parseInt(newMove.monto);

    // SI LA OPERACION ES UN INGRESO 
    if (tipoOperacion == 'INGRESO'){

        // RESTAR EL MONTO DE LA OPERACION ANTES DE SER ACTUALIZADA
        numeroSaldo -= numeroMontoViejo

        // SUMAR EL MONTO DE LA OPERACION ACTUALIZADA
        numeroSaldo += numeroMonto
        
    // SI LA OPERACION ES UN EGRESO
    } else{

        // SUMAR EL MONTO DE LA OPERACION ANTES DE SER ACTULIZADA
        numeroSaldo += numeroMontoViejo

        // RESTAR EL MONTO DE LA OPERACION ACTUALIZADA
        numeroSaldo -= numeroMonto
    }
    // ACTUALIZA EL SALDO EN BASE A LA OPERACION MODIFICADA
    await pool.query('UPDATE users SET saldo = ?', [numeroSaldo]);

    //FEEDBACK
    req.flash('success', 'Operación modificada con éxito.');

    //REDIRECCIONA A LA LISTA DE OPERACIONES
    res.redirect('/moves');
});

module.exports = router;