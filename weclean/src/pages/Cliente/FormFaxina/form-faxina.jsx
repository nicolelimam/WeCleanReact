import React, { useState } from "react";
import { Navbar, Nav, Offcanvas, Container, Button } from "react-bootstrap";
import logoWeclean from "../../../assets/images/logo-weclean.png";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../css/globalVar.css";
import "./form-faxina.css";
import { Autocomplete, TextField, InputAdornment, IconButton } from "@mui/material";

function FormularioFaxina() {
  // Estado para armazenar o valor do botão selecionado
  const [selectedDuration, setSelectedDuration] = useState(null);
  const handleButtonClick = (duration) => setSelectedDuration(duration);
  const [quantidadeComodos, setQuantidadeComodos] = useState(1);

  const locais = [
    { label: "Minha residência", value: "residencia" },
    { label: "Meu estabelecimento", value: "estabelecimento" },
  ];

  const produtos = [
    { label: "Por mim", value: "cliente" },
    { label: "Pela empresa (+ custo adicional)", value: "empresa" },
  ];

  const tiposFaxina = [
    { label: "Faxina geral (padrão)", value: "geral" },
    { label: "Pré mudança", value: "pre_mudanca" },
    { label: "Pós obra", value: "pos_obra" },
  ];

  const handleIncrement = () => {
    if (quantidadeComodos < 12) setQuantidadeComodos(quantidadeComodos + 1);
  };
  
  const handleDecrement = () => {
    if (quantidadeComodos > 1) setQuantidadeComodos(quantidadeComodos - 1);
  };  

  return (
    <div className="form-faxina-container">
      <ToastContainer />
      <Navbar bg="white" expand="lg" fixed="top" className="shadow-sm">
        <Container>
          <Navbar.Brand href="#" className="fs-4 logo">
            <span>
              <img src={logoWeclean} alt="Logo img" className="logo-weclean" />
            </span>
            WeClean
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="offcanvasNavbar" />
          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="start"
          >
            <Offcanvas.Header closeButton className="border-bottom">
              <Offcanvas.Title id="offcanvasNavbarLabel">
                <span>
                  <img
                    src={logoWeclean}
                    alt="Logo img"
                    className="logo-weclean"
                  />
                </span>
                <span className="mobile-logo-text">WeClean</span>
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-center align-items-center flex-grow-1 pe-3">
                <Nav.Link href="#">Início</Nav.Link>
              </Nav>
              <div className="d-flex flex-column justify-content-center flex-lg-row align-items-center gap-2">
                <button className="btn-logout-ff">
                  <i className="bi bi-box-arrow-right"></i> Sair
                </button>
              </div>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>

      <div className="form-faxina-content">
        <div className="ff-title-div">
          <h2>Agendamento</h2>
        </div>
        <form action="" className="form-faxina">
          <div className="form-faxina-row">
            <div className="form-faxina-item">
              <label htmlFor="" className="ff-label">
                Modalidade do serviço:
              </label>
              <span className="ff-text" id="modalidadeServico">
                Faxina geral
              </span>
            </div>
          </div>
          <div className="form-faxina-row">
            <div className="form-faxina-item" style={{ width: "100%" }}>
              {" "}
              <label className="ff-label">Para onde é o serviço?</label>
              <Autocomplete
                fullWidth
                options={locais}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Selecione uma opção"
                    sx={{
                      height: "35px",
                      "& .MuiOutlinedInput-root": {
                        height: "35px",
                        borderColor: "var(--corPrincipal)",
                      },
                    }}
                  />
                )}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: "35px",
                    border: "0.5px solid var(--corPrincipal)",
                  },
                  "& .MuiAutocomplete-option": {
                    "&:hover": {
                      backgroundColor: "var(--corPrincipal)",
                      color: "white",
                    },
                  },
                }}
              />
            </div>

            <div className="form-faxina-item">
              <label className="ff-label">
                Quantidade de cômodos a serem limpos:
              </label>
              <input
                type="number"
                name=""
                id="quantidadeComodosFaxina"
                placeholder="1"
                className="ff-input-number"
                min={1}
                max={12}
              />
            </div>
          </div>
          <div className="form-faxina-row">
            <div className="form-faxina-item">
              <label htmlFor="" className="ff-label">
                Os produtos de limpeza serão fornecidos...
              </label>
              <Autocomplete
                fullWidth
                options={produtos}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Selecione uma opção"
                    sx={{
                      height: "35px",
                      "& .MuiOutlinedInput-root": {
                        height: "35px",
                        borderColor: "var(--corPrincipal)",
                      },
                    }}
                  />
                )}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: "35px",
                    border: "0.5px solid var(--corPrincipal)",
                  },
                  "& .MuiAutocomplete-option": {
                    "&:hover": {
                      backgroundColor: "var(--corPrincipal)",
                      color: "white",
                    },
                  },
                }}
              />
            </div>
            <div className="form-faxina-item">
              <label htmlFor="" className="ff-label">
                Tipo de faxina:
              </label>
              <Autocomplete
                fullWidth
                options={tiposFaxina}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Selecione uma opção"
                    sx={{
                      height: "35px",
                      "& .MuiOutlinedInput-root": {
                        height: "35px",
                        borderColor: "var(--corPrincipal)",
                      },
                    }}
                  />
                )}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: "35px",
                    border: "0.5px solid var(--corPrincipal)",
                  },
                  "& .MuiAutocomplete-option": {
                    "&:hover": {
                      backgroundColor: "var(--corPrincipal)",
                      color: "white",
                    },
                  },
                }}
              />
            </div>
          </div>
          <div className="form-faxina-row">
            <div className="form-faxina-item">
              <label htmlFor="" className="ff-label">
                Data para realização do serviço:
              </label>
              <input
                type="datetime-local"
                name=""
                id="dataFaxina"
                className="ff-input"
              />
            </div>
            <div className="form-faxina-item">
              <label htmlFor="" className="ff-label">
                Duração da faxina:
              </label>
              <div className="ff-multiple-buttons">
                {/* Botões com controle de estado para seleção */}
                {["3 horas", "4 horas", "5 horas", "6 horas"].map(
                  (duration) => (
                    <button
                      key={duration}
                      type="button"
                      className="ff-duracao-btn"
                      onClick={() => handleButtonClick(duration)}
                      style={{
                        background:
                          selectedDuration === duration
                            ? "var(--corPrincipal)"
                            : "var(--corBg)",
                        color:
                          selectedDuration === duration
                            ? "white"
                            : "var(--corPrincipal)",
                      }}
                    >
                      {duration}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
          <div className="form-faxina-row">
            <div className="form-faxina-item">
              <label htmlFor="" className="ff-label">
                Observações (opcional):
              </label>
              <textarea
                name=""
                id="observacoesFaxina"
                className="ff-txtarea"
              ></textarea>
            </div>
          </div>
          <div className="ff-btn-div">
            <button className="cancel-button">Cancelar e voltar</button>
            <button className="confirm-button">Confirmar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormularioFaxina;
