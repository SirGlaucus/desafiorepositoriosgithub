// Constante con la URL base
const baseUrl = 'https://api.github.com/users' 

// Funcion para hacer el resquest a la api y transformar a json
const request = async (url) => {
    const response = await fetch(url)
    const result = await response.json()
    return result
}

// Las funciones getUser y getRepos nos permiten especificar a que direccion queremos realizar fetch
const getUser = async (user) => {
    const url = `${baseUrl}/${user}`
    return request(url);
}

const getRepos = async (user, pages, reposNumber) => {
    const url = `${baseUrl}/${user}/repos?page=${pages}&per_page=${reposNumber}`
    return request(url);
}

const imprimirTabla = document.querySelector('#resultados') // Constante para poder trabajar con el div del html

const llamadoDeRepos = (event) => { // Funcion creada para poder trabajar con ella en el event
    event.preventDefault()

    // Asignacion de variables para trabajar con getUser y getRepos
    const usuario = document.querySelector('#nombre').value
    const paginas = document.querySelector('#pagina').value
    const repositorios = document.querySelector('#repoPagina').value
    
    // Promise para verificar que ambas sean llamados de manera asincrona al realizar el fetch
    Promise.all([getUser(usuario), getRepos(usuario, paginas, repositorios)])
        .then(resp => {
            const datosUsuario = resp[0]

            if (datosUsuario.message === "Not Found") {
                throw 'El usuario no existe' // Error personalizado en caso de que se encuentre vacia la direccion (Da como mensaje "Not Found")
            }

            const nombreUsuario = usuario
            const nombreLogin = datosUsuario.login
            const nRepos = datosUsuario.public_repos
            const localidad = datosUsuario.location
            const tipoUsuario = datosUsuario.type
            const datosRepos = resp[1]

            let crearTabla = `
            <div class="row"><div class="col text-left"">
                <h3>Datos del Usuario</h3>
                <img src="./assets/img/corchetes.png" alt="Imagen de unos {}" class="img-fluid">
                <ul>
                    <li class="mb-3">
                        Nombre de Usuario: ${nombreUsuario}
                    </li>
                    <li class="mb-3">
                        Nombre de Login: ${nombreLogin}
                    </li>
                    <li class="mb-3">
                        Cantidad de Repositorios: ${nRepos}
                    </li>
                    <li class="mb-3">
                        Localidad: ${localidad}
                    </li>
                    <li class="mb-3">
                        Tipo de Usuario: ${tipoUsuario}
                    </li>
                </ul>
            </div>
            <div class="col text-right">
                <h3>Nombres de Repositorios</h3>
                <ul>
            ` 
            datosRepos.forEach(element => {
                crearTabla = crearTabla + `<li class="mb-3"><a href="${element.html_url}">${element.full_name}</a></li>`
            })
            crearTabla = crearTabla + `</ul></div></div>`
            // La tabla se creada agregando todo el texto a una constante la cual luego es llevada al html del selector imprimirTabla
            imprimirTabla.innerHTML = crearTabla
        })
        .catch(err => {
            alert(err)
            imprimirTabla.innerHTML = ""
        })
}

const formulario = document.querySelector('#formulario') // Selector del formulario
formulario.addEventListener('submit', llamadoDeRepos) // Evento submit y llamado de la funcion