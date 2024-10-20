import React from 'react';
import { Grid, Card, CardContent, Typography, List, ListItem, ListItemText, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { PieChart, Pie, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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

          <Grid item xs={12} md={6} >
            <Card className='dashboard-item servicos-chart'>
              <CardContent>
                <Typography variant="h6">Serviços mais solicitados esse mês</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#82ca9d" />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} >
            <Card className='dashboard-item'>
              <CardContent>
                <Typography variant="h6">Tipo de Cliente</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={lineData}>
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
            <Card className='dashboard-item'>
              <CardContent>
                <Typography variant="h6">As cidades que mais solicitaram serviços</Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={barData}>
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
            <Card className='dashboard-item'>
              <CardContent>
                <Typography variant="h6">Funcionários com base em serviços realizados</Typography>
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
            <Card className='dashboard-item'>
              <CardContent>
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
