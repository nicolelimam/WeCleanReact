import React, { useState, useEffect } from "react";
import { Navbar, Nav, Offcanvas, Container, Button } from "react-bootstrap";
import logoWeclean from "../../../assets/images/logo-weclean.png";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../css/globalVar.css";
import '../../../css/globalForm.css';
import Select from 'react-select';
import { Autocomplete, TextField, InputAdornment, IconButton } from "@mui/material";
import { db } from "../../../backend/firebase";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getUserSession } from "../../../utils/session";

function FormularioCozinha() {
  const [selectedDiasSemanaCozinha, setSelectedDiasSemanaCozinha] = useState([]);
  const [selectedRefeicoes, setSelectedRefeicoes] = useState(null);
  const [selectedNumPessoas, setSelectedNumPessoas] = useState(null);
  const [basePrice, setBasePrice] = useState(100);
  // Estado para armazenar o valor do botão selecionado
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

  useEffect(() => {
    let newPrice = 100;

    // Refeições
    if (selectedRefeicoes) {
      if (selectedRefeicoes.value === "1a6") {
        newPrice += 40; // Adiciona 40 reais para "De 1 a 6"
      } else if (selectedRefeicoes.value !== "1") {
        newPrice += 10; // Adiciona 10 reais para outras opções
      }
    }

    // Número de pessoas
    if (selectedNumPessoas) {
      const peopleExtra = {
        "3": 0,
        "3a10": 5,
        "10a30": 10,
        "30a60": 15,
        "60a100": 20,
        "mais150": 30,
      };
      newPrice += peopleExtra[selectedNumPessoas.value] || 0;
    }

    // Dias da semana
    if (selectedDiasSemanaCozinha.length > 1) {
      newPrice += (selectedDiasSemanaCozinha.length - 1) * 50;
    }

    setBasePrice(newPrice);
  }, [selectedRefeicoes, selectedNumPessoas, selectedDiasSemanaCozinha]);


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

  async function saveServicoData(data) {
    try {
      const userSession = getUserSession();
      if (!userSession || !userSession.userId) {
        throw new Error("Usuário não autenticado");
      }
      const clienteId = userSession.userId;
  
      // Cria o documento na coleção "servicos"
      const servicoRef = await addDoc(collection(db, "servicos"), {
        cliente_id: clienteId,
        data_realizacao: serverTimestamp(),
        funcionario_id: "",
        modalidade_servico: "cozinha",
        observacoes: data.observacoes || "",
        pagamento: "",
        pagamento_status: "pendente",
        pagamento_tipo: "",
        valor: data.precoTotal,
        status: "pendente",
      });
  
      // Salva o ID do serviço no localStorage
      localStorage.setItem("servicoId", servicoRef.id);
      localStorage.setItem("modalidadeServico", "cozinha");
  
      // Adiciona os dados da subcoleção "cozinha"
      for (const dia of data.diasSemana) {
        await addDoc(collection(servicoRef, "cozinha"), {
          dia_semana: dia,
          local_servico: data.localServico,
          preferencia_alimentar: data.preferenciaAlimentar,
          qtd_pessoas_atendidas: data.qtdPessoas,
          qtd_refeicoes: data.qtdRefeicoes,
        });
      }
  
      return servicoRef.id; // Retorna o ID do serviço criado
    } catch (error) {
      console.error("Erro ao salvar serviço:", error);
      throw error; // Propaga o erro para tratamento externo
    }
  }
  
  

  const handleConfirmClick = async (event) => {
    event.preventDefault();
  
    const localServico = "residencia"; // Substituir pelo valor selecionado
    const preferenciaAlimentar = "comum"; // Substituir pelo valor selecionado
    const diasSemana = selectedDiasSemanaCozinha; // Dias da semana selecionados
    const precoTotal = basePrice; // Calculado no estado
    const observacoes = document.querySelector("textarea.f-txtarea").value || ""; // Captura das observações
  
    const servicoData = {
      localServico,
      preferenciaAlimentar,
      diasSemana,
      qtdPessoas: selectedNumPessoas ? selectedNumPessoas.label : "",
      qtdRefeicoes: selectedRefeicoes ? selectedRefeicoes.label : "",
      observacoes,
      precoTotal,
    };
  
    try {
      const servicoId = await saveServicoData(servicoData);
      toast.success("Serviço agendado com sucesso!");
      navigate("/form-endereco");
    } catch (error) {
      toast.error("Houve um erro ao agendar o serviço.");
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
                onChange={(event, newValue) => setSelectedRefeicoes(newValue)}
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
                onChange={(event, newValue) => setSelectedNumPessoas(newValue)}
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
            
          <div className="form-default-item preco-panel" 
          style={{display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  justifyContent: "flex-end"
          }}>
            <p>Valor total:</p>
            <h3 className="preco">R$ {basePrice}</h3>
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
            <button className="confirm-button" type="button" onClick={handleConfirmClick}>
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormularioCozinha;
