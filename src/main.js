class Turno{
    constructor(dia,horario){
        this.dia=dia
        this.horario=horario
        this.waiting=false
    }

    equals(otro_turno){
        if(this.dia == otro_turno.dia && this.horario == otro_turno.horario){
            return true
        }
        return false
    }
}

class Comision{
    constructor(turnos){
        this.turnos=turnos
    }

    static isComisionCompatible(comision_1,comision_2){
        comision_1.turnos.forEach(turno_1 => {
            comision_2.turnos.forEach(turno_2 =>{
                if(turno_1.equals(turno_2)){
                    return false
                }
            })
        })
        return true
    }
}

class Materia{
    constructor(nombre,comisiones){
        this.nombre=nombre
        this.comisiones=comisiones
    }
}

class Horario{
    constructor(materias,comisiones){
        this.materias=materias
        this.comisiones=comisiones
    }

    static calculateHorariosCompatibles(materias){

    }
}

const modal = document.getElementById("modal_crear_nombre")

function show_create_subject(){
    modal.style.display = 'block';
}

window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }