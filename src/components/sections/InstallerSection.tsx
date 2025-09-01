// // components/InstallationForm.tsx
// import React, { useState } from 'react';
// import { Merchant } from '../src/types/merchant';
// import styles from './InstallationForm.module.css';

// const InstallationForm: React.FC = () => {
//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [apiToken, setApiToken] = useState('');
//   const [formData, setFormData] = useState<Partial<Merchant>>({
//     shopUrl: '',
//     shopName: '',
//     merchantName: '',
//   });

//   // Vérification du token API
//   const verifyToken = async () => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       // Simulation d'une vérification de token - à remplacer par un appel API réel
//       if (apiToken.length < 20) {
//         throw new Error('Token API invalide');
//       }
      
//       // Si la vérification réussit, passer à l'étape suivante
//       setStep(2);
//     } catch (err: any) {
//       setError(err.message || 'Erreur lors de la vérification du token');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Soumission du formulaire final
//   const submitForm = async () => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       const completeData = {
//         ...formData,
//         apiToken,
//         createdAt: new Date(),
//       };

//       const response = await fetch('/api/install', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(completeData),
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.error || 'Erreur lors de l\'installation');
//       }

//       // Stocker les informations dans le localStorage
//       localStorage.setItem('merchant', JSON.stringify({
//         ...completeData,
//         merchantId: result.merchantId,
//       }));

//       // Passer à l'étape de confirmation
//       setStep(3);
//     } catch (err: any) {
//       setError(err.message || 'Erreur lors de l\'installation');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   return (
//     <div className={styles.container}>
//       <div className={styles.progress}>
//         <div className={`${styles.step} ${step >= 1 ? styles.active : ''}`}>
//           <span>1</span>
//           <p>Connexion</p>
//         </div>
//         <div className={`${styles.step} ${step >= 2 ? styles.active : ''}`}>
//           <span>2</span>
//           <p>Informations</p>
//         </div>
//         <div className={`${styles.step} ${step >= 3 ? styles.active : ''}`}>
//           <span>3</span>
//           <p>Terminé</p>
//         </div>
//       </div>

//       {error && (
//         <div className={styles.error}>
//           {error}
//         </div>
//       )}

//       {step === 1 && (
//         <div className={styles.stepContent}>
//           <h2>Étape 1: Connexion à l'API</h2>
//           <div className={styles.formGroup}>
//             <label htmlFor="apiToken">Token API</label>
//             <input
//               type="password"
//               id="apiToken"
//               value={apiToken}
//               onChange={(e) => setApiToken(e.target.value)}
//               placeholder="Entrez votre token API"
//               className={styles.input}
//             />
//           </div>
//           <button 
//             onClick={verifyToken} 
//             disabled={loading || apiToken.length < 20}
//             className={styles.button}
//           >
//             {loading ? 'Vérification...' : 'Se connecter'}
//           </button>
//         </div>
//       )}

//       {step === 2 && (
//         <div className={styles.stepContent}>
//           <h2>Étape 2: Informations de votre boutique</h2>
//           <div className={styles.formGroup}>
//             <label htmlFor="shopName">Nom de la boutique *</label>
//             <input
//               type="text"
//               id="shopName"
//               name="shopName"
//               value={formData.shopName}
//               onChange={handleInputChange}
//               placeholder="Nom de votre boutique"
//               className={styles.input}
//               required
//             />
//           </div>
//           <div className={styles.formGroup}>
//             <label htmlFor="shopUrl">URL de la boutique *</label>
//             <input
//               type="url"
//               id="shopUrl"
//               name="shopUrl"
//               value={formData.shopUrl}
//               onChange={handleInputChange}
//               placeholder="https://votre-boutique.com"
//               className={styles.input}
//               required
//             />
//           </div>
//           <div className={styles.formGroup}>
//             <label htmlFor="merchantName">Votre nom (optionnel)</label>
//             <input
//               type="text"
//               id="merchantName"
//               name="merchantName"
//               value={formData.merchantName}
//               onChange={handleInputChange}
//               placeholder="Votre nom"
//               className={styles.input}
//             />
//           </div>
//           <div className={styles.buttonGroup}>
//             <button 
//               onClick={() => setStep(1)} 
//               className={styles.buttonSecondary}
//             >
//               Retour
//             </button>
//             <button 
//               onClick={submitForm} 
//               disabled={loading || !formData.shopName || !formData.shopUrl}
//               className={styles.button}
//             >
//               {loading ? 'Installation...' : 'Installer'}
//             </button>
//           </div>
//         </div>
//       )}

