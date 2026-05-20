const mongoose = require('mongoose');

const jugadorSchema = new mongoose.Schema({
    nombre_jugador: { type: String, required: true },
    numero_control: { type: String, required: true, unique: true },
    posicion: { type: String, required: true },
    equipo: { type: String, required: true }, // Nombre del equipo en texto
    numero: { type: Number, required: true }
}, { collection: 'jugador' }); // Asegurar que la colección se llame 'jugador' en singular

module.exports = mongoose.model('Jugador', jugadorSchema);
