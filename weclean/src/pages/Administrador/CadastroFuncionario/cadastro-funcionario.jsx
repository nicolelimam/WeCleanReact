import React, { useState, useEffect } from "react";
import MenuSidebarAdministrador from "../../../components/AdmMenuSidebar/adm-menu-sidebar";
import "./cadastro-funcionario.css";
import { Tooltip } from "react-tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Autocomplete, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import MenuAdm from "../../../components/MenuAdm/menu-adm";
import { RiCloseLargeFill } from "react-icons/ri";
import { db, auth } from "../../../backend/firebase";
import { collection, doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import bcrypt from "bcryptjs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import MaskedInput from "react-text-mask";
import { getDocs, query, where, updateDoc} from "firebase/firestore";
import { Modal } from "react-bootstrap";

function CadastroFuncionario() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [rows, setRows] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    dataDeNascimento: "",
    cpf: "",
    telefone: "",
    modalidade: "",
    endereco: {
      cep: "",
      rua: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: "",
    },
    email: "",
    senha: "",
  });
  const [editData, setEditData] = useState({
    nome: "",
    dataDeNascimento: "",
    cpf: "",
    telefone: "",
    modalidade: "",
    endereco: {
      cep: "",
      rua: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: "",
    },
    email: "",
    senha: "",
  });
  
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedFuncionario, setSelectedFuncionario] = useState(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleStatusDirect = async (funcionario) => {
    if (!funcionario) return;
  
    try {
      console.log("Iniciando alteração de status para:", funcionario);
      const { userId, id, status } = funcionario;
  
      if (!userId || !id) {
        console.error("Dados insuficientes para localizar o funcionário.");
        toast.error("Erro ao localizar o funcionário.");
        return;
      }
  
      const funcionarioRef = doc(db, `usuarios/${userId}/funcionarios/${id}`);
      const newStatus = status === "ativo" ? "inativo" : "ativo";
  
      console.log(`Atualizando status para: ${newStatus}`);
      await updateDoc(funcionarioRef, { status: newStatus });
  
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === id ? { ...row, status: newStatus } : row
        )
      );
  
      toast.success(
        `Funcionário ${newStatus === "ativo" ? "ativado" : "desativado"} com sucesso!`
      );
    } catch (error) {
      console.error("Erro ao alterar status: ", error);
      toast.error("Erro ao alterar o status do funcionário.");
    }
  };
  

 
  const openConfirmModal = (funcionario) => {
    if (!funcionario) {
      console.error("Funcionário não fornecido para o modal.");
      return;
    }
  
    console.log("Abrindo modal de confirmação para:", funcionario);
    setSelectedFuncionario(funcionario);
    setIsConfirmModalOpen(true); // Atualiza o estado para abrir o modal
  };
  
  const closeConfirmModal = () => {
    console.log("Fechando modal de confirmação.");
    setIsConfirmModalOpen(false); // Fecha o modal
    setTimeout(() => setSelectedFuncionario(null), 300); // Limpa o funcionário após fechar o modal
  };

  useEffect(() => {
    const fetchFuncionarios = async () => {
      try {
        const usuariosRef = collection(db, "usuarios");
        const q = query(usuariosRef, where("funcao", "==", "funcionario"));
        const querySnapshot = await getDocs(q);

        const funcionariosData = [];

        for (const doc of querySnapshot.docs) {
          const userId = doc.id;
          const userData = doc.data();

          const funcionariosRef = collection(db, `usuarios/${userId}/funcionarios`);
          const funcionariosSnapshot = await getDocs(funcionariosRef);

          funcionariosSnapshot.forEach((funcDoc) => {
            const funcData = funcDoc.data();

            funcionariosData.push({
              id: funcDoc.id,
              userId: userId,
              nome: funcData.nome || "",
              email: userData.email || "",
              telefone: funcData.telefone || "",
              localizacao: funcData.endereco?.cidade || "",
              modalidade: funcData.tipo_de_servico || "",
              status: funcData.status || "ativo",
            });
          });
        }

        setRows(funcionariosData);
      } catch (error) {
        console.error("Erro ao buscar os dados dos funcionários: ", error);
      }
    };

    fetchFuncionarios();
  }, []);

  const openEditModal = (data) => {
    const funcionarioRef = doc(db, `usuarios/${data.userId}/funcionarios/${data.id}`);
    getDoc(funcionarioRef).then((docSnap) => {
      if (docSnap.exists()) {
        const funcData = docSnap.data();
        setEditData({
          id: data.id,
          userId: data.userId,
          nome: funcData.nome,
          dataDeNascimento: funcData.data_de_nascimento || "",
          cpf: funcData.cpf || "",
          telefone: funcData.telefone || "",
          modalidade: funcData.tipo_de_servico || "",
          endereco: funcData.endereco || {
            cep: "",
            rua: "",
            numero: "",
            bairro: "",
            cidade: "",
            estado: "",
          },
          email: data.email,
          senha: "", // Pode deixar vazio ou tratar como necessário
        });
      }
    });
  
    setIsEditModalOpen(true);
  };
  
  
  const closeEditModal = () => {
    setEditData(null);
    setIsEditModalOpen(false);
  };
  

  const handleEditSubmit = async () => {
    try {
      // Atualize os dados do funcionário no Firebase (ou qualquer outro backend)
      const funcionarioRef = doc(
        db,
        `usuarios/${editData.id}/funcionarios/${editData.id}`
      );
      await setDoc(funcionarioRef, { ...editData }, { merge: true });
  
      toast.success("Funcionário atualizado com sucesso!");
      closeEditModal();
  
      // Atualiza a tabela de dados
      setRows((prev) =>
        prev.map((row) => (row.id === editData.id ? editData : row))
      );
    } catch (error) {
      console.error("Erro ao atualizar funcionário: ", error);
      toast.error("Erro ao atualizar funcionário.");
    }
  };
  

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

  const modalidade = [
    { label: "Faxina", value: "faxina" },
    { label: "Lavanderia", value: "lavanderia" },
    { label: "Cozinha", value: "cozinha" },
    { label: "Jardinagem", value: "jardinagem" },
  ];

  const columns = [
  { field: "nome", headerName: "Nome", flex: 1, sortable: true },
  { field: "email", headerName: "Email", flex: 1, sortable: true },
  { field: "telefone", headerName: "Telefone", flex: 1, sortable: true },
  {
    field: "localizacao",
    headerName: "Localização",
    flex: 1,
    sortable: true,
  },
  {
    field: "modalidade",
    headerName: "Modalidade de Serviço",
    flex: 1,
    sortable: true,
  },
  {
    field: "actions",
    headerName: "Ações",
    flex: 1,
    sortable: false,
    renderCell: (params) => (
      <div>
        <Button
          variant="contained"
          color="primary"
          size="small"
          style={{ marginRight: 10 }}
          onClick={() => openEditModal(params.row)}
        >
          Editar
        </Button>
        <Button
          variant="contained"
          color={params.row.status === "ativo" ? "secondary" : "success"}
          size="small"
          onClick={() => {
            console.log("Alterando status de:", params.row);
            toggleStatusDirect(params.row); // Altera diretamente
          }}
        >
          {params.row.status === "ativo" ? "Desativar" : "Ativar"}
        </Button>
      </div>
    ),
  }
];


  const handleEdit = (id) => {
    console.log(`Editando funcionário com ID: ${id}`);
  };

  const handleDeactivate = (id) => {
    console.log(`Desativando funcionário com ID: ${id}`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name.includes("endereco.")) {
      const [_, key] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
  
    if (name.includes("endereco.")) {
      const [_, key] = name.split(".");
      setEditData((prev) => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          [key]: value,
        },
      }));
    } else {
      setEditData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Evita múltiplos envios
  
    setIsSubmitting(true);
    try {
      toast.info("Processando...");
  
      // Criptografa a senha
      const hashedPassword = await bcrypt.hash(formData.senha, 10);
  
      // Referência ao documento principal (usuario)
      const userRef = doc(collection(db, "usuarios"));
      await setDoc(userRef, {
        email: formData.email,
        senha: hashedPassword,
        funcao: "funcionario",
        criado_em: serverTimestamp(),
        atualizado_em: serverTimestamp(),
      });
  
      // Referência ao documento na subcoleção "funcionarios"
      const funcionariosRef = doc(collection(userRef, "funcionarios"));
      await setDoc(funcionariosRef, {
        nome: formData.nome,
        data_de_nascimento: formData.dataDeNascimento,
        cpf: formData.cpf,
        telefone: formData.telefone,
        tipo_de_servico: formData.modalidade,
        endereco: formData.endereco,
        status: "ativo",
        criado_em: serverTimestamp(),
        atualizado_em: serverTimestamp(),
        compromissos_semana: ""
      });
  
      toast.success("Funcionário cadastrado com sucesso!");
      closeModal();
  
      // Reseta o formulário
      setFormData({
        nome: "",
        dataDeNascimento: "",
        cpf: "",
        telefone: "",
        modalidade: "",
        endereco: {
          cep: "",
          rua: "",
          numero: "",
          bairro: "",
          cidade: "",
          estado: "",
        },
        email: "",
        senha: "",
      });
    } catch (error) {
      console.error("Erro durante o cadastro: ", error);
      toast.error("Erro ao cadastrar funcionário! Verifique os campos e tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  
  
  return (
    <div className="cadastro-funcionario-container">
      <ToastContainer />
      <MenuAdm activePage="funcionarios" />

      <div className="cf-content">
        <div className="cf-main">
          <div className="cf-main-top">
            <h2>Funcionários cadastrados</h2>
          </div>
          <div
            className="cf-main-top"
            style={{ alignItems: "flex-end", justifyContent: "flex-end" }}
          >
            <button onClick={openModal} className="cf-btn-add">
              + Novo Funcionário
            </button>
          </div>
          <div className="cf-main-content">
            <div style={{ height: "800px", width: "100%", overflowX: "auto" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              className="cf-datagrid"
              disableColumnMenu={false}
              autoHeight={false}
              sx={{
                "& .MuiDataGrid-root": {
                  backgroundColor: "var(--corBg)",
                },
                "& .MuiDataGrid-cell": {
                  whiteSpace: "nowrap",
                },
              }}
            />

            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="modal-overlay-cf">
          <div className="modal-content-cf">
            <div className="modal-header-cf">
              <h2>Cadastrar novo funcionário</h2>
              <button onClick={closeModal} className="modal-close-btn">
                <RiCloseLargeFill />
              </button>
            </div>
            <div className="modal-body-cf">
              <div className="modal-title-cf" style={{ marginBottom: "15px" }}>
                <h3>Informações pessoais</h3>
              </div>

              <div className="cf-form">
                <div className="cf-form-item">
                  <input
                    type="text"
                    className="cf-input"
                    placeholder="Nome completo"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                  />
                 
                  <MaskedInput
                    mask={[
                      /\d/,
                      /\d/,
                      "/",
                      /\d/,
                      /\d/,
                      "/",
                      /\d/,
                      /\d/,
                      /\d/,
                      /\d/,
                    ]}
                    className="cf-input"
                    placeholder="Data de nascimento"
                    name="dataDeNascimento"
                    value={formData.dataDeNascimento}
                    onChange={handleChange}
                  />
                </div>
                <div className="cf-form-item">
               
                  <MaskedInput
                    mask={[
                      /\d/,
                      /\d/,
                      /\d/,
                      ".",
                      /\d/,
                      /\d/,
                      /\d/,
                      ".",
                      /\d/,
                      /\d/,
                      /\d/,
                      "-",
                      /\d/,
                      /\d/,
                    ]}
                    className="cf-input"
                    placeholder="CPF"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                  />

                
                  <MaskedInput
                    mask={[
                      "(",
                      /\d/,
                      /\d/,
                      ")",
                      " ",
                      /\d/,
                      /\d/,
                      /\d/,
                      /\d/,
                      /\d/,
                      "-",
                      /\d/,
                      /\d/,
                      /\d/,
                      /\d/,
                    ]}
                    className="cf-input"
                    placeholder="Telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                  />
                </div>
                <div className="cf-form-item">
                  <Autocomplete
                    className="cf-select"
                    fullWidth
                    options={modalidade}
                    getOptionLabel={(option) => option.label}
                    value={
                      modalidade.find(
                        (mod) => mod.value === formData.modalidade
                      ) || null
                    }
                    onChange={(e, newValue) =>
                      setFormData((prev) => ({
                        ...prev,
                        modalidade: newValue ? newValue.value : "",
                      }))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Modalidade de atuação"
                        sx={{
                          height: "20px !important",
                          fontFamily: "'DM Sans', sans-serif",
                          background: "var(--corBg)",
                          "& .MuiOutlinedInput-root": {
                            height: "40px",
                            borderColor: "var(--corPrincipal)",
                            borderRadius: "10px",
                          },
                        }}
                      />
                    )}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: "40px",
                        border: "1px solid var(--corPrincipal)",
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
                <div className="modal-title-cf">
                  <h3>Endereço</h3>
                </div>
                <div className="cf-form-item">
               
                  <MaskedInput
                    mask={[/\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/]}
                    className="cf-input"
                    placeholder="CEP"
                    name="endereco.cep"
                    value={formData.endereco.cep}
                    onChange={handleChange}
                  />

                  <input
                    type="text"
                    className="cf-input"
                    placeholder="Rua"
                    name="endereco.rua"
                    value={formData.endereco.rua}
                    onChange={handleChange}
                  />
                </div>
                <div className="cf-form-item">
                 
                  <MaskedInput
                    mask={[/\d/, /\d/, /\d/]} 
                    className="cf-input"
                    placeholder="Número"
                    name="endereco.numero"
                    value={formData.endereco.numero}
                    onChange={handleChange}
                  />

                  <input
                    type="text"
                    className="cf-input"
                    placeholder="Bairro"
                    name="endereco.bairro"
                    value={formData.endereco.bairro}
                    onChange={handleChange}
                  />
                </div>
                <div className="cf-form-item">
                  <input
                    type="text"
                    className="cf-input"
                    placeholder="Cidade"
                    name="endereco.cidade"
                    value={formData.endereco.cidade}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    className="cf-input"
                    placeholder="Estado"
                    style={{ marginBottom: "20px" }}
                    name="endereco.estado"
                    value={formData.endereco.estado}
                    onChange={handleChange}
                  />
                </div>
                <div className="modal-title-cf">
                  <h3>Credenciais de login</h3>
                </div>

                <div className="cf-form-item">
                  <input
                    type="email"
                    className="cf-input"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <input
                    type="password"
                    className="cf-input"
                    placeholder="Senha inicial"
                    name="senha"
                    value={formData.senha}
                    onChange={handleChange}
                  />
                </div>
                <div className="cf-buton-div">
                  <button
                    className="cf-btn-submit"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Cadastrando..." : "Cadastrar funcionário"}
                </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

{isEditModalOpen && editData && (
  <div className="modal-overlay-cf">
    <div className="modal-content-cf">
      <div className="modal-header-cf">
        <h2>Editar Funcionário</h2>
        <button onClick={closeEditModal} className="modal-close-btn">
          <RiCloseLargeFill />
        </button>
      </div>
      <div className="modal-body-cf">
        <div className="modal-title-cf" style={{ marginBottom: "15px" }}>
          <h3>Informações pessoais</h3>
        </div>

        <div className="cf-form">
          <div className="cf-form-item">
            <input
              type="text"
              className="cf-input"
              placeholder="Nome completo"
              name="nome"
              value={editData?.nome || ""}
              onChange={(e) =>
                setEditData((prev) => ({ ...prev, nome: e.target.value }))
              }
            />

            <MaskedInput
              mask={[
                /\d/,
                /\d/,
                "/",
                /\d/,
                /\d/,
                "/",
                /\d/,
                /\d/,
                /\d/,
                /\d/,
              ]}
              className="cf-input"
              placeholder="Data de nascimento"
              name="dataDeNascimento"
              value={editData?.dataDeNascimento || ""}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  dataDeNascimento: e.target.value,
                }))
              }
            />
          </div>
          <div className="cf-form-item">
            <MaskedInput
              mask={[
                /\d/,
                /\d/,
                /\d/,
                ".",
                /\d/,
                /\d/,
                /\d/,
                ".",
                /\d/,
                /\d/,
                /\d/,
                "-",
                /\d/,
                /\d/,
              ]}
              className="cf-input"
              placeholder="CPF"
              name="cpf"
              value={editData?.cpf || ""}
              onChange={(e) =>
                setEditData((prev) => ({ ...prev, cpf: e.target.value }))
              }
            />

            <MaskedInput
              mask={[
                "(",
                /\d/,
                /\d/,
                ")",
                " ",
                /\d/,
                /\d/,
                /\d/,
                /\d/,
                /\d/,
                "-",
                /\d/,
                /\d/,
                /\d/,
                /\d/,
              ]}
              className="cf-input"
              placeholder="Telefone"
              name="telefone"
              value={editData?.telefone || ""}
              onChange={(e) =>
                setEditData((prev) => ({ ...prev, telefone: e.target.value }))
              }
            />
          </div>
          <div className="cf-form-item">
            <Autocomplete
              className="cf-select"
              fullWidth
              options={modalidade}
              getOptionLabel={(option) => option.label}
              value={
                modalidade.find(
                  (mod) => mod.value === editData?.modalidade
                ) || null
              }
              onChange={(e, newValue) =>
                setEditData((prev) => ({
                  ...prev,
                  modalidade: newValue ? newValue.value : "",
                }))
              }
              renderInput={(params) => (
                <TextField {...params}
                sx={{
                  height: "20px !important",
                  fontFamily: "'DM Sans', sans-serif",
                  background: "var(--corBg)",
                  "& .MuiOutlinedInput-root": {
                    height: "40px",
                    borderColor: "var(--corPrincipal)",
                    borderRadius: "10px",
                  },
                }}
                 placeholder="Modalidade de atuação" />
              )}
            />
          </div>
          <div className="modal-title-cf">
                  <h3>Endereço</h3>
                </div>
                <div className="cf-form-item">
               
                <MaskedInput
                  mask={[/\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/]}
                  className="cf-input"
                  placeholder="CEP"
                  name="endereco.cep"
                  value={editData.endereco?.cep || ""}  // Adiciona valor padrão vazio
                  onChange={handleEditChange}
                />

                  <input
                    type="text"
                    className="cf-input"
                    placeholder="Rua"
                    name="endereco.rua"
                    value={editData.endereco?.rua}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="cf-form-item">
                 
                  <MaskedInput
                    mask={[/\d/, /\d/, /\d/]} 
                    className="cf-input"
                    placeholder="Número"
                    name="endereco.numero"
                    value={editData.endereco?.numero}
                    onChange={handleEditChange}
                  />

                  <input
                    type="text"
                    className="cf-input"
                    placeholder="Bairro"
                    name="endereco.bairro"
                    value={editData.endereco?.bairro}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="cf-form-item">
                  <input
                    type="text"
                    className="cf-input"
                    placeholder="Cidade"
                    name="endereco.cidade"
                    value={editData.endereco?.cidade}
                    onChange={handleEditChange}
                  />
                  <input
                    type="text"
                    className="cf-input"
                    placeholder="Estado"
                    style={{ marginBottom: "20px" }}
                    name="endereco.estado"
                    value={editData.endereco?.estado}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="modal-title-cf">
                  <h3>Credenciais de login</h3>
                </div>

                <div className="cf-form-item">
                  <input
                    type="email"
                    className="cf-input"
                    placeholder="Email"
                    name="email"
                    value={editData?.email}
                    onChange={handleEditChange}
                  />
                  <input
                    type="password"
                    className="cf-input"
                    placeholder="Senha inicial"
                    name="senha"
                    value={editData?.senha}
                    onChange={handleEditChange}
                  />
                </div>
          <div className="cf-buton-div">
            <button
              className="cf-btn-submit"
              onClick={handleEditSubmit}
            >
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>
      {/* {isConfirmModalOpen && (
  <Modal
    open={isConfirmModalOpen}
    onClose={closeConfirmModal}
    aria-labelledby="confirm-modal-title"
    aria-describedby="confirm-modal-description"
    disableBackdropClick={true} // Garante que o modal só feche pelo botão
  >
    <div className="modal-content">
      <h2 id="confirm-modal-title">Confirmação</h2>
      <p id="confirm-modal-description">
        Você realmente deseja {selectedFuncionario?.status === "ativo" ? "desativar" : "ativar"} o acesso desse funcionário?
      </p>
      <div className="modal-actions">
        <Button variant="outlined" onClick={closeConfirmModal}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          color={selectedFuncionario?.status === "ativo" ? "secondary" : "success"}
          onClick={toggleStatus} // Chama a função diretamente
        >
          Sim
        </Button>
      </div>
    </div>
  </Modal>
)} */}
    </div>
  </div>
)}

    </div>
  );
}

export default CadastroFuncionario;
