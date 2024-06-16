document.addEventListener("DOMContentLoaded", () => {
  const userForm = document.getElementById("userForm");
  const userList = document.querySelector(".user-list__grid");
  const confirmationModal = new bootstrap.Modal(
    document.getElementById("confirmationModal"),
  );
  const confirmationText = document.getElementById("confirmationText");
  const confirmAddUserButton = document.getElementById("confirmAddUser");

  let users = [];

  // Evento para el envío del formulario
  userForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(userForm);

    const userData = {
      firstName: formData.get("firstName").trim(),
      lastName: formData.get("lastName").trim(),
      birthDate: formData.get("birthDate"),
      email: formData.get("email").trim(),
      position: formData.get("position"),
      joinDate: formData.get("joinDate"),
    };

    let isValid = true;

    if (!userData.firstName) {
      showError(userForm.elements.firstName, "Por favor, ingresa un nombre.");
      isValid = false;
    } else {
      clearError(userForm.elements.firstName);
    }

    if (!userData.lastName) {
      showError(userForm.elements.lastName, "Por favor, ingresa un apellido.");
      isValid = false;
    } else {
      clearError(userForm.elements.lastName);
    }

    if (!isValidEmail(userData.email)) {
      showError(
        userForm.elements.email,
        "Por favor, ingresa un correo electrónico válido.",
      );
      isValid = false;
    } else {
      clearError(userForm.elements.email);
    }

    if (!userData.position) {
      showError(userForm.elements.position, "Por favor, selecciona un cargo.");
      isValid = false;
    } else {
      clearError(userForm.elements.position);
    }

    if (!userData.birthDate) {
      showError(
        userForm.elements.birthDate,
        "Por favor, ingresa una fecha de nacimiento.",
      );
      isValid = false;
    } else {
      clearError(userForm.elements.birthDate);
    }

    if (!userData.joinDate) {
      showError(
        userForm.elements.joinDate,
        "Por favor, ingresa una fecha de ingreso.",
      );
      isValid = false;
    } else {
      clearError(userForm.elements.joinDate);
    }

    if (isValid) {
      const birthDate = new Date(userData.birthDate);
      const joinDate = new Date(userData.joinDate);
      const currentDate = new Date();

      if (isValidUser(userData, birthDate, joinDate, currentDate)) {
        showModal(userData);
      }
    }
  });

  // Función para validar el formato del correo electrónico
  function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  // Función para validar el usuario y sus fechas
  function isValidUser(user, birthDate, joinDate, currentDate) {
    // Verificar correo único
    if (users.some((u) => u.email === user.email)) {
      showError(
        userForm.elements.email,
        "El correo electrónico ya está en uso.",
      );
      return false;
    } else {
      clearError(userForm.elements.email);
    }

    // Verificar si los objetos Date son válidos
    if (isNaN(birthDate.getTime()) || isNaN(joinDate.getTime())) {
      showError(
        userForm.elements.birthDate,
        "Fecha de nacimiento o fecha de ingreso no son válidas.",
      );
      return false;
    } else {
      clearError(userForm.elements.birthDate);
    }

    // Validación de la edad actual (Debe tener al menos 18 años en la fecha actual)
    if (calculateAge(birthDate, currentDate) < 18) {
      showError(
        userForm.elements.birthDate,
        "El usuario debe tener al menos 18 años a la fecha actual.",
      );
      return false;
    } else {
      clearError(userForm.elements.birthDate);
    }

    // Verificar que la fecha de ingreso no sea anterior a la fecha de nacimiento
    if (joinDate < birthDate) {
      showError(
        userForm.elements.joinDate,
        "La fecha de ingreso no puede ser anterior a la fecha de nacimiento.",
      );
      return false;
    } else {
      clearError(userForm.elements.joinDate);
    }

    // Validar la edad en la fecha de ingreso
    if (calculateAge(birthDate, joinDate) < 18) {
      showError(
        userForm.elements.joinDate,
        "El usuario debe tener al menos 18 años en la fecha de ingreso.",
      );
      return false;
    } else {
      clearError(userForm.elements.joinDate);
    }

    return true;
  }

  // Función para calcular la edad en una fecha específica
  function calculateAge(birthDate, targetDate) {
    let age = targetDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = targetDate.getMonth() - birthDate.getMonth();
    const dayDiff = targetDate.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age;
  }

  // Función para mostrar el modal de confirmación
  function showModal(user) {
    confirmationText.innerHTML = `
      <p>Nombre: ${user.firstName} ${user.lastName}</p>
      <p>Correo Electrónico: ${user.email}</p>
      <p>Cargo: ${user.position}</p>
      <p>Fecha de Ingreso: ${user.joinDate}</p>
    `;
    confirmationModal.show();
  }

  // Función para mostrar mensajes de error debajo de los campos del formulario
  function showError(inputElement, message) {
    const errorElement =
      inputElement.parentElement.querySelector(".invalid-feedback");
    inputElement.classList.add("is-invalid");
    errorElement.textContent = message;
    errorElement.style.display = "block";
  }

  // Función para limpiar los mensajes de error debajo de los campos del formulario
  function clearError(inputElement) {
    const errorElement =
      inputElement.parentElement.querySelector(".invalid-feedback");
    inputElement.classList.remove("is-invalid");
    errorElement.style.display = "none";
  }

  // Listener para limpiar los mensajes de error al modificar los campos
  Array.from(userForm.elements).forEach((element) => {
    if (element.type !== "submit") {
      element.addEventListener("input", () => {
        clearError(element);
      });
    }
  });

  // Listener para agregar usuario confirmado
  confirmAddUserButton.addEventListener("click", () => {
    const formData = new FormData(userForm);

    const userData = {
      firstName: formData.get("firstName").trim(),
      lastName: formData.get("lastName").trim(),
      birthDate: formData.get("birthDate"),
      email: formData.get("email").trim(),
      position: formData.get("position"),
      joinDate: formData.get("joinDate"),
    };

    addUserToList(userData);
    userForm.reset();
    confirmationModal.hide();
  });

  // Función para agregar usuario a la lista
  function addUserToList(user) {
    users.push(user);

    const userItem = document.createElement("div");
    userItem.className = "user-list__item col-md-3";

    userItem.innerHTML = `
      <h5>${user.firstName} ${user.lastName}</h5>
      <p>${user.email}</p>
      <p>${user.position}</p>
      <p>${user.joinDate}</p>
      <button class="btn btn-danger btn-sm">Eliminar</button>
    `;

    userItem.querySelector("button").addEventListener("click", () => {
      userList.removeChild(userItem);
      users = users.filter((u) => u.email !== user.email);
    });

    userList.appendChild(userItem);
  }
});
