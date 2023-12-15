//Modelo objeto
const objetoInicial = {
    "nombreApellidos" : "",
    "telefono" : "",
    "tarjeta" : "",
    "fechaInicio" : "",
    "fechaDev" : "",
    "isbn" : ""
}

//Modelo inicial base para el array de formularios
const arrayInicial = {
    "formularios" : [

    ]
}

//esta funcion carga los objetos al iniciar la pagina y los muestra despues del formulario
function cargarObjetos(){
    let formularios = JSON.parse(localStorage.getItem("formularios"));
    if(formularios){    
        let formularioWr = document.createElement("div");
        formularioWr.classList.add("wrapper");
        let keys = Object.keys(formularios.formularios[0]);
        for(let i = 0; i < formularios.formularios.length; i++){
            let formularioEl = document.createElement("div");
            formularioEl.classList.add("elementos");

            for(let j = 0; j < keys.length; j++){
                let divEl = document.createElement("div");
                divEl.classList.add("elemento"); 
                let uppercase = keys[j][0].toUpperCase() + keys[j].substring(1);
                let p = document.createTextNode(uppercase + ": " + formularios.formularios[i][keys[j]]);
                divEl.appendChild(p);
                formularioEl.appendChild(divEl);
            }
            let enlace = document.createElement("a");
            enlace.href = "#inicio";
            enlace.appendChild(document.createTextNode("↑"));
            enlace.classList.add("arriba");
            formularioEl.appendChild(enlace);
            formularioWr.appendChild(formularioEl);
        }
        document.getElementsByClassName("formularios")[0].appendChild(formularioWr);
    }
}

//Añade el objeto a la webStorage y recarga la pagina 👍
function addObjeto(){
    let formularios = localStorage.getItem("formularios");
    let formulario = JSON.parse(JSON.stringify(objetoInicial));
    formulario.nombreApellidos = document.getElementById("name").value;
    formulario.telefono = document.getElementById("telefono").value;
    formulario.tarjeta = document.getElementById("tarjeta").value;
    formulario.fechaInicio = document.getElementById("fechaInicio").value;
    formulario.fechaDev = document.getElementById("fechaDev").value;
    formulario.isbn = document.getElementById("isbn").value;
    if(formularios){
        formularios = JSON.parse(formularios);
        formularios.formularios.push(formulario);
        localStorage.setItem("formularios", JSON.stringify(formularios));
    }else{
        let array = JSON.parse(JSON.stringify(arrayInicial));
        array.formularios.push(formulario);
        localStorage.setItem("formularios", JSON.stringify(array));
    }
    location.reload();
}

window.onload = function () {
    cargarObjetos();
    let msg = document.getElementById('mensajeFecha');
    let form = document.getElementById("form1");
    let fechaDevolucionI = document.getElementById("fechaDev");
    fechaDevolucionI.disabled = true;
    let fechaInicioI = document.getElementById("fechaInicio");

    //programacion de eventos blur para controlar que las fechas sean correctas, fecha Inicio antes que fecha devolucion, y no puedes meter fecha devolucion sin haber puesto fecha inicio.
    fechaInicioI.addEventListener('blur', () => {
        if(fechaInicioI.value != ""){
            fechaDevolucionI.disabled = false;
        }else{
            fechaDevolucionI.disabled = true;
        }
    });

    fechaDevolucionI.addEventListener('blur', () => {
        let date1 = new Date(fechaInicioI.value);
        let date2 = new Date(fechaDevolucionI.value);
        if(date1 > date2){
            msg.textContent = "La fecha de inicio tiene que ser menor a la fecha de devolución";
        }else{
            msg.textContent = "";
        }
    });
    //validadores globales (se declaran aqui y se usan en el codigo html para validar los campos, usando regex)
    Pristine.addValidator("n_telefono", function(value) {
        // here `this` refers to the respective input element
        let expresion = /^[1-9][0-9]{8}$/;
        return value.match(expresion);
        
    }, "El formato del numero de teléfono es incorrecto", 5, false);

    Pristine.addValidator("nombre-apellidos", function(value) {
        // here `this` refers to the respective input element
        let expresion = /^([A-Za-z]+\s[A-Za-z]+)+$/;
        return value.match(expresion);
        
    }, "Por favor ponga su nombre y apellidos", 5, false);

    Pristine.addValidator("isbn", function(value) {
        // here `this` refers to the respective input element
        let expresion = /^[0-9]{10,13}$/;
        return value.match(expresion);
    }, "Por favor utilice el formato correcto ISBN (10-13 numeros)", 5, false);

    Pristine.addValidator("tarjeta", function(value) {
        // here `this` refers to the respective input element
        let expresion = /^[a-zA-Z][0-9]{8}$/;
        return value.match(expresion);
        
    }, "El formato de la tarjeta de biblioteca es incorrecto | Ejemplo: L12345678", 5, false);


    // create the pristine instance
    var pristine = new Pristine(form);

    form.addEventListener('submit', function (e) {
        e.preventDefault();


        // check if the form is valid
        let valid = pristine.validate(); // returns true or false
        //msg es la variable usada para mostrar error de las fechas, si esta vacia, no ha habido ningun problema.
        if(valid && msg.textContent === ""){
            addObjeto();
        }
    });
};



