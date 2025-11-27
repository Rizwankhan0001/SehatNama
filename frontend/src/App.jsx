import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Cloud,
  Droplets,
  Wind,
  ShieldCheck,
  BellRing,
  Map,
  Sparkles,
  Radar,
  Target,
  Compass,
  SatelliteDish,
  Search
} from 'lucide-react';
import RiskMap from './components/RiskMap';
import DiseaseCard from './components/DiseaseCard';
import WeatherStats from './components/WeatherStats';
import PreventiveTips from './components/PreventiveTips';
import DiseaseCategorySelector from './components/DiseaseCategorySelector';
import { fetchPredictions, fetchWeatherData, generatePredictions } from './services/api';

const RISK_ORDER = ['critical', 'high', 'medium', 'low'];

const formatTimeline = (entries) =>
  entries.slice(0, 4).map((item, idx) => ({
    title: `${item.location?.name || 'Unknown'} spike`,
    detail: `${Math.round(item.riskScore)}% ${item.diseaseType} risk`,
    badge: (item.riskLevel || 'high').replace(/^\w/, c => c.toUpperCase()),
    time: item.timestamp
      ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : `T-${idx + 1}h`
  }));

export default function App() {
  const [predictions, setPredictions] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState('dengue');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [syncingSensors, setSyncingSensors] = useState(false);
  const [pinnedZones, setPinnedZones] = useState([]);
  const [actionStatus, setActionStatus] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [diseaseCategory, setDiseaseCategory] = useState('human');

  const navLinks = [
    { label: 'Overview', href: '#hero' },
    { label: 'Dashboard', href: '#dashboard' },
    { label: 'Insights', href: '#insights' },
    { label: 'Alerts', href: '#alerts' }
  ];

  const heroStats = [
    { label: 'Cities monitored', value: '50+', trend: '+12 this week' },
    { label: 'Live alerts', value: predictions?.length || '24', trend: 'Updated hourly' },
    { label: 'Avg. response gain', value: '4 hrs', trend: 'Faster awareness' }
  ];

  const highlights = [
    {
      title: 'Live Weather Intelligence',
      description: 'Compare humidity, rainfall, and temperature spikes within seconds.',
      icon: Cloud
    },
    {
      title: 'Smart Risk Alerts',
      description: 'AI prioritizes the outbreaks that need attention right now.',
      icon: BellRing
    },
    {
      title: 'Field-Ready Guidance',
      description: 'Preventive playbooks tailored for cities and farming zones.',
      icon: ShieldCheck
    },
    {
      title: 'Interactive Risk Mapping',
      description: 'Pan & zoom through heat zones with real-time context layers.',
      icon: Map
    }
  ];

  const ctaMetrics = [
    { label: 'Avg. detection lead', value: '6 hrs' },
    { label: 'Regions synced', value: '82' },
    { label: 'Alerts delivered', value: '230+' }
  ];

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 300000);
    return () => clearInterval(interval);
  }, []);

  const showStatus = (type, message) => {
    setActionStatus({ type, message, timestamp: Date.now() });
    setTimeout(() => {
      setActionStatus(null);
    }, 3500);
  };

  const loadData = async () => {
    try {
      const [predData, weatherRes] = await Promise.all([
        fetchPredictions(),
        fetchWeatherData()
      ]);
      console.log('Loaded predictions:', predData?.length || 0, predData);
      setPredictions(predData || []);
      setWeatherData(weatherRes || []);
    } catch (error) {
      console.error('Error loading data:', error);
      showStatus('error', 'Failed to load data. Check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const filteredPredictions = predictions.filter(p => p.diseaseType === selectedDisease);
  const timeline = formatTimeline(filteredPredictions);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await generatePredictions();
      await loadData();
      showStatus('success', 'Risk predictions refreshed successfully.');
    } catch (error) {
      console.error('Error generating predictions:', error);
      showStatus('error', 'Could not refresh predictions. Try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handlePinZones = () => {
    if (!filteredPredictions.length) {
      showStatus('error', 'No active predictions to pin.');
      return;
    }

    const topZones = [...filteredPredictions]
      .sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0))
      .slice(0, 4);

    setPinnedZones(topZones);
    showStatus('success', 'Priority zones pinned for quick review.');
  };

  const buildShareBrief = () => {
    if (!filteredPredictions.length) {
      return `Prescure update (${new Date().toLocaleString()}): No active ${selectedDisease} risks at the moment.`;
    }

    const counts = filteredPredictions.reduce((acc, pred) => {
      acc[pred.riskLevel] = (acc[pred.riskLevel] || 0) + 1;
      return acc;
    }, {});

    const summary = RISK_ORDER
      .map(level => `${counts[level] || 0} ${level}`)
      .join(', ');

    return `Prescure ${selectedDisease.toUpperCase()} briefing (${new Date().toLocaleString()}): ${summary}. Top zone: ${
      filteredPredictions[0]?.location?.name || 'N/A'
    } (${Math.round(filteredPredictions[0]?.riskScore || 0)}%).`;
  };

  const handleShareBrief = async () => {
    const brief = buildShareBrief();
    try {
      if (typeof navigator !== 'undefined' && navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(brief);
        showStatus('success', 'Situation brief copied to clipboard.');
      } else {
        throw new Error('Clipboard unavailable');
      }
    } catch (error) {
      console.error('Share brief error:', error);
      showStatus('error', 'Clipboard unavailable. Brief logged to console.');
      console.log(brief);
    }
  };

  const handleSensorSync = async () => {
    setSyncingSensors(true);
    try {
      await loadData();
      showStatus('success', 'Field sensors synced with latest weather layers.');
    } catch (error) {
      showStatus('error', 'Sensor sync failed. Try again soon.');
    } finally {
      setSyncingSensors(false);
    }
  };

  const handleScheduleBriefing = () => {
    const briefingTime = new Date(Date.now() + 3600000).toLocaleString();
    showStatus('success', `Briefing scheduled for ${briefingTime}`);
  };

  const handleDownloadPlaybook = () => {
    const playbook = `PRESCURE PREVENTIVE PLAYBOOK\n${'='.repeat(50)}\n\nDisease: ${selectedDisease.toUpperCase()}\nGenerated: ${new Date().toLocaleString()}\n\nRisk Zones:\n${filteredPredictions.slice(0, 5).map((p, i) => `${i + 1}. ${p.location?.name || 'Unknown'} - ${Math.round(p.riskScore)}% (${p.riskLevel})`).join('\n')}\n\nPreventive Measures:\n- Monitor weather conditions daily\n- Implement vector control measures\n- Educate community about symptoms\n- Ensure medical supplies are stocked\n`;
    
    const blob = new Blob([playbook], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prescure-playbook-${selectedDisease}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showStatus('success', 'Playbook downloaded successfully.');
  };

  const handleDocs = () => {
    showStatus('success', 'Opening documentation...');
    window.open('https://github.com/Rizwankhan0001/Prescure', '_blank');
  };

  const handleLaunchDashboard = () => {
    scrollToSection('dashboard');
    showStatus('success', 'Dashboard loaded successfully!');
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    if (predictions.length === 0) {
      showStatus('error', 'No data available. Please generate predictions first.');
      setSearchResults([]);
      return;
    }
    
    const results = predictions.filter(pred => 
      pred.location?.name?.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(results);
    if (results.length > 0) {
      showStatus('success', `Found ${results.length} result(s) for "${query}"`);
    } else {
      const availableLocations = [...new Set(predictions.map(p => p.location?.name).filter(Boolean))].slice(0, 5).join(', ');
      showStatus('error', `No results for "${query}". Try: ${availableLocations}`);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const quickActions = [
    {
      title: 'Regenerate Predictions',
      description: 'Refresh AI scores with the latest weather pulse.',
      icon: Radar,
      action: handleGenerate,
      primary: true,
      loading: generating,
      cta: generating ? 'Running...' : 'Execute'
    },
    {
      title: 'Pin Priority Zones',
      description: 'Star risky districts to keep them in focus.',
      icon: Target,
      action: handlePinZones,
      cta: 'Pin zones'
    },
    {
      title: 'Share Situation Brief',
      description: 'Send a snapshot to health & agri teams.',
      icon: Compass,
      action: handleShareBrief,
      cta: 'Copy brief'
    },
    {
      title: 'Sync Field Sensors',
      description: 'Blend satellite rainfall + on-ground weather.',
      icon: SatelliteDish,
      action: handleSensorSync,
      cta: syncingSensors ? 'Syncing...' : 'Sync now',
      loading: syncingSensors
    }
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNavClick = (event, sectionId) => {
    event.preventDefault();
    scrollToSection(sectionId);
  };

  return (
    <div className="min-h-screen overflow-hidden">
      <div className="hero-glow" />
      <div className="pattern-overlay" />
      <div className="floating-shape float-one" />
      <div className="floating-shape float-two" />

      <div className="relative z-10 px-4 md:px-8 pb-20 space-y-12">
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card sticky top-4 max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 px-6 py-3"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-500/10 text-blue-600">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold gradient-text">Prescure</h1>
              <p className="text-xs text-gray-500">Weather-aware outbreak radar</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {navLinks.map(link => (
              <button
                key={link.label}
                className="nav-link"
                onClick={(event) => handleNavClick(event, link.href.replace('#', ''))}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={handleDocs} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">Docs</button>
            <button onClick={handleLaunchDashboard} className="primary-btn">Launch Dashboard</button>
          </div>
        </motion.nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card max-w-6xl mx-auto p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold gradient-text">🦠 Disease Categories</h3>
              <p className="text-xs text-slate-500">Select category and disease type</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setDiseaseCategory('human');
                setSelectedDisease('dengue');
              }}
              className={`p-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                diseaseCategory === 'human'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-xl scale-105'
                  : 'bg-white/80 text-slate-700 border-2 border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">👨⚕️</span>
                <span>Human Diseases</span>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setDiseaseCategory('crop');
                setSelectedDisease('crop');
              }}
              className={`p-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                diseaseCategory === 'crop'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-xl scale-105'
                  : 'bg-white/80 text-slate-700 border-2 border-slate-200 hover:border-green-300'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">🌾</span>
                <span>Crop Diseases</span>
              </div>
            </motion.button>
          </div>

          {diseaseCategory === 'human' && (
            <div className="grid grid-cols-3 gap-3">
              {['dengue', 'malaria', 'flu'].map((disease) => (
                <motion.button
                  key={disease}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedDisease(disease)}
                  className={`disease-pill ${selectedDisease === disease ? 'active-pill' : ''}`}
                >
                  <span className="capitalize">{disease}</span>
                </motion.button>
              ))}
            </div>
          )}

          {diseaseCategory === 'crop' && (
            <div className="p-4 rounded-2xl bg-green-50 border-2 border-green-200">
              <p className="text-sm font-bold text-green-700">🌾 Crop Disease Analysis</p>
              <p className="text-xs text-green-600 mt-1">Monitoring agricultural disease risks based on weather conditions</p>
            </div>
          )}
        </motion.div>

        <section id="hero" className="hero-section">
          <div className="hero-grid max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 text-blue-600 text-sm font-semibold">
                <Sparkles className="w-4 h-4" />
                AI weather x disease intelligence
              </span>

              <h2 className="text-4xl sm:text-5xl font-bold leading-tight text-slate-900">
                Anticipate outbreaks hours before they trend.
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Prescure blends live meteorology with epidemiology so teams can
                triage dengue, malaria, flu, and crop threats with confidence.
                Track shifts, deploy alerts, and pin down preventive playbooks
                from one beautiful command center.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  className="primary-btn"
                  onClick={() => scrollToSection('dashboard')}
                >
                  Start monitoring
                </button>
                <button
                  className="secondary-btn"
                  onClick={() => scrollToSection('insights')}
                >
                  View live demo
                </button>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                {heroStats.map((stat) => (
                  <div key={stat.label} className="stat-card">
                    <p className="text-sm uppercase tracking-wide text-gray-500">{stat.label}</p>
                    <p className="text-3xl font-semibold text-slate-900">{stat.value}</p>
                    <p className="text-xs text-emerald-500">{stat.trend}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative"
            >
              <div className="pulse-orbit" />
              <div className="glass-card p-4 md:p-6 shadow-2xl space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <BellRing className="w-5 h-5 text-blue-500" />
                  Live Alert Feed
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  {filteredPredictions.slice(0, 4).map((pred, idx) => (
                    <div key={idx} className="alert-card">
                      <div>
                        <p className="font-semibold capitalize">{pred.diseaseType}</p>
                        <p className="text-xs text-gray-500">{pred?.location?.name || 'Unknown location'}</p>
                      </div>
                      <span className="text-sm font-semibold text-red-500">{Math.round(pred.riskScore)}%</span>
                    </div>
                  ))}
                  {!filteredPredictions.length && (
                    <p className="text-sm text-gray-500">No live alerts yet. Generate predictions to populate this feed.</p>
                  )}
                </div>
                {generating && (
                  <p className="text-xs text-blue-500">Rebuilding risk map...</p>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        <section id="dashboard" className="max-w-7xl mx-auto space-y-6">
          <WeatherStats data={weatherData} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 shadow-lg">
                <Search className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold gradient-text">🔍 Search Location</h3>
                <p className="text-xs text-slate-500">Find disease risk by city, town, or village</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Enter city, town, or village name..."
                className="flex-1 px-4 py-3 rounded-2xl border-2 border-violet-200 focus:border-violet-500 focus:outline-none bg-white/80 backdrop-blur-sm text-slate-800 placeholder-slate-400 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold hover:scale-105 transition-transform shadow-lg"
                >
                  Clear
                </button>
              )}
            </div>

            {!searchQuery && predictions.length > 0 && (
              <div className="mt-4 p-4 rounded-2xl bg-green-50 border-2 border-green-200">
                <p className="text-sm font-bold text-green-700">✅ {predictions.length} locations available</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {[...new Set(predictions.map(p => p.location?.name).filter(Boolean))].slice(0, 8).map((loc, idx) => (
                    <span key={idx} className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                      {loc}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {!searchQuery && predictions.length === 0 && (
              <div className="mt-4 p-4 rounded-2xl bg-yellow-50 border-2 border-yellow-200">
                <p className="text-sm font-bold text-yellow-700">⚠️ No predictions loaded yet</p>
                <p className="text-xs text-yellow-600 mt-1">Scroll down and click the "Execute" button in the "Regenerate Predictions" card to load data.</p>
              </div>
            )}

            {searchQuery && predictions.length === 0 && (
              <div className="mt-4 p-4 rounded-2xl bg-red-50 border-2 border-red-200">
                <p className="text-sm font-bold text-red-700">❌ Cannot search - No data loaded</p>
                <p className="text-xs text-red-600 mt-1">Please generate predictions first by clicking the "Execute" button in the "Regenerate Predictions" card below.</p>
              </div>
            )}

            {searchQuery && predictions.length > 0 && searchResults.length === 0 && (
              <div className="mt-4 p-4 rounded-2xl bg-blue-50 border-2 border-blue-200">
                <p className="text-sm font-bold text-blue-700">💡 Available Locations:</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {[...new Set(predictions.map(p => p.location?.name).filter(Boolean))].slice(0, 10).map((loc, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSearch(loc)}
                      className="px-3 py-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-semibold transition-colors"
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="mt-4 space-y-3 max-h-64 overflow-y-auto">
                <p className="text-sm font-bold text-violet-700">📍 Found {searchResults.length} location(s):</p>
                {searchResults.map((result, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-4 rounded-2xl border-2 border-cyan-200 bg-gradient-to-r from-white to-cyan-50 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-lg text-slate-900">📍 {result.location?.name}</p>
                        <p className="text-sm text-slate-600 capitalize">Disease: <span className="font-semibold">{result.diseaseType}</span></p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-rose-600">{Math.round(result.riskScore)}%</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white ${result.riskLevel === 'critical' ? 'bg-red-600' : result.riskLevel === 'high' ? 'bg-orange-500' : result.riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}>
                          {result.riskLevel}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 mt-3">
                      <div className="bg-blue-100 rounded-lg p-2 text-center">
                        <p className="text-xs text-blue-600 font-semibold">🌡️ Temp</p>
                        <p className="text-sm font-bold text-blue-800">{result.factors?.temperature || 'N/A'}°C</p>
                      </div>
                      <div className="bg-cyan-100 rounded-lg p-2 text-center">
                        <p className="text-xs text-cyan-600 font-semibold">💧 Humidity</p>
                        <p className="text-sm font-bold text-cyan-800">{result.factors?.humidity || 'N/A'}%</p>
                      </div>
                      <div className="bg-indigo-100 rounded-lg p-2 text-center">
                        <p className="text-xs text-indigo-600 font-semibold">🌧️ Rain</p>
                        <p className="text-sm font-bold text-indigo-800">{result.factors?.rainfall || 'N/A'}mm</p>
                      </div>
                      <div className={`rounded-lg p-2 text-center ${
                        (result.factors?.aqi || 0) > 200 ? 'bg-red-100' :
                        (result.factors?.aqi || 0) > 150 ? 'bg-orange-100' :
                        (result.factors?.aqi || 0) > 100 ? 'bg-yellow-100' :
                        'bg-green-100'
                      }`}>
                        <p className={`text-xs font-semibold ${
                          (result.factors?.aqi || 0) > 200 ? 'text-red-600' :
                          (result.factors?.aqi || 0) > 150 ? 'text-orange-600' :
                          (result.factors?.aqi || 0) > 100 ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>🌫️ AQI</p>
                        <p className={`text-sm font-bold ${
                          (result.factors?.aqi || 0) > 200 ? 'text-red-800' :
                          (result.factors?.aqi || 0) > 150 ? 'text-orange-800' :
                          (result.factors?.aqi || 0) > 100 ? 'text-yellow-800' :
                          'text-green-800'
                        }`}>{result.factors?.aqi || 'N/A'}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold gradient-text">🦠 Disease Categories</h3>
                <p className="text-xs text-slate-500">Select category and disease type</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setDiseaseCategory('human');
                  setSelectedDisease('dengue');
                }}
                className={`p-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                  diseaseCategory === 'human'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-xl scale-105'
                    : 'bg-white/80 text-slate-700 border-2 border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl">👨‍⚕️</span>
                  <span>Human Diseases</span>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setDiseaseCategory('crop');
                  setSelectedDisease('crop');
                }}
                className={`p-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                  diseaseCategory === 'crop'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-xl scale-105'
                    : 'bg-white/80 text-slate-700 border-2 border-slate-200 hover:border-green-300'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl">🌾</span>
                  <span>Crop Diseases</span>
                </div>
              </motion.button>
            </div>

            {diseaseCategory === 'human' && (
              <div className="grid grid-cols-3 gap-3">
                {['dengue', 'malaria', 'flu'].map((disease) => (
                  <motion.button
                    key={disease}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedDisease(disease)}
                    className={`disease-pill ${selectedDisease === disease ? 'active-pill' : ''}`}
                  >
                    <span className="capitalize">{disease}</span>
                  </motion.button>
                ))}
              </div>
            )}

            {diseaseCategory === 'crop' && (
              <div className="p-4 rounded-2xl bg-green-50 border-2 border-green-200">
                <p className="text-sm font-bold text-green-700">🌾 Crop Disease Analysis</p>
                <p className="text-xs text-green-600 mt-1">Monitoring agricultural disease risks based on weather conditions</p>
              </div>
            )}
          </motion.div>

          <DiseaseCategorySelector 
            diseaseCategory={diseaseCategory}
            setDiseaseCategory={setDiseaseCategory}
            selectedDisease={selectedDisease}
            setSelectedDisease={setSelectedDisease}
            size="small"
          />

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-card p-4">
              <RiskMap predictions={filteredPredictions} diseaseType={selectedDisease} />
            </div>
            <div className="glass-card p-4" id="alerts">
              <PreventiveTips predictions={filteredPredictions} diseaseType={selectedDisease} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" id="insights">
            {filteredPredictions.slice(0, 6).map((pred, idx) => (
              <DiseaseCard key={idx} prediction={pred} />
            ))}
            {!filteredPredictions.length && (
              <div className="glass-card p-6 flex flex-col items-start justify-center">
                <p className="text-lg font-semibold text-slate-800">No insights yet</p>
                <p className="text-sm text-slate-500">Switch diseases or regenerate predictions to see detailed risk cards.</p>
              </div>
            )}
          </div>
        </section>

        <section className="max-w-6xl mx-auto space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map(({ title, description, icon: Icon, action, primary, loading, disabled, cta = 'Execute' }) => (
              <motion.div
                key={title}
                whileHover={{ y: -6 }}
                className={`quick-card ${primary ? 'quick-card-primary' : ''}`}
              >
                <div className="icon-pill">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-900">{title}</h4>
                  <p className="text-sm text-slate-500 mt-1">{description}</p>
                </div>
                {action && (
                  <button
                    onClick={!loading && !disabled ? action : undefined}
                    className="pill-btn"
                    disabled={loading || disabled}
                  >
                    {loading ? 'Working...' : cta}
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {pinnedZones.length > 0 && (
          <section className="max-w-6xl mx-auto">
            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-rose-500 font-semibold">
                    Priority watchlist
                  </p>
                  <h3 className="text-xl font-semibold text-slate-900">Pinned zones</h3>
                </div>
                <span className="badge badge-soft">{pinnedZones.length} tracked</span>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {pinnedZones.map((zone, idx) => (
                  <div key={`${zone.location?.name}-${idx}`} className="pinned-card">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        #{idx + 1} • {zone.diseaseType}
                      </p>
                      <p className="text-lg font-semibold text-slate-900">
                        {zone.location?.name || 'Unknown location'}
                      </p>
                      {zone.factors?.aqi && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                            zone.factors.aqi > 200 ? 'bg-red-100 text-red-700' :
                            zone.factors.aqi > 150 ? 'bg-orange-100 text-orange-700' :
                            zone.factors.aqi > 100 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            🌫️ AQI: {zone.factors.aqi}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-rose-500">
                        {Math.round(zone.riskScore || 0)}%
                      </p>
                      <p className="text-xs text-slate-500 capitalize">{zone.riskLevel} risk</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-6 items-start">
          <div className="glass-card p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-blue-500 uppercase tracking-wide">Live cadence</p>
                <h3 className="text-xl font-semibold text-slate-900 mt-1">Risk Timeline</h3>
              </div>
              <span className="badge badge-soft">Auto refresh</span>
            </div>
            <div className="space-y-4">
              {timeline.map((item, idx) => (
                <div key={idx} className="timeline-card">
                  <div className="timeline-dot" />
                  <div>
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="text-sm text-slate-500">{item.detail}</p>
                  </div>
                  <div className="text-right">
                    <span className="badge">{item.badge}</span>
                    <p className="text-xs text-slate-400 mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
              {!timeline.length && (
                <p className="text-sm text-slate-500">Timeline lights up once a disease filter has active alerts.</p>
              )}
            </div>
          </div>

          <div className="cta-card glass-card p-6 space-y-6">
            <div>
              <p className="text-xs font-semibold text-purple-500 uppercase tracking-wide">Team readiness</p>
              <h3 className="text-2xl font-semibold text-slate-900 mt-1">
                Coordinate responses with one push.
              </h3>
              <p className="text-sm text-slate-500 mt-2">
                Distribute preventive playbooks, sync supply kits, and brief field teams faster than an outbreak can travel.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {ctaMetrics.map(metric => (
                <div key={metric.label} className="glow-card">
                  <p className="text-xs uppercase tracking-wide text-indigo-100">{metric.label}</p>
                  <p className="text-2xl font-semibold text-white mt-1">{metric.value}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="primary-btn w-full sm:w-auto" onClick={handleScheduleBriefing}>Schedule briefing</button>
              <button className="secondary-btn w-full sm:w-auto" onClick={handleDownloadPlaybook}>Download playbook</button>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            {highlights.map(({ title, description, icon: Icon }) => (
              <div key={title} className="highlight-card">
                <div className="icon-pill">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-900">{title}</h4>
                  <p className="text-sm text-slate-600 mt-1">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {actionStatus && (
          <div className="status-toast">
            <div className={`status-chip ${actionStatus.type === 'error' ? 'status-error' : 'status-success'}`}>
              {actionStatus.message}
            </div>
          </div>
        )}

        {loading && (
          <div className="loading-overlay">
            <div className="loading-card glass-card">
              <p className="text-sm text-slate-500">Warming up data streams...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
