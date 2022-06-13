/**
 * Servicio que se conecta con la API, enviando los datos correspondientes a turnos y vacunas; y recibiendo su respectiva respuesta.
 */
const url = `http://localhost:8082/appointment`;

//visualizar turnos
const getAppointments = async () => {
  try {
    const resp = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      credentials: "include",
    });

    const { data } = await resp.json();

    return data;
  } catch (err) {
    return false;
  }
};

//sacar turno
const setAppointment = async (vaccine, vaccinationCenter) => {
  try {
    const resp = await fetch(url + "/virtual", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        vaccine: vaccine,
        vaccinationCenter: vaccinationCenter,
      }),
      credentials: "include",
    });
    const data = await resp.json();

    return { data };
  } catch (err) {
    return false;
  }
};

//registrar turno completado turno
const setCompletedAppointment = async (date, vaccinationCenter) => {
  try {
    const resp = await fetch(url + "/ACA VA EL ENDPOINT", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        date: date,
        vaccinationCenter: vaccinationCenter,
      }),
      credentials: "include",
    });
    const data = await resp.json();

    return { data };
  } catch (err) {
    return false;
  }
};

//validar vacuna
const validateAppointment = async (id, lot, mark, state) => {
  try {
    const resp = await fetch(url + "/validate", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        state: state,
        lot: lot,
        mark: mark,
      }),
      credentials: "include",
    });
    const data = await resp.json();
    return { data };
  } catch (err) {
    return false;
  }
};

const getAppointmentsByDNI = async (dni) => {
  try {
    const resp = await fetch(url + `/get-user-appointments/${dni}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      credentials: "include",
    });

    const data = await resp.json();
    console.log(data);
    return data;
  } catch (err) {
    return false;
  }
};

export const VaccService = {
  getAppointments,
  setAppointment,
  validateAppointment,
  getAppointmentsByDNI,
};
