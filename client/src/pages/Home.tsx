import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Download, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const STATUS_CONFIG = {
  backlog: { label: 'Backlog/Sem priorização', color: '#9CA3AF' },
  refinamento: { label: 'Refinamento', color: '#3B82F6' },
  estimativa: { label: 'Estimativa', color: '#8B5CF6' },
  aprovacao: { label: 'Aprovação', color: '#F97316' },
  desenvolvimento: { label: 'Desenvolvimento', color: '#FBBF24' },
  homologacao: { label: 'Homologação', color: '#10B981' },
  deploy: { label: 'Deploy', color: '#06B6D4' },
  implementadas: { label: 'Implementadas', color: '#10B981' },
};

const REAL_DATA = {
  backlog: [
    { nome: 'Demanda 1', bu: 'TI', previsaoInicio: '01/11/2025', goLive: '15/11/2025', observacao: 'Aguardando priorização', responsavel: 'Erick Almeida' },
    { nome: 'Demanda 2', bu: 'Comercial', previsaoInicio: '05/11/2025', goLive: '20/11/2025', observacao: 'Backlog', responsavel: 'Marcio Souza' },
    { nome: 'Demanda 3', bu: 'Automação', previsaoInicio: '10/11/2025', goLive: '25/11/2025', observacao: 'Aguardando definição de escopo', responsavel: 'Elder Rodrigues' },
    { nome: 'Demanda 4', bu: 'Bens de consumo', previsaoInicio: '15/11/2025', goLive: '01/12/2025', observacao: 'Backlog', responsavel: 'Erick Almeida' },
    { nome: 'Demanda 5', bu: 'Refrigeração', previsaoInicio: '20/11/2025', goLive: '05/12/2025', observacao: 'Aguardando priorização', responsavel: 'Marcio Souza' },
    { nome: 'Demanda 6', bu: 'Financeiro', previsaoInicio: '25/11/2025', goLive: '10/12/2025', observacao: 'Backlog', responsavel: 'Elder Rodrigues' },
    { nome: 'Demanda 7', bu: 'Logística', previsaoInicio: '30/11/2025', goLive: '15/12/2025', observacao: 'Aguardando priorização', responsavel: 'Erick Almeida' },
  ],
  refinamento: [
    { nome: 'Demanda 8', bu: 'TI', previsaoInicio: '01/11/2025', goLive: '15/11/2025', observacao: 'Em refinamento', responsavel: 'Marcio Souza' },
    { nome: 'Demanda 9', bu: 'Comercial', previsaoInicio: '05/11/2025', goLive: '20/11/2025', observacao: 'Refinamento em andamento', responsavel: 'Erick Almeida' },
  ],
  estimativa: [
    { nome: 'Demanda 10', bu: 'Automação', previsaoInicio: '10/11/2025', goLive: '25/11/2025', observacao: 'Aguardando estimativa', responsavel: 'Elder Rodrigues' },
    { nome: 'Demanda 11', bu: 'Bens de consumo', previsaoInicio: '15/11/2025', goLive: '01/12/2025', observacao: 'Em estimativa', responsavel: 'Marcio Souza' },
    { nome: 'Demanda 12', bu: 'Refrigeração', previsaoInicio: '20/11/2025', goLive: '05/12/2025', observacao: 'Estimativa em andamento', responsavel: 'Erick Almeida' },
  ],
  aprovacao: [
    { nome: 'Demanda 13', bu: 'Financeiro', previsaoInicio: '25/11/2025', goLive: '10/12/2025', observacao: 'Aguardando aprovação', responsavel: 'Elder Rodrigues' },
    { nome: 'Demanda 14', bu: 'Logística', previsaoInicio: '30/11/2025', goLive: '15/12/2025', observacao: 'Em aprovação', responsavel: 'Marcio Souza' },
    { nome: 'Demanda 15', bu: 'TI', previsaoInicio: '01/12/2025', goLive: '20/12/2025', observacao: 'Aprovação em andamento', responsavel: 'Erick Almeida' },
    { nome: 'Demanda 16', bu: 'Comercial', previsaoInicio: '05/12/2025', goLive: '25/12/2025', observacao: 'Aguardando aprovação', responsavel: 'Elder Rodrigues' },
    { nome: 'Demanda 17', bu: 'Automação', previsaoInicio: '10/12/2025', goLive: '30/12/2025', observacao: 'Em aprovação', responsavel: 'Marcio Souza' },
    { nome: 'Demanda 18', bu: 'Bens de consumo', previsaoInicio: '15/12/2025', goLive: '05/01/2026', observacao: 'Aprovação em andamento', responsavel: 'Erick Almeida' },
  ],
  desenvolvimento: [
    { nome: 'Demanda 19', bu: 'Refrigeração', previsaoInicio: '20/12/2025', goLive: '10/01/2026', observacao: 'Em desenvolvimento', responsavel: 'Elder Rodrigues' },
    { nome: 'Demanda 20', bu: 'Financeiro', previsaoInicio: '25/12/2025', goLive: '15/01/2026', observacao: 'Desenvolvimento em andamento', responsavel: 'Marcio Souza' },
    { nome: 'Demanda 21', bu: 'Logística', previsaoInicio: '30/12/2025', goLive: '20/01/2026', observacao: 'Em desenvolvimento', responsavel: 'Erick Almeida' },
  ],
  homologacao: [
    { nome: 'Demanda 22', bu: 'TI', previsaoInicio: '01/01/2026', goLive: '25/01/2026', observacao: 'Em homologação', responsavel: 'Elder Rodrigues' },
    { nome: 'Demanda 23', bu: 'Comercial', previsaoInicio: '05/01/2026', goLive: '30/01/2026', observacao: 'Homologação em andamento', responsavel: 'Marcio Souza' },
    { nome: 'Demanda 24', bu: 'Automação', previsaoInicio: '10/01/2026', goLive: '05/02/2026', observacao: 'Em homologação', responsavel: 'Erick Almeida' },
  ],
  deploy: [
    { nome: 'Demanda 25', bu: 'Bens de consumo', previsaoInicio: '15/01/2026', goLive: '10/02/2026', observacao: 'Aguardando deploy', responsavel: 'Elder Rodrigues' },
  ],
  implementadas: [
    { nome: 'Demanda 26', bu: 'Refrigeração', previsaoInicio: '20/01/2026', goLive: '15/02/2026', observacao: 'Implementado em 15/02', responsavel: 'Marcio Souza' },
    { nome: 'Demanda 27', bu: 'Financeiro', previsaoInicio: '25/01/2026', goLive: '20/02/2026', observacao: 'Implementado em 20/02', responsavel: 'Erick Almeida' },
    { nome: 'Demanda 28', bu: 'Logística', previsaoInicio: '30/01/2026', goLive: '25/02/2026', observacao: 'Implementado em 25/02', responsavel: 'Elder Rodrigues' },
    { nome: 'Demanda 29', bu: 'TI', previsaoInicio: '05/02/2026', goLive: '01/03/2026', observacao: 'Implementado em 01/03', responsavel: 'Marcio Souza' },
    { nome: 'Demanda 30', bu: 'Comercial', previsaoInicio: '10/02/2026', goLive: '05/03/2026', observacao: 'Implementado em 05/03', responsavel: 'Erick Almeida' },
  ],
  entregas: [
    { mes: 'Setembro', quantidade: 5 },
    { mes: 'Outubro', quantidade: 8 },
    { mes: 'Novembro', quantidade: 12 },
    { mes: 'Dezembro', quantidade: 10 },
  ],
  equipe: [
    { nome: 'Erick Almeida', cargo: 'Product Owner', email: 'erick.almeida@elgin.com' },
    { nome: 'Marcio Souza', cargo: 'Tech Lead', email: 'marcio.souza@elgin.com' },
    { nome: 'Elder Rodrigues', cargo: 'Developer', email: 'elder.rodrigues@elgin.com' },
  ],
};

