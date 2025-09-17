import React, { useState, useEffect } from 'react';
import { BookOpenIcon, SparklesIcon, AdjustmentsHorizontalIcon, XMarkIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  onShowHackathonFeatures?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShowHackathonFeatures }) => {
  const [open, setOpen] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voice, setVoice] = useState<string>('');
  const [rate, setRate] = useState<number>(1);
  const [pitch, setPitch] = useState<number>(1);
  const [volume, setVolume] = useState<number>(1);

  useEffect(() => {
    const stored = localStorage.getItem('tts_settings');
    if (stored) {
      try {
        const s = JSON.parse(stored);
        setVoice(s.voice || '');
        setRate(s.rate ?? 1);
        setPitch(s.pitch ?? 1);
        setVolume(s.volume ?? 1);
      } catch {}
    }
    try {
      if ('speechSynthesis' in window) {
        const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    } catch {}
  }, []);

  const save = () => {
    const s = { voice, rate, pitch, volume };
    localStorage.setItem('tts_settings', JSON.stringify(s));
    setOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <BookOpenIcon className="h-8 w-8" />
              <h1 className="text-3xl font-historical font-bold">
                Tarih-i Sima
              </h1>
            </div>
            <div className="hidden md:block">
              <p className="text-amber-100 text-sm">
                Yapay Zeka Destekli Tarih Anlatıcısı
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <SparklesIcon className="h-6 w-6 text-amber-200" />
            <span className="text-amber-100 text-sm font-medium">
              AI Powered
            </span>
            <button
              onClick={() => setOpen(true)}
              className="ml-3 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-sm flex items-center space-x-1"
              title="TTS Ayarları"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
              <span>TTS Ayarları</span>
            </button>
            {onShowHackathonFeatures && (
              <button
                onClick={onShowHackathonFeatures}
                className="ml-2 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg text-sm flex items-center space-x-1 text-white font-bold animate-pulse"
                title="Hackathon Özellikleri"
              >
                <RocketLaunchIcon className="h-5 w-5" />
                <span>🚀 Hackathon</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 text-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">TTS Ayarları</h3>
              <button onClick={() => setOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Ses</label>
                <select
                  value={voice}
                  onChange={(e) => setVoice(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">Varsayılan</option>
                  {voices.map((v, idx) => (
                    <option key={idx} value={v.name}>{v.name} {v.lang ? `(${v.lang})` : ''}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm mb-1">Hız: {rate.toFixed(1)}</label>
                  <input type="range" min={0.5} max={2} step={0.1} value={rate} onChange={(e) => setRate(parseFloat(e.target.value))} className="w-full" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Perde: {pitch.toFixed(1)}</label>
                  <input type="range" min={0.5} max={2} step={0.1} value={pitch} onChange={(e) => setPitch(parseFloat(e.target.value))} className="w-full" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Ses: {volume.toFixed(1)}</label>
                  <input type="range" min={0} max={1} step={0.1} value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="w-full" />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button onClick={() => setOpen(false)} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">İptal</button>
                <button onClick={save} className="px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700">Kaydet</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
