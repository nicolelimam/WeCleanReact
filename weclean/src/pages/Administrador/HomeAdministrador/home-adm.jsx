import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  PieChart,
  Bar,
  BarChart,
  Line,
  YAxis,
  XAxis,
  CartesianGrid,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { LineChart } from "recharts";
import { LuLineChart } from "react-icons/lu";
import MenuSidebarAdministrador from "../../../components/AdmMenuSidebar/adm-menu-sidebar";
import MenuAdm from "../../../components/MenuAdm/menu-adm";
import "./home-adm.css";
import { useClearSessionAndRedirect } from "../../../utils/session";
import { db } from "../../../backend/firebase"; // Assumindo que o Firebase está configurado aqui.
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  orderBy,
  limit,
} from "firebase/firestore";

const HomeAdministrador = () => {
  const [pieData, setPieData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [entradasRecentes, setEntradasRecentes] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [contadoresModalidades, setContadoresModalidades] = useState({
    faxina: 0,
    lavanderia: 0,
    cozinha: 0,
    jardinagem: 0,
  });

  useEffect(() => {
    const calcularContadores = () => {
      const contadoresIniciais = {
        faxina: 0,
        lavanderia: 0,
        cozinha: 0,
        jardinagem: 0,
      };

      servicos.forEach((servico) => {
        const modalidade = servico.modalidade_servico?.toLowerCase();
        if (modalidade && contadoresIniciais[modalidade] !== undefined) {
          contadoresIniciais[modalidade]++;
        }
      });

      setContadoresModalidades(contadoresIniciais);
    };

    if (servicos.length > 0) {
      calcularContadores();
    }
  }, [servicos]);

  const dadosPieChart = Object.entries(contadoresModalidades).map(
    ([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value,
    })
  );

  useEffect(() => {
    console.log("Contadores de Modalidades:", contadoresModalidades);
  }, [contadoresModalidades]);

  useEffect(() => {
    const fetchServicos = async () => {
      try {
        const serviceQuery = query(collection(db, "servicos"));
        const querySnapshot = await getDocs(serviceQuery);

        const fetchedServicos = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setServicos(fetchedServicos); // Atualiza o estado 'servicos' com os dados
      } catch (error) {
        console.error("Erro ao buscar os serviços:", error);
      }
    };

    fetchServicos();
  }, []);

  useEffect(() => {
    const fetchServiceData = async () => {
      const serviceQuery = query(collection(db, "servicos"));
      const querySnapshot = await getDocs(serviceQuery);

      // Corrigido: cityCounts agora é definido antes do loop
      const cityCounts = {};
      const serviceCounts = {
        faxina: 0,
        lavanderia: 0,
        cozinha: 0,
        jardinagem: 0,
      };

      querySnapshot.forEach(async (serviceDoc) => {
        const { cliente_id } = serviceDoc.data();
        const userDoc = await getDoc(doc(db, "usuarios", cliente_id));
        const city = userDoc?.data()?.clientes?.endereco?.cidade;

        if (city) {
          cityCounts[city] = (cityCounts[city] || 0) + 1;
        }
      });

      const data = Object.entries(serviceCounts).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      }));
      setPieData(data);
    };

    fetchServiceData();
  }, []);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const clientQuery = query(
          collection(db, "usuarios"),
          where("funcao", "==", "cliente")
        );
        const querySnapshot = await getDocs(clientQuery);

        let residencial = 0;
        let empresa = 0;

        querySnapshot.forEach((doc) => {
          const clienteData = doc.data();
          if (clienteData?.clientes?.cpf) {
            residencial += 1;
          } else if (clienteData?.clientes?.cnpj) {
            empresa += 1;
          }
        });

        setLineData([
          { name: "Residencial", value: residencial },
          { name: "Empresa", value: empresa },
        ]);
      } catch (error) {
        console.error("Erro ao buscar dados de clientes:", error);
      }
    };

    fetchClientData();
  }, []);

  // useEffect(() => {
  //   const fetchCityData = async () => {
  //     try {
  //       const serviceQuery = query(collection(db, 'servicos'));
  //       const querySnapshot = await getDocs(serviceQuery);

  //       const cityCounts = {
  //         Cruzeiro: 0,
  //         Taubaté: 0,
  //         Lorena: 0,
  //         'São José dos Campos': 0,
  //       };

  //       for (const serviceDoc of querySnapshot.docs) {
  //         const { cliente_id } = serviceDoc.data();

  //         if (!cliente_id) {
  //           console.warn("Serviço sem cliente_id:", serviceDoc.id);
  //           continue;
  //         }

  //         const userDoc = await getDoc(doc(db, 'usuarios', cliente_id));
  //         if (!userDoc.exists()) {
  //           console.warn(`Usuário não encontrado para ID: ${cliente_id}`);
  //           continue;
  //         }

  //         const endereco = userDoc.data()?.clientes?.endereco;
  //         const cidade = endereco?.cidade;

  //         if (cidade && cityCounts[cidade] !== undefined) {
  //           cityCounts[cidade]++;
  //         } else {
  //           console.warn("Cidade não encontrada ou não mapeada:", cidade);
  //         }
  //       }

  //       const data = Object.entries(cityCounts).map(([name, services]) => ({
  //         name,
  //         services,
  //       }));

  //       setBarData(data);
  //     } catch (error) {
  //       console.error("Erro ao buscar dados de cidades:", error);
  //     }
  //   };

  //   fetchCityData();
  // }, []);

  useEffect(() => {
    const fetchMonthlyProfit = async () => {
      try {
        const now = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);

        const serviceQuery = query(
          collection(db, "servicos"),
          where("criado_em", ">=", oneMonthAgo)
        );
        const querySnapshot = await getDocs(serviceQuery);

        let totalProfit = 0;
        const filteredData = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.status !== "cancelado") {
            totalProfit += data.valor || 0;
            filteredData.push({
              name: data.modalidade_servico,
              value: data.valor,
            });
          }
        });

        setLineData(filteredData);
        setLucroTotal(totalProfit); // Armazena o lucro total
      } catch (error) {
        console.error("Erro ao calcular o lucro mensal:", error);
      }
    };

    fetchMonthlyProfit();
  }, []);

  const [lucroTotal, setLucroTotal] = useState(0);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const employeeQuery = query(
          collection(db, "usuarios"),
          where("funcao", "==", "funcionario")
        );
        const querySnapshot = await getDocs(employeeQuery);

        const employeeData = [];

        for (const docSnap of querySnapshot.docs) {
          const userId = docSnap.id;
          const funcionariosRef = collection(
            db,
            "usuarios",
            userId,
            "funcionarios"
          );
          const funcionariosSnapshot = await getDocs(funcionariosRef);

          funcionariosSnapshot.forEach((funcionarioDoc) => {
            const funcionarioData = funcionarioDoc.data();
            employeeData.push({
              name: funcionarioData.nome || "Indefinido",
              servicos: funcionarioData.compromissos_semana || 0, // Tratando valores nulos.
            });
          });
        }

        // Ordenando a lista por serviços em ordem decrescente
        setFuncionarios(employeeData.sort((a, b) => b.servicos - a.servicos));
      } catch (error) {
        console.error("Erro ao buscar os dados dos funcionários:", error);
      }
    };

    fetchEmployeeData();
  }, []);

  const handleLogout = useClearSessionAndRedirect();

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
      <text
        x={x}
        y={y}
        fill="white"
        fontSize={14}
        fontFamily="Poppins"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  useEffect(() => {
    const fetchRecentServices = async () => {
      const serviceQuery = query(
        collection(db, "servicos"),
        orderBy("data_realizacao", "desc"),
        limit(5)
      );
      const querySnapshot = await getDocs(serviceQuery);

      const recentData = querySnapshot.docs.map((serviceDoc) => ({
        codigo: serviceDoc.id,
        ...serviceDoc.data(),
      }));

      setEntradasRecentes(recentData);
    };

    fetchRecentServices();
  }, []);

  return (
    <div className="home-administrador-container">
      <MenuAdm activePage="dashboard" />
      <div className="home-administrador-main-content">
        <div className="home-administrador-header">
          <h2 className="ha-header-txt">Dashboard</h2>
        </div>
        <Grid container spacing={3} className="home-administrador-content">
         
            <div className="chart-row">
            <Grid item xs={12} md={6} className="ha-dashboard-content">
            <Card className="dashboard-item servicos-chart">
              <CardContent className="servicos-chart-content">
                <Typography variant="h3" className="title-dashboard-item">
                  Serviços mais solicitados
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dadosPieChart}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#d6b5e4"
                      label={renderCustomizedLabel}
                      labelLine={false}
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            ["#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d"][
                              index % 4
                            ]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                      formatter={(value, entry) => (
                        <span style={{ color: "white", fontFamily: "Poppins" }}>
                          {value}: {entry.payload.value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card className="dashboard-item tipocliente-chart">
              <CardContent>
                <Typography variant="h6" className="title-dashboard">
                  Lucro mensal (em R$)
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={lineData} className="linechart-chart">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
                <Typography
                  variant="body1"
                  style={{ marginTop: "-10px", fontSize: "20px", fontWeight: "600" }}
                >
                 Lucro total do último mês: R$  <strong>{Number(lucroTotal).toFixed(2)}</strong>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
            </div>

          {/* <Grid item xs={12}>
            <Card className="dashboard-item cidades-chart">
              <CardContent>
                <Typography variant="h6" className="title-dashboard" style={{ color: 'var(--corPrincipal)' }}>
                  As cidades que mais solicitaram serviços
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={barData} className="barchart-chart">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="services" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid> */}
          <div className="chart-row">
          <Grid item xs={12} md={6}>
            <Card className="dashboard-item func-list-dashboard">
              <CardContent className="funcionarios-list-dashboard">
                <Typography
                  variant="h6"
                  style={{ color: "var(--corPrincipal)" }}
                >
                  Funcionários com base em serviços realizados
                </Typography>
                <List>
                  {funcionarios.length > 0 ? (
                    funcionarios.map((funcionario, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={funcionario.name}
                          secondary={`Serviços realizados: ${funcionario.servicos}`}
                        />
                      </ListItem>
                    ))
                  ) : (
                    <Typography variant="body1">
                      Nenhum funcionário encontrado.
                    </Typography>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card className="dashboard-item entradas-recentes-list">
              <CardContent className="entradas-recentes-dashboard">
                <Typography variant="h6">Entradas Recentes</Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Modalidade do Serviço</TableCell>
                      <TableCell>Valor</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {entradasRecentes.map((entrada, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {entrada.modalidade_servico || "N/A"}
                        </TableCell>
                        <TableCell>
                          {typeof entrada.valor === "number"
                            ? `R$ ${entrada.valor.toFixed(2)}`
                            : "Valor indisponível"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>
          </div>
         
        </Grid>
      </div>
    </div>
  );
};

export default HomeAdministrador;
