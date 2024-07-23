
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

modal_comisiones = document.getElementById("modal_crear_comisiones")
modal_nombre = document.getElementById("modal_crear_nombre")
moda_res = document.getElementById("modal_resultados")
tabla = document.getElementById("sections_table")
datos_tabla = document.getElementById("datos")
input_nombre = document.getElementById("new_subject_name_input")
label_num_pag = document.getElementById("label_num_pag")

tabla_res_1 = document.getElementById("tabla_res_1")
tabla_res_2 = document.getElementById("tabla_res_2")
tabla_res_3 = document.getElementById("tabla_res_3")
tabla_res_4 = document.getElementById("tabla_res_4")

nombre_nueva_materia = ""
horarios_calculados = []
pagina_actual = 1

function create_subject(){
    modal = document.getElementById("modal_crear_comisiones")
    tabla = document.getElementById("sections_table")
    datos_tabla = document.getElementById("datos")

    nuevas_comisiones = []
    nuevos_turnos = []
    horario_leido = ""
    dia_leido = ""
    cantidad_comisiones = 1
    filas = datos_tabla.getElementsByTagName("tr")

    for(i = 0;i<cantidad_comisiones;i++){
        Array.from(filas).forEach(fila=>{
            horario_leido = fila.getAttribute("turno")
            celdas = fila.getElementsByTagName("td")
            Array.from(celdas).forEach(celda => {
                dia_leido = celda.getAttribute("dia")
                input = celda.getElementsByTagName("input")
                if(input[0]!=null){
                    datos = input[0].value.split(",")
                    datos.forEach(numero=>{
                        if(numero == i+1){
                            nuevos_turnos.push(new Turno(dia_leido,horario_leido))
                        }
                        else if(numero > cantidad_comisiones){
                            cantidad_comisiones = numero
                            console.log(cantidad_comisiones);
                        }
                    })
                }
                
            });
        })

        if(nuevas_comisiones!=[]){nuevas_comisiones.push(new Comision(nuevos_turnos))}
        nuevos_turnos = []
    }

    materia_nueva = new Materia(nombre_nueva_materia,nuevas_comisiones)
    console.log(materia_nueva)

    archivo_materias = localStorage.getItem('subjects.json')

    if(archivo_materias!=null){
        lista_materias = JSON.parse(archivo_materias)
        lista_materias.push(materia_nueva)
    }
    else{
        lista_materias = [materia_nueva]
    }
    
    nueva_lista = JSON.stringify(lista_materias)
    localStorage.setItem('subjects.json',nueva_lista)

    modal_comisiones.style.display = 'none';
    update_subject_lists(nombre_nueva_materia)
}

function update_subject_lists(nombre_materia){

    archivo_materias = JSON.parse(localStorage.getItem('subjects.json'))
    panel_materias = document.getElementById("not_selected_subjects")

    panel_seleccionadas = document.getElementById("selected_subjects")

    while(panel_materias.firstChild){
        panel_materias.removeChild(panel_materias.firstChild)
    }

    while(panel_seleccionadas.firstChild){
        panel_seleccionadas.removeChild(panel_seleccionadas.firstChild)
    }

    archivo_materias.forEach(materia=>{
        nueva_entrada = document.createElement("div")
        nueva_entrada.className="subject"

        nuevo_label = document.createElement("label")
        nuevo_label.className="subject_name"
        nuevo_label.textContent=materia.nombre
        nueva_entrada.appendChild(nuevo_label)

        nuevos_botones = document.createElement("div")
        nuevos_botones.className="button_div"

        boton_add = document.createElement("button")
        boton_add.className="subject_button"
        if(materia.isWaiting){
            boton_add.onclick = () =>{ addToSelected(materia.nombre)}
            boton_add.innerText="Añadir"
        }
        else{
            boton_add.onclick = () =>{ removeSelected(materia.nombre)}
            boton_add.innerText="Quitar"
        }
        
        nuevos_botones.appendChild(boton_add)

        boton_edit = document.createElement("button")
        boton_edit.className="subject_button"
        boton_edit.innerText="Editar"
        boton_edit.onclick = () =>{ editSubject(materia.nombre)}
        nuevos_botones.appendChild(boton_edit)

        boton_delete = document.createElement("button")
        boton_delete.className="subject_button"
        boton_delete.innerText="Borrar"
        boton_delete.onclick = () =>{ deleteSubject(materia.nombre)}
        nuevos_botones.appendChild(boton_delete)

        nueva_entrada.appendChild(nuevos_botones)

        if(materia.isWaiting){
            panel_materias.appendChild(nueva_entrada)
        }  
        else{
            panel_seleccionadas.appendChild(nueva_entrada)
        }
    })
}

function removeSelected(nombre){
    archivo_materias = JSON.parse(localStorage.getItem('subjects.json'))
    for(i=0;i<archivo_materias.length;i++){
        materia=archivo_materias[i]
        
        if(materia.nombre==nombre){
            materia.isWaiting=true
        }
    }

    archivo_materias = JSON.stringify(archivo_materias)
    localStorage.setItem('subjects.json',archivo_materias)

    update_subject_lists()
}

