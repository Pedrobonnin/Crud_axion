const d = document,
$table = d.querySelector(".crud-table"),
$form = d.querySelector(".crud-form"),
$title = d.querySelector(".crud-title"),
$template = d.getElementById("crud-template").content,
$fragment = d.createDocumentFragment();

const getAll = async () => {
try {
  let res = await axios.get("http://localhost:3000/personas"),
    json = await res.data;

  console.log(json);

  json.forEach(el => {
    $template.querySelector(".Id").textContent = el.id;
    $template.querySelector(".Nombre").textContent = el.nombre;
    $template.querySelector(".Apellido").textContent = el.apellido;
    $template.querySelector(".Localidad").textContent = el.localidad;
    $template.querySelector(".edit").dataset.id = el.id;
    $template.querySelector(".edit").dataset.Nombre = el.nombre;
    $template.querySelector(".edit").dataset.Apellido = el.apellido;
    $template.querySelector(".edit").dataset.Localidad = el.localidad;
    $template.querySelector(".delete").dataset.id = el.id;

    let $clone = d.importNode($template, true);
    $fragment.appendChild($clone);
  });

  $table.querySelector(".tbody").appendChild($fragment);
} catch (err) {
  let message = err.statusText || "Ocurrió un error";
  $table.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
}
}

d.addEventListener("DOMContentLoaded", getAll);

d.addEventListener("submit", async e => {
if (e.target === $form) {
  e.preventDefault();

  if (!e.target.id.value) {
    //Crear
    try {
      let options = {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=utf-8"
        },
        data: JSON.stringify({
          nombre: e.target.nombre.value,
          apellido: e.target.apellido.value,
          localidad: e.target.localidad.value
        })
      },
        res = await axios("http://localhost:3000/personas/", options),
        json = await res.data;

      location.reload();
    } catch (err) {
      let message = err.statusText || "Ocurrió un error";
      $form.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
    }
  } else {
    //Actualizar 
    try {
      let options = {
        method: "PUT",
        headers: {
          "Content-type": "application/json; charset=utf-8"
        },
        data: JSON.stringify({
          nombre: e.target.nombre.value,
          apellido: e.target.apellido.value,
          localidad: e.target.localidad.value
        })
      },
        res = await axios(`http://localhost:3000/personas/${e.target.id.value}`, options),
        json = await res.data;

      location.reload();
    } catch (err) {
      let message = err.statusText || "Ocurrió un error";
      $form.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
    }
  }
}
});

d.addEventListener("click", async e => {
if (e.target.matches(".edit")) {
  $title.textContent = "Agregar a Lista";
  $form.nombre.value = e.target.dataset.Nombre;
  $form.apellido.value = e.target.dataset.Apellido;
  $form.localidad.value = e.target.dataset.Localidad;
  $form.id.value = e.target.dataset.id;
}

if (e.target.matches(".delete")) {
  let isDelete = confirm(`¿Estás seguro de eliminar el id ${e.target.dataset.id}?`);

  if (isDelete) {
    //Borrar 
    try {
      let options = {
        method: "DELETE",
        headers: {
          "Content-type": "application/json; charset=utf-8"
        }
      },
        res = await axios(`http://localhost:3000/personas/${e.target.dataset.id}`, options),
        json = await res.data;

      location.reload();
    } catch (err) {
      let message = err.statusText || "Ocurrió un error";
      alert(`Error ${err.status}: ${message}`);
    }
  }
}
});