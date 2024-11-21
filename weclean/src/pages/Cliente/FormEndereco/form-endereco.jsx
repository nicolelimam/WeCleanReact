import React, { useState, useEffect } from "react";
import { Navbar, Nav, Offcanvas, Container, Button } from "react-bootstrap";
import logoWeclean from "../../../assets/images/logo-weclean.png";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../css/globalVar.css";
import "../../../css/globalForm.css";
import MaskedInput from "react-text-mask";
import { getDoc, setDoc, doc, collection, getDocs, updateDoc, collectionGroup } from "firebase/firestore";
import { db } from "../../../backend/firebase";
import { getUserSession } from "../../../utils/session";
import {useNavigate } from "react-router-dom";
import JsBarcode from "jsbarcode";
import jsPDF from "jspdf";
import { QRCodeCanvas } from "qrcode.react";
import { Modal } from "react-bootstrap";
import { useClearSessionAndRedirect } from "../../../utils/session";

function FormularioEndereco() {
  const [rua, setRua] = useState("");
  const [bairro, setBairro] = useState("");
  const [numero, setNumero] = useState("");
  const [cep, setCep] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const navigate = useNavigate();
  const [showPixModal, setShowPixModal] = useState(false); 
const [pixQrCodeData, setPixQrCodeData] = useState(null); 


  // Estado para armazenar o valor do botão selecionado
  const [selectedDiasSemanaCozinha, setSelectedDiasSemanaCozinha] = useState(
    []
  );
  const [selectedPayment, setSelectedPayment] = useState("");
  // Função para alterar o botão selecionado
  const handleButtonClick = (diasSemanaCozinha) => {
    if (selectedDiasSemanaCozinha.includes(diasSemanaCozinha)) {
      // Remove se já estiver selecionado
      setSelectedDiasSemanaCozinha(
        selectedDiasSemanaCozinha.filter((item) => item !== diasSemanaCozinha)
      );
    } else {
      // Adiciona se não estiver selecionado
      setSelectedDiasSemanaCozinha([
        ...selectedDiasSemanaCozinha,
        diasSemanaCozinha,
      ]);
    }
  };

  useEffect(() => {
    const fetchEndereco = async () => {
      const userSession = getUserSession();
      if (userSession) {
        const userId = userSession.userId;
        try {
          const clientesRef = collection(db, "usuarios", userId, "clientes");
          const clientesSnapshot = await getDocs(clientesRef);
    
          if (!clientesSnapshot.empty) {
            const clienteDoc = clientesSnapshot.docs[0];
            const data = clienteDoc.data();
    
            if (data.endereco) {
              setRua(data.endereco.rua || "");
              setBairro(data.endereco.bairro || "");
              setNumero(data.endereco.numero || "");
              setCep(data.endereco.cep || "");
              setCidade(data.endereco.cidade || "");
              setEstado(data.endereco.estado || "");
            } else {
              toast.error("Endereço não encontrado.");
            }
          }
        } catch (error) {
          console.error("Erro ao buscar endereço:", error);
          toast.error("Erro ao carregar endereço.");
        }
      }
    };    
    fetchEndereco();
  }, []);

  const fetchNomeCliente = async (userId) => {
    try {
      const clienteRef = collection(db, "usuarios", userId, "clientes");
      const clienteSnapshot = await getDocs(clienteRef);
      if (!clienteSnapshot.empty) {
        const clienteDoc = clienteSnapshot.docs[0];
        return clienteDoc.data().nome || "Cliente não informado";
      }
      return "Cliente não encontrado";
    } catch (error) {
      console.error("Erro ao buscar o nome do cliente:", error);
      return "Erro ao obter nome";
    }
  };
  
  const fetchNomeFuncionario = async (funcionarioId) => {
    try {
      const funcionariosRef = collectionGroup(db, "funcionarios");
      const funcionariosSnapshot = await getDocs(funcionariosRef);
  
      for (const doc of funcionariosSnapshot.docs) {
        if (doc.id === funcionarioId) {
          return doc.data().nome || "Funcionário não informado";
        }
      }
      return "Funcionário não encontrado";
    } catch (error) {
      console.error("Erro ao buscar o nome do funcionário:", error);
      return "Erro ao obter nome";
    }
  };
  
  const handleLogout = useClearSessionAndRedirect();

  
  const fetchValorServico = async (servicoId) => {
    try {
      const servicoDoc = await getDoc(doc(db, "servicos", servicoId));
      if (servicoDoc.exists()) {
        return servicoDoc.data().valor || "0.00";
      }
      return "0.00";
    } catch (error) {
      console.error("Erro ao buscar o valor do serviço:", error);
      return "0.00";
    }
  };
  

  // const handleSaveEndereco = async (event) => {
  //   event.preventDefault();
  //   const userSession = getUserSession();
  //   if (!userSession) {
  //     toast.error("Usuário não logado.");
  //     return;
  //   }
  
  //   const userId = userSession.userId;
  //   const servicoId = localStorage.getItem("servicoId");
  //   let pixString = null;

  //   try {
  //     const valorServico = await fetchValorServico(servicoId);
  //     let linhaDigitavel = null; 

  //     if (selectedPayment === "Boleto") {
  //       linhaDigitavel = await gerarBoleto(valorServico);
  //       await updateDoc(doc(db, "servicos", servicoId), { pagamento: linhaDigitavel });
  //     } else if (selectedPayment === "PIX") {
  //       const pixString = await gerarQRCodePix(valorServico);
  //       await updateDoc(doc(db, "servicos", servicoId), { pagamento: pixString });
  //     }      

  //    const servicoRef = doc(db, "servicos", servicoId);
  //     await updateDoc(servicoRef, {
  //       pagamento_tipo: selectedPayment.toLowerCase(),
  //       pagamento: selectedPayment === "Boleto" ? linhaDigitavel : pixString,
  //     });
  
  //     // Restante do código de salvar endereço e alocar funcionário
  //   } catch (error) {
  //     console.error("Erro ao salvar endereço ou gerar boleto:", error);
  //     toast.error("Erro ao processar sua solicitação.");
  //   }
  
  //   try {
  //     const enderecoData = { rua, bairro, numero, cep, cidade, estado };
  
  //     // Atualizar endereço no Firestore
  //     const clientesRef = collection(db, "usuarios", userId, "clientes");
  //     const clientesSnapshot = await getDocs(clientesRef);
  
  //     if (!clientesSnapshot.empty) {
  //       const clienteDoc = clientesSnapshot.docs[0];
  //       await setDoc(clienteDoc.ref, { endereco: enderecoData }, { merge: true });
  //     } else {
  //       const newDocRef = doc(collection(db, "usuarios", userId, "clientes"));
  //       await setDoc(newDocRef, { endereco: enderecoData });
  //     }
  
  //     if (!rua || !bairro || !numero || !cep || !cidade || !estado) {
  //       toast.error("Preencha todos os campos obrigatórios do endereço.");
  //       return;
  //     }
  
  //     if (isNaN(parseInt(numero, 10)) || !numero.trim()) {
  //       toast.error("O número informado é inválido.");
  //       return;
  //     }

  
  //     const sucesso = await assignFuncionario(userId, cidade);
  //     if (sucesso) {
  //       toast.success("Solicitação finalizada com sucesso!");
  //       navigate("/home-cliente");
  //     } else {
  //       toast.error("Nenhum funcionário disponível no momento.");
  //     }
  //   } catch (error) {
  //     console.error("Erro ao salvar endereço:", error);
  //     toast.error("Erro ao salvar endereço.");
  //   }
  // };
  
  const handleSaveEndereco = async (event) => {
    event.preventDefault();
    const userSession = getUserSession();
    if (!userSession) {
      toast.error("Usuário não logado.");
      return;
    }
  
    const userId = userSession.userId;
    const servicoId = localStorage.getItem("servicoId");
  
    try {
      const valorServico = await fetchValorServico(servicoId);
      let linhaDigitavel = null; 
      let pixString = null;
  
      if (selectedPayment === "Boleto") {
        linhaDigitavel = await gerarBoleto(valorServico);
      } else if (selectedPayment === "PIX") {
        pixString = await gerarQRCodePix(valorServico);
      }
  
      const servicoRef = doc(db, "servicos", servicoId);
      await updateDoc(servicoRef, {
        pagamento_tipo: selectedPayment.toLowerCase(),
        pagamento: selectedPayment === "Boleto" ? linhaDigitavel : pixString,
      });
  
      // Atualizar endereço no Firestore
      const enderecoData = { rua, bairro, numero, cep, cidade, estado };
  
      const clientesRef = collection(db, "usuarios", userId, "clientes");
      const clientesSnapshot = await getDocs(clientesRef);
  
      if (!clientesSnapshot.empty) {
        const clienteDoc = clientesSnapshot.docs[0];
        await setDoc(clienteDoc.ref, { endereco: enderecoData }, { merge: true });
      } else {
        const newDocRef = doc(collection(db, "usuarios", userId, "clientes"));
        await setDoc(newDocRef, { endereco: enderecoData });
      }
  
      if (!rua || !bairro || !numero || !cep || !cidade || !estado) {
        toast.error("Preencha todos os campos obrigatórios do endereço.");
        return;
      }
  
      if (isNaN(parseInt(numero, 10)) || !numero.trim()) {
        toast.error("O número informado é inválido.");
        return;
      }
  
      const sucesso = await assignFuncionario(userId, cidade);
      if (sucesso) {
        toast.success("Solicitação finalizada com sucesso!");
        navigate("/home-cliente");
      } else {
        toast.error("Nenhum funcionário disponível no momento.");
      }
    } catch (error) {
      console.error("Erro ao salvar endereço ou gerar boleto:", error);
      toast.error("Erro ao processar sua solicitação.");
    }
  };
  
  
  
  // const assignFuncionario = async (userId, cidadeCliente) => {
  //   try {
  //     const servicoId = localStorage.getItem("servicoId");
  //     const modalidade = localStorage.getItem("modalidadeServico");
  
  //     if (!servicoId || !modalidade) {
  //       toast.error("Erro: Serviço não encontrado.");
  //       return false;
  //     }
  
  //     // Buscar todos os usuários com a subcoleção 'funcionarios'
  //     const usuariosRef = collection(db, "usuarios");
  //     const usuariosSnapshot = await getDocs(usuariosRef);
  
  //     const funcionariosDisponiveis = [];
  
  //     for (const usuarioDoc of usuariosSnapshot.docs) {
  //       const usuarioId = usuarioDoc.id;
  //       const funcionariosRef = collection(db, "usuarios", usuarioId, "funcionarios");
  //       const funcionariosSnapshot = await getDocs(funcionariosRef);
  
  //       for (const funcionarioDoc of funcionariosSnapshot.docs) {
  //         const funcionarioData = funcionarioDoc.data();
  //         const enderecoFuncionario = funcionarioData.endereco || {};
  
  //         if (
  //           funcionarioData.tipo_de_servico === modalidade &&
  //           enderecoFuncionario.cidade === cidadeCliente
  //         ) {
  //           const hoje = new Date();
  //           let compromissosSemana = parseInt(funcionarioData.compromissos_semana || "0", 10);
  //           let semana = funcionarioData.semana ? new Date(funcionarioData.semana) : null;
  
  //           // Resetar contador semanal se for uma nova semana
  //           if (semana && (hoje - semana) / (1000 * 60 * 60 * 24 * 7) >= 1) {
  //             compromissosSemana = 0; // Resetar compromissos da semana
  //             semana = hoje; // Atualizar data para a semana atual
  //           }
  
  //           // Adicionar funcionário se ainda pode assumir serviços
  //           if (compromissosSemana < 7) {
  //             funcionariosDisponiveis.push({
  //               id: funcionarioDoc.id,
  //               compromissos_semana: compromissosSemana,
  //               semana: semana || hoje,
  //               ref: funcionarioDoc.ref,
  //               ...funcionarioData,
  //             });
  //           }

  //           if (!funcionarioData.compromissos_semana || !funcionarioData.semana) {
  //             compromissosSemana = 0;
  //             semana = hoje;
  //           } else {
  //             compromissosSemana = parseInt(funcionarioData.compromissos_semana, 10);
  //             semana = new Date(funcionarioData.semana);
  //           }

  //           await updateDoc(funcionarioSelecionado.ref, {
  //             compromissos_semana: funcionarioSelecionado.compromissos_semana + 1,
  //             semana: funcionarioSelecionado.semana || hoje,
  //           });
            
            
  //         }
  //       }
  //     }
  
  //     if (funcionariosDisponiveis.length === 0) {
  //       toast.error("Nenhum funcionário disponível para esta modalidade na sua cidade.");
  //       return false;
  //     }
  
  //     // Selecionar o funcionário com menos compromissos
  //     const funcionarioSelecionado = funcionariosDisponiveis.sort(
  //       (a, b) => a.compromissos_semana - b.compromissos_semana
  //     )[0];
  
  //     // Atualizar contador semanal e data no Firestore
  //     await updateDoc(funcionarioSelecionado.ref, {
  //       compromissos_semana: funcionarioSelecionado.compromissos_semana + 1,
  //       semana: funcionarioSelecionado.semana || new Date(),
  //     });
  
  //     // Atualizar o ID do funcionário no serviço
  //     await updateDoc(doc(db, "servicos", servicoId), {
  //       funcionario_id: funcionarioSelecionado.id,
  //     });

  
  //     toast.success(`Funcionário ${funcionarioSelecionado.nome} foi atribuído ao serviço!`);
  //     return true;
  //   } catch (error) {
  //     console.error("Erro ao atribuir funcionário:", error);
  //     toast.error("Erro ao atribuir funcionário.");
  //     return false;
  //   }
  // };
  
  const assignFuncionario = async (userId, cidadeCliente) => {
    try {
      const servicoId = localStorage.getItem("servicoId");
      const modalidade = localStorage.getItem("modalidadeServico");
  
      if (!servicoId || !modalidade) {
        toast.error("Erro: Serviço não encontrado.");
        return false;
      }
  
      // Buscar todos os usuários com a subcoleção 'funcionarios'
      const usuariosRef = collection(db, "usuarios");
      const usuariosSnapshot = await getDocs(usuariosRef);
  
      const funcionariosDisponiveis = [];
  
      for (const usuarioDoc of usuariosSnapshot.docs) {
        const usuarioId = usuarioDoc.id;
        const funcionariosRef = collection(db, "usuarios", usuarioId, "funcionarios");
        const funcionariosSnapshot = await getDocs(funcionariosRef);
  
        for (const funcionarioDoc of funcionariosSnapshot.docs) {
          const funcionarioData = funcionarioDoc.data();
          const enderecoFuncionario = funcionarioData.endereco || {};
  
          // Verificar requisitos iniciais (modalidade e cidade)
          if (
            funcionarioData.tipo_de_servico === modalidade &&
            enderecoFuncionario.cidade === cidadeCliente
          ) {
            const hoje = new Date();
            let compromissosSemana = parseInt(funcionarioData.compromissos_semana || "0", 10);
            let semana = funcionarioData.semana ? new Date(funcionarioData.semana) : null;
  
            // Resetar contador semanal se for uma nova semana
            if (!semana || (hoje - semana) / (1000 * 60 * 60 * 24) >= 7) {
              compromissosSemana = 0;
              semana = hoje; // Atualizar data para a semana atual
            }
  
            // Adicionar funcionário à lista se tiver disponibilidade
            if (compromissosSemana < 7) {
              funcionariosDisponiveis.push({
                id: funcionarioDoc.id,
                compromissos_semana: compromissosSemana,
                semana,
                ref: funcionarioDoc.ref,
                ...funcionarioData,
              });
            }
          }
        }
      }
  
      if (funcionariosDisponiveis.length === 0) {
        toast.error("Nenhum funcionário disponível para esta modalidade na sua cidade.");
        return false;
      }
  
      // Selecionar o funcionário com menos compromissos
      const funcionarioSelecionado = funcionariosDisponiveis.sort(
        (a, b) => a.compromissos_semana - b.compromissos_semana
      )[0];
  
      // Atualizar contador semanal e data no Firestore
      await updateDoc(funcionarioSelecionado.ref, {
        compromissos_semana: funcionarioSelecionado.compromissos_semana + 1,
        semana: funcionarioSelecionado.semana,
      });
  
      // Atualizar o ID do funcionário no serviço
      await updateDoc(doc(db, "servicos", servicoId), {
        funcionario_id: funcionarioSelecionado.id,
      });
  
      toast.success(`Funcionário ${funcionarioSelecionado.nome} foi atribuído ao serviço!`);
      return true;
    } catch (error) {
      console.error("Erro ao atribuir funcionário:", error);
      toast.error("Erro ao atribuir funcionário.");
      return false;
    }
  };
  

   // Função para gerar boleto
   const gerarBoleto = async (valorServico) => {
    const servicoId = localStorage.getItem("servicoId");
    const servicoDoc = await getDoc(doc(db, "servicos", servicoId));
  
    let funcionarioNome = "Funcionário não atribuído";
    if (servicoDoc.exists() && servicoDoc.data().funcionario_id) {
      funcionarioNome = await fetchNomeFuncionario(servicoDoc.data().funcionario_id);
    }
  
    // Exibir toast antes de gerar o boleto
    toast.success("Pedido realizado, disponibilizaremos o boleto de pagamento para você.");
  
    const valorCentavos = (parseFloat(valorServico) * 100).toFixed(0);
    const linhaDigitavel = `23791.00000 12345.678901 23456.789012 1 ${valorCentavos}`;
  
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, linhaDigitavel, { format: "CODE128", displayValue: false });
  
    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text("Boleto WeClean", 105, 20, { align: "center" });
  
    pdf.setFontSize(12);
    pdf.text("Prestador de Serviços: WeClean", 10, 40);
    pdf.text(`Responsável pela realização do serviço: ${funcionarioNome}`, 10, 50);
    pdf.text(`Data: ${new Date().toLocaleDateString()}`, 10, 60);
    pdf.text(`Valor: R$ ${parseFloat(valorServico).toFixed(2)}`, 10, 70);
    pdf.text(`Linha Digitável: ${linhaDigitavel}`, 10, 80);
  
    const barcodeDataURL = canvas.toDataURL();
    pdf.addImage(barcodeDataURL, "PNG", 10, 90, 190, 20);
  
    pdf.save("boleto_weclean.pdf");

    return linhaDigitavel;
  };
  
  // Função para alterar a seleção do radiobutton
  const handlePaymentChange = (event) => {
    setSelectedPayment(event.target.value); // Atualiza o valor selecionado
  };

  const gerarQRCodePix = async (valorServico) => {
    const pixData = {
      chave: "suporte@weclean.com.br",
      nome: "WeClean Serviços LTDA",
      valor: parseFloat(valorServico).toFixed(2),
      cidade: "São Paulo",
      descricao: "Pagamento WeClean",
    };
  
    const pixString = `
      00020126360014BR.GOV.BCB.PIX0114${pixData.chave}
      520400005303986540${pixData.valor}5802BR
      5913${pixData.nome}6009${pixData.cidade}
      62170503***6304
    `.replace(/\s/g, ""); // Remove espaços
  
    setPixQrCodeData(pixString); // Ainda define o estado para o modal, se necessário
    setShowPixModal(true);
  
    return pixString; // Retorna o valor para uso imediato
  };
  

  const baixarQRCodePix = (pixData) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
  
    const qrCodeCanvas = document.querySelector("canvas");
    canvas.width = qrCodeCanvas.width;
    canvas.height = qrCodeCanvas.height;
    ctx.drawImage(qrCodeCanvas, 0, 0);
  
    const pdf = new jsPDF();
    pdf.text("Pagamento via Pix", 105, 10, { align: "center" });
    
    pdf.text(`Código Pix:`, 10, 20);
    const wrappedPixCode = pdf.splitTextToSize(pixData, 180);
    pdf.text(wrappedPixCode, 10, 30);
  
    const lineHeight = wrappedPixCode.length * 10; // Calcula a altura ocupada pelo texto
    const imageYPosition = 30 + lineHeight + 10; // Adiciona um espaço extra de 10 unidades abaixo do texto
  
    const imageData = canvas.toDataURL("image/png");
    pdf.addImage(imageData, "PNG", 15, imageYPosition, 180, 180);
  
    pdf.save(`QRCode_Pix_Servico_${localStorage.getItem("servicoId")}.pdf`);
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
                <button className="btn-logout-ff" onClick={handleLogout}>
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
          <div className="form-default-row">
            <div className="form-default-item">
              <label htmlFor="" className="f-label">
                Rua:
              </label>
              <input type="text" 
                className="f-input" 
                placeholder="Rua"
                value={rua}
                onChange={(e) => setRua(e.target.value)}  
              />
            </div>
            <div className="form-default-item">
              <label htmlFor="" className="f-label">
                Bairro:
              </label>
              <input type="text" 
                className="f-input" 
                placeholder="Bairro" 
                value={bairro}
                onChange={(e) => setBairro(e.target.value)} 
              />
            </div>
            <div className="form-default-item">
              <label htmlFor="" className="f-label">
                Número:
              </label>
              <MaskedInput
                mask={[/\d/, /\d/, /\d/]}
                className="f-input"
                placeholder="Número"
                value={numero}
                onChange={(e) => setNumero(e.target.value.replace(/\D/g, ""))} // Apenas números
              />
            </div>
          </div>
          <div className="form-default-row">
            <div className="form-default-item">
              <label htmlFor="" className="f-label">
                CEP:
              </label>
              <MaskedInput
                mask={[/\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/]}
                className="f-input"
                placeholder="CEP"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
              />
            </div>
            <div className="form-default-item">
              <label htmlFor="" className="f-label">
                Cidade:
              </label>
              <input
                type="text"
                className="f-input"
                placeholder="Cidade"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
              />
            </div>
            <div className="form-default-item">
              <label htmlFor="" className="f-label">
                Estado:
              </label>
              <input
                type="text"
                className="f-input"
                placeholder="Estado (XX)"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              />
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
              <label htmlFor="pagBoleto" className="f-lb-radio-btn">
                Boleto
              </label>
            </div>
            <div className="form-default-item2">
              <input
                type="radio"
                id="pagPix"
                name="payment"
                value="PIX"
                checked={selectedPayment === "PIX"} 
                onChange={handlePaymentChange}
              />
              <label htmlFor="pagPix" className="f-lb-radio-btn">
                PIX
              </label>
            </div>
          </div>
          <div className="ff-btn-div">
            <button className="cancel-button">Cancelar e voltar</button>
            <button className="confirm-button2" onClick={handleSaveEndereco}>
              Finalizar solicitação
            </button>
          </div>
        </form>
      </div>

      <Modal
        show={showPixModal}
        onHide={() => {
          setShowPixModal(false);
          navigate("/home-cliente"); // Redireciona ao fechar o modal
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Pagamento via Pix</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p className="alert alert-warning">
            Atenção! Faça o download do QR Code ou copie o código PIX antes de fechar o modal, pois essa informação não pode ser perdida.
          </p>
          {pixQrCodeData && (
            <>
              <QRCodeCanvas value={pixQrCodeData} size={256} />
              <p className="mt-3" style={{ wordWrap: "break-word", wordBreak: "break-word" }}>
                <strong>Código Pix:</strong> {pixQrCodeData}
                <br />
                <Button
                  variant="link"
                  onClick={() => navigator.clipboard.writeText(pixQrCodeData)}
                  style={{ marginLeft: "10px", padding: 0 }}
                >
                  Copiar
                </Button>
              </p>
              <Button
                variant="primary"
                className="mt-3 btn-baixar-pix"
                onClick={() => baixarQRCodePix(pixQrCodeData)}
              >
                Baixar QR Code em PDF
              </Button>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowPixModal(false);
              navigate("/home-cliente");
            }}
          >
            Fechar e voltar ao Início
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}

export default FormularioEndereco;
