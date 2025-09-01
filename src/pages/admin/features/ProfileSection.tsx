import { useState } from 'react';
import styles from '../../../styles/admin.module.css';

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
    <div className="profileSectio">
      <div className="sectionHeade">
        <h2>Profil</h2>
        <p>Gérez les informations de votre compte</p>
      </div>
      
      <div className="profileConten">
        <div className="profileTab">
          <button 
            className={` tabButton ${activeTab === 'info' ? 'tabActive' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            Informations
          </button>
          <button 
            className={` tabButton ${activeTab === 'security' ? 'tabActive' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            Sécurité
          </button>
          <button 
            className={` tabButton ${activeTab === 'settings' ? 'tabActive' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Paramètres
          </button>
        </div>
        
        <div className="profileTabConten">
          {activeTab === 'info' && (
            <div className="profileFormCar">
              <h3>Informations personnelles</h3>
              <form onSubmit={handleSubmit}>
                <div className="formRo">
                  <div className="formGrou">
                    <label>Nom de la boutique</label>
                    <input
                      type="text"
                      name="shopName"
                      value={formData.shopName}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="formGrou">
                    <label>URL de la boutique</label>
                    <input
                      type="url"
                      name="shopUrl"
                      value={formData.shopUrl}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="formRo">
                  <div className="formGrou">
                    <label>Votre nom</label>
                    <input
                      type="text"
                      name="merchantName"
                      value={formData.merchantName}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="formGrou">
                    <label>Email</label>
                    <input
                      type="email"
                      name="merchantEmail"
                      value={formData.merchantEmail}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <button type="submit" className="saveButto">
                  Enregistrer les modifications
                </button>
              </form>
            </div>
          )}
          
          {activeTab === 'security' && (
            <div className="profileFormCar">
              <h3>Paramètres de sécurité</h3>
              <div className="securitySetting">
                <div className="securityIte">
                  <h4>Mot de passe</h4>
                  <p>Définissez un mot de passe fort pour protéger votre compte</p>
                  <button className="changePasswordButto">
                    Modifier le mot de passe
                  </button>
                </div>
                
                <div className="securityIte">
                  <h4>Connexions actives</h4>
                  <p>Gérez les appareils connectés à votre compte</p>
                  <button className="viewSessionsButto">
                    Voir les sessions actives
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="profileFormCar">
              <h3>Paramètres de l'application</h3>
              <div className="appSetting">
                <div className="settingIte">
                  <h4>Notifications</h4>
                  <p>Configurez les notifications que vous souhaitez recevoir</p>
                  <div className="toggleSwitc">
                    <input type="checkbox" id="notifications" defaultChecked />
                    <label htmlFor="notifications"></label>
                  </div>
                </div>
                
                <div className="settingIte">
                  <h4>Mode sombre</h4>
                  <p>Activez le mode sombre pour un confort visuel</p>
                  <div className="toggleSwitc">
                    <input type="checkbox" id="darkMode" />
                    <label htmlFor="darkMode"></label>
                  </div>
                </div>
                
                <div className="settingIte">
                  <h4>Langue</h4>
                  <p>Choisissez la langue de l'interface</p>
                  <select className="languageSelec">
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