class Turno{
    constructor(dia,horario){
        this.dia=dia
        this.horario=horario
    }

    static igualTurno(turno1,turno2){
        if(turno1.dia == turno2.dia && turno1.horario == turno2.horario){
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
        var flag = true
        
        for(var i = 0;i<comision_1.turnos.length;i++){
            for(var j = 0;j<comision_2.turnos.length;j++){
                if(Turno.igualTurno(comision_1.turnos[i],comision_2.turnos[j])){
                    flag=false
                }
            }
        }
        return flag
    }
}

class Materia{
    constructor(nombre,comisiones){
        this.nombre=nombre
        this.comisiones=comisiones
        this.isWaiting = true
    }
}

class Horario{
    constructor(materias_nombres,comisiones){
        this.materias_nombres=materias_nombres
        this.comisiones=comisiones
    }

    isHorarioCompatible(){
        var flag = true
        for(var i=0;i<this.comisiones.length;i++){
            for(var j=i+1;j<this.comisiones.length;j++){
                if(Comision.isComisionCompatible(this.comisiones[i],this.comisiones[j]) == false){
                    flag =  false
                }
            }
        }

        return flag
    }

    static calculateHorariosCompatibles(materias){
        var combinaciones_posibles = 1
        var horarios_compatibles = []
        var cant_comisiones = []
        var nombres_materias = []
        materias.forEach(materia=>{
            combinaciones_posibles *= materia.comisiones.length
            cant_comisiones.push(materia.comisiones.length)
            nombres_materias.push(materia.nombre)
        })

        var anillo = new Anillo(cant_comisiones)
        var comisiones_a_probar = []

        for(var i = 0;i<combinaciones_posibles;i++){
            for(var j=0;j<materias.length;j++){
                comisiones_a_probar.push(materias[j].comisiones[anillo.values[j]])
            }

            var horario_a_probar = new Horario(nombres_materias,comisiones_a_probar)
            if(horario_a_probar.isHorarioCompatible() == true){
                horarios_compatibles.push(horario_a_probar)
            }
            
            comisiones_a_probar = []
            anillo.turn()
        }

        console.log(horarios_compatibles);

        return horarios_compatibles

    }
}

class Anillo{
    constructor(modulos){
        this.modulos = modulos
        this.values = []
        modulos.forEach(valor=>{this.values.push(0)})
    }

    turn(){
        var i = 0
        for(i = 0;i<this.modulos.length;i++){
            this.values[i] = (this.values[i]+1)%this.modulos[i]
            if(this.values[i]!=0){
                break;
            }
        }
    }
}

export {
    Turno,
    Comision,
    Materia,
    Horario,
    Anillo
}