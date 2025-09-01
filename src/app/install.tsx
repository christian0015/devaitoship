'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Types pour la validation
interface InstallFormData {
  email: string;
  password: string;
  shopUrl: string;
  contactEmail: string;
  acceptTerms: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  shopUrl?: string;
  contactEmail?: string;
  acceptTerms?: string;
  general?: string;
}

export default function InstallPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<InstallFormData>({
    email: '',
    password: '',
    shopUrl: '',
    contactEmail: '',
    acceptTerms: false
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // Étapes du formulaire

  // Validation des champs
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    // Validation email Devaito
    if (!formData.email) {
      newErrors.email = 'Email requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email invalide';
    }

    // Validation mot de passe
    if (!formData.password) {
      newErrors.password = 'Mot de passe requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mot de passe trop court (min. 6 caractères)';
    }

    // Validation URL boutique
    if (!formData.shopUrl) {
      newErrors.shopUrl = 'URL de la boutique requise';
    } else if (!/^https?:\/\/.+\..+/.test(formData.shopUrl)) {
      newErrors.shopUrl = 'URL invalide (ex: https://monshop.devaito.com)';
    }

    // Validation email de contact
    if (!formData.contactEmail) {
      newErrors.contactEmail = 'Email de contact requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Format email invalide';
    }

    // Validation CGU
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Vous devez accepter les conditions d\'utilisation';
    }

    return newErrors;
  };

  const handleInputChange = (field: keyof InstallFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Appel à notre API qui gère l'authentification Devaito et l'enregistrement
      const response = await fetch('/api/install', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de l\'installation');
      }

      // Succès - redirection vers l'admin
      setStep(3); // Étape de succès
      setTimeout(() => {
        router.push('/admin');
      }, 2000);

    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'Erreur inattendue'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="stepContent">
      <div className="stepHeader">
        <h2>Connexion à votre compte Devaito</h2>
        <p>Connectez votre boutique Devaito à DevaShip</p>
      </div>

      <div className="formGroup">
        <label htmlFor="email">Email Devaito *</label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="votre-email@example.com"
          className={errors.email ? 'error' : ''}
          disabled={isLoading}
        />
        {errors.email && <span className="errorText">{errors.email}</span>}
      </div>

      <div className="formGroup">
        <label htmlFor="password">Mot de passe Devaito *</label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          placeholder="••••••••"
          className={errors.password ? 'error' : ''}
          disabled={isLoading}
        />
        {errors.password && <span className="errorText">{errors.password}</span>}
      </div>

      <div className="stepActions">
        <button 
          type="button" 
          onClick={() => setStep(2)}
          className="nextButton"
          disabled={!formData.email || !formData.password}
        >
          Suivant
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="stepContent">
      <div className="stepHeader">
        <h2>Configuration de votre boutique</h2>
        <p>Informations complémentaires pour finaliser l'installation</p>
      </div>

      <div className="formGroup">
        <label htmlFor="shopUrl">URL de votre boutique *</label>
        <input
          id="shopUrl"
          type="url"
          value={formData.shopUrl}
          onChange={(e) => handleInputChange('shopUrl', e.target.value)}
          placeholder="https://monshop.devaito.com"
          className={errors.shopUrl ? 'error' : ''}
          disabled={isLoading}
        />
        {errors.shopUrl && <span className="errorText">{errors.shopUrl}</span>}
        <small>URL complète de votre boutique Devaito</small>
      </div>

      <div className="formGroup">
        <label htmlFor="contactEmail">Email de contact *</label>
        <input
          id="contactEmail"
          type="email"
          value={formData.contactEmail}
          onChange={(e) => handleInputChange('contactEmail', e.target.value)}
          placeholder="contact@monshop.com"
          className={errors.contactEmail ? 'error' : ''}
          disabled={isLoading}
        />
        {errors.contactEmail && <span className="errorText">{errors.contactEmail}</span>}
        <small>Email pour les notifications et le support</small>
      </div>

      <div className="formGroup">
        <label className="checkboxLabel">
          <input
            type="checkbox"
            checked={formData.acceptTerms}
            onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
            disabled={isLoading}
          />
          <span className={errors.acceptTerms ? 'error' : ''}>
            J'accepte les <Link href="/terms" target="_blank">conditions d'utilisation</Link> et la <Link href="/privacy" target="_blank">politique de confidentialité</Link>
          </span>
        </label>
        {errors.acceptTerms && <span className="errorText">{errors.acceptTerms}</span>}
      </div>

      <div className="stepActions">
        <button 
          type="button" 
          onClick={() => setStep(1)}
          className="backButton"
          disabled={isLoading}
        >
          Retour
        </button>
        <button 
          type="submit" 
          className="submitButton"
          disabled={isLoading}
        >
          {isLoading ? 'Installation...' : 'Installer DevaShip'}
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="stepContent success">
      <div className="successIcon">✅</div>
      <h2>Installation réussie !</h2>
      <p>Votre boutique Devaito est maintenant connectée à DevaShip.</p>
      <p>Redirection vers votre tableau de bord...</p>
    </div>
  );

  return (
    <div className="installContainer">
      {/* Header */}
      <header className="installHeader">
        <Link href="/" className="backToHome">
          ← Retour à l'accueil
        </Link>
        <div className="logo">
          <h1>DevaShip</h1>
          <span>Installation</span>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="progressBar">
        <div className="progressStep">
          <div className={`stepNumber ${step >= 1 ? 'active' : ''}`}>1</div>
          <span>Connexion</span>
        </div>
        <div className="progressLine"></div>
        <div className="progressStep">
          <div className={`stepNumber ${step >= 2 ? 'active' : ''}`}>2</div>
          <span>Configuration</span>
        </div>
        <div className="progressLine"></div>
        <div className="progressStep">
          <div className={`stepNumber ${step >= 3 ? 'active' : ''}`}>3</div>
          <span>Terminé</span>
        </div>
      </div>

      {/* Form Container */}
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          {errors.general && (
            <div className="errorMessage">
              <strong>Erreur :</strong> {errors.general}
            </div>
          )}
        </form>
      </div>

      <style jsx>{`
        .installContainer {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          --color-primary: #000000;
          --color-secondary: #ffffff;
          --color-accent: #00d084;
          --color-accent-hover: #00b874;
          --color-gray-light: #f8f9fa;
          --color-gray-medium: #6c757d;
          --color-gray-dark: #212529;
          --color-border: #e9ecef;
          --color-error: #dc3545;
          --color-success: #28a745;
        }

        .installHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem;
          background: var(--color-secondary);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .backToHome {
          color: var(--color-gray-medium);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .backToHome:hover {
          color: var(--color-accent);
        }

        .logo h1 {
          margin: 0;
          color: var(--color-primary);
          font-size: 1.5rem;
        }

        .logo span {
          color: var(--color-gray-medium);
          font-size: 0.9rem;
        }

        .progressBar {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          max-width: 500px;
          margin: 0 auto;
        }

        .progressStep {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .stepNumber {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-border);
          color: var(--color-gray-medium);
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .stepNumber.active {
          background: var(--color-accent);
          color: var(--color-secondary);
        }

        .progressStep span {
          font-size: 0.9rem;
          color: var(--color-gray-medium);
        }

        .progressLine {
          width: 60px;
          height: 2px;
          background: var(--color-border);
          margin: 0 1rem;
        }

        .formContainer {
          max-width: 500px;
          margin: 0 auto;
          padding: 2rem;
        }

        .stepContent {
          background: var(--color-secondary);
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .stepHeader {
          text-align: center;
          margin-bottom: 2rem;
        }

        .stepHeader h2 {
          margin: 0 0 0.5rem 0;
          color: var(--color-primary);
          font-size: 1.5rem;
        }

        .stepHeader p {
          margin: 0;
          color: var(--color-gray-medium);
        }

        .formGroup {
          margin-bottom: 1.5rem;
        }

        .formGroup label {
          display: block;
          margin-bottom: 0.5rem;
          color: var(--color-primary);
          font-weight: 500;
        }

        .formGroup input[type="email"],
        .formGroup input[type="password"],
        .formGroup input[type="url"] {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid var(--color-border);
          border-radius: 6px;
          font-size: 1rem;
          transition: border-color 0.2s ease;
          box-sizing: border-box;
        }

        .formGroup input:focus {
          outline: none;
          border-color: var(--color-accent);
        }

        .formGroup input.error {
          border-color: var(--color-error);
        }

        .formGroup small {
          display: block;
          margin-top: 0.25rem;
          color: var(--color-gray-medium);
          font-size: 0.85rem;
        }

        .checkboxLabel {
          display: flex !important;
          align-items: flex-start;
          gap: 0.5rem;
          cursor: pointer;
        }

        .checkboxLabel input[type="checkbox"] {
          margin-top: 0.1rem;
        }

        .checkboxLabel span {
          line-height: 1.4;
        }

        .checkboxLabel a {
          color: var(--color-accent);
          text-decoration: none;
        }

        .checkboxLabel a:hover {
          text-decoration: underline;
        }

        .errorText {
          display: block;
          color: var(--color-error);
          font-size: 0.85rem;
          margin-top: 0.25rem;
        }

        .errorMessage {
          background: #f8d7da;
          color: #721c24;
          padding: 1rem;
          border-radius: 6px;
          margin-top: 1rem;
          border: 1px solid #f5c6cb;
        }

        .stepActions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
        }

        .backButton {
          padding: 0.75rem 1.5rem;
          border: 2px solid var(--color-border);
          background: var(--color-secondary);
          color: var(--color-gray-medium);
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .backButton:hover:not(:disabled) {
          border-color: var(--color-gray-medium);
          color: var(--color-primary);
        }

        .nextButton,
        .submitButton {
          padding: 0.75rem 1.5rem;
          background: var(--color-accent);
          color: var(--color-secondary);
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s ease;
          min-width: 120px;
        }

        .nextButton:hover:not(:disabled),
        .submitButton:hover:not(:disabled) {
          background: var(--color-accent-hover);
        }

        .nextButton:disabled,
        .submitButton:disabled,
        .backButton:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .success {
          text-align: center;
        }

        .successIcon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .success h2 {
          color: var(--color-success);
          margin-bottom: 1rem;
        }

        .success p {
          color: var(--color-gray-medium);
          margin: 0.5rem 0;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .installHeader {
            padding: 1rem;
          }

          .formContainer {
            padding: 1rem;
          }

          .stepContent {
            padding: 1.5rem;
          }

          .progressBar {
            padding: 1rem;
          }

          .stepActions {
            flex-direction: column;
          }

          .progressStep span {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
}