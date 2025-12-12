import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface ProfileSectionProps {
  userData: any;
}

interface ShippingAddress {
  name?: string;
  company?: string;
  street1?: string;
  street2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  phone?: string;
  email?: string;
}

interface Dimensions {
  length?: number;
  width?: number;
  height?: number;
  weight?: number;
  distance_unit?: 'cm' | 'in';
  mass_unit?: 'kg' | 'lb';
}

export default function ProfileSection({ userData }: ProfileSectionProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('info');
  const [formData, setFormData] = useState({
    shopName: '',
    shopUrl: '',
    merchantName: '',
    merchantEmail: '',
    apiKey: '', // AJOUTÉ
    shippingAddress: {
      name: '',
      company: '',
      street1: '',
      street2: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      phone: '',
      email: ''
    } as ShippingAddress,
    defaultDimensions: {
      length: 0,
      width: 0,
      height: 0,
      weight: 0,
      distance_unit: 'cm' as const,
      mass_unit: 'kg' as const
    } as Dimensions
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteType, setDeleteType] = useState<'shop' | 'account'>('shop');

  useEffect(() => {
    if (userData) {
      setFormData({
        shopName: userData.shopName || '',
        shopUrl: userData.shopUrl || '',
        merchantName: userData.merchantName || '',
        merchantEmail: userData.merchantEmail || '',
        apiKey: '', // Toujours vide pour la sécurité
        shippingAddress: userData.shippingAddress || {
          name: '',
          company: '',
          street1: '',
          street2: '',
          city: '',
          state: '',
          zip: '',
          country: '',
          phone: '',
          email: ''
        },
        defaultDimensions: userData.defaultDimensions || {
          length: 0,
          width: 0,
          height: 0,
          weight: 0,
          distance_unit: 'cm',
          mass_unit: 'kg'
        }
      });
    }
  }, [userData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('shippingAddress.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        shippingAddress: {
          ...prev.shippingAddress,
          [field]: value
        }
      }));
    } else if (name.startsWith('defaultDimensions.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        defaultDimensions: {
          ...prev.defaultDimensions,
          [field]: field === 'length' || field === 'width' || field === 'height' || field === 'weight' 
            ? parseFloat(value) || 0 
            : value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    // Préparer les données à envoyer
    const dataToSend = { ...formData };
    
    // Ne pas envoyer l'apiKey s'il est vide
    if (!dataToSend.apiKey.trim()) {
      delete dataToSend.apiKey;
    }
    
    try {
      const response = await fetch(`/api/merchants/${userData?._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage('Modifications sauvegardées avec succès!');

         // Mettez à jour le localStorage avec les nouvelles données
        const updatedUserData = {
          ...userData,
          ...data.merchant // Les données mises à jour retournées par l'API
        };
        
        localStorage.setItem('merchant', JSON.stringify(updatedUserData));

        // Réinitialiser le champ apiKey après succès
        setFormData(prev => ({ ...prev, apiKey: '' }));
        // Rafraîchir les données après 2 secondes
        setTimeout(() => {
          router.reload();
        }, 2000);
      } else {
        setMessage(`Erreur: ${data.error || 'Erreur inconnue'}`);
      }
    } catch (error: any) {
      setMessage('Erreur lors de la sauvegarde');
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch(`/api/merchants/${userData?.merchantId._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(deleteType === 'shop' 
          ? 'Boutique supprimée avec succès! Redirection...'
          : 'Compte supprimé avec succès! Redirection...'
        );
        // Rediriger vers la page d'accueil après 3 secondes
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else {
        setMessage(`Erreur: ${data.error}`);
      }
    } catch (error) {
      setMessage('Erreur lors de la suppression');
      console.error('Error deleting:', error);
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="profileSection">
      <div className="sectionHeader">
        <h2>Profil</h2>
        <p>Gérez les informations de votre compte</p>
      </div>
      
      {message && (
        <div className={`message ${message.includes('Erreur') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}
      
      <div className="profileContent">
        <div className="profileTabs">
          <button 
            className={`tabButton ${activeTab === 'info' ? 'tabActive' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            Informations
          </button>
          <button 
            className={`tabButton ${activeTab === 'api' ? 'tabActive' : ''}`}
            onClick={() => setActiveTab('api')}
          >
            API
          </button>
          <button 
            className={`tabButton ${activeTab === 'address' ? 'tabActive' : ''}`}
            onClick={() => setActiveTab('address')}
          >
            Adresse
          </button>
          <button 
            className={`tabButton ${activeTab === 'dimensions' ? 'tabActive' : ''}`}
            onClick={() => setActiveTab('dimensions')}
          >
            Dimensions
          </button>
          <button 
            className={`tabButton ${activeTab === 'security' ? 'tabActive' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            Sécurité
          </button>
          <button 
            className={`tabButton ${activeTab === 'danger' ? 'tabActive' : ''}`}
            onClick={() => setActiveTab('danger')}
            style={{ color: '#dc2626' }}
          >
            Zone de danger
          </button>
        </div>
        
        <div className="profileTabContent">
          {activeTab === 'info' && (
            <div className="profileFormCard">
              <h3>Informations personnelles</h3>
              <form onSubmit={handleSubmit}>
                <div className="formRow">
                  <div className="formGroup">
                    <label>Nom de la boutique *</label>
                    <input
                      type="text"
                      name="shopName"
                      value={formData.shopName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="formGroup">
                    <label>URL de la boutique *</label>
                    <input
                      type="url"
                      name="shopUrl"
                      value={formData.shopUrl}
                      onChange={handleInputChange}
                      required
                      placeholder="https://example.myshopify.com"
                    />
                    <small className="formHint">L'URL doit être unique</small>
                  </div>
                </div>
                
                <div className="formRow">
                  <div className="formGroup">
                    <label>Votre nom</label>
                    <input
                      type="text"
                      name="merchantName"
                      value={formData.merchantName}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="formGroup">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="merchantEmail"
                      value={formData.merchantEmail}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <button type="submit" className="saveButton" disabled={loading}>
                  {loading ? 'Sauvegarde...' : 'Enregistrer les modifications'}
                </button>
              </form>
            </div>
          )}
          
          {activeTab === 'api' && (
            <div className="profileFormCard">
              <h3>Configuration API</h3>
              <form onSubmit={handleSubmit}>
                <div className="formGroup">
                  <label>Clé API</label>
                  <input
                    type="password"
                    name="apiKey"
                    value={formData.apiKey}
                    onChange={handleInputChange}
                    placeholder="Entrez une nouvelle clé API pour la modifier"
                  />
                  <small className="formHint">
                    Laissez vide pour conserver la clé actuelle
                  </small>
                </div>
                
                <div className="formGroup">
                  <label>Token API actuel</label>
                  <input
                    type="text"
                    value="●●●●●●●●●●●●●●●●"
                    disabled
                    className="disabledField"
                  />
                  <small className="formHint">
                    Le token API ne peut pas être modifié depuis l'interface
                  </small>
                </div>
                
                <button type="submit" className="saveButton" disabled={loading}>
                  {loading ? 'Sauvegarde...' : 'Mettre à jour la clé API'}
                </button>
              </form>
            </div>
          )}
          
          {activeTab === 'address' && (
            <div className="profileFormCard">
              <h3>Adresse d'expédition</h3>
              <form onSubmit={handleSubmit}>
                <div className="formRow">
                  <div className="formGroup">
                    <label>Nom complet</label>
                    <input
                      type="text"
                      name="shippingAddress.name"
                      value={formData.shippingAddress.name || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="formGroup">
                    <label>Entreprise</label>
                    <input
                      type="text"
                      name="shippingAddress.company"
                      value={formData.shippingAddress.company || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="formRow">
                  <div className="formGroup">
                    <label>Adresse ligne 1</label>
                    <input
                      type="text"
                      name="shippingAddress.street1"
                      value={formData.shippingAddress.street1 || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="formGroup">
                    <label>Adresse ligne 2</label>
                    <input
                      type="text"
                      name="shippingAddress.street2"
                      value={formData.shippingAddress.street2 || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="formRow">
                  <div className="formGroup">
                    <label>Ville</label>
                    <input
                      type="text"
                      name="shippingAddress.city"
                      value={formData.shippingAddress.city || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="formGroup">
                    <label>État/Province</label>
                    <input
                      type="text"
                      name="shippingAddress.state"
                      value={formData.shippingAddress.state || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="formRow">
                  <div className="formGroup">
                    <label>Code postal</label>
                    <input
                      type="text"
                      name="shippingAddress.zip"
                      value={formData.shippingAddress.zip || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="formGroup">
                    <label>Pays</label>
                    <input
                      type="text"
                      name="shippingAddress.country"
                      value={formData.shippingAddress.country || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="formRow">
                  <div className="formGroup">
                    <label>Téléphone</label>
                    <input
                      type="tel"
                      name="shippingAddress.phone"
                      value={formData.shippingAddress.phone || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="formGroup">
                    <label>Email d'adresse</label>
                    <input
                      type="email"
                      name="shippingAddress.email"
                      value={formData.shippingAddress.email || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <button type="submit" className="saveButton" disabled={loading}>
                  {loading ? 'Sauvegarde...' : 'Enregistrer les modifications'}
                </button>
              </form>
            </div>
          )}
          
          {activeTab === 'dimensions' && (
            <div className="profileFormCard">
              <h3>Dimensions par défaut</h3>
              <form onSubmit={handleSubmit}>
                <div className="formRow">
                  <div className="formGroup">
                    <label>Longueur (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      name="defaultDimensions.length"
                      value={formData.defaultDimensions.length || 0}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="formGroup">
                    <label>Largeur (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      name="defaultDimensions.width"
                      value={formData.defaultDimensions.width || 0}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="formRow">
                  <div className="formGroup">
                    <label>Hauteur (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      name="defaultDimensions.height"
                      value={formData.defaultDimensions.height || 0}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="formGroup">
                    <label>Poids (kg)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      name="defaultDimensions.weight"
                      value={formData.defaultDimensions.weight || 0}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="formRow">
                  <div className="formGroup">
                    <label>Unité de distance</label>
                    <select
                      name="defaultDimensions.distance_unit"
                      value={formData.defaultDimensions.distance_unit || 'cm'}
                      onChange={handleInputChange}
                    >
                      <option value="cm">Centimètres (cm)</option>
                      <option value="in">Pouces (in)</option>
                    </select>
                  </div>
                  
                  <div className="formGroup">
                    <label>Unité de masse</label>
                    <select
                      name="defaultDimensions.mass_unit"
                      value={formData.defaultDimensions.mass_unit || 'kg'}
                      onChange={handleInputChange}
                    >
                      <option value="kg">Kilogrammes (kg)</option>
                      <option value="lb">Livres (lb)</option>
                    </select>
                  </div>
                </div>
                
                <button type="submit" className="saveButton" disabled={loading}>
                  {loading ? 'Sauvegarde...' : 'Enregistrer les modifications'}
                </button>
              </form>
            </div>
          )}
          
          {activeTab === 'security' && (
            <div className="profileFormCard">
              <h3>Paramètres de sécurité</h3>
              <div className="securitySettings">
                <div className="securityItem">
                  <h4>Mot de passe</h4>
                  <p>Définissez un mot de passe fort pour protéger votre compte</p>
                  <button className="changePasswordButton">
                    Modifier le mot de passe
                  </button>
                </div>
                
                <div className="securityItem">
                  <h4>Connexions actives</h4>
                  <p>Gérez les appareils connectés à votre compte</p>
                  <button className="viewSessionsButton">
                    Voir les sessions actives
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'danger' && (
            <div className="profileFormCard dangerZone">
              <h3 style={{ color: '#dc2626' }}>Zone de danger</h3>
              <p style={{ marginBottom: '1.5rem' }}>
                Ces actions sont irréversibles. Veuillez procéder avec prudence.
              </p>
              
              <div className="dangerActions">
                <div className="dangerAction">
                  <h4>Supprimer la boutique</h4>
                  <p>Cette action supprimera votre boutique mais conservera votre compte.</p>
                  <button 
                    className="dangerButton"
                    onClick={() => {
                      setDeleteType('shop');
                      setShowDeleteConfirm(true);
                    }}
                    disabled={loading}
                  >
                    Supprimer la boutique
                  </button>
                </div>
                
                <div className="dangerAction">
                  <h4>Supprimer le compte</h4>
                  <p>Cette action supprimera définitivement votre compte et toutes vos données.</p>
                  <button 
                    className="dangerButton deleteAccount"
                    onClick={() => {
                      setDeleteType('account');
                      setShowDeleteConfirm(true);
                    }}
                    disabled={loading}
                  >
                    Supprimer le compte
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h3>Confirmation de suppression</h3>
            <p>
              Êtes-vous sûr de vouloir {deleteType === 'shop' ? 'supprimer votre boutique' : 'supprimer votre compte'} ? 
              Cette action est irréversible.
            </p>
            <div className="modalActions">
              <button
                className="modalCancel"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={loading}
              >
                Annuler
              </button>
              <button
                className="modalConfirm"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? 'Suppression...' : 'Confirmer la suppression'}
              </button>
            </div>
          </div>
        </div>
      )}


      <style jsx>
        {`
        .profileSection {
  background: #ffffffff;
  border-radius: 12px;
  padding: 1rem 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.profileSection .sectionHeader {
  margin-bottom: 2rem;
}

.profileSection .sectionHeader h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #000;
  margin-bottom: 0.5rem;
}

.profileSection .sectionHeader p {
  color: #666;
  font-size: 0.95rem;
}

.profileSection .message {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-weight: 500;
  animation: slideIn 0.3s ease;
}

.profileSection .message.success {
  background: #E5FAF2;
  border: 1px solid #10B981;
  color: #065F46;
}

.profileSection .message.error {
  background: #FEF2F2;
  border: 1px solid #EF4444;
  color: #991B1B;
}

.profileSection .profileContent {
  display: flex;
  gap: 2rem;
}

.profileSection .profileTabs {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 200px;
}

.profileSection .tabButton {
  padding: 0.75rem 1rem;
  text-align: left;
  background: transparent;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
}

.profileSection .tabButton:hover {
  background: #E9F0EE;
  color: #000;
}

.profileSection .tabButton.tabActive {
  background: #E5FAF2;
  color: #000;
  font-weight: 600;
}

.profileSection .profileTabContent {
  flex: 1;
  background: #F6F6F6;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.profileSection .profileFormCard {
  animation: fadeIn 0.3s ease;
}

.profileSection .profileFormCard h3 {
  font-size: 1.4rem;
  font-weight: 600;
  color: #000;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #E5FAF2;
}

.profileSection .formRow {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.profileSection .formGroup {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.profileSection .formGroup label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
}

.profileSection .formGroup input,
.profileSection .formGroup select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  background: #fff;
}

.profileSection .formGroup input:focus,
.profileSection .formGroup select:focus {
  outline: none;
  border-color: #000;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
}

.profileSection .formGroup input.disabledField {
  background: #f5f5f5;
  color: #888;
  cursor: not-allowed;
}

.profileSection .formHint {
  font-size: 0.8rem;
  color: #888;
  margin-top: 0.5rem;
}

.profileSection .saveButton {
  background: #000;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1rem;
}

.profileSection .saveButton:hover {
  background: #333;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.profileSection .saveButton:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.profileSection .securitySettings {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profileSection .securityItem {
  padding: 1.5rem;
  background: #F6F6F6;
  border-radius: 8px;
  border-left: 4px solid #000;
}

.profileSection .securityItem h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #000;
  margin-bottom: 0.5rem;
}

.profileSection .securityItem p {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
}

.profileSection .changePasswordButton,
.profileSection .viewSessionsButton {
  background: #E5FAF2;
  color: #065F46;
  border: 1px solid #10B981;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.profileSection .changePasswordButton:hover,
.profileSection .viewSessionsButton:hover {
  background: #d1f7e8;
}

.profileSection .dangerZone {
  border: 2px solid #fecaca;
}

.profileSection .dangerActions {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profileSection .dangerAction {
  padding: 1.5rem;
  background: #FEF2F2;
  border-radius: 8px;
  border-left: 4px solid #dc2626;
}

.profileSection .dangerAction h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #991B1B;
  margin-bottom: 0.5rem;
}

.profileSection .dangerAction p {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
}

.profileSection .dangerButton {
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.profileSection .dangerButton:hover {
  background: #b91c1c;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(220, 38, 38, 0.2);
}

.profileSection .dangerButton.deleteAccount {
  background: #000;
}

.profileSection .dangerButton.deleteAccount:hover {
  background: #333;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.profileSection .dangerButton:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.profileSection .modalOverlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.profileSection .modalContent {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  animation: slideUp 0.3s ease;
}

.profileSection .modalContent h3 {
  font-size: 1.4rem;
  font-weight: 600;
  color: #000;
  margin-bottom: 1rem;
}

.profileSection .modalContent p {
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.5;
}

.profileSection .modalActions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.profileSection .modalCancel {
  background: #E9F0EE;
  color: #333;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.profileSection .modalCancel:hover {
  background: #dde4e2;
}

.profileSection .modalConfirm {
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.profileSection .modalConfirm:hover {
  background: #b91c1c;
}

.profileSection .modalCancel:disabled,
.profileSection .modalConfirm:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { 
    opacity: 0;
    transform: translateY(-10px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .profileSection .profileContent {
    flex-direction: column;
  }
  
  .profileSection .profileTabs {
    flex-direction: row;
    overflow-x: auto;
    min-width: 100%;
    padding-bottom: 0.5rem;
  }
  
  .profileSection .tabButton {
    white-space: nowrap;
  }
  
  .profileSection .formRow {
    flex-direction: column;
    gap: 1rem;
  }
  
  .profileSection .modalActions {
    flex-direction: column;
  }
  
  .profileSection .modalCancel,
  .profileSection .modalConfirm {
    width: 100%;
  }
}
        `}
      </style>
    </div>
  );
}