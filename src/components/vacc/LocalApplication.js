import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { NBar } from "../Navbar";
import { AuthService } from "../../services/auth.service";
import { useNavigate } from "react-router-dom";
import { VaccService } from "../../services/vacc.service";
import { AdminService } from "../../services/admin.service";

function LocalApplication() {
  let { dni, birthday, email } = useParams();
  const navigate = useNavigate();
  const [inputVaccineValue, setInputVaccineValue] = useState("");

  const [messageValue, setMessageValue] = useState("");
  const [messageConfirmValue, setMessageConfirmValue] = useState("");
  const [messageStock, setMessageStock] = useState("");

  const [loadingValue, setLoadingValue] = useState(false);
  const [inputLot, setInputLot] = useState("");
  const [inputMark, setInputMark] = useState("");
  const [usr, setUsr] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [showStock, setShowStock] = useState(true);

  const getValidations = () => {
    if (inputVaccineValue) {
      VaccService.validateLocalApliccation(
        inputVaccineValue,
        dni,
        birthday
      ).then((res) => {
        if (res.data.status === "fail") {
          setShowStock(false);
          setMessageValue(res.data.message);
          setShowInput(false);
        } else {
          setShowInput(res.data.continue);
          setShowInput(true);
        }
      });
    } else {
      setShowInput(false);
      setMessageStock("");
    }
  };
  const getStock = () => {
    if (inputVaccineValue) {
      AdminService.getStock(inputVaccineValue, usr.vaccinationCenter).then(
        (res) => {
          if (showStock) setMessageStock(`El stock actual es ${res.data.cant}`);
        }
      );
    } else {
      setMessageStock("");
      setShowInput(false);
    }
  };

  useEffect(() => {
    AuthService.getUser().then((res) => {
      if (res) setUsr(res);
      else navigate("/login");
    });
    getValidations();
    getStock();
  }, [inputVaccineValue]);

  /**
   * Funcion que maneja el cambio del "InputLot"
   * @param {*} e representa el evento.
   */
  const handleLotChange = (e) => {
    setMessageValue("");
    setMessageConfirmValue("");
    setInputLot(e.target.value);
  };

  /**
   * Funcion que maneja el cambio del "InputMark"
   * @param {*} e representa el evento.
   */
  const handleMarkChange = (e) => {
    setMessageValue("");
    setMessageConfirmValue("");
    setInputMark(e.target.value);
  };

  /**
   * Funcion que maneja el cambio de "InputVaccine"
   * @param {*} e Representa el evento
   */
  const handleVaccineChange = (e) => {
    setMessageValue("");
    setMessageConfirmValue("");
    setInputVaccineValue(e.target.value);
  };

  /**
   * Funcion que maneja el envio de datos para validar un turno
   * @param {*} e representa el evento
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    VaccService.registerLocalApliccation(
      inputVaccineValue,
      inputMark,
      inputLot,
      usr.vaccinationCenter,
      dni,
      birthday,
      email
    ).then((res) => {
      if (res.data.status === "fail") {
        setMessageValue(res.data.message);
      } else {
        AuthService.getUserByDNI(dni).then((res) => {
          setMessageConfirmValue(
            `La aplicación de la vacuna contra ${inputVaccineValue} para el paciente  ${res.fullName} se registró correctamente 😁`
          );
        });
      }
    });
  };
  const reset = () => {
    setInputLot("");
    setInputMark("");
    document.getElementById("vacc").selectedIndex = 0;
  };

  return (
    <>
      <div className="section-container">
        <NBar user={usr} />
        <form className="setAppointment" onSubmit={handleSubmit}>
          <h3>Registrar aplicación de vacuna</h3>
          <label htmlFor="vacc">Selecciona la vacuna: </label>
          <select
            className="form-select"
            onChange={handleVaccineChange}
            id="vacc"
            name="vacunas"
            required
          >
            <option></option>
            <option value="Gripe">Gripe</option>
            <option value="Covid">COVID</option>
            <option value="FiebreAmarilla">Fiebre amarilla</option>
          </select>
          {messageStock && <div>{messageStock}</div>}
          {showInput && (
            <>
              <input
                type="text"
                name="lot"
                value={inputLot}
                onChange={handleLotChange}
                placeholder="Ingrese el Lote"
              ></input>
              <input
                type="text"
                name="mark"
                value={inputMark}
                onChange={handleMarkChange}
                placeholder="Ingrese la marca"
              ></input>
              <button type="submit">
                {loadingValue && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>Registrar aplicacion</span>
              </button>
            </>
          )}

          {messageValue && (
            <div className="form-group">
              <div className="alert alert-danger" role="alert">
                {messageValue}
              </div>
            </div>
          )}
          {messageConfirmValue && (
            <div className="form-group message">
              <div className="alert alert-info" role="alert">
                {messageConfirmValue}
              </div>
            </div>
          )}
        </form>
      </div>
    </>
  );
}

export default LocalApplication;