function addToSelected(nombre){
    archivo_materias = JSON.parse(localStorage.getItem('subjects.json'))

    for(i=0;i<archivo_materias.length;i++){
        materia=archivo_materias[i]
        
        if(materia.nombre==nombre){
            materia.isWaiting=false
        }
    }

    archivo_materias = JSON.stringify(archivo_materias)
    localStorage.setItem('subjects.json',archivo_materias)

    update_subject_lists()

    
}

function editSubject(nombre){

    btn_complete = document.getElementById("btn_complete_subject")
    btn_edit = document.getElementById("btn_edit_subject")
    modal = document.getElementById("modal_crear_comisiones")
    tabla = document.getElementById("sections_table")
    datos_tabla = document.getElementById("datos")
    filas = datos_tabla.getElementsByTagName("tr")

    archivo_materias = JSON.parse(localStorage.getItem('subjects.json'))

    clean_table()

    for(i=0;i<archivo_materias.length;i++){
        materia=archivo_materias[i]
        if(materia.nombre==nombre){
            num_comision = 1
            materia.comisiones.forEach(comision=>{
                for(i=0;i<filas.length;i++){
                    fila = filas[i].getElementsByTagName("td")
                    for(j=0;j<fila.length;j++){
                        celda = fila[j]
                        input = celda.getElementsByTagName("input")
                        if(input[0]!=null){
                            comision.turnos.forEach(turno=>{
                                if(turno.dia == j && turno.horario==i){
                                    input[0].value = input[0].value.concat(num_comision+",")
                                    
                                }
                            })
                        }
                        
                    }
                }
                num_comision++
            })
        }
    }

    clean_table("edit")

    btn_edit.style.display='flex';
    btn_edit.onclick = () => { complete_edit_subject(nombre)}
    btn_complete.style.display='none';
    modal_comisiones.style.display = 'flex';

    archivo_materias = JSON.stringify(archivo_materias)
    localStorage.setItem('subjects.json',archivo_materias)

    update_subject_lists()

}

function complete_edit_subject(nombre){

    modal = document.getElementById("modal_crear_comisiones")
    tabla = document.getElementById("sections_table")
    datos_tabla = document.getElementById("datos")

    nuevas_comisiones = []
    nuevos_turnos = []
    horario_leido = ""
    dia_leido = ""
    cantidad_comisiones = 1
    filas = datos_tabla.getElementsByTagName("tr")
    
    for(i = 0;i<cantidad_comisiones;i++){
        Array.from(filas).forEach(fila=>{
            horario_leido = fila.getAttribute("turno")
            celdas = fila.getElementsByTagName("td")
            Array.from(celdas).forEach(celda => {
                dia_leido = celda.getAttribute("dia")
                input = celda.getElementsByTagName("input")
                if(input[0]!=null){
                    datos = input[0].value.split(",")
                    datos.forEach(numero=>{
                        if(numero == i+1){
                            nuevos_turnos.push(new Turno(dia_leido,horario_leido))
                        }
                        else if(numero > cantidad_comisiones){
                            cantidad_comisiones = numero
                            console.log(cantidad_comisiones);
                        }
                    })
                }
                
            });
        })

        nuevas_comisiones.push(new Comision(nuevos_turnos))
        nuevos_turnos = []

    }

    lista_materias = JSON.parse(localStorage.getItem('subjects.json'))

    lista_materias.forEach(materia=>{
        if(materia.nombre == nombre){
            materia.comisiones = nuevas_comisiones
        }
    })

    lista_materias = JSON.stringify(lista_materias)
    localStorage.setItem('subjects.json',lista_materias)

    modal_comisiones.style.display = 'none';
    update_subject_lists(nombre_nueva_materia)

}

function deleteSubject(nombre){
    archivo_materias = JSON.parse(localStorage.getItem('subjects.json'))

    for(i=0;i<archivo_materias.length;i++){
        materia=archivo_materias[i]
        
        if(materia.nombre==nombre){
            archivo_materias.splice(i,1)
        }
    }

    archivo_materias = JSON.stringify(archivo_materias)
    localStorage.setItem('subjects.json',archivo_materias)

    update_subject_lists()
}

