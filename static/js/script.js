
function agregar_jugador() {
    let openRequest = indexedDB.open("torneo_manager", 1);

    openRequest.onsuccess = function () {
        let db = openRequest.result;

        // 1. Iniciamos una transacción de lectura/escritura en la tabla "jugadores"
        let transaction = db.transaction("jugadores", "readwrite");

        // 2. Obtenemos el almacén de objetos para operar con él
        let jugadores = transaction.objectStore("jugadores");

        // 3. Creamos el objeto jugador
        let jugador = {
            id: document.getElementById("jugador-control").value,
            nombre_completo: document.getElementById("jugador-nombre").value,
            posicion: document.getElementById("jugador-posicion").value,
            dorsal: document.getElementById("jugador-dorsal").value,
            created: new Date()
        };

        // 4. Agregamos el jugador
        let request = jugadores.add(jugador);

        request.onsuccess = function () {
            console.log("Jugador agregado correctamente. No. Control: " + request.result);
        };

        request.onerror = function () {
            console.log("Ocurrió un error al agregar el jugador: " + request.error);
        };
    };

    openRequest.onerror = function () {
        console.log("Error al abrir la BD para agregar al jugador" + request.error);
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
                    + "<a href='' class='btn-icon text-success' title='Editar'>✏️</a>"
                    + "<a href='' class='btn-icon text-danger' title='Eliminar'>🚫</a>"
                    + "</div>"
                    + "</td>"
                    + "</tr>";
                cursor.continue();
            }
        };
    }
}

// Lógica para la ventana modal
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modal-nuevo-jugador");
    const btnAbrir = document.getElementById("btn-nuevo-jugador");
    const btnCerrar = document.getElementById("cerrar-modal");
    const btnCancelar = document.getElementById("btn-cancelar");
    const form = document.getElementById("form-nuevo-jugador");

    // Función para abrir el modal
    btnAbrir.addEventListener("click", () => {
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
        agregar_jugador()
        // cerrarModal();
    });
});