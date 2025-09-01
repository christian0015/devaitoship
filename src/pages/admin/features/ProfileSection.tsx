import { useState } from 'react';
import styles from '../../../styles/Admin.module.css';

interface ProfileSectionProps {
  userData: any;
}

export default function ProfileSection({ userData }: ProfileSectionProps) {
  const [activeTab, setActiveTab] = useState('info');
  const [formData, setFormData] = useState({
    shopName: userData?.shopName || '',
    shopUrl: userData?.shopUrl || '',
    merchantName: userData?.merchantName || '',
    merchantEmail: userData?.merchantEmail || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique de sauvegarde ici
    alert('Modifications sauvegardées!');
  };

  return (
    <div className={styles.profileSection}>
      <div className={styles.sectionHeader}>
        <h2>Profil</h2>
        <p>Gérez les informations de votre compte</p>
      </div>
      
      <div className={styles.profileContent}>
        <div className={styles.profileTabs}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'info' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('info')}
          >
            Informations
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'security' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('security')}
          >
            Sécurité
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'settings' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Paramètres
          </button>
        </div>
        
        <div className={styles.profileTabContent}>
          {activeTab === 'info' && (
            <div className={styles.profileFormCard}>
              <h3>Informations personnelles</h3>
              <form onSubmit={handleSubmit}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Nom de la boutique</label>
                    <input
                      type="text"
                      name="shopName"
                      value={formData.shopName}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>URL de la boutique</label>
                    <input
                      type="url"
                      name="shopUrl"
                      value={formData.shopUrl}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Votre nom</label>
                    <input
                      type="text"
                      name="merchantName"
                      value={formData.merchantName}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>Email</label>
                    <input
                      type="email"
                      name="merchantEmail"
                      value={formData.merchantEmail}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <button type="submit" className={styles.saveButton}>
                  Enregistrer les modifications
                </button>
              </form>
            </div>
          )}
          
          {activeTab === 'security' && (
            <div className={styles.profileFormCard}>
              <h3>Paramètres de sécurité</h3>
              <div className={styles.securitySettings}>
                <div className={styles.securityItem}>
                  <h4>Mot de passe</h4>
                  <p>Définissez un mot de passe fort pour protéger votre compte</p>
                  <button className={styles.changePasswordButton}>
                    Modifier le mot de passe
                  </button>
                </div>
                
                <div className={styles.securityItem}>
                  <h4>Connexions actives</h4>
                  <p>Gérez les appareils connectés à votre compte</p>
                  <button className={styles.viewSessionsButton}>
                    Voir les sessions actives
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className={styles.profileFormCard}>
              <h3>Paramètres de l'application</h3>
              <div className={styles.appSettings}>
                <div className={styles.settingItem}>
                  <h4>Notifications</h4>
                  <p>Configurez les notifications que vous souhaitez recevoir</p>
                  <div className={styles.toggleSwitch}>
                    <input type="checkbox" id="notifications" defaultChecked />
                    <label htmlFor="notifications"></label>
                  </div>
                </div>
                
                <div className={styles.settingItem}>
                  <h4>Mode sombre</h4>
                  <p>Activez le mode sombre pour un confort visuel</p>
                  <div className={styles.toggleSwitch}>
                    <input type="checkbox" id="darkMode" />
                    <label htmlFor="darkMode"></label>
                  </div>
                </div>
                
                <div className={styles.settingItem}>
                  <h4>Langue</h4>
                  <p>Choisissez la langue de l'interface</p>
                  <select className={styles.languageSelect}>
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}