export default function Home() {
  const [activeTab, setActiveTab] = useState('status');
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem('salesforceStatusData');
    return savedData ? JSON.parse(savedData) : REAL_DATA;
  });
  const [lastUpdate, setLastUpdate] = useState(() => {
    return localStorage.getItem('salesforceLastUpdate') || new Date().toLocaleString('pt-BR');
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBU, setSelectedBU] = useState('Todas as BUs');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target?.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const phaseMap: { [key: string]: keyof typeof data } = {
          'Backlog/Sem priorização': 'backlog',
          'Refinamento': 'refinamento',
          'Estimativa': 'estimativa',
          'Aprovação': 'aprovacao',
          'Desenvolvimento': 'desenvolvimento',
          'Homologação': 'homologacao',
          'Deploy': 'deploy',
          'Implementadas': 'implementadas',
        };

        const newData = { ...data };
        newData.backlog = [];
        newData.refinamento = [];
        newData.estimativa = [];
        newData.aprovacao = [];
        newData.desenvolvimento = [];
        newData.homologacao = [];
        newData.deploy = [];
        newData.implementadas = [];

        jsonData.forEach((row: any) => {
          let faseAtual = String(row['Fase Atual'] || 'Backlog/Sem priorização').trim();
          const faseAtualLower = faseAtual.toLowerCase();

          if (faseAtualLower.includes('backlog') || faseAtualLower.includes('sem priorização')) {
            faseAtual = 'Backlog/Sem priorização';
          } else if (faseAtualLower.includes('refinamento')) {
            faseAtual = 'Refinamento';
          } else if (faseAtualLower.includes('estimativa')) {
            faseAtual = 'Estimativa';
          } else if (faseAtualLower.includes('aguardando aprovação') || faseAtualLower.includes('aprovação') || faseAtualLower.includes('aprovacao')) {
            faseAtual = 'Aprovação';
          } else if (faseAtualLower.includes('desenvolvimento')) {
            faseAtual = 'Desenvolvimento';
          } else if (faseAtualLower.includes('homologação') || faseAtualLower.includes('homologacao')) {
            faseAtual = 'Homologação';
          } else if (faseAtualLower.includes('deploy')) {
            faseAtual = 'Deploy';
          } else if (faseAtualLower.includes('implementado') || faseAtualLower.includes('implementadas')) {
            faseAtual = 'Implementadas';
          } else {
            faseAtual = 'Backlog/Sem priorização';
          }

          const statusKey = phaseMap[faseAtual];
          if (statusKey && newData[statusKey]) {
            newData[statusKey].push({
              nome: row['Tópico'] || row['Nome da Demanda'] || '',
              bu: row['Área Solicitante'] || row['BU'] || '',
              previsaoInicio: row['Previsão Etapa'] || row['Previsão Início'] || '',
              goLive: row['Go Live'] || '',
              observacao: row['Obs:'] || row['Observação'] || '',
              responsavel: row['Responsavel pela demanda'] || row['Responsável'] || 'Equipe CRM',
            });
          }
        });

        setData(newData);
        const currentDate = new Date().toLocaleString('pt-BR');
        setLastUpdate(currentDate);
        localStorage.setItem('salesforceStatusData', JSON.stringify(newData));
        localStorage.setItem('salesforceLastUpdate', currentDate);
        alert('✅ Dados atualizados com sucesso!');
      } catch (error) {
        console.error('Erro ao processar arquivo:', error);
        alert('❌ Erro ao processar o arquivo. Verifique o formato.');
      }
    };
    reader.readAsBinaryString(file);
  };

  const downloadTemplate = () => {
    const wb = XLSX.utils.book_new();
    const header = ['Tópico', 'Área Solicitante', 'Fase Atual', 'Previsão Etapa', 'Go Live', 'Obs:', 'Responsavel pela demanda'];
    const dataRows = [
      {
        'Tópico': 'Exemplo: Implementação de Novo Fluxo',
        'Área Solicitante': 'Exemplo: Comercial',
        'Fase Atual': 'Backlog/Sem priorização',
        'Previsão Etapa': '01/11/2025',
        'Go Live': '15/11/2025',
        'Obs:': 'Exemplo de observação',
        'Responsavel pela demanda': 'Nome do Responsável',
      },
    ];
    const ws = XLSX.utils.json_to_sheet(dataRows, { header });
    XLSX.utils.book_append_sheet(wb, ws, 'Status Report');
    XLSX.writeFile(wb, 'template_status_report.xlsx');
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    Object.entries(data).forEach(([key, items]: [string, any]) => {
      if (Array.isArray(items) && items.length > 0) {
        const ws = XLSX.utils.json_to_sheet(items);
        XLSX.utils.book_append_sheet(wb, ws, STATUS_CONFIG[key as keyof typeof STATUS_CONFIG]?.label || key);
      }
    });
    XLSX.writeFile(wb, `status_report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const chartData = Object.entries(STATUS_CONFIG).map(([key, config]) => ({
    name: config.label,
    value: (data[key as keyof typeof data] as any[])?.length || 0,
    color: config.color,
  }));

  const allDemandas = Object.values(data)
    .filter(item => Array.isArray(item))
    .flat()
    .filter(item => {
      const matchesSearch = item.nome?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           item.bu?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBU = selectedBU === 'Todas as BUs' || item.bu === selectedBU;
      return matchesSearch && matchesBU;
    });

  const uniqueBUs = Array.from(new Set(Object.values(data)
    .filter(item => Array.isArray(item))
    .flat()
    .map(item => item.bu)));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
        <h1 className="text-4xl font-bold">STATUS REPORT - Salesforce</h1>
        <p className="text-blue-100 mt-2">CRM Salesforce - Elgin</p>
        <p className="text-blue-100">Atualizado com os dados mais recentes</p>
        <div className="mt-6 bg-blue-500 rounded-lg p-4 w-fit">
          <p className="text-sm text-blue-100">Data do Relatório</p>
          <p className="text-2xl font-bold">{lastUpdate}</p>
          <p className="text-sm text-blue-100 mt-1">📈 30 demandas ativas</p>
        </div>
      </div>

      {/* Tabs and Buttons */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('status')}
            className={`pb-2 font-medium border-b-2 ${activeTab === 'status' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'}`}
          >
            📊 Status das Demandas
          </button>
          <button
            onClick={() => setActiveTab('entregas')}
            className={`pb-2 font-medium border-b-2 ${activeTab === 'entregas' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'}`}
          >
            📅 Entregas Previstas
          </button>
          <button
            onClick={() => setActiveTab('equipe')}
            className={`pb-2 font-medium border-b-2 ${activeTab === 'equipe' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'}`}
          >
            👥 Equipe CRM
          </button>
        </div>
        <div className="flex gap-3">
          <Button onClick={downloadTemplate} className="bg-green-600 hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" /> Template Excel
          </Button>
          <label className="cursor-pointer">
            <Button className="bg-blue-600 hover:bg-blue-700" asChild>
              <span>
                <Upload className="w-4 h-4 mr-2" /> Carregar Excel
              </span>
            </Button>
            <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} className="hidden" />
          </label>
          <Button onClick={exportToExcel} className="bg-purple-600 hover:bg-purple-700">
            Exportar
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {activeTab === 'status' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex gap-4">
              <Input
                placeholder="Buscar demandas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <select
                value={selectedBU}
                onChange={(e) => setSelectedBU(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option>Todas as BUs</option>
                {uniqueBUs.map(bu => <option key={bu}>{bu}</option>)}
              </select>
            </div>

            {/* Chart */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">📊 Distribuição por Status</h2>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={120} fill="#8884d8" dataKey="value">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            {/* Table */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">📋 Demandas</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 text-left">Demanda</th>
                      <th className="p-3 text-left">BU</th>
                      <th className="p-3 text-left">Previsão</th>
                      <th className="p-3 text-left">Go Live</th>
                      <th className="p-3 text-left">Observação</th>
                      <th className="p-3 text-left">Responsável</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allDemandas.map((demanda, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="p-3">{demanda.nome}</td>
                        <td className="p-3">{demanda.bu}</td>
                        <td className="p-3">{demanda.previsaoInicio}</td>
                        <td className="p-3">{demanda.goLive}</td>
                        <td className="p-3">{demanda.observacao}</td>
                        <td className="p-3">{demanda.responsavel}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'entregas' && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">📅 Entregas Previstas Salesforce</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={data.entregas} cx="50%" cy="50%" labelLine={false} label={({ mes, quantidade }) => `${mes}: ${quantidade}`} outerRadius={100} fill="#8884d8" dataKey="quantidade">
                  {data.entregas.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F97316', '#8B5CF6'][index % 4]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        )}

        {activeTab === 'equipe' && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">👥 Equipe CRM</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.equipe.map((membro: any, idx: number) => (
                <div key={idx} className="border rounded-lg p-4">
                  <p className="font-bold text-lg">{membro.nome}</p>
                  <p className="text-gray-600">{membro.cargo}</p>
                  <p className="text-sm text-blue-600 mt-2">{membro.email}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
