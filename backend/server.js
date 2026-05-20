require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Equipo = require('./models/Equipo');
const Jugador = require('./models/Jugador');

const app = express();
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch(err => console.error('Error conectando a MongoDB:', err));

const grupoMap = { 'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6 };

app.post('/api/sync', async (req, res) => {
    const { equipos, jugadores } = req.body;
    
    try {
        // Validar límite de equipos por grupo
        for (const eq of equipos) {
            const id_grupo = grupoMap[eq.grupo];
            const equipoExistente = await Equipo.findOne({ nombre_equipo: eq.nombre });
            
            if (!equipoExistente) {
                const countEnGrupo = await Equipo.countDocuments({ id_grupo: id_grupo });
                if (countEnGrupo >= 6) {
                    return res.status(400).json({ error: `El grupo ${eq.grupo} ya tiene el máximo de 6 equipos permitidos.` });
                }
            }
        }

        // Procesar Equipos
        for (const eq of equipos) {
            const id_grupo = grupoMap[eq.grupo];
            const equipoExistente = await Equipo.findOne({ nombre_equipo: eq.nombre });
            
            if (!equipoExistente) {
                // Autoincrementar id_equipo para equipos nuevos
                const lastEquipo = await Equipo.findOne().sort({ id_equipo: -1 });
                const nextId = (lastEquipo && lastEquipo.id_equipo) ? lastEquipo.id_equipo + 1 : 1;
                
                await Equipo.create({
                    id_equipo: nextId,
                    nombre_equipo: eq.nombre,
                    id_grupo: id_grupo,
                    goles_contra: 0,
                    goles_favor: 0,
                    puntos: 0
                });
            } else {
                // Actualizar grupo si cambió
                if (equipoExistente.id_grupo !== id_grupo) {
                    equipoExistente.id_grupo = id_grupo;
                    await equipoExistente.save();
                }
            }
        }

        // Procesar Jugadores
        for (const jug of jugadores) {
            // Obtener el nombre del equipo cruzando con el array de equipos enviados (id frontend)
            const eqFromFrontend = equipos.find(e => e.id === jug.equipo);
            const teamName = eqFromFrontend ? eqFromFrontend.nombre : "Sin equipo";

            await Jugador.findOneAndUpdate(
                { numero_control: jug.id },
                {
                    nombre_jugador: jug.nombre_completo,
                    posicion: jug.posicion,
                    numero: Number(jug.dorsal) || 0,
                    equipo: teamName
                },
                { upsert: true, new: true }
            );
        }

        res.json({ message: 'Sincronización exitosa.' });

    } catch (error) {
        console.error('Error en sincronización:', error);
        res.status(500).json({ error: 'Error interno del servidor durante la sincronización.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
