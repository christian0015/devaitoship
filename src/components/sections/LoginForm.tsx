// components/LoginForm.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import styles from './LoginForm.module.css';

interface LoginData {
  email: string;
  password: string;
  shopUrl: string;
}

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: '',
    shopUrl: ''
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const loginToDevaito = async () => {
    setLoading(true);
    setError(null);
    try {
      // Étape 1: Connexion à l'API Devaito pour récupérer le token
      const loginResponse = await fetch('https://admin.devaito.com/api/login', {
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

      if (!loginResponse.ok) {
        if (loginResponse.status === 401) {
          throw new Error('Identifiants incorrects');
        }
        if (loginResponse.status === 404) {
          throw new Error('Utilisateur non trouvé');
        }
        throw new Error('Erreur de connexion à Devaito');
      }

      const loginResult = await loginResponse.json();
      
      if (!loginResult.token) {
        throw new Error('Token manquant dans la réponse');
      }

      // Étape 2: Récupérer les informations du marchand depuis notre API
      const merchantResponse = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginData.email,
          apiToken: loginResult.token,
          shopUrl: loginData.shopUrl
        }),
      });
      
    // alert(loginData.shopUrl)

      const merchantResult = await merchantResponse.json();

      if (!merchantResponse.ok) {
        throw new Error(merchantResult.error || 'Erreur lors de la récupération des données');
      }

      // Stocker les informations dans le localStorage
      localStorage.setItem('merchant', JSON.stringify({
        ...merchantResult.merchant,
        apiToken: loginResult.token
      }));

      // Rediriger vers l'admin
      router.push("/admin");
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginToDevaito();
  };

  return (
    <div className={styles.container}>
      <h2>Connexion à Devaito</h2>
      
      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
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
            required
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
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="shopUrl">shopUrl</label>
          <input
            type="shopUrl"
            id="shopUrl"
            name="shopUrl"
            value={loginData.shopUrl}
            onChange={handleLoginChange}
            placeholder="Votre shopUrl Devaito"
            className={styles.input}
            required
          />
        </div>
        <button 
          type="submit"
          disabled={loading || !loginData.email || !loginData.password || !loginData.shopUrl}
          className={styles.button}
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;