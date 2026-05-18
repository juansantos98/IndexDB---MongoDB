function agregar_jugador() {
    let openRequest = indexedDB.open("torneo_manager", 1);

    openRequest.onsuccess = function () {
        let db = openRequest.result;

        // 1. Iniciamos una transacción de lectura/escritura en la tabla "jugadores"
        let transaction = db.transaction("jugadores", "readwrite");

        // 2. Obtenemos el almacén de objetos para operar con él
        let jugadores = transaction.objectStore("jugadores");

        let id_equipo = "";
        if (localStorage.getItem('id_equipo')) {
            id_equipo = localStorage.getItem('id_equipo');
        }

        // 3. Creamos el objeto jugador
        let jugador = {
            id: document.getElementById("jugador-control").value,
            nombre_completo: document.getElementById("jugador-nombre").value,
            posicion: document.getElementById("jugador-posicion").value,
            dorsal: document.getElementById("jugador-dorsal").value,
            equipo: id_equipo,
            created: new Date()
        };

        // 4. Usamos put en lugar de add para que actualice si ya existe, o lo cree si es nuevo
        let request = jugadores.put(jugador);

        request.onsuccess = function () {
            console.log("Jugador guardado correctamente. No. Control: " + request.result);
            listar_jugadores(); // Refrescar tabla
            document.getElementById("modal-nuevo-jugador").classList.remove("active"); // Cerrar modal
        };

        request.onerror = function () {
            console.log("Ocurrió un error al agregar el jugador: " + request.error);
        };
    };

    openRequest.onerror = function () {
        console.log("Error al abrir la BD para agregar al jugador" + request.error);
    }
}

function eliminar_jugador(id_a_borrar) {
    // Asegurarnos de que el ID sea siempre un string, tal como se guarda desde el input
    id_a_borrar = String(id_a_borrar);

    if (!window.confirm("¿Está seguro de eliminar al jugador? Esta acción es irreversible.")) {
        return;
    }

    let openRequest = indexedDB.open("torneo_manager", 1);

    openRequest.onsuccess = function () {
        let db = openRequest.result;

        // 1. Iniciamos una transacción de lectura/escritura en la tabla "jugadores"
        let transaction = db.transaction("jugadores", "readwrite");

        // 2. Obtenemos el almacén de objetos para operar con él
        let jugadores = transaction.objectStore("jugadores");

        // 3. Ejecutamos la petición de borrado pasando el ID
        let request = jugadores.delete(id_a_borrar);

        request.onsuccess = function () {
            console.log("Petición de eliminación completada para el No. Control: " + id_a_borrar);
            listar_jugadores(); // Actualizar la tabla después de eliminar
        };

        request.onerror = function () {
            console.log("Ocurrió un error al eliminar el jugador: " + request.error);
        };
    };

    openRequest.onerror = function () {
        console.log("Error al abrir la BD para eliminar al jugador");
    }
}

function eliminar_equipo() {
    let id_a_borrar = "";
    if (localStorage.getItem('id_equipo')) {
        id_a_borrar = localStorage.getItem('id_equipo');
    }

    if (!window.confirm("¿Está seguro de eliminar el Equipo con todos sus Jugadores? Esta acción es irreversible.")) {
        return;
    }

    let openRequest = indexedDB.open("torneo_manager", 1);

    openRequest.onsuccess = function () {
        let db = openRequest.result;

        // 1. Iniciamos una transacción de lectura/escritura en la tabla "jugadores"
        let transaction = db.transaction("jugadores", "readwrite");

        // 2. Obtenemos el almacén de objetos para operar con él
        let jugadores = transaction.objectStore("jugadores");

        //  Borrar todos los jugadores
        let request1 = jugadores.clear();

        request1.onsuccess = function () {
            console.log("Jugadores Eliminados Correctamente");
        };

        request1.onerror = function () {
            console.log("Ocurrió un error al eliminar los jugadores: " + request.error);
        };

        //  Borrar todos los equipos

        let transaction2 = db.transaction("equipos", "readwrite");

        let equipos = transaction2.objectStore("equipos");

        let request2 = equipos.clear();

        request2.onsuccess = function () {
            localStorage.removeItem('id_equipo');
            window.location.reload();
            console.log("Equipos Eliminados Correctamente");
        };

        request2.onerror = function () {
            console.log("Ocurrió un error al eliminar los equipos: " + request.error);
        };
    };

    openRequest.onerror = function () {
        console.log("Error al abrir la BD para eliminar al jugador");
    }
}

function listar_jugadores() {
    const openRequest = indexedDB.open("torneo_manager", 1);

    openRequest.onsuccess = function () {
        let resultado = document.getElementById("jugadores");
        resultado.innerHTML = "";

        let db = openRequest.result;
        let transaction = db.transaction("jugadores", "readonly");
        let jugadores = transaction.objectStore("jugadores");
        let query = jugadores.openCursor();

        query.onsuccess = ev => {
            let cursor = ev.target.result;
            if (cursor) {
                resultado.innerHTML += "<tr>"
                    + "<td>" + cursor.value.id + "</td>"
                    + "<td>" + cursor.value.nombre_completo + "</td>"
                    + "<td><span class='badge badge-blue'>" + cursor.value.posicion + "</span></td>"
                    + "<td><span class='badge badge-gray'>" + cursor.value.dorsal + "</span></td>"
                    + "<td>"
                    + "<div class='acciones-group'>"
                    + "<Button class='btn-icon text-success' title='Editar' onclick='editar_jugador(\"" + cursor.value.id + "\")'> <i class='fa-solid fa-pen-to-square green'></i> </Button>"
                    + "<Button class='btn-icon text-danger' title='Eliminar' onclick='eliminar_jugador(\"" + cursor.value.id + "\")'> <i class='fa-solid fa-trash red'></i> </Button>"
                    + "</div>"
                    + "</td>"
                    + "</tr>";
                cursor.continue();
            }
        };
    }
}

