import React, { useState } from "react";
import { Navbar, Nav, Offcanvas, Container, Button } from "react-bootstrap";
import logoWeclean from "../../../assets/images/logo-weclean.png";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../css/globalVar.css";
import '../../../css/globalForm.css';


function FormularioJardinagem() {

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
                Serviço de jardinagem
              </span>
            </div>
          </div>
          <div className="form-default-row">
            <div className="form-default-item">
              <label htmlFor="" className="f-label">
                Tipo de serviço:
              </label>
              <select name="" id="" className="form-select">
                <option value="">Manutenção</option>
                <option value="">Paisagismo</option>
                <option value="">Corte de grama</option>
                <option value="">Poda de árvores e arbustos</option>
              </select>
            </div>
            <div className="form-default-item">
              <label htmlFor="" className="f-label">
                Tipo de local:
              </label>
              <select name="" id="" className="form-select">
                <option value="">Jardim residencial</option>
                <option value="">Jardim empresarial</option>
              </select>
            </div>
            
          </div>
          <div className="form-default-row">
          <div className="form-default-item">
              <label htmlFor="" className="f-label">
                Tamanho da área verda (em m²):
              </label>
              <input type="text" className="f-input" placeholder="Ex: 4"/>
            </div>
            <div className="form-default-item">
                <label htmlFor="" className="f-label">
                    Frequência de serviço:
                </label>
                <select name="" id="" className="form-select">
                    <option value="">Único</option>
                    <option value="">Semanal</option>
                    <option value="">Mensal</option>
                </select>
            </div>
            
          </div>
          <div className="form-default-row">
            <div className="form-default-item">
              <label htmlFor="" className="f-label">
                Data para realização do serviço:
              </label>
              <input type="datetime-local" name="" className="f-input f-date" />
            </div>
            <div className="form-default-item">
              <label htmlFor="" className="f-label">
                Observações adicionais sobre o jardim:
              </label>
              <textarea name=""  className="f-txtarea">

              </textarea>
            </div>
            
          </div>
          <br />
          <div className="form-default-row">
              <p>
                  <i className="bi bi-info-circle"></i> A negociação para o serviço em empresas deverá ser realizado diretamente com
                  a equipe de atendimento da WeClean. Ao finalizar a solicitação de serviço, você estará permitindo que entremos em contato com você.
                  <br />
                  Os equipamentos e materiais necessários para o serviço de jardinagem será
                  fornecido pela WeClean como suporte ao prestador de serviço. 
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

export default FormularioJardinagem;
