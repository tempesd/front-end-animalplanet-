const urlAPIBase = "https://animalplanetv2-1.onrender.com/Citas";

function getDatos() {
  let params = {
    id_Cita: document.getElementById("id").value,
    doctor: document.getElementById("doctor").value,
    propietario: document.getElementById("propietario").value,
    servicio: document.getElementById("servicio").value,
    fecha: document.getElementById("fecha").value,
    motivo: document.getElementById("motivo").value,
  };
  return params;
}

function fnValidarCampos() {
  const params = getDatos();

  if (params.doctor.trim().length == 0) {
    Swal.fire("El campo doctor es requerido!", "", "info");
    return false;
  }

  if (params.propietario.trim().length == 0) {
    Swal.fire("El campo propietario es requerido!", "", "info");
    return false;
  }

  if (params.servicio.trim().length == 0) {
    Swal.fire("El campo servicio es requerido!", "", "info");
    return false;
  }

  if (params.fecha.length == 0) {
    Swal.fire("El campo fecha es requerido!", "", "info");
    return false;
  }

  if (params.motivo.trim().length == 0) {
    Swal.fire("El campo motivo es requerido!", "", "info");
    return false;
  }

  return true;
}

function fnGuardarCambios() {
  if (fnValidarCampos() == false) {
    return;
  }

  const id = parseInt($("#id").val());

  if (id === 0) {
    fnGuardar();
  } else {
    fnEditar();
  }
}

function fnGuardar() {
  const params = getDatos();

  axios
    .post(urlAPIBase, params)
    .then(function (response) {
      const data = response.data;

      if (data.msj === "OK") {
        fnListar();

        Swal.fire("¡Cita agregada!", "", "success");
        $("#citaModal").modal("hide");
        $("#citaForm")[0].reset();
        $("#id").val(0);
      } else {
        Swal.fire(data.msj, "", "info");
      }
    })
    .catch(function (error) {
      Swal.fire("Error", "Hubo un error al agregar la cita", "error");
      console.dir(error);
    });
}

function fnEditar() {
  const params = getDatos();

  axios
    .put(urlAPIBase, params)
    .then(function (response) {
      const data = response.data;

      if (data.msj === "OK") {
        fnListar();

        Swal.fire("¡Cita editada!", "", "success");
        $("#citaModal").modal("hide");
        $("#citaForm")[0].reset();
      } else {
        Swal.fire(data.msj, "", "info");
      }
    })
    .catch(function (error) {
      Swal.fire("Error", "Hubo un error al editar la cita", "error");
      console.dir(error);
    });
}

function fnListar() {
  axios
    .get(urlAPIBase)
    .then(function (response) {
      const citas = response.data;
      let row = "";

      citas.forEach(function (item) {
        row += `
      <tr>
        <td>${item.id_Cita}</td>
        <td>${item.doctor}</td>
        <td>${item.propietario}</td>
        <td>${item.servicio}</td>
        <td>${item.fecha}</td>
        <td>${item.motivo}</td>
        <td>
          <button class="btn btn-info btn-sm" onclick="fnCargarDatos(${item.id_Cita})" title='Editar'> <i class='fa fa-edit'></i></button>
          <button class="btn btn-danger btn-sm" onclick="fnEliminar(${item.id_Cita})" title='Eliminar'> <i class='fa fa-trash'></i></button>
        </td>
      </tr>
    `;
      });

      fnDestruirTabla("citas-table");
      $("#citas-table-body").html(row);
      fnCrearDataTable("citas-table");
    })
    .catch(function (error) {
      Swal.fire("Error", "Hubo un error al obtener las citas", "error");
      console.dir(error);
    });
}

function fnCargarDatos(id) {
  axios
    .get(urlAPIBase + "/" + id)
    .then(function (response) {
      const data = response.data;
      $("#id").val(data.id_Cita);
      $("#doctor").val(data.doctor);
      $("#propietario").val(data.propietario);
      $("#servicio").val(data.servicio);
      $("#fecha").val(data.fecha);
      $("#motivo").val(data.motivo);

      $("#lblTitulo").html("Editar");
      $("#citaModal").modal("show");
    })
    .catch(function (error) {
      Swal.fire("Error", "Hubo un error al cargar datos", "error");
    });
}

function fnEliminar(id) {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "¡No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, eliminarlo!",
  }).then((result) => {
    if (result.isConfirmed) {
      axios
        .delete(urlAPIBase + `/${id}`)
        .then(function (response) {
          const data = response.data;

          if (data.msj === "OK") {
            Swal.fire("¡Eliminado!", "La cita ha sido eliminada.", "success");
            fnListar();
          } else {
            Swal.fire(data.msj, "", "info");
          }
        })
        .catch(function (error) {
          Swal.fire("Error", "Hubo un error al eliminar la cita", "error");
        });
    }
  });
}

function fnNuevo() {
  $("#citaForm")[0].reset();
  $("#citaModal").modal("show");
  $("#lblTitulo").html("Nueva");
  $("#id").val(0);
}

fnListar();
