import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Download, Upload, Zap, Rocket, Clipboard, Key, X } from 'lucide-react';
import * as XLSX from 'xlsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const STATUS_CONFIG = {
  backlog: { label: 'Backlog/Sem priorização', color: '#9CA3AF', bgColor: '#F3F4F6' },
  refinamento: { label: 'Refinamento', color: '#3B82F6', bgColor: '#EFF6FF' },
  estimativa: { label: 'Estimativa', color: '#8B5CF6', bgColor: '#FAF5FF' },
  aprovacao: { label: 'Aprovação', color: '#F97316', bgColor: '#FEF3C7' },
  desenvolvimento: { label: 'Desenvolvimento', color: '#FBBF24', bgColor: '#FFFBEB' },
  homologacao: { label: 'Homologação', color: '#10B981', bgColor: '#F0FDF4' },
  deploy: { label: 'Deploy', color: '#06B6D4', bgColor: '#ECFDF5' },
  implementadas: { label: 'Implementadas', color: '#059669', bgColor: '#F0FDF4' },
};

const REAL_DATA = {
  backlog: [
    { nome: 'Demanda 1', bu: 'TI', goLive: '15/10/2025', observacao: 'Aguardando priorização', responsavel: 'Erick Almeida' },
    { nome: 'Demanda 2', bu: 'Comercial', goLive: '20/10/2025', observacao: 'Backlog', responsavel: 'Marcio Souza' },
    { nome: 'Demanda 3', bu: 'Automação', goLive: '25/10/2025', observacao: 'Aguardando definição de escopo', responsavel: 'Elder Rodrigues' },
    { nome: 'Demanda 4', bu: 'Bens de consumo', goLive: '01/11/2025', observacao: 'Backlog', responsavel: 'Erick Almeida' },
    { nome: 'Demanda 5', bu: 'Refrigeração', goLive: '05/11/2025', observacao: 'Aguardando priorização', responsavel: 'Marcio Souza' },
    { nome: 'Demanda 6', bu: 'Financeiro', goLive: '10/11/2025', observacao: 'Backlog', responsavel: 'Elder Rodrigues' },
    { nome: 'Demanda 7', bu: 'Logística', goLive: '15/11/2025', observacao: 'Aguardando priorização', responsavel: 'Erick Almeida' },
  ],
  refinamento: [
    { nome: 'Demanda 8', bu: 'TI', goLive: '15/10/2025', observacao: 'Em refinamento', responsavel: 'Marcio Souza' },
    { nome: 'Demanda 9', bu: 'Comercial', goLive: '20/10/2025', observacao: 'Refinamento em andamento', responsavel: 'Erick Almeida' },
  ],
  estimativa: [
    { nome: 'Demanda 10', bu: 'Automação', goLive: '25/10/2025', observacao: 'Aguardando estimativa', responsavel: 'Elder Rodrigues' },
    { nome: 'Demanda 11', bu: 'Bens de consumo', goLive: '01/11/2025', observacao: 'Em estimativa', responsavel: 'Marcio Souza' },
    { nome: 'Demanda 12', bu: 'Refrigeração', goLive: '05/11/2025', observacao: 'Estimativa em andamento', responsavel: 'Erick Almeida' },
  ],
  aprovacao: [
    { nome: 'Demanda 13', bu: 'Financeiro', goLive: '10/11/2025', observacao: 'Aguardando aprovação', responsavel: 'Elder Rodrigues' },
    { nome: 'Demanda 14', bu: 'Logística', goLive: '15/11/2025', observacao: 'Em aprovação', responsavel: 'Marcio Souza' },
    { nome: 'Demanda 15', bu: 'TI', goLive: '20/11/2025', observacao: 'Aprovação em andamento', responsavel: 'Erick Almeida' },
    { nome: 'Demanda 16', bu: 'Comercial', goLive: '25/11/2025', observacao: 'Aguardando aprovação', responsavel: 'Elder Rodrigues' },
    { nome: 'Demanda 17', bu: 'Automação', goLive: '30/11/2025', observacao: 'Em aprovação', responsavel: 'Marcio Souza' },
    { nome: 'Demanda 18', bu: 'Bens de consumo', goLive: '05/12/2025', observacao: 'Aprovação em andamento', responsavel: 'Erick Almeida' },
  ],
  desenvolvimento: [
    { nome: 'Demanda 19', bu: 'Refrigeração', goLive: '10/12/2025', observacao: 'Em desenvolvimento', responsavel: 'Elder Rodrigues' },
    { nome: 'Demanda 20', bu: 'Financeiro', goLive: '15/12/2025', observacao: 'Desenvolvimento em andamento', responsavel: 'Marcio Souza' },
    { nome: 'Demanda 21', bu: 'Logística', goLive: '20/12/2025', observacao: 'Em desenvolvimento', responsavel: 'Erick Almeida' },
  ],
  homologacao: [
    { nome: 'Demanda 22', bu: 'TI', goLive: '25/12/2025', observacao: 'Em homologação', responsavel: 'Elder Rodrigues' },
    { nome: 'Demanda 23', bu: 'Comercial', goLive: '30/12/2025', observacao: 'Homologação em andamento', responsavel: 'Marcio Souza' },
    { nome: 'Demanda 24', bu: 'Automação', goLive: '05/01/2026', observacao: 'Em homologação', responsavel: 'Erick Almeida' },
  ],
  deploy: [
    { nome: 'Demanda 25', bu: 'Bens de consumo', goLive: '10/01/2026', observacao: 'Aguardando deploy', responsavel: 'Elder Rodrigues' },
  ],
  implementadas: [
    { nome: 'Demanda 26', bu: 'Refrigeração', goLive: '15/01/2026', observacao: 'Implementado em 15/01', responsavel: 'Marcio Souza' },
    { nome: 'Demanda 27', bu: 'Financeiro', goLive: '20/01/2026', observacao: 'Implementado em 20/01', responsavel: 'Erick Almeida' },
    { nome: 'Demanda 28', bu: 'Logística', goLive: '25/01/2026', observacao: 'Implementado em 25/01', responsavel: 'Elder Rodrigues' },
    { nome: 'Demanda 29', bu: 'TI', goLive: '01/02/2026', observacao: 'Implementado em 01/02', responsavel: 'Marcio Souza' },
    { nome: 'Demanda 30', bu: 'Comercial', goLive: '05/02/2026', observacao: 'Implementado em 05/02', responsavel: 'Erick Almeida' },
  ],
  entregas: [
    { mes: 'Setembro', quantidade: 9 },
    { mes: 'Outubro', quantidade: 8 },
    { mes: 'Novembro', quantidade: 12 },
    { mes: 'Dezembro', quantidade: 10 },
  ],
  equipe: [
    { nome: 'Carlos Almeida', cargo: 'CRM Manager', email: 'carlos.almeida@elgin.com.br', inicial: 'C' },
    { nome: 'Erick Almeida', cargo: 'CRM Specialist', email: 'erick.almeida@elgin.com.br', inicial: 'E' },
    { nome: 'Felipe Nascimento', cargo: 'CRM Developer', email: 'felipe.nascimento@elgin.com.br', inicial: 'F' },
    { nome: 'Elder Guerra', cargo: 'CRM Analyst', email: 'elder.guerra@elgin.com.br', inicial: 'E' },
    { nome: 'Marcio Souza', cargo: 'Valtech Consultant', email: 'marcio.souza@valtech.com', inicial: 'M' },
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
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<any[]>([]);
  const [modalTitle, setModalTitle] = useState('');

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
          const goLiveDate = row['Go Live'] || '';
          const previsaoEtapa = row['Previsão Etapa'] || '';
          const goLiveFormatted = `${goLiveDate}${previsaoEtapa ? ' - ' + previsaoEtapa : ''}`;

          if (statusKey && newData[statusKey]) {
            newData[statusKey].push({
              nome: row['Tópico'] || row['Nome da Demanda'] || '',
              bu: row['Área Solicitante'] || row['BU'] || '',
              goLive: goLiveFormatted,
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
    const dataRows = [
      {
        'Tópico': 'Exemplo: Implementação de Novo Fluxo',
        'Área Solicitante': 'Exemplo: Comercial',
        'Fase Atual': 'Backlog/Sem priorização',
        'Previsão Etapa': 'Em planejamento',
        'Go Live': '15/11/2025',
        'Obs:': 'Exemplo de observação',
        'Responsavel pela demanda': 'Nome do Responsável',
      },
    ];
    const ws = XLSX.utils.json_to_sheet(dataRows);
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

  const openModal = (phase: string, title: string) => {
    if (data[phase as keyof typeof data]) {
      setModalData(data[phase as keyof typeof data] as any[]);
      setModalTitle(title);
      setModalOpen(true);
    }
  };

  const statusCards = [
    { key: 'refinamento', label: 'Refinamento', icon: '🔍' },
    { key: 'estimativa', label: 'Estimativa', icon: '📊' },
    { key: 'aprovacao', label: 'Aprovação', icon: '✅' },
    { key: 'desenvolvimento', label: 'Desenvolvimento', icon: '⚙️' },
    { key: 'homologacao', label: 'Homologação', icon: '🧪' },
    { key: 'deploy', label: 'Deploy', icon: '🚀' },
    { key: 'implementadas', label: 'Implementadas', icon: '✨' },
  ];

  const getDisplayData = () => {
    let allData: any[] = [];
    Object.entries(data).forEach(([key, items]: [string, any]) => {
      if (Array.isArray(items)) {
        allData = allData.concat(items);
      }
    });

    return allData.filter(item => {
      const matchesSearch = item.nome?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           item.bu?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBU = selectedBU === 'Todas as BUs' || item.bu === selectedBU;
      return matchesSearch && matchesBU;
    });
  };

  const uniqueBUs = Array.from(new Set(Object.values(data)
    .filter((item: any) => Array.isArray(item))
    .flat()
    .map((item: any) => item.bu)));

  const buDistribution = uniqueBUs.map((bu: string) => ({
    bu,
    quantidade: Object.values(data)
      .filter((item: any) => Array.isArray(item))
      .flat()
      .filter((item: any) => item.bu === bu).length,
  }));

  const displayData = getDisplayData();

  // Filter entregas - only those with real dates (not "Em planejamento")
  const entregasReais = Object.values(data)
    .filter((item: any) => Array.isArray(item))
    .flat()
    .filter((item: any) => {
      const goLive = item.goLive || '';
      return goLive && !goLive.toLowerCase().includes('em planejamento');
    });

  // Group entregas by month
  const entregasPorMes: { [key: string]: any[] } = {
    'Setembro': entregasReais.filter((d: any) => d.goLive?.includes('/09/')),
    'Outubro': entregasReais.filter((d: any) => d.goLive?.includes('/10/')),
    'Novembro': entregasReais.filter((d: any) => d.goLive?.includes('/11/')),
    'Dezembro': entregasReais.filter((d: any) => d.goLive?.includes('/12/')),
  };

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
          <p className="text-sm text-blue-100 mt-1">📊 30 demandas ativas</p>
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
            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {statusCards.map((card) => {
                const count = (data[card.key as keyof typeof data] as any[])?.length || 0;
                return (
                  <div
                    key={card.key}
                    onClick={() => openModal(card.key, `${card.icon} ${card.label}`)}
                    className="p-4 rounded-lg cursor-pointer transition-all transform hover:scale-105 shadow hover:shadow-md"
                    style={{
                      backgroundColor: STATUS_CONFIG[card.key as keyof typeof STATUS_CONFIG]?.bgColor,
                      borderTop: `4px solid ${STATUS_CONFIG[card.key as keyof typeof STATUS_CONFIG]?.color}`,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">
                          {card.icon} {card.label}
                        </p>
                        <p className="text-3xl font-bold mt-2" style={{ color: STATUS_CONFIG[card.key as keyof typeof STATUS_CONFIG]?.color }}>
                          {count}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Clique para detalhes</p>
                  </div>
                );
              })}
            </div>

            {/* Fast Tracking Section */}
            <Card
              onClick={() => openModal('backlog', '⚡ Fast Tracking sem priorização')}
              className="p-6 bg-blue-50 border-l-4 border-blue-600 cursor-pointer hover:shadow-lg transition-all"
            >
              <h3 className="text-lg font-bold text-gray-800">⚡ Fast Tracking sem priorização</h3>
              <p className="text-gray-600 mt-1">Demandas em backlog que ainda não foram priorizadas para desenvolvimento</p>
              <p className="text-right text-2xl font-bold text-blue-600 mt-4">{(data.backlog as any[])?.length} demandas</p>
            </Card>

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
                <option key="todas">Todas as BUs</option>
                {uniqueBUs.map((bu: string) => <option key={`bu-${bu}`}>{bu}</option>)}
              </select>
            </div>

            {/* Table */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">📋 Todas as Demandas</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 text-left">Demanda</th>
                      <th className="p-3 text-left">Área Solicitante</th>
                      <th className="p-3 text-left">Go Live</th>
                      <th className="p-3 text-left">Observação</th>
                      <th className="p-3 text-left">Responsável</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayData.map((demanda: any, idx: number) => (
                      <tr key={`${demanda.nome}-${demanda.bu}-${idx}`} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{demanda.nome}</td>
                        <td className="p-3"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{demanda.bu}</span></td>
                        <td className="p-3">{demanda.goLive}</td>
                        <td className="p-3 text-gray-600">{demanda.observacao}</td>
                        <td className="p-3"><span className="bg-gray-100 px-2 py-1 rounded text-xs">EC {demanda.responsavel?.split(' ')[0] || 'CRM'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Distribution Chart */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">📊 Distribuição por Área Solicitante</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={buDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bu" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="quantidade" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {activeTab === 'entregas' && (
          <div className="space-y-6">
            {/* Entregas by Month */}
            {['Setembro', 'Outubro', 'Novembro', 'Dezembro'].map((mes: string) => {
              const entregasDoMes = entregasPorMes[mes];
              
              return (
                <div key={mes}>
                  <h2 className="text-2xl font-bold mb-4">
                    <span className="inline-flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full mr-3">
                      {entregasDoMes.length}
                    </span>
                    {mes} 2025 - Entregas Confirmadas
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {entregasDoMes.length > 0 ? (
                      entregasDoMes.map((entrega: any, idx: number) => (
                        <Card key={`entrega-${entrega.nome}-${idx}`} className="p-4 border-l-4 border-blue-600">
                          <p className="font-bold text-gray-800 text-sm">{entrega.nome}</p>
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-600">📁 {entrega.bu}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-600">📅 {entrega.goLive}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-600">✅</span>
                            </div>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <Card className="p-4 col-span-3 text-center text-gray-500">
                        Nenhuma entrega confirmada para {mes}
                      </Card>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'equipe' && (
          <div className="space-y-6">
            {/* Team Message */}
            <Card className="p-6 bg-blue-600 text-white rounded-lg">
              <p className="text-lg">Estamos aqui para apoiar você em cada etapa da sua jornada digital</p>
            </Card>

            {/* Team Members */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {(data.equipe as any[]).map((membro: any, idx: number) => (
                <Card key={idx} className="overflow-hidden">
                  <div className="bg-blue-600 h-20 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">
                      {membro.inicial}
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="font-bold text-gray-800">{membro.nome}</p>
                    <p className="text-sm text-gray-600">{membro.cargo}</p>
                    <p className="text-sm text-blue-600 mt-2">✉️ {membro.email}</p>
                  </div>
                </Card>
              ))}
            </div>

            {/* Services */}
            <div>
              <h2 className="text-2xl font-bold mb-4">🔧 Serviços Disponíveis</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-6 border-t-4 border-yellow-500 bg-yellow-50">
                  <Zap className="w-8 h-8 text-yellow-500 mb-2" />
                  <p className="font-bold">Incidentes</p>
                  <p className="text-sm text-gray-600 mt-2">Resolvidos com agilidade</p>
                </Card>
                <Card className="p-6 border-t-4 border-blue-500 bg-blue-50">
                  <Rocket className="w-8 h-8 text-blue-500 mb-2" />
                  <p className="font-bold">Fast Tracking</p>
                  <p className="text-sm text-gray-600 mt-2">Melhorias rápidas</p>
                </Card>
                <Card className="p-6 border-t-4 border-purple-500 bg-purple-50">
                  <Clipboard className="w-8 h-8 text-purple-500 mb-2" />
                  <p className="font-bold">Projetos</p>
                  <p className="text-sm text-gray-600 mt-2">Planejamento estratégico</p>
                </Card>
                <Card className="p-6 border-t-4 border-orange-500 bg-orange-50">
                  <Key className="w-8 h-8 text-orange-500 mb-2" />
                  <p className="font-bold">Licenças</p>
                  <p className="text-sm text-gray-600 mt-2">Gerenciadas com eficiência</p>
                </Card>
              </div>
            </div>

            {/* Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-6 bg-blue-600 text-white">
                <p className="text-2xl font-bold">🌐 Portal de Atendimento</p>
                <p className="mt-2">Cherwell Service Desk</p>
                <p className="text-right mt-4">→</p>
              </Card>
              <Card className="p-6 bg-green-600 text-white">
                <p className="text-2xl font-bold">📧 E-mail Geral</p>
                <p className="mt-2">crm@elgin.com.br</p>
                <p className="text-right mt-4">✉️</p>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Important Note */}
      {activeTab === 'status' && (
        <div className="px-8 pb-8">
          <Card className="p-6 bg-yellow-50 border-l-4 border-yellow-500">
            <p className="text-lg font-bold text-yellow-800">⚠️ Observação Importante</p>
            <p className="text-gray-700 mt-2">Verifique regularmente o status das demandas e mantenha a comunicação com a equipe CRM para garantir o cumprimento dos prazos.</p>
          </Card>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold">{modalTitle}</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {modalData.map((item: any, idx: number) => (
                  <div key={idx} className="border-l-4 border-blue-600 pl-4 py-2">
                    <p className="font-bold text-gray-800">{item.nome}</p>
                    <div className="mt-2 text-sm text-gray-600 space-y-1">
                      <p>📁 <strong>BU:</strong> {item.bu}</p>
                      <p>📅 <strong>Go Live:</strong> {item.goLive}</p>
                      <p>💬 <strong>Observação:</strong> {item.observacao}</p>
                      <p>👤 <strong>Responsável:</strong> {item.responsavel}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
