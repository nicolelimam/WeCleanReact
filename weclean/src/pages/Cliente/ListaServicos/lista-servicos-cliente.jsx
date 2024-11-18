import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { getUserSession } from '../../../utils/session';
import { Tabs, Tab, Box, Typography, Card, CardContent, CardActions, Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import { Container, Navbar, Offcanvas, Nav } from "react-bootstrap";
import 'react-toastify/dist/ReactToastify.css';
import { LuLogOut } from "react-icons/lu";
import logoWeclean from "../../../assets/images/logo-weclean.png";
import { Link } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import './lista-servicos-cliente.css';
import { Pagination, Modal } from '@mui/material';
import { updateDoc } from "firebase/firestore";

function ListaServicosCliente() {
  const [servicos, setServicos] = useState([]);
  const [categoriaAtual, setCategoriaAtual] = useState(0);
  const [enderecoCliente, setEnderecoCliente] = useState(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
const [modalAberto, setModalAberto] = useState(false);
const [detalhesServico, setDetalhesServico] = useState(null);


const itensPorPagina = 4;

const handleAbrirModal = (detalhes) => {
  setDetalhesServico(detalhes);
  setModalAberto(true);
};

const handleFecharModal = () => {
  setModalAberto(false);
  setDetalhesServico(null);
};


  useEffect(() => {
    const carregarServicos = async () => {
        try {
          const db = getFirestore();
          const session = getUserSession();
      
          if (!session) {
            toast.error('Usuário não está logado!');
            return;
          }
      
          const { userId } = session;
      
          // Buscar os serviços do cliente
          const servicosRef = collection(db, 'servicos');
          const servicosQuery = query(servicosRef, where('cliente_id', '==', userId));
          const servicosSnapshot = await getDocs(servicosQuery);
          if (servicosSnapshot.empty) {
            console.warn('Nenhum serviço encontrado para o usuário logado:', userId);
            toast.info('Nenhum serviço encontrado.');
            setServicos([]);
            return;
          }
          
      
          const servicosData = [];
          for (const servicoDoc of servicosSnapshot.docs) {
            const servico = servicoDoc.data();
            const servicoId = servicoDoc.id;
      
            // Tentar buscar subcoleções (modalidades de serviço) dinamicamente
            const modalidades = ['faxina', 'lavanderia', 'cozinha', 'jardinagem']; // Lista das modalidades
            const detalhes = [];
            for (const modalidade of modalidades) {
              try {
                const subcolecaoRef = collection(db, `servicos/${servicoId}/${modalidade}`);
                const subcolecaoSnapshot = await getDocs(subcolecaoRef);
                if (!subcolecaoSnapshot.empty) {
                  subcolecaoSnapshot.forEach((doc) => {
                    detalhes.push({ modalidade, ...doc.data() });
                  });
                }
              } catch (error) {
                console.warn(`Subcoleção ${modalidade} não encontrada para serviço ${servicoId}.`);
              }
            }
            
      
            servicosData.push({
              id: servicoId,
              ...servico,
              detalhes, // Adiciona os detalhes encontrados
            });
          }
      
          console.log('Serviços carregados:', servicosData);
          setServicos(servicosData);
        } catch (error) {
          console.error('Erro ao carregar os serviços:', error);
          toast.error('Erro ao carregar os serviços.');
        }
      };
      

    carregarServicos();
  }, []);

  const categorias = ['Pendentes', 'Finalizados', 'Cancelados'];

  return (
    <div className='lista-servicos-cliente-container'>
      <ToastContainer />
      <Navbar bg="white" expand="lg" fixed="top" className="shadow-sm">
        <Container>
          <Navbar.Brand href="#bannerHeader" className="fs-4 logo">
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
                <Nav.Link href="/home-cliente" className=''>Início</Nav.Link>
                <Nav.Link href="#" className='active'>Serviços</Nav.Link>
              </Nav>
              <div className="d-flex flex-column justify-content-center flex-lg-row align-items-center gap-2">
                <button
                  className="btn-logout"
                  data-tooltip-id="tooltip-logout"
                  data-tooltip-content="Sair"
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

      <div className="lista-servicos-cliente-main-content">
        <div className="lsc-header">
          <h2 className="lsc-header-txt">Suas solicitações</h2>
        </div>
        <br />
        <div className="lsc-content">
          <Tabs
            value={categoriaAtual}
            className='lsc-lis-abas'
            onChange={(event, newValue) => setCategoriaAtual(newValue)}
            aria-label="Categorias de serviços"
          >
            {categorias.map((categoria, index) => (
              <Tab label={categoria} key={index} />
            ))}
          </Tabs> 
          <Box sx={{ p: 3 }} className="lsc-list">
  {servicos
    .filter((servico) => {
      const statusServico = servico.status ? servico.status.toLowerCase() : '';
      const abaAtual = categorias[categoriaAtual].toLowerCase();
      return statusServico === abaAtual || categoriaAtual === 0; // Exibe tudo na aba "Pendentes" se for a aba padrão.
    })
    .slice((paginaAtual - 1) * itensPorPagina, paginaAtual * itensPorPagina)
    .map((servico, index) => (
      <Card
        key={index}
        sx={{
          marginBottom: 2,
          backgroundColor: '#f3e5f5',
          width: 150,
          margin: '0 auto',
        }}
        className="lsc-list-card"
      >
        <CardContent>
          <Typography variant="h6" component="div">
            Serviço: {servico.modalidade_servico.charAt(0).toUpperCase() + servico.modalidade_servico.slice(1)}
          </Typography>
          <Typography variant="body2">
            Data: {new Date(servico.data_realizacao.seconds * 1000).toLocaleDateString()}
          </Typography>
          <Typography variant="body2">Funcionário: {servico.funcionario || 'Não informado'}</Typography>
        </CardContent>
        <CardActions>
          <Button size="small" color="primary" onClick={() => handleAbrirModal(servico)}>
            Ver mais
          </Button>
        </CardActions>
      </Card>
    ))}
  <Pagination
    count={Math.ceil(
      servicos.filter((servico) => {
        const statusServico = servico.status ? servico.status.toLowerCase() : '';
        const abaAtual = categorias[categoriaAtual].toLowerCase();
        return statusServico === abaAtual || categoriaAtual === 0; // Mesma lógica do filtro.
      }).length / itensPorPagina
    )}
    page={paginaAtual}
    onChange={(event, value) => setPaginaAtual(value)}
    color="primary"
    sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}
  />
</Box>

        </div>
      </div>
      <Modal
        open={modalAberto}
        onClose={handleFecharModal}
        aria-labelledby="modal-detalhes-servico"
        aria-describedby="modal-descricao-servico"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          {detalhesServico && (
            <>
              <Typography
                id="modal-detalhes-servico"
                variant="h6"
                component="h2"
              >
                Serviço:{" "}
                {detalhesServico.modalidade_servico.charAt(0).toUpperCase() +
                  detalhesServico.modalidade_servico.slice(1)}
              </Typography>
              <Typography sx={{ mt: 2 }}>
                Data Marcada:{" "}
                {new Date(
                  detalhesServico.data_realizacao.seconds * 1000
                ).toLocaleDateString()}
              </Typography>
              <Typography>Valor: R$ {detalhesServico.valor}</Typography>
              <Typography>
                Observações: {detalhesServico.observacoes}
              </Typography>
              <Typography>
                Pagamento: {detalhesServico.pagamento_status} (
                {detalhesServico.pagamento_tipo})
              </Typography>
              <Typography>Status: {detalhesServico.status}</Typography>

              {detalhesServico.detalhes.map((detalhe, idx) => (
                <Box key={idx} sx={{ mt: 2 }}>
                  <Typography>
                    Modalidade:{" "}
                    {detalhe.modalidade.charAt(0).toUpperCase() +
                      detalhe.modalidade.slice(1)}
                  </Typography>
                  {Object.entries(detalhe).map(([key, value]) => {
                    if (key !== "modalidade") {
                      return (
                        <Typography key={key}>
                          {key.charAt(0).toUpperCase() +
                            key.slice(1).replace("_", " ")}
                          : {String(value)}
                        </Typography>
                      );
                    }
                    return null;
                  })}
                </Box>
              ))}

              {detalhesServico.status.toLowerCase() === "pendente" && (
                <Button
                  variant="contained"
                  color="error"
                  sx={{ mt: 2 }}
                  onClick={async () => {
                    try {
                      const db = getFirestore();
                      const servicoRef = doc(
                        db,
                        "servicos",
                        detalhesServico.id
                      );
                      await updateDoc(servicoRef, { status: "cancelado" });
                      toast.success("Pedido cancelado com sucesso!");
                      handleFecharModal();
                      setPaginaAtual(1); // Reinicia a paginação
                      window.location.reload();
                    } catch (error) {
                      toast.error("Erro ao cancelar o pedido.");
                      console.error(
                        "Erro ao atualizar status do serviço:",
                        error
                      );
                    }
                  }}
                >
                  Cancelar Pedido
                </Button>
              )}
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
}

export default ListaServicosCliente;
