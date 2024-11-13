import React from 'react';
import { Grid, Card, CardContent, Typography, List, ListItem, ListItemText, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { PieChart, Bar, BarChart, Line, YAxis, XAxis, CartesianGrid, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LineChart } from 'recharts';
import { LuLineChart } from 'react-icons/lu';
import MenuSidebarAdministrador from '../../../components/AdmMenuSidebar/adm-menu-sidebar';
import MenuAdm from '../../../components/MenuAdm/menu-adm';
import './home-adm.css';

const HomeAdministrador = () => {
  const pieData = [
    { name: 'Faxina', value: 400 },
    { name: 'Lavanderia', value: 300 },
    { name: 'Cozinha', value: 200 },
    { name: 'Jardinagem', value: 100 },
  ];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
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
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const lineData = [
    { name: 'Janeiro', Residencial: 40, Empresa: 24 },
    { name: 'Fevereiro', Residencial: 30, Empresa: 13 },
    { name: 'Março', Residencial: 20, Empresa: 98 },
    { name: 'Abril', Residencial: 27, Empresa: 39 },
    { name: 'Maio', Residencial: 18, Empresa: 48 },
    { name: 'Junho', Residencial: 23, Empresa: 38 },
  ];

  const barData = [
    { name: 'Cruzeiro', services: 50 },
    { name: 'Cachoeira Paulista', services: 30 },
    { name: 'Lorena', services: 70 },
    { name: 'Taubaté', services: 90 },
    { name: 'São José dos Campos', services: 100 },
    { name: 'Guaratinguetá', services: 65 },
  ];

  const funcionarios = [
    { name: 'João', servicos: 15 },
    { name: 'Maria', servicos: 12 },
    { name: 'Pedro', servicos: 9 },
    { name: 'Ana', servicos: 7 },
  ];

  const entradasRecentes = [
    { codigo: '123', valor: 200 },
    { codigo: '456', valor: 150 },
    { codigo: '789', valor: 300 },
    { codigo: '012', valor: 100 },
  ];

  return (
    <div className='home-administrador-container'>
      <MenuAdm activePage='dashboard' />
      <div className="home-administrador-main-content">
        <div className="home-administrador-header">
          <h2 className='ha-header-txt'>Dashboard</h2>
        </div>
        <Grid container spacing={3} className="home-administrador-content">

          <Grid item xs={12} md={6} className='ha-dashboard-content'>
            <Card className='dashboard-item servicos-chart'>
              <CardContent className='servicos-chart-content'>
                <Typography variant="h3" className='title-dashboard-item'>Serviços mais solicitados esse mês</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
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
                        <Cell key={`cell-${index}`} fill={['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d'][index % 4]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                      formatter={(value, entry) => (
                        <span style={{ color: 'white', fontFamily: 'Poppins' }}>
                          {value}: {entry.payload.value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} >
            <Card className='dashboard-item tipocliente-chart'>
              <CardContent>
                <Typography variant="h6" className='title-dashboard'>Tipo de Cliente (maiores solicitações)</Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={lineData} className='linechart-chart'>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Residencial" stroke="#8884d8" />
                    <Line type="monotone" dataKey="Empresa" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Gráfico de Barras */}
          <Grid item xs={12} >
            <Card className='dashboard-item cidades-chart'>
              <CardContent>
                <Typography variant="h6" className='title-dashboard' style={{color: 'var(--corPrincipal'}}>As cidades que mais solicitaram serviços</Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={barData} className='barchart-chart'>
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
          </Grid>

       
          <Grid item xs={12} md={6} >
            <Card className='dashboard-item func-list-dashboard'>
              <CardContent className='funcionarios-list-dashboard'>
                <Typography variant="h6" style={{color: "var(--corPrincipal)"}}>Funcionários com base em serviços realizados</Typography>
                <List>
                  {funcionarios.map((funcionario, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={funcionario.name} secondary={`Serviços: ${funcionario.servicos}`} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} >
            <Card className='dashboard-item entradas-recentes-list'>
              <CardContent className='entradas-recentes-dashboard'>
                <Typography variant="h6">Entradas Recentes</Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Código do Serviço</TableCell>
                      <TableCell>Valor</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {entradasRecentes.map((entrada, index) => (
                      <TableRow key={index}>
                        <TableCell>{entrada.codigo}</TableCell>
                        <TableCell>{`R$ ${entrada.valor}`}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default HomeAdministrador;
