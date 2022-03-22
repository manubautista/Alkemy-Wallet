# Alkemy Wallet
<h2> Importante: <br> El "home" se encuentra en la ruta ( /moves ) <br>
Ejemplo en Local Host 4000: localhost:4000/moves.  <br>
Base de datos volcada en database/data-dump.sql. </h2>

<div> <h3> API para administración de presupuesto personal </h3> 
  <li> Este repositorio forma parte del challenge de Alkemy Fullstack JS. </li>
  <li> Desarrollado en Node.js junto al framework de Backend Express. </li>
  <li> Base de datos manejada con MariaDB. </li>
  <li> El LocalHost fue establecido con Xampp Control panel, utilizando MySQL. </li>
  <li> En el archivo database/data-dump.sql se encuentra el dump de la base de datos.</li>
  <li> Frontend desarrollado con Bootstrap y Fontawesome, debido a que React.js es optativo. </li>
  <li> Se lleva la información de la base de datos que viaja mediante JSON hacia las templates (cliente) con Handlebars. No se utilizaron peticiones AJAX. </li>
  <li> Referido a los commits declarativos y atomizados, se utilizó Github Desktop para realizar los cambios en el proyecto </li>
  <li> Respecto a las buenas prácticas para rutas, se definió la acción específica que se ejecuta en cada una por ejemplo add.hbs para agregar una nueva operación </li> 
 </div>
 
<h2> Estructura de la tabla que contiene las operaciones de dinero. </h2>

![db](https://user-images.githubusercontent.com/91494874/159546987-577b0f8a-8941-4bab-80ce-53272f5cd9c8.jpg)



<h2> Vista /moves (home) </h2>

![main](https://user-images.githubusercontent.com/91494874/155935157-7cdbca72-d240-457c-a9cb-f271430e7e4e.jpg)


<h2> Vista de formulario para registrar de operaciones /moves/add </h2>

![form](https://user-images.githubusercontent.com/91494874/156025335-bc22da10-8e5b-48b4-866c-92a221765b19.jpg)

<h2> Vista de formulario de edición de operaciones /moves/edit/95 <- (id de la operación) </h2>

![formedit](https://user-images.githubusercontent.com/91494874/156026624-073a1fc9-5acb-44dc-ac17-d3c1958f7ca3.jpg)
