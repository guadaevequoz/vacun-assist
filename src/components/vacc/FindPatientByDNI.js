import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { VaccService } from "../../services/vacc.service";
import LocalApplication from "./LocalApplication";

const FindPatientByDNI = ({ show, handleClose, dni, vaccinationCenter }) => {
  const navigate = useNavigate();
  const [loadingValue, setLoadingValue] = useState(true);

  const [fullName, setFullName] = useState("");
  const [DNI, setDNI] = useState("");
  const [appointments, setAppointments] = useState("");
  const [activeCovid, setActiveCovid] = useState(false);
  const [activeFiebreA, setActiveFiebreA] = useState(false);
  const [activeGripe, setActiveGripe] = useState(false);
  const [birthday, setBirthday] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageMail, setMessageMail] = useState("");
  const [fail, setFail] = useState(false);

  useEffect(() => {
    if (dni) {
      VaccService.getAppointmentsByDNI(dni).then((res) => {
        if (!(res.data.status === "fail")) {
          setLoadingValue(false);
          setFail(false);
          let patient = res.data.data.patient;
          let dataAppointments = res.data.data.appointments;
          if (dataAppointments) {
            dataAppointments = dataAppointments.filter((data) => {
              return data.vaccinationCenter === vaccinationCenter;
            });
            dataAppointments.map((data) => {
              switch (data.vaccine) {
                case "Covid":
                  setActiveCovid(true);
                  break;
                case "FiebreAmarilla":
                  setActiveFiebreA(true);
                  break;
                case "Gripe":
                  setActiveGripe(true);
                  break;
              }
            });
            setAppointments(dataAppointments);
          }
          setFullName(patient.fullName);
          setDNI(patient.dni);
          setBirthday(patient.birthday);
          setEmail(patient.email);
        } else {
          setLoadingValue(false);
          res.data.message === "Error de conexión con el RENAPER😢"
            ? setMessage(res.data.message)
            : setMessage(
                "No se pudo encontrar datos correspondientes a ese DNI"
              );
          setFail(true);
        }
      });
    }
  }, [show]);

  const handleSubmit = (e) => {
    e.preventDefault();

    handleClose(appointments, fullName);
    setActiveCovid(false);
    setActiveFiebreA(false);
    setActiveGripe(false);
    setAppointments("");
    setMessageMail("");
    setLoadingValue(true);
  };

  const handleMail = (e) => {
    setMessageMail("");
    setEmail(e.target.value);
  };

  const handleSubmitAplication = () => {
    email
      ? navigate(`/localApp/${DNI}/${birthday}/${email}`)
      : setMessageMail("Ingrese un mail para continuar");
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        {loadingValue ? (
          <Modal.Header>
            <span className="spinner-border spinner-border-sm"></span>
          </Modal.Header>
        ) : (
          <>
            {" "}
            <Modal.Header>
              {fail ? " Error" : "Compruebe que los datos sean correctos"}
            </Modal.Header>
            <Modal.Body>
              {fail ? (
                <p> {message} </p>
              ) : (
                <>
                  <ul>
                    <li>Nombre Completo: {fullName}</li>
                    <li>DNI:{DNI}</li>
                  </ul>
                  {appointments === "" ? (
                    <div>
                      No esta registrado. Si va a aplicarle una vacuna,
                      Registralo!
                      <label htmlFor="email">
                        Ingrese el mail del paciente para registrarlo:{" "}
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={email}
                        onChange={handleMail}
                      ></input>
                    </div>
                  ) : appointments.length === 0 ? (
                    <div>No tiene turnos activos</div>
                  ) : (
                    <ul>
                      Tiene los siguientes turnos Activos:
                      {activeCovid && <li>Covid</li>}
                      {activeFiebreA && <li>Fiebre Amarilla</li>}
                      {activeGripe && <li>Gripe</li>}
                    </ul>
                  )}
                  {messageMail && (
                    <div className="alert alert-danger" role="alert">
                      {messageMail}
                    </div>
                  )}
                  <Button
                    className="btn-validate"
                    onClick={handleSubmitAplication}
                  >
                    Registrar Aplicacion
                  </Button>{" "}
                </>
              )}
            </Modal.Body>
          </>
        )}
        <Modal.Footer>
          <Button className="btn-validate" type="submit" onClick={handleSubmit}>
            Cerrar
          </Button>
          <hr />
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FindPatientByDNI;
