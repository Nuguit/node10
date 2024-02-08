const express = require('express');
const app = express();
const libros = require('./routes/libros')
let {MongoClient} = require('mongodb')
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

const client = new MongoClient('mongodb://127.0.0.1:27017')

async function connectMongo() {
    try {
        await client.connect().then((client) => app.locals.db = client.db('prueba'));
        await client.db("admin").command({ ping: 1 });
        console.log("MongoDB está conectado");
    } catch (error) {
        console.error("MongoDB no conectado:", error);
    }
}

connectMongo()


app.post('clientes/:registrarCliente', async (req, res) => {
    try {
        let { nombre, apellido, DNI } = req.body
        const results = await app.locals.db.collection('clientes').insertOne({ nombre, apellido, DNI })
            if (results.length > 0) {
                ? res.send({ mensaje: 'Registrado correctamente' })
                : res.send({ mensaje: 'El cliente ya está registrado' })

    } catch (error) {
        console.error(error);
        res.status(500).send({ mensaje: 'Error al hacer el registro', error });
    }
})


app.put('clientes/:editar', async (req, res) => {
    try {
        const results = await clientes.findByIdAndUpdate(req.params.DNI, req.params.apellido, req.params.nombre, { new: true })
        results
            ? res.send({ mensaje: "Información de cliente actualizada", results })
            : res.send({ mensaje: "El cliente no se ha podido encontrar en nuestra base de datos", results })
    } catch (error) {
        res.send({ mensaje: "No se ha podido realizar la petición: " + error })
    }
},)


app.post('clientes/:checkin', async (req, res) => {
    try {
        const { DNI, noHabitacion, fechaCheckIn, fechaCheckOut } = req.body;

        
        const cliente = await Cliente.findOne({ DNI });
        if (!cliente) {
            return res.status(400).json({ mensaje: "El cliente no está registrado y no puede hacer una reserva." });
        }

        const habitacion = await Habitacion.findOne({ noHabitacion, estado: 'Disponible' });
        if (!habitacion) {
            return res.status(400).json({ mensaje: "La habitación no está disponible y no puede hacer una reserva." });
        }

        
        const reserva = new Reserva({
            cliente: cliente._id,
            habitacion: habitacion._id,
            fechaCheckIn,
            fechaCheckOut
        });
        await reserva.save();

        habitacion.estado = 'Ocupada';
        await habitacion.save();

        res.json({ mensaje: 'Reserva realizada con éxito.' });
    } catch (error) {
        console.error('Error al realizar el check-in:', error);
        res.status(500).json({ mensaje: 'Hubo un error al realizar el check-in.' });
    }
});


app.put('/checkout/:idCliente', async (req, res) => {
    try {
        const idCliente = req.params.idCliente;

        const reserva = await Reserva.findOne({ cliente: idCliente, fechaCheckOut: null });
        if (!reserva) {
            return res.status(404).json({ mensaje: "No se encontró ninguna reserva activa para el cliente." });
        }

        reserva.fechaCheckOut = new Date();
        await reserva.save();

        const habitacion = await Habitacion.findById(reserva.habitacion);
        habitacion.estado = "Disponible";
        await habitacion.save();

        res.json({ mensaje: "Check-out completado con éxito." });
    } catch (error) {
        console.error("Error al realizar el check-out:", error);
        res.status(500).json({ mensaje: "Hubo un error al realizar el check-out." });
    }
});


app.listen(PORT, (e) => {
    e
        ? console.error("Express no conectado")
        : console.log("Express conectado y a la escucha en el puerto: " + PORT)
})