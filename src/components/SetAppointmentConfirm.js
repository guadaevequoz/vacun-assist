import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

/**
 * Funcion que muestra un mensaje de confirmacion cuando un usuario paciente saca un turno
 * @param {*} show Determina si el "Modal" se visualiza o no
 *  @param {*} handleClose Funcion que cierra el "Modal" una vez sacado el turno
 *  @param {*} data Dia asignado para el turno
 * @returns Retorna un "Modal" que se despliega en pantalla cuando se saca un turno
 */
const SetAppointmentConfirm = ({ show, handleClose, data }) => {
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  //Solo se renderiza "SetAppointmentConfirm" cuando cambia el valor de "show"
  useEffect(() => {
    if (data) setDate(data);
  }, [show]);

  /**
   * Funcion que cierra el "Modal" y redirige a la pagina principal
   * @param {*} e Representa el evento
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    handleClose();
    navigate("/board");
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Tu turno fue sacado con exito</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Presentate en tu vacunatorio el dia {date} para poder vacunarte
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn-validate" type="submit" onClick={handleSubmit}>
            Ok
          </Button>
          <hr />
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SetAppointmentConfirm;
