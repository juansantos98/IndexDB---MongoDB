class Equipo {
    #idEquipo;
    #nombre;
    #grupo;

    constructor(idEquipo, nombre, posicion) {
        this.#idEquipo = noControl;
        this.#nombre = nombre;
    }

    getIdEquipo() {
        return this.#idEquipo;
    }

    setIdEquipo(idEquipo) {
        this.#idEquipo = idEquipo;
    }

    getNombre() {
        return this.#nombre;
    }

    setNombre(nombre) {
        this.#nombre = nombre;
    }

    getGrupo() {
        return this.#grupo;
    }

    setGrupo(grupo) {
        this.#grupo = grupo;
    }
}