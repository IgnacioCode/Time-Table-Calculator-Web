# Time Table Calculator

Una pequeña aplicacion web para poder calcular todas las posibles combinaciones de horarios disponibles para materias universitarias. 

Hecha integramente con vanilla Javascript y css para mantener la simplicidad de la misma.

Para acceder a la misma esta hecho un deploy en vercel sobre este repositorio. 

Se accede [aqui](https://time-table-calculator-web.vercel.app/)

## Como usarla

Primero debemos tener definido que materias nos interesaria poder cursar. Luego, haremos click en el boton de "Crear Materia", ingresaremos el nombre y nos aparecera una tabla de comisiones.

En dicha tabla debemos escribir los numeros de comisiones que existan en cada horario y dia. El orden de las comisiones no afecta al resultado. Si existe mas de 1 comision en un mismo horario, deben ingresarse los numeros pero separados por comas, quedando de la siguiente forma "1,2,3,4".

Una vez que completemos las comisiones, podremos completar esta materia y proceder a cargar la siguiente.

Una vez cargadas todas las materias que nos interesen, debemos darle al boton "Añadir" a aquellas que querramos tener en cuenta para el calculo de los posibles horarios. Al hacer click, nos apareceran todos los horarios que permitan cursar todas las materias seleccionadas. 

**Si no existen horarios posibles, apareceran los 4 cuadros vacios.**

## Datos Guardados

Todas las materias que ingresemos a la pagina quedan guardados dentro de la cache del navegador para dicha pagina web, por lo que si accedemos desde un nuevo navegador no podremos visualizar las materias que hayamos cargado previamente.
