const openRequest = indexedDB.open("torneo_futbol", 2);

// Se ejecuta si la base de datos NO existe o se cambia la versión
openRequest.onupgradeneeded = function () {
    let db = openRequest.result;

    // Creamos el object store (tabla) solo si no existe
    if (!db.objectStoreNames.contains('jugadores')) {
        db.createObjectStore('jugadores', { keyPath: 'id' });
        console.log("Base de datos y almacén 'jugadores' creados correctamente");
    }

    if (!db.objectStoreNames.contains('equipos')) {
        db.createObjectStore('equipos', { keyPath: 'id' });
        console.log("Base de datos y almacén 'equipos' creados correctamente");
    }
}

openRequest.onerror = function () {
    console.log("Ocurrió un error al abrir/crear la BD: " + openRequest.error);
};

openRequest.onsuccess = function () {
    listar_jugadores();
    console.log("Conexión a IndexedDB exitosa");
};