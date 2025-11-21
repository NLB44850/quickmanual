import React, { useState, useRef } from 'react';
import { Upload, FileText, Zap, Shield, Wrench, BookOpen, Camera, ImagePlus, Info } from 'lucide-react';

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

  // Données de démonstration
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
    // Simulation d'un délai d'analyse
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-3 pb-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4 pt-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 flex items-center justify-center gap-2">
            <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-600" />
            QuickManual
          </h1>
          <p className="text-sm text-gray-600">Résumez vos manuels en quelques secondes</p>
        </div>

        {/* Demo Banner */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 flex items-start gap-2">
          <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <strong>Version démo</strong> - Cette version affiche des données d'exemple pour tester l'interface.
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-3">
          <div className="flex border-b">
            <button
              onClick={() => { setActiveTab('pdf'); stopCamera(); }}
              className={`flex-1 py-3 px-3 font-semibold text-sm ${activeTab === 'pdf' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
            >
              <FileText className="w-4 h-4 inline mr-1" />
              Manuel PDF
            </button>
            <button
              onClick={() => { setActiveTab('image'); setFile(null); }}
              className={`flex-1 py-3 px-3 font-semibold text-sm ${activeTab === 'image' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
            >
              <Camera className="w-4 h-4 inline mr-1" />
              Photo/Scanner
            </button>
          </div>

          <div className="p-4">
            {activeTab === 'pdf' ? (
              <div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <label className="cursor-pointer">
                    <span className="text-indigo-600 font-semibold text-sm">Sélectionner un PDF</span>
                    <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
                  </label>
                  {file && <div className="mt-3 text-sm text-gray-600 break-all px-2">{file.name}</div>}
                </div>
                {file && (
                  <button 
                    onClick={analyzePDF} 
                    disabled={loading} 
                    className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 transition-colors text-sm"
                  >
                    {loading ? 'Analyse en cours...' : 'Analyser le manuel'}
                  </button>
                )}
              </div>
            ) : (
              <div>
                {!cameraActive ? (
                  <div className="space-y-3">
                    <button 
                      onClick={startCamera} 
                      className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors text-sm"
                    >
                      <Camera className="w-5 h-5 inline mr-2" />
                      Activer la caméra
                    </button>
                    <div className="text-center text-gray-500 text-xs">ou</div>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                      <ImagePlus className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <label className="cursor-pointer">
                        <span className="text-indigo-600 font-semibold text-sm">Télécharger une image</span>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                      </label>
                    </div>
                    {imagePreview && (
                      <div>
                        <img src={imagePreview} alt="Aperçu" className="w-full h-48 object-contain rounded-lg border border-gray-200" />
                        <button 
                          onClick={analyzeImage} 
                          disabled={loading} 
                          className="w-full mt-3 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 transition-colors text-sm"
                        >
                          {loading ? 'Analyse en cours...' : 'Analyser la couverture'}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg" />
                    <div className="flex gap-3">
                      <button 
                        onClick={capturePhoto} 
                        className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors text-sm"
                      >
                        📸 Capturer
                      </button>
                      <button 
                        onClick={stopCamera} 
                        className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors text-sm"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {summary && (
          <div className="space-y-3 animate-fadeIn">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 px-1">{summary.product}</h2>
            
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex gap-3">
                <Zap className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 mb-2 text-sm">⚡ Démarrage rapide</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{summary.quickStart}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex gap-3">
                <Shield className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 mb-2 text-sm">🛡️ Sécurité</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{summary.safety}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex gap-3">
                <Wrench className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 mb-2 text-sm">🔧 Entretien</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{summary.maintenance}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex gap-3">
                <FileText className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 mb-2 text-sm">🔍 Dépannage</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{summary.troubleshooting}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}