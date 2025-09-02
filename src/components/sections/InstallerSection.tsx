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
  });
  const [urlError, setUrlError] = useState<string | null>(null);

  // Fonction pour nettoyer et valider l'URL en temps réel
  const validateAndCleanUrl = (url: string): { isValid: boolean; cleanedUrl: string } => {
    if (!url) return { isValid: true, cleanedUrl: '' };
    
    try {
      let cleanedUrl = url.trim();
      
      // Supprimer tous les slashes au début (après le protocole)
      if (cleanedUrl.includes('://')) {
        const [protocol, rest] = cleanedUrl.split('://');
        cleanedUrl = protocol + '://' + rest.replace(/^\/+/, '');
      } else {
        cleanedUrl = cleanedUrl.replace(/^\/+/, '');
        cleanedUrl = 'https://' + cleanedUrl;
      }
      
      // Supprimer les slashes à la fin
      cleanedUrl = cleanedUrl.replace(/\/+$/, '');
      
      // Valider que l'URL a un format correct
      const urlObj = new URL(cleanedUrl);
      const domainParts = urlObj.hostname.split('.');
      
      if (domainParts.length < 2) {
        return { isValid: false, cleanedUrl };
      }
      
      // Vérifier que le TLD a au moins 2 caractères
      const tld = domainParts[domainParts.length - 1];
      if (tld.length < 2) {
        return { isValid: false, cleanedUrl };
      }
      
      // Vérifier qu'il n'y a pas de chemin après le domaine
      if (urlObj.pathname !== '/' && urlObj.pathname !== '') {
        return { isValid: false, cleanedUrl };
      }
      
      return { isValid: true, cleanedUrl };
    } catch (err) {
      return { isValid: false, cleanedUrl: url };
    }
  };

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
      // Nettoyer et valider l'URL avant soumission
      const { isValid, cleanedUrl } = validateAndCleanUrl(formData.shopUrl || '');
      
      if (!isValid) {
        throw new Error('URL de boutique invalide. Format attendu: https://votre-boutique.com');
      }
      
      const completeData = {
        ...formData,
        shopUrl: cleanedUrl,
        merchantEmail: loginData.email,
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
    
    if (name === 'shopUrl') {
      // Valider l'URL en temps réel et afficher un message d'erreur si nécessaire
      const { isValid } = validateAndCleanUrl(value);
      setUrlError(isValid ? null : 'URL invalide. Format attendu: https://votre-boutique.com');
    }
    
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
            {urlError && (
              <div className={styles.fieldError}>
                {urlError}
              </div>
            )}
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
          <div className={styles.buttonGroup}>
            <button 
              onClick={() => setStep(1)} 
              className={styles.buttonSecondary}
            >
              Retour
            </button>
            <button 
              onClick={submitForm} 
              disabled={loading || !formData.shopName || !formData.shopUrl || !!urlError}
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