import React, { useState } from "react";
import { Navbar, Nav, Offcanvas, Container, Button } from "react-bootstrap";
import logoWeclean from "../../../assets/images/logo-weclean.png";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../css/globalVar.css";
import '../../../css/globalForm.css';


function FormularioLavanderia() {

  // Estado para armazenar o valor do botão selecionado
  const [selectedRoupaTipos, setSelectedRoupaTipos] = useState([]);

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
              <select name="" id="" className="form-select">
                <option value="">Lavagem, secagem e passagem</option>
                <option value="">Apenas lavagem e secagem</option>
                <option value="">Apenas lavagem</option>
              </select>
            </div>
            <div className="form-default-item">
              <label htmlFor="" className="f-label">
                Quantidade de peças (de roupa):
              </label>
              <select name="" id="" className="form-select">
                  <option value="">De 10 - 20</option>
                  <option value="">De 20 - 40</option>
                  <option value="">De 40 - 80</option>
                  <option value="">De 80 - 100</option>
                  <option value="">Até 150 peças de roupa</option>
              </select>
            </div>
          </div>
          <div className="form-default-row2">
              <label htmlFor="" className="f-label">
                Tipos de roupas:
              </label>
              <div className="f-multiple-buttons">
              {["Roupas comuns", "Roupas delicadas", "Roupas de cama", "Toalhas", "Tecidos escuros", "Tecidos claros", "Tecidos coloridos"].map((roupaTipo) => (
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
          <div className="form-default-row">
            <div className="form-default-item">
              <label htmlFor="" className="f-label">
                Preferências de lavagem:
              </label>
              <select name="" id="" className="form-select">
                <option value="">Nenhuma</option>
                <option value="">Uso de produtos hipoalergênicos</option>
                <option value="">Lavagem a seco (taxa adicional)</option>
              </select>
            </div>
            <div className="form-default-item">
              <label htmlFor="" className="f-label">
                Data para realização do serviço:
              </label>
              <input type="datetime-local" name="" className="f-input f-date" />
            </div>
          </div>
          <div className="form-default-row">
          <div className="form-default-item fd2">
               <label htmlFor="" className="f-label">
                  Os produtos necessários para a lavagem serão fornecidos:
               </label>
               <select name="" id="" className="form-select">
                <option value="">Por mim</option>
                <option value="">Pela WeClean (+ taxa adicional)</option>
               </select>
            </div>
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
                  <i className="bi bi-info-circle"></i> Os equipamentos para realização de serviço (máquina de lavar, máquina secadora e ferro de passar) devem ser
                  fornecidos pelo cliente. A taxa adicional para os produtos utilizados serão calculados de acordo com a quantidade de peças de roupa a serem lavadas/passadas
                  e com a complexidade do serviço. 
              </p>
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

export default FormularioLavanderia;
