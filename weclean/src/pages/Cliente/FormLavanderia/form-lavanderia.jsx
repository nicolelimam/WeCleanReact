import React, { useState } from "react";
import { Navbar, Nav, Offcanvas, Container, Button } from "react-bootstrap";
import logoWeclean from "../../../assets/images/logo-weclean.png";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../css/globalVar.css";
import '../../../css/globalForm.css';
import { Autocomplete, TextField } from "@mui/material";


function FormularioLavanderia() {

  // Estado para armazenar o valor do botão selecionado
  const [selectedRoupaTipos, setSelectedRoupaTipos] = useState([]);
  const [selectedTecidos, setSelectedTecidos] = useState([]);
  const navigate = useNavigate();
  // Função para alterar o botão selecionado
  const handleButtonClick = (roupaTipo) => {
    if (selectedRoupaTipos.includes(roupaTipo)) {
      // Remove se já estiver selecionado
      setSelectedRoupaTipos(selectedRoupaTipos.filter(item => item !== roupaTipo));
    } else {
      // Adiciona se não estiver selecionado
      setSelectedRoupaTipos([...selectedRoupaTipos, roupaTipo]);
    }
  };

  const handleTecidoClick = (tecido) => {
    if (selectedTecidos.includes(tecido)) {
      // Remove se já estiver selecionado
      setSelectedTecidos(selectedTecidos.filter(item => item !== tecido));
    } else {
      // Adiciona se não estiver selecionado
      setSelectedTecidos([...selectedTecidos, tecido]);
    }
  };

  const handleConfirmClick = () => {
    navigate('/form-endereco'); 
  };

  const tipoServico = [
    {label: "Lavagem, secagem e passagem", value: "1"},
    {label: "Apenas lavagem e secagem", value: "2"},
    {label: "Apenas lavagem", value: "3"},
  ];

  const qtdPecas = [
    {label: "De 10 - 20", value: "10a20"},
    {label: "De 20 - 40", value: "20a40"},
    {label: "De 40 - 80", value: "40a80"},
    {label: "Até 150 peças de roupa", value: "150"},
  ];

  const preferencias = [
    {label: "Nenhuma", value: "nenhuma"},
    {label: "Uso de produtos hipoalergênicos", value: "hipoalergenicos"},
    {label: "Lavagem a seco (taxa adicional)", value: "lavagem-a-seco"},
  ];

  const produtos = [
    {label: "Por mim", value: "cliente"},
    {label: "Pela WeClean (+ taxa adicional)", value: "empresa"},
  ];

  return (
    <div className="form-page-container">
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

      <div className="form-default-content">
        <div className="f-title-div">
          <h2>Agendamento</h2>
        </div>
        <form action="" className="form-default">
          <div className="form-default-row ">
            <div className="form-default-item">
              <label htmlFor="" className="f-label">
                Modalidade do serviço:
              </label>
              <span className="ff-text" id="modalidadeServico">
                Lavanderia
              </span>
            </div>
          </div>
          <div className="form-default-row">
            <div className="form-default-item">
              <label htmlFor="" className="f-label">
                Tipo de serviço:
              </label>
              <Autocomplete
                fullWidth
                options={tipoServico}
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
            <div className="form-default-item">
              <label htmlFor="" className="f-label">
                Quantidade de peças (de roupa):
              </label>
              <Autocomplete
                fullWidth
                options={qtdPecas}
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
          <div className="form-default-row">
            <div className="form-default-item">
            <label htmlFor="" className="f-label">
                Tipos de roupas:
              </label>
              <div className="f-multiple-buttons">
              {["Roupas comuns", "Roupas delicadas", "Roupas de cama", "Toalhas"].map((roupaTipo) => (
                  <button
                    key={roupaTipo}
                    type="button"
                    className="f-check-btn"
                    onClick={() => handleButtonClick(roupaTipo)}
                    style={{
                      background: selectedRoupaTipos.includes(roupaTipo)
                        ? "var(--corPrincipal)"
                        : "var(--corBg)",
                      color: selectedRoupaTipos.includes(roupaTipo)
                        ? "white"
                        : "var(--corPrincipal)",
                    }}
                  >
                    {roupaTipo}
                  </button>
                ))}
            </div>
            </div>
              <div className="form-default-item">
                <label htmlFor="" className="f-label">
                  Tipos de tecidos:
                </label>
                <div className="f-multiple-buttons">
                  {["Tecidos escuros", "Tecidos claros", "Tecidos coloridos"].map((tecido) => (
                    <button
                      key={tecido}
                      type="button"
                      className="f-check-btn"
                      onClick={() => handleTecidoClick(tecido)}
                      style={{
                        background: selectedTecidos.includes(tecido)
                          ? "var(--corPrincipal)"
                          : "var(--corBg)",
                        color: selectedTecidos.includes(tecido)
                          ? "white"
                          : "var(--corPrincipal)",
                      }}
                    >
                      {tecido}
                    </button>
                  ))}
                  </div>
              </div>
            
          </div>
          <div className="form-default-row">
            <div className="form-default-item">
              <label htmlFor="" className="f-label">
                Preferências de lavagem:
              </label>
              <Autocomplete
                fullWidth
                options={preferencias}
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
            <div className="form-default-item">
              <label htmlFor="" className="f-label">
                Data para realização do serviço:
              </label>
              <input type="datetime-local" name="" className="f-input f-date" />
            </div>
          </div>
          <div className="form-default-row" >
          <div className="form-default-item3">
               <label htmlFor="" className="f-label">
                  Os produtos necessários para a lavagem serão fornecidos:
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
           
            
          </div>
          <div className="form-default-row">
            <div className="form-default-item">
            <label htmlFor="" className="f-label">
                Observações (opcional):
              </label>
              <textarea name=""  className="f-txtarea" style={{width: "100% !important"}}>

              </textarea>
            </div>
          </div>
          <br />
          <div className="form-default-row">
              <p>
                  <i className="bi bi-info-circle"></i> Os equipamentos para realização de serviço (máquina de lavar, máquina secadora e ferro de passar) devem ser
                  fornecidos pelo cliente. A taxa adicional para os produtos utilizados serão calculados de acordo com a quantidade de peças de roupa a serem lavadas/passadas
                  e com a complexidade do serviço. 
              </p>
          </div>
          <div className="ff-btn-div">
            <button className="cancel-button">Cancelar e voltar</button>
            <button className="confirm-button" onClick={handleConfirmClick}>Confirmar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormularioLavanderia;
