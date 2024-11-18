import React, { useState, useEffect } from "react";
import { Navbar, Nav, Offcanvas, Container, Button } from "react-bootstrap";
import logoWeclean from "../../../assets/images/logo-weclean.png";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../css/globalVar.css";
import "./form-faxina.css";
import { useNavigate } from "react-router-dom";
import { Autocomplete, TextField, InputAdornment, IconButton } from "@mui/material";
import Chatbot from "../../../components/ChatBot/chatbot";
import { db } from "../../../backend/firebase";
import { doc, setDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getUserSession } from "../../../utils/session";

function FormularioFaxina() {
  const [selectedDuration, setSelectedDuration] = useState(null);
  const handleButtonClick = (duration) => setSelectedDuration(duration);
  const [quantidadeComodos, setQuantidadeComodos] = useState(1);
  const [preco, setPreco] = useState(150); 
  const [produtosFornecidos, setProdutosFornecidos] = useState('cliente'); // Estado para quem fornecerá os produtos
  const [tipoFaxina, setTipoFaxina] = useState('geral'); // Estado para o tipo de faxina
  const navigate = useNavigate();

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

  useEffect(() => {
    const novoPreco = calcularPrecoFaxina(selectedDuration, produtosFornecidos, tipoFaxina, quantidadeComodos);
    setPreco(novoPreco);
  }, [selectedDuration, quantidadeComodos, produtosFornecidos, tipoFaxina]);
  

  const handleIncrement = () => {
    if (quantidadeComodos < 12) setQuantidadeComodos(quantidadeComodos + 1);
  };
  
  const handleDecrement = () => {
    if (quantidadeComodos > 1) setQuantidadeComodos(quantidadeComodos - 1);
  };  

  // Função para calcular o preço final da faxina
  const calcularPrecoFaxina = (duracao, produtosFornecidos, tipoFaxina, qtdComodos) => {
    let precoBase = 150;
  
    // Ajusta o preço pela duração da faxina
    if (duracao === "4 horas") precoBase += 25;
    else if (duracao === "5 horas") precoBase += 35;
    else if (duracao === "6 horas") precoBase += 50;
  
    // Acréscimo se a empresa fornecer os produtos
    if (produtosFornecidos === "empresa") precoBase += 30;
  
    // Ajusta o preço pelo tipo de faxina
    switch (tipoFaxina) {
      case "pre_mudanca":
        precoBase += 40;
        break;
      case "pos_obra":
        precoBase += 60;
        break;
      default:
        break;
    }
  
    // Acréscimo para quantidade de cômodos (a partir de 5)
    if (qtdComodos >= 5 && qtdComodos <= 10) {
      precoBase += (qtdComodos - 4) * 10; // R$10 por cômodo adicional acima de 4
    }
  
    return precoBase;
  };
  


const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    // Captura os dados preenchidos no formulário
    const clienteId = getUserSession().userId; // Pega o ID do cliente logado
    const dataRealizacao = document.getElementById('dataFaxina').value;
    const quantidadeComodos = document.getElementById('quantidadeComodosFaxina').value;
    const localServico = locais.find(loc => loc.label === document.querySelector('.MuiAutocomplete-inputRoot input').value).value;
    const produtosFornecidos = produtos.find(prod => prod.label === document.querySelectorAll('.MuiAutocomplete-inputRoot input')[1].value).value;
    const tipoFaxina = tiposFaxina.find(tipo => tipo.label === document.querySelectorAll('.MuiAutocomplete-inputRoot input')[2].value).value;
    const observacoes = document.getElementById('observacoesFaxina').value;
    const duracao = selectedDuration; // Duração da faxina selecionada

    // Calcula o preço final
    const precoFinal = calcularPrecoFaxina(duracao, produtosFornecidos, tipoFaxina);

    
    
    // Salva o serviço na coleção 'servicos'
    const servicoRef = doc(collection(db, 'servicos')); // Inicializa servicoRef antes de qualquer uso
    await setDoc(servicoRef, {
      cliente_id: clienteId,
      data_realizacao: new Date(dataRealizacao),
      funcionario_id: '',
      modalidade_servico: 'faxina',
      observacoes: observacoes || '',
      pagamento_status: 'pendente',
      valor: precoFinal.toFixed(2), // Valor final como string
      status: 'pendente',
      criado_em: serverTimestamp()
    });

    // Salva o ID do serviço no localStorage para ser utilizado no próximo formulário
    localStorage.setItem('servicoId', servicoRef.id);
    localStorage.setItem('modalidadeServico', 'faxina');

    // Salva os dados específicos da faxina na subcoleção 'faxina'
    const faxinaRef = doc(collection(servicoRef, 'faxina'));
    await setDoc(faxinaRef, {
      duracao_faxina: parseInt(duracao), // Converte para número
      local_servico: localServico,
      produtos_fornecidos: produtosFornecidos === 'cliente' ? true : false,
      qtd_comodos: parseInt(quantidadeComodos), // Converte para número
      tipo_faxina: tipoFaxina
    });

    toast.success('Faxina agendada com sucesso!');
    navigate("/form-endereco");
  } catch (error) {
    console.error('Erro ao salvar o serviço: ', error);
    toast.error('Erro ao agendar a faxina. Tente novamente.');
  }
};


  return (
    <div className="form-faxina-container">
      <ToastContainer />
      <Chatbot />
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
                max={10}
                value={quantidadeComodos}
                onChange={(e) => setQuantidadeComodos(Math.min(Math.max(parseInt(e.target.value), 1), 10))} // Limita entre 1 e 10
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
                onChange={(event, newValue) => setProdutosFornecidos(newValue ? newValue.value : 'cliente')}
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
                onChange={(event, newValue) => setTipoFaxina(newValue ? newValue.value : 'geral')}
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
            <div className="form-faxina-item preco-panel">
              <p>Valor total:</p>
              <h2 className="preco">R$ {preco.toFixed(2)}</h2>
            </div>
          </div>
          <div className="ff-btn-div">
            <button className="cancel-button">Cancelar e voltar</button>
            <button className="confirm-button" onClick={handleSubmit}>Confirmar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormularioFaxina;
