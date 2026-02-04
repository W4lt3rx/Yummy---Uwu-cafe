import React, { useState, useEffect } from 'react';
import { ContextType, User, LocaleType, Product, ShiftLog } from './types';
import { StorageService } from './services/storageService';
import { DiscordService } from './services/discordService';
import { 
  User as UserIcon, Lock, ArrowLeft, IceCream, Coffee, Crown, 
  Clock, PlayCircle, PauseCircle, StopCircle, LogOut, 
  Plus, Trash2, Edit, X, Calendar, History 
} from 'lucide-react';

// Pages
import { Calculator } from './components/Calculator';

// Utility to format milliseconds to HH:mm:ss
const formatDuration = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// --- LANDING PAGE ---
const LandingPage = ({ onSelectContext }: { onSelectContext: (ctx: ContextType) => void }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-transparent">
      <h1 className="text-4xl md:text-5xl font-bold text-slate-700 mb-12 text-center drop-shadow-xl bg-white/60 backdrop-blur-md px-10 py-5 rounded-full border-2 border-white/40">
        ✨ Bienvenido al Sistema ✨
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {/* Yummy */}
        <button 
          onClick={() => onSelectContext('yummy')}
          className="group relative bg-pink-100/80 backdrop-blur-md rounded-3xl p-8 h-80 flex flex-col items-center justify-center shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 border-4 border-white"
        >
          <div className="bg-white p-6 rounded-full shadow-inner mb-6 group-hover:rotate-12 transition-transform">
            <IceCream size={64} className="text-pink-400" />
          </div>
          <h2 className="text-3xl font-bold text-pink-500 mb-2">Yummy Ice Cream</h2>
          <p className="text-pink-400 font-medium">Plataforma Heladería</p>
        </button>

        {/* UwU */}
        <button 
          onClick={() => onSelectContext('uwu')}
          className="group relative bg-sky-100/80 backdrop-blur-md rounded-3xl p-8 h-80 flex flex-col items-center justify-center shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 border-4 border-white"
        >
          <div className="bg-white p-6 rounded-full shadow-inner mb-6 group-hover:-rotate-12 transition-transform">
            <Coffee size={64} className="text-sky-400" />
          </div>
          <h2 className="text-3xl font-bold text-sky-500 mb-2">UwU Café</h2>
          <p className="text-sky-400 font-medium">Plataforma Cafetería</p>
        </button>

        {/* Admin */}
        <button 
          onClick={() => onSelectContext('admin_panel')}
          className="group relative bg-amber-100/80 backdrop-blur-md rounded-3xl p-8 h-80 flex flex-col items-center justify-center shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 border-4 border-white"
        >
          <div className="bg-white p-6 rounded-full shadow-inner mb-6 group-hover:scale-110 transition-transform">
            <Crown size={64} className="text-amber-500" />
          </div>
          <h2 className="text-3xl font-bold text-amber-500 mb-2">Jefes / Dueños</h2>
          <p className="text-amber-600 font-medium">Panel Administrativo</p>
        </button>
      </div>
    </div>
  );
};

// --- LOGIN PAGE ---
const LoginPage = ({ context, onLogin, onBack }: { context: ContextType, onLogin: (u: User) => void, onBack: () => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const users = StorageService.getUsers();
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      setError('❌ Usuario o contraseña incorrectos');
      return;
    }

    // Permission Check
    if (context === 'admin_panel') {
      if (user.role !== 'admin') {
        setError('⛔ Solo Jefes pueden entrar aquí');
        return;
      }
    } else if (context) {
      // It's a shop
      if (user.role !== 'admin' && !user.allowedLocales.includes(context as LocaleType)) {
        setError('⛔ No tienes permiso para este local');
        return;
      }
    }

    onLogin(user);
  };

  const themeColor = context === 'yummy' ? 'pink' : context === 'uwu' ? 'sky' : 'amber';
  const displayTitle = context === 'yummy' ? 'Yummy Ice Cream' : context === 'uwu' ? 'UwU Café' : 'Panel de Jefes';

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent">
      <div className="bg-white/95 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-md border-4 border-white relative modal-content">
        <button onClick={onBack} className="absolute top-6 left-6 text-gray-400 hover:text-gray-600">
          <ArrowLeft />
        </button>
        
        <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-${themeColor}-100`}>
          <UserIcon className={`text-${themeColor}-500`} size={40} />
        </div>

        <h2 className={`text-3xl font-bold text-center mb-2 text-${themeColor}-500`}>{displayTitle}</h2>
        <p className="text-center text-gray-400 mb-8">Inicia sesión para continuar</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-600 font-bold mb-2 ml-1">Usuario</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input 
                type="text" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-100 bg-white/80 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-${themeColor}-300 focus:ring-4 focus:ring-${themeColor}-100 transition-all`}
                placeholder="Tu nombre de usuario"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 font-bold mb-2 ml-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-100 bg-white/80 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-${themeColor}-300 focus:ring-4 focus:ring-${themeColor}-100 transition-all`}
                placeholder="••••••"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-center font-bold bg-red-50/80 p-2 rounded-lg">{error}</p>}

          <button 
            type="submit"
            className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg shadow-${themeColor}-200 bg-${themeColor}-400 hover:bg-${themeColor}-500 active:scale-95 transition-all`}
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