//       {step === 3 && (
//         <div className={styles.stepContent}>
//           <div className={styles.success}>
//             <h2>Installation terminée!</h2>
//             <p>Votre boutique a été configurée avec succès.</p>
//             <button 
//               onClick={() => window.location.href = '/admin'}
//               className={styles.button}
//             >
//               Accéder à votre espace admin
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default InstallationForm;

// components/InstallationForm.tsx
"use client";

import React, { useState } from 'react';
import { Merchant } from '../../types/merchant';
import styles from './InstallationForm.module.css';
import { useRouter } from "next/navigation";

interface LoginData {
  email: string;
  password: string;
}

const InstallationForm: React.FC = () => {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiToken, setApiToken] = useState('');
  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: ''
  });
  const [formData, setFormData] = useState<Partial<Merchant>>({
    shopUrl: '',
    shopName: '',
    merchantName: '',
    merchantEmail: ''
  });

  // Connexion à l'API Devaito pour récupérer le token
  const loginToDevaito = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://admin.devaito.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Identifiants incorrects');
        }
        if (response.status === 404) {
          throw new Error('Utilisateur non trouvé');
        }
        throw new Error('Erreur de connexion à Devaito');
      }

      const result = await response.json();
      console.log(apiToken)
      
      if (!result.token) {
        throw new Error('Token manquant dans la réponse');
      }

      // Stocker le token et passer à l'étape suivante
      setApiToken(result.token);
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  // Soumission du formulaire final
  const submitForm = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const completeData = {
        ...formData,
        apiToken,
        createdAt: new Date(),
      };

      const response = await fetch('/api/install', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(completeData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de l\'installation');
      }

      // Stocker les informations dans le localStorage
      localStorage.setItem('merchant', JSON.stringify({
        ...completeData,
        merchantId: result.merchantId,
      }));

      // Passer à l'étape de confirmation
      setStep(3);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'installation');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.progress}>
        <div className={`${styles.step} ${step >= 1 ? styles.active : ''}`}>
          <span>1</span>
          <p>Connexion</p>
        </div>
        <div className={`${styles.step} ${step >= 2 ? styles.active : ''}`}>
          <span>2</span>
          <p>Informations</p>
        </div>
        <div className={`${styles.step} ${step >= 3 ? styles.active : ''}`}>
          <span>3</span>
          <p>Terminé</p>
        </div>
      </div>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      {step === 1 && (
        <div className={styles.stepContent}>
          <h2>Étape 1: Connexion à Devaito</h2>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={loginData.email}
              onChange={handleLoginChange}
              placeholder="Votre email Devaito"
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value={loginData.password}
              onChange={handleLoginChange}
              placeholder="Votre mot de passe"
              className={styles.input}
            />
          </div>
          <button 
            onClick={loginToDevaito} 
            disabled={loading || !loginData.email || !loginData.password}
            className={styles.button}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className={styles.stepContent}>
          <h2>Étape 2: Informations de votre boutique</h2>
          <div className={styles.formGroup}>
            <label htmlFor="shopName">Nom de la boutique *</label>
            <input
              type="text"
              id="shopName"
              name="shopName"
              value={formData.shopName}
              onChange={handleInputChange}
              placeholder="Nom de votre boutique"
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="shopUrl">URL de la boutique *</label>
            <input
              type="url"
              id="shopUrl"
              name="shopUrl"
              value={formData.shopUrl}
              onChange={handleInputChange}
              placeholder="https://votre-boutique.com"
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="merchantName">Votre nom (optionnel)</label>
            <input
              type="text"
              id="merchantName"
              name="merchantName"
              value={formData.merchantName}
              onChange={handleInputChange}
              placeholder="Votre nom"
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="merchantEmail">Votre email *</label>
            <input
              type="email"
              id="merchantEmail"
              name="merchantEmail"
              value={formData.merchantEmail}
              onChange={handleInputChange}
              placeholder="Votre email pour les notifications"
              className={styles.input}
              required
            />
          </div>
          <div className={styles.buttonGroup}>
            <button 
              onClick={() => setStep(1)} 
              className={styles.buttonSecondary}
            >
              Retour
            </button>
            <button 
              onClick={submitForm} 
              disabled={loading || !formData.shopName || !formData.shopUrl || !formData.merchantEmail}
              className={styles.button}
            >
              {loading ? 'Installation...' : 'Installer'}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className={styles.stepContent}>
          <div className={styles.success}>
            <h2>Installation terminée!</h2>
            <p>Votre boutique a été configurée avec succès.</p>
            <button 
            //   onClick={() => window.location.href = '/admin'}
            onClick={() => router.push("/admin")}
              className={styles.button}
            >
              Accéder à votre espace admin
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstallationForm;