import React, { useState } from "react";
import { Navbar, Nav, Offcanvas, Container, Button } from "react-bootstrap";
import logoWeclean from "../../../assets/images/logo-weclean.png";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../css/globalVar.css";
import '../../../css/globalForm.css';
import Select from 'react-select';
import { Autocomplete, TextField, InputAdornment, IconButton } from "@mui/material";


function FormularioCozinha() {

  // Estado para armazenar o valor do botão selecionado
  const [selectedDiasSemanaCozinha, setSelectedDiasSemanaCozinha] = useState([]);
  const navigate = useNavigate();
  
  // Função para alterar o botão selecionado
  const handleButtonClick = (diasSemanaCozinha) => {
    if (selectedDiasSemanaCozinha.includes(diasSemanaCozinha)) {
      // Remove se já estiver selecionado
      setSelectedDiasSemanaCozinha(selectedDiasSemanaCozinha.filter(item => item !== diasSemanaCozinha));
    } else {
      // Adiciona se não estiver selecionado
      setSelectedDiasSemanaCozinha([...selectedDiasSemanaCozinha, diasSemanaCozinha]);
    }
  };

  const handleConfirmClick = () => {
    navigate('/form-endereco'); 
  };

  const locais = [
    { label: "Minha residência", value: "residencia" },
    { label: "Meu estabelecimento", value: "estabelecimento" },
  ];

  const refeicoes = [
    {label: "Apenas 1", value: "1" },
    {label: "De 1 a 3", value: "1a3"},
    {label: "De 1 a 4", value: "1a4"},
    {label: "De 1 a 6", value: "1a6"},
  ];

  const preferencias = [
    {label: "Comum", value: "comum"},
    {label: "Sem glúten", value: "sem-gluten"},
    {label: "Vegetariana", value: "vegetariana"},
    {label: "Vegana", value: "vegana"},
  ];

  const numPessoas = [
    {label: "Até 3 pessoas", value: "3"},
    {label: "3 - 10 pessoas", value: "3a10"},
    {label: "10 - 30 pessoas", value: "10a30"},
    {label: "30 - 60 pessoas", value: "30a60"},
    {label: "60 - 100 pessoas", value: "60a100" },
    {label: "Mais de 150 pessoas", value: "mais150"},
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
                Serviço de cozinha
              </span>
            </div>
          </div>
          <div className="form-default-row">
            <div className="form-default-item">
              <label htmlFor="" className="f-label">
                Para onde é o serviço?
              </label>
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
            <div className="form-default-item">
              <label htmlFor="" className="f-label">
                Quantidade de refeições por dia:
              </label>
              <Autocomplete
                fullWidth
                options={refeicoes}
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
                    Preferência alimentar:
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
                Número de pessoas a serem atendidas:
              </label>
              <Autocomplete
                fullWidth
                options={numPessoas}
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
                Dias da semana para realização do serviço:
              </label>
              <div className="f-multiple-buttons">
              {["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"].map((diasSemanaCozinha) => (
                  <button
                    key={diasSemanaCozinha}
                    type="button"
                    className="f-check-btn"
                    onClick={() => handleButtonClick(diasSemanaCozinha)}
                    style={{
                      background: selectedDiasSemanaCozinha.includes(diasSemanaCozinha)
                        ? "var(--corPrincipal)"
                        : "var(--corBg)",
                      color: selectedDiasSemanaCozinha.includes(diasSemanaCozinha)
                        ? "white"
                        : "var(--corPrincipal)",
                    }}
                  >
                    {diasSemanaCozinha}
                  </button>
                ))}
              </div>
             
            </div>
            <div className="form-default-item">
              <label htmlFor="" className="f-label">
                Data para realização do serviço:
              </label>
              <input type="datetime-local" name="" className="f-input f-date" />
            </div>
          </div>
          <div className="form-default-row">
            <div className="form-default-item">
              <label htmlFor="" className="f-label">
                Observações (opcional):
              </label>
              <textarea name=""  className="f-txtarea">

              </textarea>
            </div>
            
          </div>
          <br />
          <div className="form-default-row">
              <p>
                  <i className="bi bi-info-circle"></i> Para serviços de cozinha fornecidos a empresa, a negociação ocorrerá diretamente com a WeClean.
                  Ao finalizar essa solicitação para serviços a uma pessoa jurídica, você estará enviando uma solicitação para que a WeClean entre em contato com sua empresa.
                  Somente serviços residenciais podem ser contratados diretamente pelo site.
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

export default FormularioCozinha;
