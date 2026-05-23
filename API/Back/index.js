const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app=express();
const PORT = process.env.PORT || 3000;
const TOKEN = process.env.API_TOKEN || '123456';

app.use(cors());
app.use(express.json());

const auth = (req, res, next) => {
    const token = req.headers['authorization'];
    if (token === `Bearer ${TOKEN}`) {
        next();
    } else {
        res.status(401).json({ message: 'Acceso no autorizado' });
    }
};

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Conectado a MongoDB');
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
        });
    })
    .catch(err => console.error('Error al conectar a MongoDB:', err));

const tareaSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        trim: true   
    },
    descripcion: {
        type: String,
        required: true,
        trim: true
    },
    completada: {
        type: Boolean,
        default: false
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
});

const Tarea = mongoose.model('Tarea', tareaSchema);

//-------------------------------------------------------

app.get('/tareas', auth, async (req, res) => { //GET Obtener todas las tareas
    try {
        const tareas = await Tarea.find();
        res.json(tareas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las tareas' });
    }
});

app.get('/tareas/:id', auth, async (req, res) => { //GET Obtener una tarea por id
    try {
        const tarea = await Tarea.findById(req.params.id);
        if (!tarea) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }
        res.json(tarea);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la tarea' });
    }
});

app.post('/tareas', auth, async (req, res) => { //POST Crear una nueva tarea
    try {
        const nuevaTarea = new Tarea(req.body);
        const tareaGuardada = await nuevaTarea.save();
        res.status(201).json(tareaGuardada);
    } catch (error) {
        res.status(400).json({ message: 'Error al crear la tarea' });
    }
});

app.put('/tareas/:id', auth, async (req, res) => { //PUT Actualizar una tarea por id
    try {
        const tareaActualizada = await Tarea.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!tareaActualizada) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }
        res.json(tareaActualizada);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar la tarea' });
    }
});

app.delete('/tareas/:id', auth, async (req, res) => { //DELETE Eliminar una tarea por id
    try {
        const tareaEliminada = await Tarea.findByIdAndDelete(req.params.id);
        if (!tareaEliminada) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }
        res.json({ message: 'Tarea eliminada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la tarea' });
    }
});