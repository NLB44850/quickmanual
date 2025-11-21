import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### Fichier 5 : `src/App.js`

Dans le dossier `src/`, créez `App.js` et **copiez tout le code de l'artefact "QuickManual - Version Démo Mobile"** que j'ai créé plus haut.

Pour copier le code de l'artefact :
1. Cliquez sur l'icône en haut à droite de l'artefact démo
2. Sélectionnez "Copy code"
3. Collez dans `App.js`

---

## ✅ Vérification

Votre structure finale devrait être :
```
quickmanual/
├── package.json
├── public/
│   └── index.html
└── src/
    ├── index.js
    ├── index.css
    └── App.js