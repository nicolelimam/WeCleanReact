import React, { useState } from "react";
import { Navbar, Nav, Offcanvas, Container, Button } from "react-bootstrap";
import logoWeclean from "../../../assets/images/logo-weclean.png";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../css/globalVar.css";
import '../../../css/globalForm.css';


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
                Tipo de serviço:
              </label>
              <select name="" id="" className="form-select">
                <option value="">Residencial</option>
                <option value="">Empresarial</option>
              </select>
            </div>
            <div className="form-default-item">
              <label htmlFor="" className="f-label">
                Quantidade de refeições por dia:
              </label>
              <select name="" id="" className="form-select">
                  <option value="">Apenas 1</option>
                  <option value="">De 1 a 3</option>
                  <option value="">De 1 a 4</option>
                  <option value="">De 1 a 6</option>
              </select>
            </div>
          </div>
          <div className="form-default-row">
            <div className="form-default-item">
                <label htmlFor="" className="f-label">
                    Preferência alimentar:
                </label>
                <select name="" id="" className="form-select">
                    <option value="">Comum</option>
                    <option value="">Sem glúten</option>
                    <option value="">Vegetariana</option>
                    <option value="">Vegana</option>
                </select>
            </div>
              <div className="form-default-item">
              <label htmlFor="" className="f-label">
                Número de pessoas a serem atendidas:
              </label>
              <select name="" id="" className="form-select">
                <option value="">Até 3 pessoas</option>
                <option value="">3 - 10 pessoas</option>
                <option value="">10 - 30 pessoas</option>
                <option value="">30 - 60 pessoas</option>
                <option value="">60 - 100 pessoas</option>
                <option value="">Mais de 150 pessoas</option>
              </select>
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
