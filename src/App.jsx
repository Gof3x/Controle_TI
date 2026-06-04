import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  Bell,
  Box,
  CirclePlus,
  ClipboardList,
  Laptop2,
  LayoutDashboard,
  Menu,
  MonitorSmartphone,
  MoonStar,
  PencilLine,
  Search,
  Smartphone,
  Trash2,
  UserRoundCheck,
  X,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const STORAGE_KEY = 'controle-ti-inventory-v1';

const seedInventory = {
  park: [
    {
      id: 1,
      patrimonio: 'TI-1001',
      tipo: 'Desktop',
      marcaModelo: 'Dell OptiPlex 7010',
      usuario: 'Ana Paula',
      setor: 'Financeiro',
    },
    {
      id: 2,
      patrimonio: 'TI-1002',
      tipo: 'Notebook',
      marcaModelo: 'Lenovo ThinkPad E14',
      usuario: 'Bruno Silva',
      setor: 'Comercial',
    },
    {
      id: 3,
      patrimonio: 'TI-1003',
      tipo: 'Celular',
      marcaModelo: 'Samsung Galaxy A54',
      usuario: 'Carla Souza',
      setor: 'Operações',
    },
  ],
  stock: [
    {
      id: 4,
      patrimonio: 'TI-2001',
      tipo: 'Notebook',
      marcaModelo: 'Acer Aspire 5',
      condicao: 'Novo',
    },
    {
      id: 5,
      patrimonio: 'TI-2002',
      tipo: 'Celular',
      marcaModelo: 'Motorola G84',
      condicao: 'Seminovo',
    },
    {
      id: 6,
      patrimonio: 'TI-2003',
      tipo: 'Desktop',
      marcaModelo: 'HP ProDesk 400',
      condicao: 'Seminovo',
    },
  ],
  nextId: 7,
};

const sidebarItems = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'park', label: 'Parque de Máquinas', icon: MonitorSmartphone },
  { key: 'stock', label: 'Estoque', icon: Box },
];

const emptyEquipmentForm = {
  patrimonio: '',
  tipo: 'Notebook',
  marcaModelo: '',
  estado: '',
  cidade: '',
  usuario: '',
  setor: '',
};

const locationOptions = {
  SP: ['ITU', 'ITAPETININGA', 'ITAPECERICA DA SERRA', 'SUMARE', 'MAIRINQUE', 'SANTA GERTRUDES'],
  ES: ['VITORIA', 'SERRA-ES'],
  BA: ['SALVADOR'],
  PE: [
    'HOSPITAL OTAVIO DE FREITAS',
    'HOSPITAL ULISSES PERNAMBUCANO',
    'HOSPITAL CORRERIA PICANÇO',
    'HOSPITAL JABOATAO PRAZERES',
    'HOSPITAL REGIONAL DO AGRESTE',
    'RESTAURANTE POPULAR JOSUE DE CASTRO',
    'RESTAURANTE POPULAR NAIDE TEODOSIO',
    'ESCRITORIO PE',
    'HOSPITAL BARAO DE LUCENA',
    'MERENDA CABO',
    'COZINHA JABOATÃO',
  ],
};

const stateLabels = {
  SP: 'São Paulo',
  ES: 'Espírito Santo',
  BA: 'Bahia',
  PE: 'Pernambuco',
};

const emptyAssignmentForm = {
  usuario: '',
  setor: '',
};

