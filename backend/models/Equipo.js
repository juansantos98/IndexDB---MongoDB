const mongoose = require('mongoose');

const equipoSchema = new mongoose.Schema({
    id_equipo: { type: Number, required: true, unique: true },
    nombre_equipo: { type: String, required: true, unique: true },
    id_grupo: { type: Number, required: true },
    goles_contra: { type: Number, default: 0 },
    goles_favor: { type: Number, default: 0 },
    puntos: { type: Number, default: 0 }
}, { collection: 'equipos' });

module.exports = mongoose.model('Equipo', equipoSchema);
