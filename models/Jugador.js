class Jugador {
    #noControl;
    #nombre;
    #primerApellido;
    #segundoApellido;
    #posicion;
    #dorsal;
    #equipo;

    constructor(noControl, nombre, primerApellido, segundoApellido, posicion, dorsal) {
        this.#noControl = noControl;
        this.#nombre = nombre;
        this.#primerApellido = primerApellido;
        this.#segundoApellido = segundoApellido;
        this.#posicion = posicion;
        this.#dorsal = dorsal;
    }

    getNoControl() {
        return this.#noControl;
    }

    setNoControl(noControl) {
        this.#noControl = noControl;
    }

    getNombre() {
        return this.#nombre;
    }

    setNombre(nombre) {
        this.#nombre = nombre;
    }

    getPrimerApellido() {
        return this.#primerApellido;
    }

    setPrimerApellido(primerApellido) {
        this.#primerApellido = primerApellido;
    }

    getSegundoApellido() {
        return this.#segundoApellido;
    }

    setSegundoApellido(segundoApellido) {
        this.#segundoApellido = segundoApellido;
    }

    getPosicion() {
        return this.#posicion;
    }

    setPosicion(posicion) {
        this.#posicion = posicion;
    }

    getDorsal(){
        return this.$dorsal;
    }

    setDorsa(dorsal){
        this.#dorsal = dorsal;
    }

    getEquipo() {
        return this.#equipo;
    }

    setEquipo(equipo) {
        this.#equipo = equipo;
    }
}