import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthService } from "../services/auth.service";

/**
 * Funcion que permite registrar un usuario paciente
 * @returns Retorna un formulario para registrar a un ususario paciente
 */
function SignUp() {
  const navigate = useNavigate();

  const [inputDniValue, setInputDniValue] = useState("");
  const [inputPasswordValue, setInputPasswordValue] = useState("");
  const [inputMailValue, setInputMailValue] = useState("");
  const [messageValue, setMessageValue] = useState("");
  const [loadingValue, setLoadingValue] = useState(false);

  /**
   * Función que maneja el envio de datos cuando termino de completar el formulario SignUp
   * @param {*} e representa el evento.
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    AuthService.signup(
      inputDniValue,
      inputMailValue,
      inputPasswordValue + ""
    ).then((res) => {
      if (res.data.status === "fail") {
        setInputDniValue("");
        setInputPasswordValue("");
        setInputMailValue("");
        setMessageValue(res.data.message);
        setLoadingValue(false);
      } else {
        navigate("/confirm");
      }
    });
  };

  /**
   * Funcion que maneja el cambio de "InputDni"
   * @param {*} e representa el evento.
   */
  const handleDniChange = (e) => {
    setInputDniValue(e.target.value);
  };
  /**
   * Funcion que maneja el cambio de "InputPassword"
   * @param {*} e representa el evento.
   */
  const handlePasswordChange = (e) => {
    setInputPasswordValue(e.target.value);
  };
  /**
   * Funcion que maneja el cambio de "InputMail"
   * @param {*} e representa el evento.
   */
  const handleMailChange = (e) => {
    setInputMailValue(e.target.value);
  };

  return (
    <>
      <form className="form-login" onSubmit={handleSubmit}>
        <h3 className="form-login-signup-header">
          Por favor completá estos datos para continuar.
        </h3>
        <input
          type="number"
          name="dni"
          value={inputDniValue}
          onChange={handleDniChange}
          placeholder="Ingresa tu DNI."
          required
        ></input>
        <input
          type="email"
          name="email"
          value={inputMailValue}
          onChange={handleMailChange}
          placeholder="Ingresa tu mail."
          required
        ></input>
        <input
          type="password"
          name="pass"
          value={inputPasswordValue}
          onChange={handlePasswordChange}
          placeholder="Ingresa tu contraseña."
          required
        ></input>
        <button type="submit">
          {loadingValue && (
            <span className="spinner-border spinner-border-sm"></span>
          )}
          <span>Registrarse</span>
        </button>
        <p className="message">
          Ya tenes una cuenta? <Link to="/login"> Inicia sesión! </Link>
        </p>
        {messageValue && (
          <div className="form-group message">
            <div className="alert alert-danger" role="alert">
              {messageValue}
            </div>
          </div>
        )}
      </form>
    </>
  );
}

export default SignUp;
