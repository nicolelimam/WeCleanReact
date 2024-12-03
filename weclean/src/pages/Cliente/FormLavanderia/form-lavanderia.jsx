import React, { useState, useEffect } from "react";
import { Navbar, Nav, Offcanvas, Container, Button } from "react-bootstrap";
import logoWeclean from "../../../assets/images/logo-weclean.png";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../css/globalVar.css";
import '../../../css/globalForm.css';
import { Autocomplete, TextField } from "@mui/material";
import { getFirestore, collection, addDoc, doc, setDoc } from "firebase/firestore";
import { getUserSession } from "../../../utils/session";
import { useClearSessionAndRedirect } from "../../../utils/session";
import { LuLogOut } from "react-icons/lu";
import { Tooltip } from "react-tooltip";
import Chatbot from "../../../components/ChatBot/chatbot";

function FormularioLavanderia() {
  const [quantidadePecas, setQuantidadePecas] = useState("10a20"); // Estado para quantidade de peças
  const [preferenciaLavagem, setPreferenciaLavagem] = useState("nenhuma"); // Estado para preferências de lavagem
  const [produtosFornecidos, setProdutosFornecidos] = useState("cliente"); // Estado para quem fornecerá os produtos
  const [preco, setPreco] = useState(200); // Estado para o preço total inicial
  const [tipoServicoSelecionado, setTipoServicoSelecionado] = useState("1"); // Estado para tipo de serviço

  const handleLogout = useClearSessionAndRedirect();

  useEffect(() => {
    const novoPreco = calcularPrecoLavanderia(quantidadePecas, preferenciaLavagem, produtosFornecidos, tipoServicoSelecionado);
    setPreco(novoPreco);
  }, [quantidadePecas, preferenciaLavagem, produtosFornecidos, tipoServicoSelecionado]);
  

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

  const handleSalvarDados = async (event) => {
  event.preventDefault(); // Prevenir o comportamento padrão de recarregar a página
  const db = getFirestore();
  const session = getUserSession();

  if (!session || !session.userId) {
    toast.error("Usuário não identificado. Faça login novamente.");
    return;
  }

  try {
    // Adiciona o documento na coleção "servicos"
    const servicoRef = await addDoc(collection(db, "servicos"), {
      cliente_id: session.userId, // ID do usuário da sessão
      data_realizacao: new Date(), // Substituir pelo valor selecionado no input
      modalidade_servico: "lavanderia",
      observacoes: "", // Substituir pelo valor preenchido no campo de observações
      pagamento: "",
      pagamento_status: "pendente",
      pagamento_tipo: "",
      valor: preco,
      status: "pendente",
    });

    // Adiciona os dados específicos de lavanderia na subcoleção
    await addDoc(collection(servicoRef, "lavanderia"), {
      preferencias_lavagem: preferenciaLavagem,
      produtos_fornecidos: produtosFornecidos === "cliente",
      qtd_pecas: parseInt(quantidadePecas, 10) || 0,
      tipo_roupas: selectedRoupaTipos.length > 1 ? JSON.stringify(selectedRoupaTipos) : selectedRoupaTipos[0] || "",
      tipo_servico: tipoServicoSelecionado,
      tipo_tecidos: selectedTecidos.length > 1 ? JSON.stringify(selectedTecidos) : selectedTecidos[0] || "",
    });

    // Salva o ID do serviço no localStorage
    localStorage.setItem('servicoId', servicoRef.id);
    localStorage.setItem('modalidadeServico', 'lavanderia');

    toast.success("Serviço salvo com sucesso!");
    navigate("/form-endereco");
  } catch (error) {
    console.error("Erro ao salvar dados no Firestore:", error);
    toast.error("Erro ao salvar os dados. Tente novamente.");
  }
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

 const calcularPrecoLavanderia = (qtdPecas, preferencia, produtosFornecidos, tipoServico) => {
  let precoBase = 0;

  // Definir o preço base com base no tipo de serviço
  if (tipoServico === "1") precoBase = 220; // Lavagem, secagem e passagem
  else if (tipoServico === "2") precoBase = 200; // Apenas lavagem e secagem
  else if (tipoServico === "3") precoBase = 170; // Apenas lavagem

  // Ajuste de preço com base na quantidade de peças
  if (qtdPecas === "20a40") precoBase += 5;
  else if (qtdPecas === "40a80") precoBase += 10;
  else if (qtdPecas === "150") precoBase += 20;

  // Acréscimo se for lavagem a seco
  if (preferencia === "lavagem-a-seco") precoBase += 40;

  // Acréscimo se a empresa fornecer os produtos
  if (produtosFornecidos === "empresa") precoBase += 30;

  return precoBase;
};

const handleCancel = () => {
  navigate('/home-cliente');
};

  return (
    <div className="form-page-container">
      <ToastContainer />
      <Chatbot userType="cliente" />
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
                <Nav.Link href="/home-cliente"></Nav.Link>
              </Nav>
              <div className="d-flex flex-column justify-content-center flex-lg-row align-items-center gap-2">
                <button
                  className="btn-logout"
                  data-tooltip-id="tooltip-logout"
                  data-tooltip-content="Sair"
                  onClick={handleLogout}
                >
                  <LuLogOut />
                </button>
                <Tooltip
                  id="tooltip-logout"
                  place="bottom"
                  style={{
                    backgroundColor: "var(--corPrincipal)",
                    color: "#fff",
                  }} 
                />
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
  // Removida a prop hideInput se ela foi acidentalmente passada
  options={tipoServico}
  onChange={(event, newValue) => setTipoServicoSelecionado(newValue ? newValue.value : "1")}
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
                onChange={(event, newValue) => setQuantidadePecas(newValue ? newValue.value : "10a20")}
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
                onChange={(event, newValue) => setPreferenciaLavagem(newValue ? newValue.value : "nenhuma")}
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
                onChange={(event, newValue) => setProdutosFornecidos(newValue ? newValue.value : "cliente")}
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
            <div className="form-faxina-item preco-panel">
              <p>Valor total:</p>
              <h2 className="preco">R$ {preco}</h2> 
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
          <button onClick={handleCancel} type="reset" className="cancel-button">Cancelar e voltar</button>
            <button className="confirm-button" 
                  type="button" 
                  onClick={handleSalvarDados}
            >Confirmar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormularioLavanderia;
