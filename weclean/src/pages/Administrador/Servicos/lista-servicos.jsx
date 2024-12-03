import React, { useState, useEffect } from "react";
import MenuSidebarAdministrador from "../../../components/AdmMenuSidebar/adm-menu-sidebar";
import {
  Tabs,
  Tab,
  Box,
  Card,
  CardContent,
  Typography,
  Pagination,
  Tooltip,
  Menu,
  MenuItem,
  TextField,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import "./lista-servicos.css";
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
import { BeatLoader } from "react-spinners";

function ListaServicos() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [serviceType, setServiceType] = useState("");
  const servicesPerPage = 7;
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detalhesServico, setDetalhesServico] = useState(null);

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

          // Parse da avaliação
          let avaliacao = null;
          if (servico.avaliacao) {
            try {
              avaliacao = JSON.parse(servico.avaliacao);
            } catch (error) {
              console.warn(
                `Erro ao parsear avaliação do serviço ${servicoId}:`,
                error
              );
            }
          }

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
            avaliacao,
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
      setDetalhesServico(null)
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

  const formatarCamposDetalhes = (modalidade, detalhes) => {
    const camposPorModalidade = {
      faxina: {
        modalidade: "Modalidade",
        qtd_comodos: "Quantidade de cômodos",
        tipo_faxina: "Tipo de Faxina",
        local_servico: "Local de realização do serviço",
        duracao_faxina: "Duração da faxina",
        produtos_fornecidos: "Produtos fornecidos pela empresa?",
      },
      cozinha: {
        modalidade: "Modalidade",
        dia_semana: "Dia da Semana",
        local_servico: "Local do Serviço",
        qtd_refeicoes: "Quantidade de Refeições",
        preferencia_alimentar: "Preferência Alimentar",
        qtd_pessoas_atendidas: "Quantidade de Pessoas Atendidas",
      },
      jardinagem: {
        modalidade: "Modalidade",
        area_verde: "Área Verde (em metros)",
        tipo_local: "Tipo de Local",
        tipo_servico: "Tipo de Serviço",
      },
      lavanderia: {
        modalidade: "Modalidade",
        preferencias_lavagem: "Preferência de Lavagem",
        produtos_fornecidos: "Produtos fornecidos pela empresa?",
        qtd_pecas: "Quantidade de Peças",
        tipo_roupas: "Tipo de Roupas",
        tipo_servico: "Tipo de Serviço",
        tipo_tecidos: "Tipos de Tecidos",
      },
    };

    return Object.entries(detalhes).reduce((acc, [chave, valor]) => {
      const label = camposPorModalidade[modalidade]?.[chave] || chave;
      acc[label] = valor;
      return acc;
    }, {});
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
      <MenuAdm activePage="servicos" />
      <div className="ls-content">
        <div className="ls-main">
          <div className="ls-main-top">
            <h2>Serviços e Solicitações</h2>
            <br />
            {/* <Box
              display="flex"
              gap={2}
              alignItems="center"
              className="ls-top-filters"
            >
              <TextField
                label="Busca por número de serviço, cliente ou funcionário"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{ width: "30%" }}
              />
              <TextField
                label="Data"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={selectedDate}
                onChange={handleDateChange}
                sx={{ width: "20%" }}
              />
              <FormControl sx={{ width: "20%" }}>
                <InputLabel>Tipo de Serviço</InputLabel>
                <Select
                  value={serviceType}
                  onChange={handleServiceTypeChange}
                  label="Tipo de Serviço"
                >
                  <MenuItem value="">
                    <em>Todos</em>
                  </MenuItem>
                  <MenuItem value="Faxina">Faxina</MenuItem>
                  <MenuItem value="Lavanderia">Lavanderia</MenuItem>
                  <MenuItem value="Jardinagem">Jardinagem</MenuItem>
                  <MenuItem value="Cozinha">Cozinha</MenuItem>
                </Select>
              </FormControl>
            </Box> */}
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

            {loading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ mt: 2, width: "100%", mt: 1 }}
              >
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <BeatLoader color="#4f1d64" size={30} />
                  <br />
                  <h4>Carregando serviços...</h4>
                </div>
              </Box>
            ) : filteredServicos.length > 0 ? (
              filteredServicos.map((servico) => (
                <Card
                  key={servico.id || Math.random()}
                  sx={{ width: "80%", mb: 2 }}
                  className="ls-card"
                  onClick={() => handleAbrirModal(servico)}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      style={{
                        fontSize: "22px",
                        fontWeight: "700",
                        color: "var(--corPrincipal)",
                      }}
                    >
                      Serviço -{" "}
                      {servico.modalidade_servico || "Não especificada"}
                    </Typography>
                    <Typography>
                      Cliente: {servico.clienteNome || "Não identificado"}
                    </Typography>
                    <Typography>
                      Funcionário: {servico.funcionarioNome || "Não atribuído"}
                    </Typography>
                    <Typography>
                      Data Agendada:{" "}
                      {servico.data_realizacao
                        ? new Date(
                            servico.data_realizacao.seconds * 1000
                          ).toLocaleDateString()
                        : "Data não disponível"}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography
                variant="body1"
                color="textSecondary"
                sx={{ mt: 2, width: "100%" }}
              >
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    textAlign: "center",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <h4>Nenhum serviço corresponde à sua busca :(</h4>
                </div>
              </Typography>
            )}

            <Pagination
              count={Math.ceil(filteredServicos.length / servicesPerPage)}
              page={page}
              onChange={handlePageChange}
              sx={{ mt: 3 }}
            />
          </div>
        </div>
      </div>
      <Modal
        show={!!detalhesServico}
        onHide={() => setDetalhesServico(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="ls-card-title">
            Detalhes do Serviço
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detalhesServico ? (
            <>
              <Typography variant="body1" style={{ fontSize: "18px" }}>
                <strong>Cliente:</strong> {detalhesServico.clienteNome}
              </Typography>
              <Typography variant="body1" style={{ fontSize: "18px" }}>
                <strong>Funcionário:</strong> {detalhesServico.funcionarioNome}
              </Typography>
              <Typography variant="body1" style={{ fontSize: "18px" }}>
                <strong>Status:</strong>{" "}
                {detalhesServico.status || "Não informado"}
              </Typography>
              <Typography variant="body1" style={{ fontSize: "18px" }}>
                <strong>Valor:</strong>{" "}
                <span style={{ color: "green", fontWeight: "bold" }}>
                  R$ {detalhesServico.valor || "Não informado"}
                </span>
              </Typography>
              <Typography variant="body1" style={{ fontSize: "18px" }}>
                <strong>Observações:</strong>{" "}
                {detalhesServico.observacoes || "Nenhuma"}
              </Typography>

              <br />
              {detalhesServico.detalhes.map((detalhe, idx) => {
                const camposFormatados = formatarCamposDetalhes(
                  detalhe.modalidade,
                  detalhe
                );
                return (
                  <div key={idx} style={{ marginBottom: "10px" }}>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      style={{
                        fontSize: "20px",
                        color: "var(--corActive)",
                        marginBottom: "20px",
                      }}
                    >
                      Modalidade:{" "}
                      {detalhe.modalidade.charAt(0).toUpperCase() +
                        detalhe.modalidade.slice(1)}
                    </Typography>
                    {Object.entries(camposFormatados).map(([label, valor]) => (
                      <Typography
                        key={label}
                        variant="body2"
                        style={{ fontSize: "18px" }}
                      >
                        <strong>{label}:</strong>{" "}
                        {typeof valor === "boolean"
                          ? valor
                            ? "Sim"
                            : "Não"
                          : valor}
                      </Typography>
                    ))}

                    {detalhesServico.avaliacao && (
                      <div style={{ marginTop: "20px" }}>
                        <h5
                          style={{
                            color: "var(--corPrincipal)",
                            marginBottom: "10px",
                            fontSize: "20px",
                            fontWeight: "700",
                          }}
                        >
                          Avaliação
                        </h5>
                        <p style={{ fontSize: "18px" }}>
                          <strong>Qualidade:</strong>{" "}
                          {detalhesServico.avaliacao.qualidade ||
                            "Não avaliado"}{" "}
                          estrelas
                        </p>
                        <p style={{ fontSize: "18px" }}>
                          <strong>Profissionalismo:</strong>{" "}
                          {detalhesServico.avaliacao.profissionalismo ||
                            "Não avaliado"}{" "}
                          estrelas
                        </p>
                        <p style={{ fontSize: "18px" }}>
                          <strong>Comentário:</strong>{" "}
                          {detalhesServico.avaliacao.comentario ||
                            "Nenhum comentário."}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          ) : (
            <Typography variant="body1" color="textSecondary">
              Nenhum serviço selecionado.
            </Typography>
          )}
        </Modal.Body>
        <Modal.Footer>
          {detalhesServico &&
            (detalhesServico.status === "pendente" ||
              detalhesServico.status === "em analise") && (
              <Button
                variant="danger"
                onClick={() => cancelarServico(detalhesServico.id)}
              >
                Cancelar Serviço
              </Button>
            )}
          <Button variant="secondary" onClick={() => setDetalhesServico(null)}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ListaServicos;
