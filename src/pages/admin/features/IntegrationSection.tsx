'use client';
import { useEffect, useState } from 'react';
import CodeBlock from '@/components/sections/CodeBlock';
// Icônes SVG personnalisées
const Copy = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const Check = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20,6 9,17 4,12"></polyline>
  </svg>
);

const Code = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="16,18 22,12 16,6"></polyline>
    <polyline points="8,6 2,12 8,18"></polyline>
  </svg>
);

const Zap = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"></polygon>
  </svg>
);

interface Props {
  userData: {
    _id: string;
    shopUrl: string;
    shopName: string;
    merchantEmail: string;
  };
}

export default function IntegrationSection({ userData }: Props) {
  const [shopId, setShopId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'html' | 'react'>('html');

  useEffect(() => {
    if (!userData?.shopUrl) return;

    const fetchShopId = async () => {
      try {
        const res = await fetch('/api/integration', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ shopUrl: userData.shopUrl }),
        });
        const data = await res.json();
        if (res.ok) setShopId(data.shopId);
        else console.error(data.error);
      } catch (e) {
        console.error('API Error:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchShopId();
  }, [userData]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const htmlCode = `<!-- Widget bundle script -->
  
<!-- DIV where the widget will be injected -->
<div id="devaito-widget" data-shop-id="${shopId}"></div>

<script type="text/javascript">
(function() {

  // Stocker le shopId dans une variable globale
  window.DEVAITO_SHOP_ID = '${shopId}';
  /**
   * Détecte si on est dans le builder Devaito
   * - Marche même avec des domaines personnalisés
   */
  function isInBuilder() {
    const href = window.location.href;
    return href.includes('/admin/builder');
  }

  /**
   * Charge un script externe dynamiquement
   * @param {string} url
   * @param {function} callback
   */
  function loadScript(url, callback) {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.defer = true;
    script.onload = callback || function(){};
    script.onerror = function() {
      console.error('Impossible de charger le script : ' + url);
    };
    document.head.appendChild(script);
  }

  // Si on n'est PAS dans le builder, on charge le script du widget
  if (!isInBuilder()) {
    loadScript('https://devaitoship.vercel.app/embed.js', function() {
      console.log('Widget chargé et exécuté.');
    });
  } else {
    console.log('Mode Builder détecté : script du widget non chargé.');
  }
})();
</script>
    `;




  const reactCode = `import { useEffect } from 'react';

export default function MyComponent() {
  useEffect(() => {

    // Stocker le shopId dans une variable globale
    window.DEVAITO_SHOP_ID = '${shopId}';
    const script = document.createElement('script');
    script.src = 'https://devaitoship.vercel.app/embed.js';
    script.defer = true;
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div id="devaito-widget" data-shop-id="${shopId}"></div>
  );
}`;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement de votre intégration...</p>
        <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 4rem 2rem;
            background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
            border-radius: 16px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #e9ecef;
            border-top: 4px solid #00d084;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          p {
            color: #6c757d;
            font-size: 1.1rem;
            margin: 0;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="integration-container">
      <div className="header-section">
        <div className="icon-wrapper">
          <Code size={32} />
        </div>
        <div className="header-content">
          <h2>Intégration Widget</h2>
          <p>Intégrez facilement le widget Devaito sur votre site web</p>
        </div>
        <div className="status-badge">
          <Zap size={16} />
          <span>Prêt à intégrer</span>
        </div>
      </div>

      {shopId ? (
        <div className="integration-content">
          <div className="shop-info">
            <div className="shop-details">
              <h3>{userData.shopName}</h3>
              <p className="shop-url">{userData.shopUrl}</p>
              <div className="shop-id">
                <span className="label">Shop ID:</span>
                <code className="id-code">{shopId}</code>
              </div>
            </div>
          </div>

          <div className="code-section">
            <div className="tabs-container">
              <div className="tabs">
                <button 
                  className={`tab ${activeTab === 'html' ? 'active' : ''}`}
                  onClick={() => setActiveTab('html')}
                >
                  <Code size={16} />
                  HTML/JS
                </button>
                <button 
                  className={`tab ${activeTab === 'react' ? 'active' : ''}`}
                  onClick={() => setActiveTab('react')}
                >
                  <Zap size={16} />
                  React
                </button>
              </div>
              <button 
                className="copy-button"
                onClick={() => copyToClipboard(activeTab === 'html' ? htmlCode : reactCode)}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copié!' : 'Copier'}
              </button>
            </div>

            {/* <div className="code-wrapper">
              <pre className="code-block">
                <code>{activeTab === 'html' ? htmlCode : reactCode}</code>
              </pre>
            </div> */}

            <div className="code-wrapper">
              <CodeBlock
                code={activeTab === 'html' ? htmlCode : reactCode} 
                language={activeTab === 'html' ? 'markup' : 'javascript'}
              />
            </div>

          </div>

          <div className="instructions-section">
            <h3>Instructions d'intégration</h3>
            <div className="steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Copiez le code</h4>
                  <p>Utilisez le bouton "Copier" pour copier le code d'intégration</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>Collez dans votre site</h4>
                  <p>Ajoutez le code là où vous voulez que le widget apparaisse</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>C'est prêt!</h4>
                  <p>Le widget se chargera automatiquement sur votre site</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Impossible de récupérer l'ID de la boutique</h3>
          <p>Veuillez réessayer ou contactez le support technique.</p>
          <button className="retry-button" onClick={() => window.location.reload()}>
            Réessayer
          </button>
        </div>
      )}

      <style jsx>{`
        .integration-container {
          max-width: 900px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .header-section {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 2rem;
          background: linear-gradient(135deg, #000000 0%, #212529 100%);
          color: #ffffff;
          position: relative;
          overflow: hidden;
        }

        .header-section::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(0, 208, 132, 0.2) 0%, transparent 70%);
          border-radius: 50%;
          transform: translate(50%, -50%);
        }

        .icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          background: #00d084;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 208, 132, 0.3);
          z-index: 1;
        }

        .header-content {
          flex: 1;
          z-index: 1;
        }

        .header-content h2 {
          margin: 0 0 0.5rem 0;
          font-size: 1.8rem;
          font-weight: 700;
        }

        .header-content p {
          margin: 0;
          color: #e9ecef;
          font-size: 1rem;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(0, 208, 132, 0.2);
          border: 1px solid #00d084;
          border-radius: 8px;
          color: #00d084;
          font-size: 0.9rem;
          font-weight: 500;
          z-index: 1;
        }

        .integration-content {
          padding: 2rem;
        }

        .shop-info {
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          border: 1px solid #e9ecef;
          border-radius: 12px;
        }

        .shop-details h3 {
          margin: 0 0 0.5rem 0;
          color: #212529;
          font-size: 1.3rem;
          font-weight: 600;
        }

        .shop-url {
          margin: 0 0 1rem 0;
          color: #6c757d;
          font-size: 0.95rem;
        }

        .shop-id {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .label {
          color: #6c757d;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .id-code {
          padding: 0.25rem 0.75rem;
          background: #212529;
          color: #00d084;
          border-radius: 6px;
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .code-section {
          margin-bottom: 2rem;
        }

        .tabs-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e9ecef;
        }

        .tabs {
          display: flex;
          gap: 0.5rem;
        }

        .tab {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          color: #6c757d;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .tab:hover {
          background: #e9ecef;
          color: #212529;
        }

        .tab.active {
          background: #00d084;
          border-color: #00d084;
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(0, 208, 132, 0.3);
        }

        .copy-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: #212529;
          border: none;
          border-radius: 8px;
          color: #ffffff;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .copy-button:hover {
          background: #000000;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .code-wrapper {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .code-block {
          margin: 0;
          padding: 2rem;
          background: linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%);
          color: #e9ecef;
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 0.9rem;
          line-height: 1.6;
          white-space: pre-wrap;
          word-wrap: break-word;
          overflow-x: auto;
        }

        .instructions-section h3 {
          margin: 0 0 1.5rem 0;
          color: #212529;
          font-size: 1.3rem;
          font-weight: 600;
        }

        .steps {
          display: grid;
          gap: 1.5rem;
        }

        .step {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .step-number {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: #00d084;
          color: #ffffff;
          border-radius: 50%;
          font-weight: 600;
          font-size: 0.9rem;
          flex-shrink: 0;
        }

        .step-content h4 {
          margin: 0 0 0.5rem 0;
          color: #212529;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .step-content p {
          margin: 0;
          color: #6c757d;
          line-height: 1.5;
        }

        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 3rem 2rem;
          text-align: center;
        }

        .error-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .error-container h3 {
          margin: 0 0 1rem 0;
          color: #dc3545;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .error-container p {
          margin: 0 0 2rem 0;
          color: #6c757d;
          font-size: 1.1rem;
        }

        .retry-button {
          padding: 0.75rem 2rem;
          background: #00d084;
          border: none;
          border-radius: 8px;
          color: #ffffff;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .retry-button:hover {
          background: #00b874;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 208, 132, 0.3);
        }

        @media (max-width: 768px) {
          .header-section {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }

          .integration-content {
            padding: 1.5rem;
          }

          .tabs-container {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .tabs {
            justify-content: center;
          }

          .shop-id {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}