// --- WORKER DASHBOARD ---

const WorkerDashboard = ({ user, context, onLogout }: { user: User, context: LocaleType, onLogout: () => void }) => {
  const [session, setSession] = useState(StorageService.getSession(user.id));
  const [elapsed, setElapsed] = useState(0);
  const [todayLogs, setTodayLogs] = useState(StorageService.getTimeLogs().filter(l => l.userId === user.id && new Date(l.timestamp).toDateString() === new Date().toDateString()));
  const [history, setHistory] = useState(StorageService.getShiftLogs().filter(l => l.userId === user.id));

  useEffect(() => {
    let interval: any;
    if (session.isActive && !session.isOnPause && session.startTime) {
      interval = setInterval(() => {
        const start = new Date(session.startTime!).getTime();
        const now = new Date().getTime();
        setElapsed(now - start - session.totalPauseTime);
      }, 1000);
    } else {
      setElapsed(0);
    }
    return () => clearInterval(interval);
  }, [session]);

  const handleAction = async (type: 'entrada' | 'pausa' | 'continuar' | 'salida') => {
    const now = new Date();
    const newSession = { ...session };
    let logType: 'entrada' | 'pausa' | 'salida' = 'entrada';

    if (type === 'entrada') {
      newSession.isActive = true;
      newSession.startTime = now.toISOString();
      logType = 'entrada';
    } else if (type === 'pausa') {
      newSession.isOnPause = true;
      newSession.lastPauseTime = now.toISOString();
      logType = 'pausa';
    } else if (type === 'continuar') {
      newSession.isOnPause = false;
      if (newSession.lastPauseTime) {
        const pauseStart = new Date(newSession.lastPauseTime).getTime();
        newSession.totalPauseTime += (now.getTime() - pauseStart);
      }
      newSession.lastPauseTime = null;
      logType = 'entrada'; 
    } else if (type === 'salida') {
      // Calculate final duration
      if (newSession.startTime) {
          const startTimeMs = new Date(newSession.startTime).getTime();
          const endTimeMs = now.getTime();
          const totalWorkTime = endTimeMs - startTimeMs - newSession.totalPauseTime;

          const shiftLog: ShiftLog = {
              id: crypto.randomUUID(),
              userId: user.id,
              username: user.username,
              locale: context,
              startTime: newSession.startTime,
              endTime: now.toISOString(),
              totalPauseTime: newSession.totalPauseTime,
              totalWorkTime: totalWorkTime
          };
          StorageService.addShiftLog(shiftLog);
          setHistory(prev => [shiftLog, ...prev]);
      }

      newSession.isActive = false;
      newSession.isOnPause = false;
      newSession.startTime = null;
      newSession.lastPauseTime = null;
      newSession.totalPauseTime = 0;
      logType = 'salida';
    }

    StorageService.saveSession(user.id, newSession);
    setSession(newSession);

    if (type !== 'continuar') {
      const log = {
        id: crypto.randomUUID(),
        userId: user.id,
        username: user.username,
        locale: context,
        type: logType,
        timestamp: now.toISOString()
      };
      StorageService.addTimeLog(log);
      setTodayLogs(prev => [log, ...prev]);
      await DiscordService.sendTimeLog(log);
    }
  };

  const totalAccumulatedTime = history.reduce((acc, curr) => acc + curr.totalWorkTime, 0);
  const themeColor = context === 'yummy' ? 'pink' : 'sky';

  return (
    <div className="min-h-screen bg-transparent pb-24">
      {/* Header */}
      <div className={`bg-white/95 backdrop-blur-md p-6 shadow-md border-b-4 border-${themeColor}-100 flex justify-between items-center sticky top-0 z-30`}>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full bg-${themeColor}-100 text-${themeColor}-500`}>
            {context === 'yummy' ? <IceCream /> : <Coffee />}
          </div>
          <div>
            <h1 className={`text-2xl font-bold text-${themeColor}-600`}>Hola, {user.username}</h1>
            <p className="text-gray-400 text-sm">Panel de Trabajador</p>
          </div>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 text-gray-400 hover:text-red-400 font-bold transition-colors">
          <LogOut size={20} /> Salir
        </button>
      </div>

      <div className="container mx-auto p-6 max-w-4xl">
        {/* Main Clock Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl text-center mb-8 border-4 border-white">
          <h2 className="text-gray-400 font-bold mb-4 uppercase tracking-widest text-sm">Tiempo Trabajado Hoy (Sesión)</h2>
          <div className={`text-6xl md:text-8xl font-bold text-slate-700 font-mono mb-8`}>
            {formatDuration(elapsed)}
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {!session.isActive ? (
              <button 
                onClick={() => handleAction('entrada')}
                className="flex items-center gap-3 px-8 py-4 bg-green-400 text-white rounded-2xl font-bold text-xl shadow-lg hover:bg-green-500 active:scale-95 transition-all"
              >
                <PlayCircle size={28} /> Marcar Entrada
              </button>
            ) : (
              <>
                {session.isOnPause ? (
                  <button 
                    onClick={() => handleAction('continuar')}
                    className="flex items-center gap-3 px-8 py-4 bg-amber-400 text-white rounded-2xl font-bold text-xl shadow-lg hover:bg-amber-500 active:scale-95 transition-all"
                  >
                    <PlayCircle size={28} /> Reanudar
                  </button>
                ) : (
                  <button 
                    onClick={() => handleAction('pausa')}
                    className="flex items-center gap-3 px-8 py-4 bg-amber-400 text-white rounded-2xl font-bold text-xl shadow-lg hover:bg-amber-500 active:scale-95 transition-all"
                  >
                    <PauseCircle size={28} /> Pausa
                  </button>
                )}
                
                <button 
                  onClick={() => handleAction('salida')}
                  className="flex items-center gap-3 px-8 py-4 bg-red-400 text-white rounded-2xl font-bold text-xl shadow-lg hover:bg-red-500 active:scale-95 transition-all"
                >
                  <StopCircle size={28} /> Terminar
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Event History (Today) */}
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-lg border-4 border-white">
                <h3 className="text-xl font-bold text-gray-600 mb-6 flex items-center gap-2">
                    <Clock className={`text-${themeColor}-400`} /> Eventos de Hoy
                </h3>
                <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                    {todayLogs.length === 0 && <p className="text-gray-400 text-center py-4">Sin actividad hoy...</p>}
                    {todayLogs.map(log => (
                    <div key={log.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${
                            log.type === 'entrada' ? 'bg-green-400' : 
                            log.type === 'pausa' ? 'bg-amber-400' : 'bg-red-400'
                        }`} />
                        <span className="font-bold text-gray-700 capitalize">{log.type}</span>
                        </div>
                        <span className="font-mono text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    ))}
                </div>
            </div>

            {/* Personal Shift History */}
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-lg border-4 border-white">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-600 flex items-center gap-2">
                        <History className={`text-${themeColor}-400`} /> Historial
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold bg-${themeColor}-100 text-${themeColor}-600`}>
                        Total: {formatDuration(totalAccumulatedTime)}
                    </span>
                </div>
                
                <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                    {history.length === 0 && <p className="text-gray-400 text-center py-4">No hay turnos completados.</p>}
                    {history.map(shift => (
                    <div key={shift.id} className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                         <div className="flex justify-between mb-2">
                            <span className="text-sm font-bold text-gray-600">
                                {new Date(shift.startTime).toLocaleDateString()}
                            </span>
                            <span className={`text-xs font-bold uppercase ${shift.locale === 'yummy' ? 'text-pink-400' : 'text-sky-400'}`}>
                                {shift.locale}
                            </span>
                         </div>
                         <div className="flex justify-between items-end">
                             <div className="text-xs text-gray-400">
                                 {new Date(shift.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(shift.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                             </div>
                             <div className="text-lg font-mono font-bold text-slate-700">
                                 {formatDuration(shift.totalWorkTime)}
                             </div>
                         </div>
                    </div>
                    ))}
                </div>
            </div>
        </div>

      </div>

      <Calculator locale={context} user={user} />
    </div>
  );
};

// --- ADMIN DASHBOARD ---

const AdminDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'products_yummy' | 'products_uwu' | 'history'>('users');
  const [users, setUsers] = useState(StorageService.getUsers());
  const [productsYummy, setProductsYummy] = useState(StorageService.getProducts('yummy'));
  const [productsUwU, setProductsUwU] = useState(StorageService.getProducts('uwu'));
  const [shiftHistory, setShiftHistory] = useState(StorageService.getShiftLogs());
  const [selectedUserIdForHistory, setSelectedUserIdForHistory] = useState<string | null>(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null); // Quick dirty type for brevity

  const refreshData = () => {
    setUsers(StorageService.getUsers());
    setProductsYummy(StorageService.getProducts('yummy'));
    setProductsUwU(StorageService.getProducts('uwu'));
    setShiftHistory(StorageService.getShiftLogs());
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as any;
    const user: User = {
      id: editingItem?.id || crypto.randomUUID(),
      username: form.username.value,
      password: form.password.value,
      role: form.role.value,
      allowedLocales: Array.from(form.locales.selectedOptions).map((o: any) => o.value)
    };
    StorageService.saveUser(user);
    setIsModalOpen(false);
    refreshData();
  };

  const handleDeleteUser = (id: string) => {
    if(window.confirm('¿Seguro de eliminar este usuario?')) {
      StorageService.deleteUser(id);
      refreshData();
    }
  };

  const handleSaveProduct = (e: React.FormEvent, locale: LocaleType) => {
    e.preventDefault();
    const form = e.target as any;
    const prod: Product = {
      id: editingItem?.id || crypto.randomUUID(),
      name: form.name.value,
      price: parseFloat(form.price.value),
      icon: form.icon.value,
      category: form.category.value
    };
    
    const currentList = locale === 'yummy' ? productsYummy : productsUwU;
    const newList = editingItem 
      ? currentList.map(p => p.id === prod.id ? prod : p)
      : [...currentList, prod];
      
    StorageService.saveProducts(locale, newList);
    setIsModalOpen(false);
    refreshData();
  };

  const handleDeleteProduct = (id: string, locale: LocaleType) => {
    if(!window.confirm('¿Borrar producto?')) return;
    const currentList = locale === 'yummy' ? productsYummy : productsUwU;
    const newList = currentList.filter(p => p.id !== id);
    StorageService.saveProducts(locale, newList);
    refreshData();
  };

  const handleDeleteShift = (id: string) => {
      if(window.confirm('¿Eliminar este registro de horas?')) {
          StorageService.deleteShiftLog(id);
          refreshData();
      }
  }

  const handleClearUserHistory = (userId: string) => {
      if(window.confirm('⚠️ ¿ESTÁS SEGURO? Se borrará TODO el historial de horas de este usuario. Esta acción no se puede deshacer.')) {
          StorageService.clearUserShiftLogs(userId);
          refreshData();
      }
  }

  // Calculate totals for History Tab
  const totalGlobalTime = shiftHistory.reduce((acc, curr) => acc + curr.totalWorkTime, 0);

  // Helper for rendering user card in staff management
  const renderUserCard = (u: User) => (
    <div key={u.id} className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm transition-all hover:bg-white/80">
       <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${u.role === 'admin' ? 'bg-amber-400' : 'bg-gray-400'}`}>
            {u.username[0].toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-gray-700">{u.username}</p>
            <p className="text-xs text-gray-400">{u.role} {u.role === 'admin' && '👑'}</p>
          </div>
       </div>
       <div className="flex gap-2">
         <button onClick={() => { setEditingItem(u); setIsModalOpen(true); }} className="text-blue-400 hover:bg-blue-100 p-2 rounded-full transition-colors"><Edit size={18} /></button>
         <button onClick={() => handleDeleteUser(u.id)} className="text-red-400 hover:bg-red-100 p-2 rounded-full transition-colors"><Trash2 size={18} /></button>
       </div>
     </div>
  );

  return (
    <div className="min-h-screen bg-transparent">
       <div className="bg-white/95 backdrop-blur-md p-6 shadow-md border-b-4 border-amber-100 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-amber-100 text-amber-500">
            <Crown />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-amber-600">Panel de Control</h1>
            <p className="text-gray-400 text-sm">Administración Global</p>
          </div>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 text-gray-400 hover:text-red-400 font-bold">
          <LogOut size={20} /> Salir
        </button>
      </div>

      <div className="container mx-auto p-6 max-w-5xl">
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'users' ? 'bg-amber-400 text-white shadow-lg scale-105' : 'bg-white/80 backdrop-blur-sm text-gray-500 hover:bg-white/90'}`}
          >
            👥 Usuarios
          </button>
          <button 
            onClick={() => setActiveTab('products_yummy')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'products_yummy' ? 'bg-pink-400 text-white shadow-lg scale-105' : 'bg-white/80 backdrop-blur-sm text-gray-500 hover:bg-white/90'}`}
          >
            🍦 Yummy Productos
          </button>
          <button 
            onClick={() => setActiveTab('products_uwu')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'products_uwu' ? 'bg-sky-400 text-white shadow-lg scale-105' : 'bg-white/80 backdrop-blur-sm text-gray-500 hover:bg-white/90'}`}
          >
            ☕ UwU Productos
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'history' ? 'bg-purple-400 text-white shadow-lg scale-105' : 'bg-white/80 backdrop-blur-sm text-gray-500 hover:bg-white/90'}`}
          >
            📊 Historial de Horas
          </button>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-xl border-4 border-white min-h-[500px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-700">
              {activeTab === 'users' ? 'Gestionar Equipo' : 
               activeTab === 'history' ? 'Historial de Horas' : 
               activeTab === 'products_yummy' ? 'Menú Yummy' : 'Menú UwU'}
            </h2>
            {activeTab !== 'history' && (
                <button 
                onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
                className="w-10 h-10 rounded-full bg-green-400 text-white flex items-center justify-center hover:bg-green-500 transition-colors shadow-md"
                >
                <Plus />
                </button>
            )}
          </div>

          {activeTab === 'users' && (
            <div className="space-y-8">
               {/* Yummy Team */}
               <div className="bg-pink-50/40 p-6 rounded-2xl border border-pink-100">
                  <h3 className="text-xl font-bold text-pink-500 mb-4 flex items-center gap-2">
                    <IceCream className="text-pink-400"/> Staff Yummy Ice Cream
                  </h3>
                  <div className="grid gap-3">
                    {users.filter(u => u.role === 'admin' || u.allowedLocales.includes('yummy')).map(renderUserCard)}
                  </div>
               </div>

               {/* UwU Team */}
               <div className="bg-sky-50/40 p-6 rounded-2xl border border-sky-100">
                  <h3 className="text-xl font-bold text-sky-500 mb-4 flex items-center gap-2">
                    <Coffee className="text-sky-400" /> Staff UwU Café
                  </h3>
                  <div className="grid gap-3">
                    {users.filter(u => u.role === 'admin' || u.allowedLocales.includes('uwu')).map(renderUserCard)}
                  </div>
               </div>
            </div>
          )}
          
          {activeTab === 'history' && (
            <div className="animate-in fade-in duration-300">
              {selectedUserIdForHistory ? (
                // DETAIL VIEW
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <button 
                      onClick={() => setSelectedUserIdForHistory(null)}
                      className="flex items-center gap-2 text-purple-600 font-bold hover:underline"
                    >
                      <ArrowLeft size={18} /> Volver a la lista
                    </button>
                    <button 
                      onClick={() => handleClearUserHistory(selectedUserIdForHistory)}
                      className="px-4 py-2 rounded-xl bg-red-100 text-red-500 font-bold hover:bg-red-200 transition-colors flex items-center gap-2"
                    >
                      <Trash2 size={16}/> Limpiar Todo
                    </button>
                  </div>

                  {(() => {
                    const selectedUser = users.find(u => u.id === selectedUserIdForHistory);
                    const userLogs = shiftHistory.filter(l => l.userId === selectedUserIdForHistory);
                    const userTotalTime = userLogs.reduce((acc, curr) => acc + curr.totalWorkTime, 0);

                    return (
                      <>
                        <div className="bg-purple-50/60 p-6 rounded-2xl border border-purple-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-purple-400 flex items-center justify-center text-white font-bold text-2xl">
                              {selectedUser?.username[0].toUpperCase()}
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-gray-700">{selectedUser?.username}</h3>
                              <p className="text-purple-400 font-bold uppercase text-xs">{selectedUser?.role}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-400 font-bold uppercase text-xs">Tiempo Total Acumulado</p>
                            <span className="text-4xl font-mono font-bold text-purple-600">{formatDuration(userTotalTime)}</span>
                          </div>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-gray-600">
                            <thead className="bg-gray-100/60 text-gray-400 text-xs uppercase font-bold">
                              <tr>
                                <th className="p-4 rounded-tl-xl">Local</th>
                                <th className="p-4">Fecha</th>
                                <th className="p-4">Inicio</th>
                                <th className="p-4">Fin</th>
                                <th className="p-4">Duración</th>
                                <th className="p-4 rounded-tr-xl text-right">Acción</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100/50">
                              {userLogs.length === 0 ? (
                                <tr><td colSpan={6} className="p-8 text-center text-gray-400">No hay registros para este usuario.</td></tr>
                              ) : (
                                userLogs.map(shift => (
                                  <tr key={shift.id} className="hover:bg-white/40 transition-colors">
                                    <td className="p-4">
                                      <span className={`px-2 py-1 rounded text-xs font-bold ${shift.locale === 'yummy' ? 'bg-pink-100 text-pink-500' : 'bg-sky-100 text-sky-500'}`}>
                                        {shift.locale}
                                      </span>
                                    </td>
                                    <td className="p-4 font-medium">{new Date(shift.startTime).toLocaleDateString()}</td>
                                    <td className="p-4 font-mono text-xs">{new Date(shift.startTime).toLocaleTimeString()}</td>
                                    <td className="p-4 font-mono text-xs">{new Date(shift.endTime).toLocaleTimeString()}</td>
                                    <td className="p-4 font-mono font-bold text-gray-800">{formatDuration(shift.totalWorkTime)}</td>
                                    <td className="p-4 text-right">
                                      <button 
                                        onClick={() => handleDeleteShift(shift.id)}
                                        className="text-red-300 hover:text-red-500 hover:bg-red-50/50 p-2 rounded-full transition-colors"
                                      >
                                        <Trash2 size={16} />
                                      </button>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </>
                    );
                  })()}
                </div>
              ) : (
                // USER LIST VIEW
                <div className="space-y-6">
                  <div className="flex justify-between items-center bg-gray-50/60 p-4 rounded-2xl border border-gray-100">
                     <p className="text-gray-500 font-bold uppercase text-xs">Suma de todas las horas (Global)</p>
                     <span className="font-mono font-bold text-gray-700 text-xl">{formatDuration(totalGlobalTime)}</span>
                  </div>

                  <div className="grid gap-4">
                    {users.map(u => {
                      const userTotal = shiftHistory
                        .filter(l => l.userId === u.id)
                        .reduce((acc, curr) => acc + curr.totalWorkTime, 0);
                      
                      return (
                        <div key={u.id} className="flex items-center justify-between p-6 bg-white/60 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl transition-transform group-hover:scale-110 ${u.role === 'admin' ? 'bg-amber-400' : 'bg-purple-400'}`}>
                              {u.username[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-xl text-gray-700">{u.username}</p>
                              <p className="text-sm text-gray-400 capitalize">{u.role} {u.role === 'admin' && '👑'}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="text-right">
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Horas</p>
                              <p className="font-mono font-bold text-purple-600 text-lg">{formatDuration(userTotal)}</p>
                            </div>
                            <button 
                              onClick={() => setSelectedUserIdForHistory(u.id)}
                              className="px-4 py-2 bg-purple-500 text-white rounded-xl font-bold text-sm hover:bg-purple-600 transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-purple-100"
                            >
                              <History size={16} /> Ver historial
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {(activeTab === 'products_yummy' || activeTab === 'products_uwu') && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {(activeTab === 'products_yummy' ? productsYummy : productsUwU).map(p => (
                 <div key={p.id} className="p-4 bg-white/60 backdrop-blur-sm rounded-xl relative group hover:shadow-md transition-all">
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditingItem(p); setIsModalOpen(true); }} className="bg-white p-1 rounded-full shadow text-blue-400"><Edit size={14}/></button>
                      <button onClick={() => handleDeleteProduct(p.id, activeTab === 'products_yummy' ? 'yummy' : 'uwu')} className="bg-white p-1 rounded-full shadow text-red-400"><Trash2 size={14}/></button>
                    </div>
                    <div className="text-4xl mb-2 text-center">{p.icon}</div>
                    <p className="font-bold text-center text-gray-700">{p.name}</p>
                    <p className="text-center text-gray-500 font-mono">${p.price}</p>
                 </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal - Generic for both User and Product to save lines */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white/95 backdrop-blur-md w-full max-w-md rounded-3xl p-8 shadow-2xl modal-content relative border-2 border-white/50">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"><X /></button>
            <h3 className="text-2xl font-bold mb-6 text-gray-700">
              {editingItem ? 'Editar' : 'Crear'} {activeTab === 'users' ? 'Usuario' : 'Producto'}
            </h3>
            
            <form onSubmit={(e) => {
              if (activeTab === 'users') handleSaveUser(e);
              else handleSaveProduct(e, activeTab === 'products_yummy' ? 'yummy' : 'uwu');
            }} className="space-y-4">
              
              {activeTab === 'users' ? (
                <>
                  <input name="username" defaultValue={editingItem?.username} placeholder="Username" required className="w-full p-3 bg-white/60 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-amber-300 text-gray-800" />
                  <input name="password" defaultValue={editingItem?.password} placeholder="Password" required className="w-full p-3 bg-white/60 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-amber-300 text-gray-800" />
                  <select name="role" defaultValue={editingItem?.role || 'worker'} className="w-full p-3 bg-white/60 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-amber-300 text-gray-800">
                    <option value="worker">Worker</option>
                    <option value="admin">Admin</option>
                  </select>
                  <div className="p-3 bg-white/60 rounded-xl border-2 border-gray-100">
                    <p className="text-sm text-gray-500 mb-2">Locales Permitidos (Ctrl+Click)</p>
                    <select name="locales" multiple defaultValue={editingItem?.allowedLocales || ['yummy']} className="w-full bg-transparent focus:outline-none text-gray-800 h-20">
                      <option value="yummy">Yummy Ice Cream</option>
                      <option value="uwu">UwU Café</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <input name="name" defaultValue={editingItem?.name} placeholder="Nombre Producto" required className="w-full p-3 bg-white/60 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-amber-300 text-gray-800" />
                  <input name="price" type="number" step="0.5" defaultValue={editingItem?.price} placeholder="Precio" required className="w-full p-3 bg-white/60 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-amber-300 text-gray-800" />
                  <input name="icon" defaultValue={editingItem?.icon} placeholder="Icono (Emoji/URL)" required className="w-full p-3 bg-white/60 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-amber-300 text-gray-800" />
                  <input name="category" defaultValue={editingItem?.category} placeholder="Categoría" required className="w-full p-3 bg-white/60 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-amber-300 text-gray-800" />
                </>
              )}

              <button type="submit" className="w-full py-3 bg-amber-400 text-white font-bold rounded-xl shadow-lg hover:bg-amber-500 transition-all mt-4 active:scale-95">Guardar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- APP ROOT COMPONENT ---

const App: React.FC = () => {
  const [context, setContext] = useState<ContextType>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleSelectContext = (ctx: ContextType) => {
    setContext(ctx);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setContext(null); // Go back to very start
  };

  const handleBackToLanding = () => {
    setContext(null);
  };

  if (!context) {
    return <LandingPage onSelectContext={handleSelectContext} />;
  }

  if (!currentUser) {
    return <LoginPage context={context} onLogin={handleLogin} onBack={handleBackToLanding} />;
  }

  if (context === 'admin_panel') {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  // Worker Dashboard for Yummy or UwU
  return <WorkerDashboard user={currentUser} context={context as LocaleType} onLogout={handleLogout} />;
};

export default App;