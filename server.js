const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Esto permite mostrar las páginas web

// Conexión a la base de datos
mongoose.connect(process.env.MONGO_URI)
	.then(() => console.log('¡Éxito! Conectado a la base de datos en MongoDB Atlas.'))
	.catch((error) => console.log('Hubo un error al conectar:', error));

// Esquema de base de datos
const jugadorSchema = new mongoose.Schema({
	nombre_completo: { type: String, required: true },
	rut: { type: String, required: true },
	estatura: Number,
	perfil_deportivo: {
		deporte: String,
		posicion: String,
		dorsal: Number
	}
});

const Jugador = mongoose.model('Jugador', jugadorSchema);

// Ruta para Guardar jugador
app.post('/api/jugadores', async (req, res) => {
	try {
		const nuevoJugador = new Jugador(req.body);
		await nuevoJugador.save();
		res.status(201).json({ mensaje: 'Jugador guardado con éxito', jugador: nuevoJugador });
	} catch (error) {
		res.status(400).json({ error: 'Error al guardar el jugador', detalle: error.message });
	}
});

// Ruta para Leer jugadores
app.get('/api/jugadores', async (req, res) => {
	try {
		const jugadores = await Jugador.find();
		res.status(200).json(jugadores);
	} catch (error) {
		res.status(500).json({ error: 'Error al obtener los jugadores' });
	}
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Servidor iniciado y escuchando en el puerto ${PORT}`);
});

