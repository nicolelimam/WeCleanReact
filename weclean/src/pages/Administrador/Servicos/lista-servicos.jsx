import React, { useState, useEffect } from "react";
import MenuSidebarAdministrador from "../../../components/AdmMenuSidebar/adm-menu-sidebar";
import { Tabs, Tab, Box, Card, CardContent, Typography, Pagination, Tooltip, Menu, MenuItem, TextField, Select, InputLabel, FormControl } from "@mui/material";
import './lista-servicos.css';
import MenuAdm from "../../../components/MenuAdm/menu-adm";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc, // Adicionado aqui
} from "firebase/firestore";
// import { Modal, Button } from "@mui/material";
import { Modal, Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { db } from "../../../backend/firebase";

function ListaServicos() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [serviceType, setServiceType] = useState('');
  const servicesPerPage = 7;
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detalhesServico, setDetalhesServico] = useState(null); // Estado para os detalhes do serviço

  const handleAbrirModal = (servico) => {
    setDetalhesServico(servico);
  };

  useEffect(() => {
    const carregarServicos = async () => {
      setLoading(true);
      try {
        const servicosRef = collection(db, "servicos");
        const servicosSnapshot = await getDocs(servicosRef);
  
        const servicosData = [];
  
        for (const servicoDoc of servicosSnapshot.docs) {
          const servico = servicoDoc.data();
          const servicoId = servicoDoc.id;
  
          // Obter informações do funcionário
          let funcionarioNome = "Não atribuído";
          if (servico.funcionario_id) {
            const usuariosQuery = query(
              collection(db, "usuarios"),
              where("funcao", "==", "funcionario")
            );
            const usuariosSnapshot = await getDocs(usuariosQuery);
  
            for (const usuarioDoc of usuariosSnapshot.docs) {
              const funcionariosRef = collection(
                db,
                `usuarios/${usuarioDoc.id}/funcionarios`
              );
              const funcionariosSnapshot = await getDocs(funcionariosRef);
  
              funcionariosSnapshot.forEach((funcDoc) => {
                if (funcDoc.id === servico.funcionario_id) {
                  funcionarioNome = funcDoc.data().nome;
                }
              });
            }
          }
  
          // Obter informações do cliente
          let clienteNome = "Não identificado";
          if (servico.cliente_id) {
            const clienteRef = collection(
              db,
              `usuarios/${servico.cliente_id}/clientes`
            );
            const clienteSnapshot = await getDocs(clienteRef);
  
            clienteSnapshot.forEach((clienteDoc) => {
              clienteNome = clienteDoc.data().nome;
            });
          }

  
          // Subcoleções e campos detalhados
          const modalidades = ["faxina", "lavanderia", "cozinha", "jardinagem"];
          const detalhes = [];
          for (const modalidade of modalidades) {
            const subcolecaoRef = collection(
              db,
              `servicos/${servicoId}/${modalidade}`
            );
            const subcolecaoSnapshot = await getDocs(subcolecaoRef);
  
            subcolecaoSnapshot.forEach((doc) => {
              detalhes.push({ modalidade, ...doc.data() });
            });
          }
  
          servicosData.push({
            id: servicoId,
            ...servico,
            funcionarioNome,
            clienteNome,
            detalhes,
          });
        }
  
        setServicos(servicosData);
      } catch (error) {
        console.error("Erro ao carregar serviços:", error);
        toast.error("Erro ao carregar serviços.");
      } finally {
        setLoading(false);
      }
    };
  
    carregarServicos();
  }, []);

  

  const categorias = ["pendente", "finalizado", "cancelado", "em analise"];

  const cancelarServico = async (id) => {
    try {
      const servicoRef = doc(db, "servicos", id);
      await updateDoc(servicoRef, { status: "cancelado" });
      toast.success("Serviço cancelado com sucesso!");
  
      // Atualizar o estado local
      setServicos((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: "cancelado" } : s))
      );
    } catch (error) {
      console.error("Erro ao cancelar serviço:", error);
      toast.error("Erro ao cancelar serviço.");
    }
  };
  

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleServiceTypeChange = (event) => {
    setServiceType(event.target.value);
  };


  
  const filteredServicos = servicos
  .filter((servico) => {
    const statusAtual = categorias[activeTab];
    return servico.status === statusAtual;
  })
  .slice((page - 1) * servicesPerPage, page * servicesPerPage);  

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1299) {
        setShowSidebar(false); // oculta o menu se a largura for <= 1299px
      } else {
        setShowSidebar(true); // exibe o menu se a largura for > 1299px
      }
    };

    window.addEventListener("resize", handleResize);

    // executa o handleResize inicialmente para verificar o tamanho ao carregar a página
    handleResize();

    return () => window.removeEventListener("resize", handleResize); // Limpa o evento quando o componente desmonta
  }, []);


  const servicosExibidos = filteredServicos.slice(
    (page - 1) * servicesPerPage,
    page * servicesPerPage
  );

  
  

  return (
    <div className="lista-servicos-container">
      
      <MenuAdm activePage='servicos' />
      <div className="ls-content">
      

        <div className="ls-main">
            <div className="ls-main-top">
                <h2>Serviços e Solicitações</h2>
                <br />
                <Box display="flex" gap={2} alignItems="center" className="ls-top-filters">
              <TextField
                label="Busca por número de serviço, cliente ou funcionário"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{ width: '30%' }}
              />
              <TextField
                label="Data"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={selectedDate}
                onChange={handleDateChange}
                sx={{ width: '20%' }}
              />
              <FormControl sx={{ width: '20%' }}>
                <InputLabel>Tipo de Serviço</InputLabel>
                <Select
                  value={serviceType}
                  onChange={handleServiceTypeChange}
                  label="Tipo de Serviço"
                >
                  <MenuItem value=""><em>Todos</em></MenuItem>
                  <MenuItem value="Faxina">Faxina</MenuItem>
                  <MenuItem value="Lavanderia">Lavanderia</MenuItem>
                  <MenuItem value="Jardinagem">Jardinagem</MenuItem>
                  <MenuItem value="Cozinha">Cozinha</MenuItem>
                </Select>
              </FormControl>
            </Box>
            </div>
          
          <div className="ls-main-content">
          <Tabs 
            value={activeTab} 
            className="abas-lista" 
            onChange={handleTabChange} 
            centered
            sx={{
                "& .MuiTab-root": {
                color: "var(--corPrincipal)", 
                },
                "& .Mui-selected": {
                color: "var(--corPrincipal)", 
                fontWeight: "bold", 
                },
                "& .MuiTabs-indicator": {
                backgroundColor: "var(--corPrincipal)",
                },
            }}
            >
            <Tab label="Pendentes" />
            <Tab label="Finalizados" />
            <Tab label="Cancelados" />
            <Tab label="Em análise" />
            </Tabs>


            <Box className="servicos-lista" sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 2 }}>
  {loading ? (
    <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
      Carregando serviços...
    </Typography>
  ) : filteredServicos.length > 0 ? (
    filteredServicos.map((servico) => (
      <Card
        key={servico.id}
        sx={{ width: "80%", mb: 2 }}
        className="ls-card"
        onClick={() => handleAbrirModal(servico)}
      >
        <CardContent>
          <Typography variant="h6">
            Serviço - {servico.modalidade_servico} 
          </Typography>
          <Typography>Cliente: {servico.clienteNome}</Typography>
          <Typography>Funcionário: {servico.funcionarioNome}</Typography>
          <Typography>Data Agendada: {new Date(servico.data_realizacao.seconds * 1000).toLocaleDateString()}</Typography>
        </CardContent>
      </Card>
    ))
  ) : (
    <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
      Nenhum serviço corresponde à sua busca :(
    </Typography>
  )}
</Box>



            <Pagination
            count={Math.ceil(filteredServicos.length / servicesPerPage)}
            page={page}
            onChange={handlePageChange}
            sx={{ mt: 3 }}
          />
          </div>
         
        </div>
      </div>
      <Modal show={!!detalhesServico} onHide={() => setDetalhesServico(null)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Detalhes do Serviço</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {detalhesServico && (
      <>
        <Typography variant="body1">Cliente: {detalhesServico.clienteNome}</Typography>
        <Typography variant="body1">Funcionário: {detalhesServico.funcionarioNome}</Typography>
        <Typography variant="body1">Status: {detalhesServico.status}</Typography>
        <Typography variant="body1">Valor: R$ {detalhesServico.valor || "Não informado"}</Typography>
        <Typography variant="body1">Observações: {detalhesServico.observacoes || "Nenhuma"}</Typography>

        {detalhesServico.detalhes.map((detalhe, idx) => (
          <div key={idx} style={{ marginBottom: "10px" }}>
            <Typography variant="body1" fontWeight="bold">
              Modalidade: {detalhe.modalidade.charAt(0).toUpperCase() + detalhe.modalidade.slice(1)}
            </Typography>
            {Object.entries(detalhe).map(([chave, valor]) => {
              if (chave !== "modalidade" && valor) {
                return (
                  <Typography key={chave} variant="body2">
                    {chave}: {typeof valor === "boolean" ? (valor ? "Sim" : "Não") : valor}
                  </Typography>
                );
              }
              return null;
            })}
          </div>
        ))}

        {(detalhesServico.status === "pendente" || detalhesServico.status === "em análise") && (
          <Button
            variant="danger"
            onClick={() => cancelarServico(detalhesServico.id)}
          >
            Cancelar Serviço
          </Button>
        )}
      </>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setDetalhesServico(null)}>
      Fechar
    </Button>
  </Modal.Footer>
</Modal>



    </div>
  );
}

export default ListaServicos;
