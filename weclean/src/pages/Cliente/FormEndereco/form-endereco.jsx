import React, { useState } from "react";
import { Navbar, Nav, Offcanvas, Container, Button } from "react-bootstrap";
import logoWeclean from "../../../assets/images/logo-weclean.png";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../css/globalVar.css";
import '../../../css/globalForm.css';


function FormularioEndereco() {

  // Estado para armazenar o valor do botão selecionado
  const [selectedDiasSemanaCozinha, setSelectedDiasSemanaCozinha] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState("");
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

  // Função para alterar a seleção do radiobutton
    const handlePaymentChange = (event) => {
    setSelectedPayment(event.target.value); // Atualiza o valor selecionado
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
                <h3 className="f-sec-title">Confirme seu endereço:</h3>
            </div>
          </div>
          <div className="form-default-row2">
              <label htmlFor="" className="f-label">
                Endereço
              </label>
              <input type="text" className="f-input" placeholder="Digite seu endereço aqui" />
          </div>
          <div className="form-default-row">
          <div className="form-default-item">
              <label htmlFor="" className="f-label">
                CEP:
              </label>
              <input type="text" className="f-input" placeholder="Digite seu CEP"/>
            </div>
            <div className="form-default-item">
                <label htmlFor="" className="f-label">
                    Cidade:
                </label>
                <input type="text" className="f-input" placeholder="Insira o nome de sua cidade" />
            </div>
            <div className="form-default-item">
                <label htmlFor="" className="f-label">
                    Estado:
                </label>
                <input type="text" className="f-input" placeholder="Insira o nome do seu estado" />
            </div>
          </div>
          <br />
          <div className="form-default-row">
            <h3 className="f-sec-title">Meio de pagamento</h3>
          </div>
          <div className="form-default-row2">
            <div className="form-default-item2">
            <input
            type="radio"
            id="pagBoleto"
            name="payment"
            value="Boleto"
            checked={selectedPayment === "Boleto"} // Verifica se o valor está selecionado
            onChange={handlePaymentChange}
            />
            <label htmlFor="pagBoleto" className="f-lb-radio-btn">Boleto</label>
            </div>
            <div className="form-default-item2">
            <input
            type="radio"
            id="pagPix"
            name="payment"
            value="PIX"
            checked={selectedPayment === "PIX"} // Verifica se o valor está selecionado
            onChange={handlePaymentChange}
            />
            <label htmlFor="pagPix" className="f-lb-radio-btn">PIX</label>
            </div>
          </div>
          <div className="ff-btn-div">
            <button className="cancel-button">Cancelar e voltar</button>
            <button className="confirm-button2">Finalizar solicitação</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormularioEndereco;
