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

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configuración de Cloudinary (reemplaza con tus datos o ponlos en tu archivo .env)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configurar almacenamiento de imágenes en la nube
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'pichilemu-deportes-fotos',
        allowed_formats: ['jpg', 'png', 'jpeg']
    }
});
const upload = multer({ storage: storage });

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('¡Éxito! Conectado a la base de datos en MongoDB Atlas.'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

// Esquema actualizado del Jugador
const jugadorSchema = new mongoose.Schema({
    nombre_completo: { type: String, required: true },
    rut: { type: String, required: true },
    estatura: Number,
    peso: Number,
    ano_nacimiento: Number,
    club_deportivo: { type: String, required: true },
    foto_url: String, // <-- NUEVO: Enlace de la foto en la nube
    perfil_deportivo: {
        deporte: String,
        posicion: String,
        dorsal: Number
    }
});

const Jugador = mongoose.model('Jugador', jugadorSchema);

// Ruta para registrar jugador con foto
app.post('/api/jugadores', upload.single('foto'), async (req, res) => {
    try {
        const nuevaData = {
            nombre_completo: req.body.nombre_completo,
            rut: req.body.rut,
            estatura: parseFloat(req.body.estatura),
            peso: parseFloat(req.body.peso),
            ano_nacimiento: parseInt(req.body.ano_nacimiento),
            club_deportivo: req.body.club_deportivo,
            foto_url: req.file ? req.file.path : '', // URL de la foto subida a Cloudinary
            perfil_deportivo: {
                deporte: req.body.deporte,
                posicion: req.body.posicion,
                dorsal: parseInt(req.body.dorsal)
            }
        };

        const nuevoJugador = new Jugador(nuevaData);
        await nuevoJugador.save();
        res.status(201).json({ mensaje: '¡Jugador registrado con éxito!', jugador: nuevoJugador });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar el jugador' });
    }
});

// Ruta para ver todos los jugadores (ideal para tus gráficas de TV)
app.get('/api/jugadores', async (req, res) => {
    try {
        const jugadores = await Jugador.find();
        res.json(jugadores);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los jugadores' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado y escuchando en el puerto ${PORT}`);
});