function App() {
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [inventory, setInventory] = useState(seedInventory);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [modalMode, setModalMode] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [targetId, setTargetId] = useState(null);
  const [equipmentForm, setEquipmentForm] = useState(emptyEquipmentForm);
  const [assignmentForm, setAssignmentForm] = useState(emptyAssignmentForm);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setInventory(JSON.parse(stored));
      } catch {
        setInventory(seedInventory);
      }
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
  }, [inventory, ready]);

  const parkItems = inventory.park;
  const stockItems = inventory.stock;

  const totalPark = parkItems.reduce((sum, item) => sum + 1, 0);
  const parkByType = {
    Desktop: parkItems.filter((item) => item.tipo === 'Desktop').length,
    Notebook: parkItems.filter((item) => item.tipo === 'Notebook').length,
    Celular: parkItems.filter((item) => item.tipo === 'Celular').length,
  };
  const stockByType = {
    Desktop: stockItems.filter((item) => item.tipo === 'Desktop').length,
    Notebook: stockItems.filter((item) => item.tipo === 'Notebook').length,
    Celular: stockItems.filter((item) => item.tipo === 'Celular').length,
  };

  const dashboardChart = [
    { name: 'Desktop', emUso: parkByType.Desktop, emEstoque: stockByType.Desktop },
    { name: 'Notebook', emUso: parkByType.Notebook, emEstoque: stockByType.Notebook },
    { name: 'Celular', emUso: parkByType.Celular, emEstoque: stockByType.Celular },
  ];

  const filteredPark = parkItems.filter((item) => {
    const query = searchTerm.toLowerCase();
    return (
      item.patrimonio.toLowerCase().includes(query) ||
      item.usuario.toLowerCase().includes(query)
    );
  });

  const openAddEquipment = () => {
    setEditingId(null);
    setEquipmentForm(emptyEquipmentForm);
    setModalMode('equipment');
  };

  const openEditEquipment = (item) => {
    setEditingId(item.id);
    setEquipmentForm({
      patrimonio: item.patrimonio,
      tipo: item.tipo,
      marcaModelo: item.marcaModelo,
      estado: item.estado || '',
      cidade: item.cidade || '',
      usuario: item.usuario,
      setor: item.setor,
    });
    setModalMode('equipment');
  };

  const openAssignModal = (itemId) => {
    setTargetId(itemId);
    setAssignmentForm(emptyAssignmentForm);
    setModalMode('assignment');
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingId(null);
    setTargetId(null);
    setEquipmentForm(emptyEquipmentForm);
    setAssignmentForm(emptyAssignmentForm);
  };

  const saveEquipment = (event) => {
    event.preventDefault();

    if (!equipmentForm.patrimonio.trim() || !equipmentForm.marcaModelo.trim()) {
      return;
    }

    if (editingId) {
      setInventory((current) => ({
        ...current,
        park: current.park.map((item) =>
          item.id === editingId
            ? {
                ...item,
                patrimonio: equipmentForm.patrimonio.trim(),
                tipo: equipmentForm.tipo,
                marcaModelo: equipmentForm.marcaModelo.trim(),
                estado: equipmentForm.estado,
                cidade: equipmentForm.cidade,
                usuario: equipmentForm.usuario.trim(),
                setor: equipmentForm.setor.trim(),
              }
            : item,
        ),
      }));
    } else {
      const newItem = {
        id: inventory.nextId,
        patrimonio: equipmentForm.patrimonio.trim(),
        tipo: equipmentForm.tipo,
        marcaModelo: equipmentForm.marcaModelo.trim(),
        estado: equipmentForm.estado,
        cidade: equipmentForm.cidade,
        usuario: equipmentForm.usuario.trim(),
        setor: equipmentForm.setor.trim(),
      };

      setInventory((current) => ({
        ...current,
        park: [newItem, ...current.park],
        nextId: current.nextId + 1,
      }));
    }

    closeModal();
  };

  const removeEquipment = (itemId) => {
    setInventory((current) => ({
      ...current,
      park: current.park.filter((item) => item.id !== itemId),
    }));
  };

  const assignStockItem = (event) => {
    event.preventDefault();

    const stockItem = stockItems.find((item) => item.id === targetId);
    if (!stockItem || !assignmentForm.usuario.trim() || !assignmentForm.setor.trim()) {
      return;
    }

    const movedItem = {
      id: stockItem.id,
      patrimonio: stockItem.patrimonio,
      tipo: stockItem.tipo,
      marcaModelo: stockItem.marcaModelo,
      usuario: assignmentForm.usuario.trim(),
      setor: assignmentForm.setor.trim(),
    };

    setInventory((current) => ({
      ...current,
      stock: current.stock.filter((item) => item.id !== targetId),
      park: [movedItem, ...current.park],
    }));

    closeModal();
  };

  const totalEmUso = dashboardChart.reduce((sum, item) => sum + item.emUso, 0);
  const totalEstoque = dashboardChart.reduce((sum, item) => sum + item.emEstoque, 0);
  const cityOptions = equipmentForm.estado ? locationOptions[equipmentForm.estado] || [] : [];

  const handleStateChange = (value) => {
    const nextCities = locationOptions[value] || [];

    setEquipmentForm((current) => ({
      ...current,
      estado: value,
      cidade: nextCities.includes(current.cidade) ? current.cidade : nextCities[0] || '',
    }));
  };

  const handleCityChange = (value) => {
    setEquipmentForm((current) => ({ ...current, cidade: value }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-72 border-r border-slate-800 bg-slate-950/95 px-5 py-6 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:block`}
        >
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 shadow-glow">
              <Laptop2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Controle TI</p>
              <h1 className="text-lg font-semibold text-white">Inventário e Parque</h1>
            </div>
          </div>

          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const active = activeScreen === item.key;

              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setActiveScreen(item.key);
                    setMobileSidebarOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                    active
                      ? 'bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/30'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="mb-3 flex items-center gap-2 text-sky-300">
              <MoonStar className="h-4 w-4" />
              <span className="text-sm font-medium">Tema Dark Mode</span>
            </div>
            <p className="text-sm leading-6 text-slate-400">
              Interface pronta para testes, com persistência temporária no navegador via localStorage.
            </p>
          </div>
        </aside>

        <div className="flex-1 lg:pl-72">
          <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
            <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <button
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-200 lg:hidden"
                  onClick={() => setMobileSidebarOpen((current) => !current)}
                >
                  {mobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>

                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Sistema Web</p>
                  <h2 className="text-xl font-semibold text-white">
                    {activeScreen === 'dashboard' && 'Dashboard'}
                    {activeScreen === 'park' && 'Parque de Máquinas'}
                    {activeScreen === 'stock' && 'Estoque'}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-400 sm:flex">
                  <Bell className="h-4 w-4 text-sky-300" />
                  Dados persistidos localmente
                </div>
              </div>
            </div>
          </header>

          <main className="px-4 py-6 sm:px-6 lg:px-8">
            {activeScreen === 'dashboard' && (
              <div className="space-y-6">
                <section className="grid gap-4 xl:grid-cols-4 lg:grid-cols-2">
                  <MetricCard
                    title="Total do Parque"
                    value={totalPark}
                    description="Desktops, notebooks e celulares em uso"
                    icon={ClipboardList}
                  />
                  <MetricCard
                    title="Equipamentos em Uso"
                    value={`${totalEmUso}`}
                    description={`Desktop ${parkByType.Desktop} · Notebook ${parkByType.Notebook} · Celular ${parkByType.Celular}`}
                    icon={UserRoundCheck}
                  />
                  <MetricCard
                    title="Estoque de Notebooks"
                    value={stockByType.Notebook}
                    description="Aparelhos parados em estoque"
                    icon={Laptop2}
                  />
                  <MetricCard
                    title="Estoque de Celulares"
                    value={stockByType.Celular}
                    description="Aparelhos parados em estoque"
                    icon={Smartphone}
                  />
                </section>

                <section className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
                  <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-glow">
                    <div className="mb-6 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Comparativo</p>
                        <h3 className="mt-1 text-2xl font-semibold text-white">Em Uso vs Em Estoque</h3>
                      </div>
                      <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-slate-300">
                        Atualizado em tempo real
                      </div>
                    </div>

                    <div className="h-[360px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dashboardChart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                          <XAxis dataKey="name" stroke="#94a3b8" />
                          <YAxis stroke="#94a3b8" allowDecimals={false} />
                          <Tooltip
                            contentStyle={{
                              background: '#020617',
                              border: '1px solid #1e293b',
                              borderRadius: '16px',
                              color: '#e2e8f0',
                            }}
                            labelStyle={{ color: '#7dd3fc' }}
                          />
                          <Bar dataKey="emUso" name="Em Uso" radius={[10, 10, 0, 0]}>
                            {dashboardChart.map((entry) => (
                              <Cell key={entry.name} fill="#38bdf8" />
                            ))}
                          </Bar>
                          <Bar dataKey="emEstoque" name="Em Estoque" radius={[10, 10, 0, 0]}>
                            {dashboardChart.map((entry) => (
                              <Cell key={entry.name} fill="#0f766e" />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-glow">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="rounded-2xl bg-sky-500/15 p-3 text-sky-300">
                        <BarChart3 className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Resumo Geral</h3>
                        <p className="text-sm text-slate-400">Visão consolidada do inventário</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <SummaryRow label="Itens em uso" value={totalEmUso} accent="text-sky-300" />
                      <SummaryRow label="Itens em estoque" value={totalEstoque} accent="text-emerald-300" />
                      <SummaryRow label="Desktops em uso" value={parkByType.Desktop} accent="text-cyan-300" />
                      <SummaryRow label="Notebooks em uso" value={parkByType.Notebook} accent="text-blue-300" />
                      <SummaryRow label="Celulares em uso" value={parkByType.Celular} accent="text-indigo-300" />
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeScreen === 'park' && (
              <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-glow">
                <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Parque de Máquinas</p>
                    <h3 className="mt-1 text-2xl font-semibold text-white">Equipamentos ativos</h3>
                  </div>

                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                    <div className="relative w-full lg:w-[320px]">
                      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <input
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Buscar por usuário ou patrimônio"
                        className="w-full rounded-2xl border border-slate-800 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-500"
                      />
                    </div>
                    <button
                      onClick={openAddEquipment}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-700 px-4 py-3 font-medium text-white transition hover:opacity-95"
                    >
                      <CirclePlus className="h-4 w-4" />
                      Cadastrar Equipamento
                    </button>
                  </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-800">
                  <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
                    <thead className="bg-slate-950/80 text-slate-400">
                      <tr>
                        <th className="px-4 py-3 font-medium">Patrimônio</th>
                        <th className="px-4 py-3 font-medium">Tipo</th>
                        <th className="px-4 py-3 font-medium">Marca/Modelo</th>
                        <th className="px-4 py-3 font-medium">Usuário Responsável</th>
                        <th className="px-4 py-3 font-medium">Setor</th>
                        <th className="px-4 py-3 font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-slate-950/40">
                      {filteredPark.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-4 py-10 text-center text-slate-400">
                            Nenhum equipamento encontrado com esse filtro.
                          </td>
                        </tr>
                      ) : (
                        filteredPark.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-900/60">
                            <td className="px-4 py-4 font-medium text-white">{item.patrimonio}</td>
                            <td className="px-4 py-4 text-slate-300">{item.tipo}</td>
                            <td className="px-4 py-4 text-slate-300">{item.marcaModelo}</td>
                            <td className="px-4 py-4 text-slate-300">{item.usuario}</td>
                            <td className="px-4 py-4 text-slate-300">{item.setor}</td>
                            <td className="px-4 py-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => openEditEquipment(item)}
                                  className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-slate-200 transition hover:border-sky-500 hover:text-sky-300"
                                >
                                  <PencilLine className="h-4 w-4" />
                                  Editar
                                </button>
                                <button
                                  onClick={() => removeEquipment(item.id)}
                                  className="inline-flex items-center gap-2 rounded-xl border border-rose-900/60 px-3 py-2 text-rose-300 transition hover:bg-rose-950/60"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Remover
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {activeScreen === 'stock' && (
              <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-glow">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Estoque</p>
                    <h3 className="mt-1 text-2xl font-semibold text-white">Equipamentos parados</h3>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-slate-400">
                    Clique em Atribuir para mover ao parque
                  </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-800">
                  <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
                    <thead className="bg-slate-950/80 text-slate-400">
                      <tr>
                        <th className="px-4 py-3 font-medium">Patrimônio</th>
                        <th className="px-4 py-3 font-medium">Tipo</th>
                        <th className="px-4 py-3 font-medium">Marca/Modelo</th>
                        <th className="px-4 py-3 font-medium">Condição</th>
                        <th className="px-4 py-3 font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-slate-950/40">
                      {stockItems.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-4 py-10 text-center text-slate-400">
                            O estoque está vazio no momento.
                          </td>
                        </tr>
                      ) : (
                        stockItems.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-900/60">
                            <td className="px-4 py-4 font-medium text-white">{item.patrimonio}</td>
                            <td className="px-4 py-4 text-slate-300">{item.tipo}</td>
                            <td className="px-4 py-4 text-slate-300">{item.marcaModelo}</td>
                            <td className="px-4 py-4 text-slate-300">{item.condicao}</td>
                            <td className="px-4 py-4">
                              <button
                                onClick={() => openAssignModal(item.id)}
                                className="inline-flex items-center gap-2 rounded-xl bg-sky-500/15 px-3 py-2 font-medium text-sky-300 transition hover:bg-sky-500/25"
                              >
                                <UserRoundCheck className="h-4 w-4" />
                                Atribuir a Usuário
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </main>
        </div>
      </div>

      {modalMode && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-glow">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-sky-300">
                  {modalMode === 'equipment' ? 'Cadastro / Edição' : 'Transferência de Estoque'}
                </p>
                <h3 className="mt-1 text-2xl font-semibold text-white">
                  {modalMode === 'equipment' ? 'Equipamento' : 'Atribuir a Usuário'}
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="rounded-2xl border border-slate-800 bg-slate-950 p-2 text-slate-300 transition hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {modalMode === 'equipment' && (
              <form className="grid gap-4 md:grid-cols-2" onSubmit={saveEquipment}>
                <Field
                  label="Patrimônio"
                  value={equipmentForm.patrimonio}
                  onChange={(value) => setEquipmentForm((current) => ({ ...current, patrimonio: value }))}
                  placeholder="Ex.: TI-3001"
                />
                <Field
                  label="Tipo"
                  as="select"
                  value={equipmentForm.tipo}
                  onChange={(value) => setEquipmentForm((current) => ({ ...current, tipo: value }))}
                  options={['Desktop', 'Notebook', 'Celular']}
                />
                <div className="md:col-span-2">
                  <Field
                    label="Marca/Modelo"
                    value={equipmentForm.marcaModelo}
                    onChange={(value) => setEquipmentForm((current) => ({ ...current, marcaModelo: value }))}
                    placeholder="Ex.: Dell Latitude 5440"
                  />
                </div>
                <Field
                  label="Estado"
                  as="select"
                  value={equipmentForm.estado}
                  onChange={handleStateChange}
                  options={Object.keys(locationOptions)}
                  optionLabels={stateLabels}
                />
                <Field
                  label="Cidade / Unidade"
                  as="select"
                  value={equipmentForm.cidade}
                  onChange={handleCityChange}
                  options={cityOptions}
                  placeholder={equipmentForm.estado ? 'Selecione a cidade ou unidade' : 'Selecione o estado primeiro'}
                />
                <Field
                  label="Usuário Responsável"
                  value={equipmentForm.usuario}
                  onChange={(value) => setEquipmentForm((current) => ({ ...current, usuario: value }))}
                  placeholder="Nome do colaborador"
                />
                <Field
                  label="Setor"
                  value={equipmentForm.setor}
                  onChange={(value) => setEquipmentForm((current) => ({ ...current, setor: value }))}
                  placeholder="Ex.: Suporte"
                />
                <div className="md:col-span-2 mt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-2xl border border-slate-800 px-4 py-3 text-slate-300 transition hover:border-slate-700 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="rounded-2xl bg-gradient-to-r from-sky-500 to-blue-700 px-5 py-3 font-medium text-white transition hover:opacity-95"
                  >
                    {editingId ? 'Salvar Alterações' : 'Cadastrar Equipamento'}
                  </button>
                </div>
              </form>
            )}

            {modalMode === 'assignment' && (
              <form className="grid gap-4" onSubmit={assignStockItem}>
                <Field
                  label="Nome do Usuário"
                  value={assignmentForm.usuario}
                  onChange={(value) => setAssignmentForm((current) => ({ ...current, usuario: value }))}
                  placeholder="Digite o nome do usuário"
                />
                <Field
                  label="Setor"
                  value={assignmentForm.setor}
                  onChange={(value) => setAssignmentForm((current) => ({ ...current, setor: value }))}
                  placeholder="Digite o setor"
                />
                <div className="mt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-2xl border border-slate-800 px-4 py-3 text-slate-300 transition hover:border-slate-700 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="rounded-2xl bg-gradient-to-r from-sky-500 to-blue-700 px-5 py-3 font-medium text-white transition hover:opacity-95"
                  >
                    Confirmar Atribuição
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {mobileSidebarOpen && (
        <button
          aria-label="Fechar menu"
          className="fixed inset-0 z-20 bg-slate-950/50 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
    </div>
  );
}

function MetricCard({ title, value, description, icon: Icon }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-glow transition hover:-translate-y-1 hover:border-sky-500/30">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="rounded-2xl bg-sky-500/15 p-3 text-sky-300">
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-xs uppercase tracking-[0.3em] text-slate-500">Indicador</span>
      </div>
      <div className="space-y-1">
        <p className="text-sm text-slate-400">{title}</p>
        <p className="text-4xl font-semibold text-white">{value}</p>
        <p className="text-sm leading-6 text-slate-500">{description}</p>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, accent }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
      <span className="text-sm text-slate-400">{label}</span>
      <span className={`text-lg font-semibold ${accent}`}>{value}</span>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, as = 'input', options = [], optionLabels = {} }) {
  const baseClass = 'mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-500';

  return (
    <label className="block text-sm font-medium text-slate-300">
      {label}
      {as === 'select' ? (
        <select className={baseClass} value={value} onChange={(event) => onChange(event.target.value)}>
          <option value="">{placeholder || 'Selecione'}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {optionLabels[option] || option}
            </option>
          ))}
        </select>
      ) : (
        <input
          className={baseClass}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
        />
      )}
    </label>
  );
}

export default App;