function editar_jugador(id_a_editar) {
    console.log(id_a_editar);
    const modal = document.getElementById("modal-nuevo-jugador");

    let openRequest = indexedDB.open("torneo_manager", 1);

    openRequest.onsuccess = function () {
        let db = openRequest.result;

        // 1. Iniciamos una transacción de lectura/escritura en la tabla "jugadores"
        let transaction = db.transaction("jugadores", "readwrite");

        // 2. Obtenemos el almacén de objetos para operar con él
        let jugadores = transaction.objectStore("jugadores");

        // 3. Ejecutamos la petición de borrado pasando el ID
        let request = jugadores.get(id_a_editar);

        request.onsuccess = function () {
            // 4. Verificamos si el jugador realmente existe
            if (request.result) {
                let jugadorEncontrado = request.result;
                console.log("¡Jugador encontrado!", jugadorEncontrado);

                // Aquí ya puedes usar los datos, por ejemplo, para llenar un formulario:
                document.getElementById("jugador-control").value = jugadorEncontrado.id;
                document.getElementById("jugador-control").disabled = true
                document.getElementById("jugador-nombre").value = jugadorEncontrado.nombre_completo;
                document.getElementById("jugador-posicion").value = jugadorEncontrado.posicion;
                document.getElementById("jugador-dorsal").value = jugadorEncontrado.dorsal;

            } else {
                console.log("No se encontró ningún jugador con el ID: " + id_a_buscar);
            }
        };

        request.onerror = function () {
            console.log("Ocurrió un error al eliminar el jugador: " + request.error);
        };
    };

    openRequest.onerror = function () {
        console.log("Error al abrir la BD para eliminar al jugador");
    }

    // Función para abrir el modal
    modal.classList.add("active");
}

// Lógica para la ventana modal
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modal-nuevo-jugador");
    const btnAbrir = document.getElementById("btn-nuevo-jugador");
    const btnCerrar = document.getElementById("cerrar-modal");
    const btnCancelar = document.getElementById("btn-cancelar");
    const form = document.getElementById("form-nuevo-jugador");

    // Función para abrir el modal en modo 'Nuevo'
    btnAbrir.addEventListener("click", () => {
        form.reset();
        document.getElementById("jugador-control").disabled = false; // Asegurarse de que esté habilitado
        modal.classList.add("active");
    });

    // Función para cerrar el modal
    const cerrarModal = () => {
        modal.classList.remove("active");
        form.reset(); // Limpiar el formulario al cerrar
    };

    btnCerrar.addEventListener("click", cerrarModal);
    btnCancelar.addEventListener("click", cerrarModal);

    // Cerrar al hacer clic fuera del modal
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            cerrarModal();
        }
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault(); // Evitar recarga de la página
        agregar_jugador();
    });

    // --- Lógica del formulario de Equipo ---
    const inputEquipoNombre = document.getElementById("equipo-nombre");
    const tablaJugadoresContainer = document.getElementById("tabla-jugadores-container");

    window.revelarSeccionJugadores = () => {
        btnAbrir.style.display = "inline-flex"; // Es btn-nuevo-jugador
        tablaJugadoresContainer.style.display = "block";
    };

    // Verificar al cargar la página si ya existe un equipo guardado
    let openRequest = indexedDB.open("torneo_manager", 1);
    openRequest.onsuccess = function () {
        let db = openRequest.result;
        let transaction = db.transaction("equipos", "readonly");
        let equipos = transaction.objectStore("equipos");
        let query = equipos.getAll();

        query.onsuccess = function () {
            if (query.result && query.result.length > 0) {
                // Ya existe un equipo
                inputEquipoNombre.value = query.result[0].nombre;
                localStorage.setItem('id_equipo', query.result[0].id); // Sincronizar con localStorage en la nueva pestaña
                window.revelarSeccionJugadores();
            }
        };
    }
});

function agregar_equipo() {
    const inputEquipoNombre = document.getElementById("equipo-nombre");
    const nombreEquipo = inputEquipoNombre.value.trim();

    if (nombreEquipo === "") return;

    let openRequest = indexedDB.open("torneo_manager", 1);

    openRequest.onsuccess = function () {
        let db = openRequest.result;

        let transaction = db.transaction("equipos", "readwrite");
        let equipos = transaction.objectStore("equipos");

        let id_equipo = "";
        if (localStorage.getItem('id_equipo')) {
            id_equipo = localStorage.getItem('id_equipo');
        } else {
            id_equipo = Date.now().toString();
            localStorage.setItem('id_equipo', id_equipo);
        }

        let request = equipos.put({ id: id_equipo, nombre: nombreEquipo });

        request.onsuccess = function () {
            console.log("Equipo registrado exitosamente: " + nombreEquipo);
            window.location.reload();
            window.revelarSeccionJugadores();
        };

        request.onerror = function () {
            alert(request.error);
        }
    };
}