function calculate_timetable(){
    modal_res = document.getElementById("modal_resultados")

    lista_materias = JSON.parse(localStorage.getItem('subjects.json'))
    materias_seleccionadas = []
    lista_materias.forEach(materia=>{
        if(materia.isWaiting==false){
            materias_seleccionadas.push(materia)
        }
    })

    
    horarios_compatibles = Horario.calculateHorariosCompatibles(materias_seleccionadas)
    horarios_calculados = horarios_compatibles
    modal_res.style.display="flex";

    pagina_actual = 0
    paginas_totales = Math.ceil(horarios_compatibles.length / 4);
    label_num_pag.textContent = "Pagina " + (paginas_totales==0?0:pagina_actual+1) + " de " + paginas_totales

    clean_res_table(tabla_res_1)
    clean_res_table(tabla_res_2)
    clean_res_table(tabla_res_3)
    clean_res_table(tabla_res_4)
    if(horarios_compatibles[0]!=null){
        completa_tabla(tabla_res_1,horarios_compatibles[0])
    }
    if(horarios_compatibles[1]!=null){
        completa_tabla(tabla_res_2,horarios_compatibles[1])
    }
    if(horarios_compatibles[2]!=null){
        completa_tabla(tabla_res_3,horarios_compatibles[2])
    }
    if(horarios_compatibles[3]!=null){
        completa_tabla(tabla_res_4 ,horarios_compatibles[3])
    }
}

function completa_tabla(tabla,horario){
    
    filas = tabla.getElementsByTagName("tr")
    for(i=0;i<filas.length;i++){
        fila = filas[i].getElementsByTagName("td")
        for(j=0;j<fila.length;j++){
            celda = fila[j]
            label = celda.getElementsByTagName("label")
            if(label[0]!=null){
                label[0].textContent = ""
            }
            
        }
    }

    filas = tabla.getElementsByTagName("tr")
    celdas=[]
    for(i=0;i<filas.length;i++){
        celdas.push(filas[i].getElementsByTagName("td"))
    }


    //  HORARIO  
    //celdas[1][2].getElementsByTagName("label")[0].textContent = "AAA1"
    //       DIA   

    for(i=0;i<horario.comisiones.length;i++){
        comision_actual = horario.comisiones[i]
        for(j=0;j<comision_actual.turnos.length;j++){
            celdas[comision_actual.turnos[j].horario][comision_actual.turnos[j].dia].getElementsByTagName("label")[0].textContent = horario.materias_nombres[i]
        }
        
    }


}

function back_page(){
    if(pagina_actual>0){
        pagina_actual-=2
        next_page()
    }
}

function next_page(){

    if(pagina_actual<paginas_totales-1){
        pagina_actual++
    }
    
    clean_res_table(tabla_res_1)
    if(horarios_compatibles[pagina_actual*4]!=null){
        completa_tabla(tabla_res_1,horarios_compatibles[pagina_actual*4])
    }
    clean_res_table(tabla_res_2)
    if(horarios_compatibles[pagina_actual*4+1]!=null){
        completa_tabla(tabla_res_2,horarios_compatibles[pagina_actual*4+1])
    }
    clean_res_table(tabla_res_3)
    if(horarios_compatibles[pagina_actual*4+2]!=null){
        completa_tabla(tabla_res_3,horarios_compatibles[pagina_actual*4+2])
    }
    clean_res_table(tabla_res_4)
    if(horarios_compatibles[pagina_actual*4+3]!=null){
        completa_tabla(tabla_res_4 ,horarios_compatibles[pagina_actual*4+3])
    }

    label_num_pag.textContent = "Pagina " + (pagina_actual+1) + " de " + paginas_totales
}

function clean_res_table(tabla){
    filas = tabla.getElementsByTagName("tr")
    for(i=0;i<filas.length;i++){
        fila = filas[i].getElementsByTagName("td")
        for(j=0;j<fila.length;j++){
            celda = fila[j]
            label = celda.getElementsByTagName("label")
            if(label[0]!=null){
                label[0].textContent = ""
            }
            
        }
    }
}

function show_create_subject(){
    modal_nombre.style.display = 'flex';
}

function continue_creation(){
    btn_complete = document.getElementById("btn_complete_subject")
    btn_edit = document.getElementById("btn_edit_subject")
    btn_edit.style.display='none';
    btn_complete.style.display='flex';
    nombre_nueva_materia = input_nombre.value
    input_nombre.value = ""
    clean_table()
    modal_comisiones.style.display = 'flex';
    modal_nombre.style.display = 'none';
}

function clean_table(option){
    datos_tabla = document.getElementById("datos")
    filas = datos_tabla.getElementsByTagName("tr")
    for(i=0;i<filas.length;i++){
        fila = filas[i].getElementsByTagName("td")
        for(j=0;j<fila.length;j++){
            celda = fila[j]
            input = celda.getElementsByTagName("input")
            if(input[0]!=null){
                if(option=="edit"){
                    if(input[0].value[input[0].value.length-1]==','){
                        input[0].value = input[0].value.slice(0,-1)
                    }
                }
                else{
                    input[0].value = ""
                }
            }
            
        }
    }
}

window.onclick = function(event) {
    if (event.target == modal_nombre) {
        modal_nombre.style.display = "none";
    }
    else if (event.target == modal_comisiones) {
        modal_comisiones.style.display = "none";
    }
    else if(event.target == moda_res){
        modal_res.style.display = "none"
    }
  }

window.addEventListener('load', function() {
    update_subject_lists()
});