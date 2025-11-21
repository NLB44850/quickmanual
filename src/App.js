import React, { useState, useRef } from 'react';
import { Upload, FileText, Zap, Shield, Wrench, BookOpen, Camera, ImagePlus, Info, Sparkles } from 'lucide-react';

export default function ManualSummarizerDemo() {
  const [file, setFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [activeTab, setActiveTab] = useState('pdf');
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);

  const demoData = {
    pdf: {
      product: "Machine à café Nespresso Vertuo",
      quickStart: "Rincez le réservoir d'eau et remplissez-le. Insérez une capsule et fermez la tête. Appuyez sur le bouton pour lancer l'extraction automatique.",
      safety: "Ne pas immerger l'appareil dans l'eau. Débrancher avant nettoyage. Ne pas utiliser avec des mains mouillées. Tenir hors de portée des enfants.",
      maintenance: "Détartrer tous les 3 mois avec le kit fourni. Nettoyer le bac récupérateur quotidiennement. Vider le contenant à capsules régulièrement.",
      troubleshooting: "Voyant rouge clignotant : détartrage nécessaire. Café trop froid : préchauffer la tasse. Pas d'extraction : vérifier le niveau d'eau et la capsule."
    },
    image: {
      product: "Aspirateur robot Roomba i7+",
      quickStart: "Branchez la station de charge. Placez le robot sur la base pour charger 3h. Téléchargez l'app iRobot. Appuyez sur CLEAN pour démarrer.",
      safety: "Ne pas utiliser sur surfaces mouillées. Retirer les câbles du sol. Surveiller lors de la première utilisation. Ne pas aspirer liquides.",
      maintenance: "Vider le bac après chaque utilisation. Nettoyer les brosses hebdomadairement. Remplacer les filtres tous les 2 mois. Nettoyer les capteurs mensuellement.",
      troubleshooting: "Erreur 1 : nettoyer les roues. Erreur 2 : débloquer les brosses. Ne démarre pas : vérifier la charge. Aspiration faible : vider le bac."
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setSummary(null);
    }
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setImageFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(selectedFile);
      setSummary(null);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCameraActive(true);
    } catch (err) {
      alert('Impossible d\'accéder à la caméra. Veuillez autoriser l\'accès dans les paramètres.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0);
      
      canvas.toBlob((blob) => {
        const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
        setImageFile(file);
        setImagePreview(canvas.toDataURL('image/jpeg'));
        stopCamera();
        setSummary(null);
      }, 'image/jpeg');
    }
  };

  const simulateAnalysis = (type) => {
    setLoading(true);
    setTimeout(() => {
      setSummary(demoData[type]);
      setLoading(false);
    }, 2000);
  };

  const analyzePDF = () => {
    if (!file) return;
    simulateAnalysis('pdf');
  };

  const analyzeImage = () => {
    if (!imageFile) return;
    simulateAnalysis('image');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100 p-4 pb-8">
      <div className="max-w-2xl mx-auto">
        {/* Header avec animation */}
        <div className="text-center mb-6 pt-4 animate-slideDown">
          <div className="inline-flex items-center justify-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg mb-3">
            <BookOpen className="w-8 h-8 text-indigo-600 animate-bounce" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              QuickManual
            </h1>
            <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
          </div>
          <p className="text-gray-700 font-medium">Résumez vos manuels instantanément ✨</p>
        </div>

        {/* Demo Banner avec style amélioré */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl p-4 mb-6 flex items-start gap-3 shadow-md animate-fadeIn">
          <Info className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5 animate-pulse" />
          <div className="text-sm text-gray-800">
            <strong className="text-orange-600">🎯 Version démo</strong> - Testez l'interface avec des données d'exemple
          </div>
        </div>

        {/* Tabs avec style amélioré */}
        <div className="bg-white rounded-2xl shadow-xl mb-6 overflow-hidden border-2 border-indigo-100">
          <div className="flex bg-gradient-to-r from-indigo-50 to-purple-50">
            <button
              onClick={() => { setActiveTab('pdf'); stopCamera(); }}
              className={`flex-1 py-4 px-4 font-bold text-sm transition-all duration-300 ${
                activeTab === 'pdf' 
                  ? 'text-indigo-600 border-b-4 border-indigo-600 bg-white scale-105' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
              }`}
            >
              <FileText className="w-5 h-5 inline mr-2" />
              Manuel PDF
            </button>
            <button
              onClick={() => { setActiveTab('image'); setFile(null); }}
              className={`flex-1 py-4 px-4 font-bold text-sm transition-all duration-300 ${
                activeTab === 'image' 
                  ? 'text-purple-600 border-b-4 border-purple-600 bg-white scale-105' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
              }`}
            >
              <Camera className="w-5 h-5 inline mr-2" />
              Photo/Scanner
            </button>
          </div>

          <div className="p-6 bg-gradient-to-br from-white to-gray-50">
            {activeTab === 'pdf' ? (
              <div className="space-y-4">
                <div className="border-3 border-dashed border-indigo-300 rounded-2xl p-8 text-center hover:border-indigo-500 hover:bg-indigo-50/50 transition-all duration-300 cursor-pointer group bg-gradient-to-br from-indigo-50/30 to-purple-50/30">
                  <Upload className="w-12 h-12 text-indigo-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <label className="cursor-pointer">
                    <span className="text-indigo-600 font-bold text-base hover:text-indigo-700">
                      📄 Sélectionner un PDF
                    </span>
                    <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
                  </label>
                  {file && (
                    <div className="mt-4 p-3 bg-white rounded-xl text-sm text-gray-700 font-medium shadow-sm border border-indigo-200">
                      ✅ {file.name}
                    </div>
                  )}
                </div>
                {file && (
                  <button 
                    onClick={analyzePDF} 
                    disabled={loading} 
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:scale-100 text-base"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                        Analyse en cours...
                      </span>
                    ) : (
                      '🚀 Analyser le manuel'
                    )}
                  </button>
                )}
              </div>
            ) : (
              <div>
                {!cameraActive ? (
                  <div className="space-y-4">
                    <button 
                      onClick={startCamera} 
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-base"
                    >
                      <Camera className="w-6 h-6 inline mr-2" />
                      📸 Activer la caméra
                    </button>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t-2 border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-gradient-to-br from-white to-gray-50 px-4 text-gray-500 font-medium text-sm">ou</span>
                      </div>
                    </div>
                    <div className="border-3 border-dashed border-purple-300 rounded-2xl p-8 text-center hover:border-purple-500 hover:bg-purple-50/50 transition-all duration-300 cursor-pointer group bg-gradient-to-br from-purple-50/30 to-pink-50/30">
                      <ImagePlus className="w-12 h-12 text-purple-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                      <label className="cursor-pointer">
                        <span className="text-purple-600 font-bold text-base hover:text-purple-700">
                          🖼️ Télécharger une image
                        </span>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                      </label>
                    </div>
                    {imagePreview && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="relative rounded-2xl overflow-hidden border-4 border-purple-200 shadow-lg">
                          <img src={imagePreview} alt="Aperçu" className="w-full h-52 object-contain bg-gray-100" />
                        </div>
                        <button 
                          onClick={analyzeImage} 
                          disabled={loading} 
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:scale-100 text-base"
                        >
                          {loading ? (
                            <span className="flex items-center justify-center gap-2">
                              <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                              Analyse en cours...
                            </span>
                          ) : (
                            '🔍 Analyser la couverture'
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="rounded-2xl overflow-hidden border-4 border-purple-300 shadow-xl">
                      <video ref={videoRef} autoPlay playsInline className="w-full" />
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={capturePhoto} 
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        📸 Capturer
                      </button>
                      <button 
                        onClick={stopCamera} 
                        className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white py-4 rounded-xl font-bold hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        ✖️ Annuler
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Results avec style amélioré */}
        {summary && (
          <div className="space-y-4 animate-slideUp">
            <div className="text-center bg-white rounded-2xl p-5 shadow-lg border-2 border-indigo-200">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {summary.product}
              </h2>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-5 border-2 border-green-200 hover:shadow-xl transition-shadow duration-300">
              <div className="flex gap-4">
                <div className="bg-green-100 rounded-full p-3 h-fit">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-green-800 mb-2 text-base flex items-center gap-2">
                    ⚡ Démarrage rapide
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{summary.quickStart}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl shadow-lg p-5 border-2 border-red-200 hover:shadow-xl transition-shadow duration-300">
              <div className="flex gap-4">
                <div className="bg-red-100 rounded-full p-3 h-fit">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-red-800 mb-2 text-base flex items-center gap-2">
                    🛡️ Sécurité
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{summary.safety}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-lg p-5 border-2 border-blue-200 hover:shadow-xl transition-shadow duration-300">
              <div className="flex gap-4">
                <div className="bg-blue-100 rounded-full p-3 h-fit">
                  <Wrench className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-blue-800 mb-2 text-base flex items-center gap-2">
                    🔧 Entretien
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{summary.maintenance}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl shadow-lg p-5 border-2 border-orange-200 hover:shadow-xl transition-shadow duration-300">
              <div className="flex gap-4">
                <div className="bg-orange-100 rounded-full p-3 h-fit">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-orange-800 mb-2 text-base flex items-center gap-2">
                    🔍 Dépannage
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{summary.troubleshooting}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.6s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }
        .animate-bounce {
          animation: bounce 2s ease-in-out infinite;
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
