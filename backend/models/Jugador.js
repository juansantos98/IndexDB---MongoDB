const mongoose = require('mongoose');

const jugadorSchema = new mongoose.Schema({
    nombre_jugador: { type: String, required: true },
    numero_control: { type: String, required: true, unique: true },
    posicion: { type: String, required: true },
    equipo: { type: String, required: true },
    numero: { type: Number, required: true }
}, { collection: 'jugadors' });

module.exports = mongoose.model('Jugador', jugadorSchema);
