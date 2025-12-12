//embed-projet/style.js
export function loadStyles() {
  if (!document.getElementById('devaito-widget-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'devaito-widget-styles';
    styleSheet.textContent = `
      /* Copier tout le CSS de l'original embed.js ici */
      .devaito-card-widget { transition: all 0.3s ease; }
      .devaito-card-widget:hover { box-shadow: 0 8px 25px rgba(0,208,132,0.15) !important; }
      .devaito-btn-primary { transition: all 0.3s ease; }
      .devaito-btn-primary:hover { background: #00b870 !important; transform: translateY(-1px); }
      .devaito-input-field { transition: border-color 0.2s ease; }
      .devaito-input-field:focus { border-color: #00d084 !important; outline: none; box-shadow: 0 0 0 2px rgba(0,208,132,0.1); }
      .devaito-rate-card { transition: all 0.2s ease; cursor: pointer; }
      .devaito-rate-card:hover { border-color: #00d084 !important; transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0,208,132,0.1); }
      .devaito-rate-card.selected { border: 2px solid #00d084 !important; background-color: #f0fff8; }
      .devaito-toggle-container { transition: all 0.2s ease; }
      .devaito-toggle-container:hover { background: #f0f9ff !important; }
      
      /* Styles pour le widget flottant */
      .devaito-floating-widget {
        position: fixed;
        top: 85px;
        right: 20px;
        width: 60px;
        height: 60px;
        background: #00d084;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 208, 132, 0.3);
        z-index: 10000;
        transition: all 0.3s ease;
      }
      
      .devaito-floating-widget:hover {
        transform: scale(1.02);
      }
      
      .devaito-floating-expanded {
        width: 90%;
        max-width: 500px;
        height: auto;
        max-height: 80vh;
        border-radius: 12px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }
      
      .devaito-floating-header {
        padding: 16px;
        background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        border-bottom: 1px solid #e5e7eb;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .devaito-floating-title {
        font-weight: 600;
        color: #1f2937;
        font-size: 16px;
      }
      
      .devaito-close-btn {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #6b7280;
      }
      
      .devaito-floating-content {
        overflow-y: auto;
        max-height: calc(80vh - 60px);
      }
      
      .devaito-form-status {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        font-size: 14px;
      }
      
      .devaito-form-status.valid {
        color: #059669;
      }
      
      .devaito-form-status.invalid {
        color: #dc2626;
      }
      
      .devaito-checkmark {
        margin-left: 8px;
        color: #059669;
      }
      
      .devaito-product-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        margin-bottom: 8px;
      }
      
      .devaito-product-info {
        flex-grow: 1;
        margin-right: 12px;
      }
      
      .devaito-product-name {
        font-weight: 500;
        color: #374151;
        font-size: 14px;
      }
      
      .devaito-product-details {
        font-size: 12px;
        color: #6b7280;
        margin-top: 2px;
      }
      
      .devaito-product-quantity {
        width: 60px;
        padding: 8px;
        border: 1.5px solid #d1d5db;
        color: #1f2937;
        border-radius: 6px;
        text-align: center;
        font-size: 14px;
        background: #f9fafb;
      }
      
      .devaito-total-price {
        font-weight: 700;
        font-size: 18px;
        color: #1f2937;
        margin-top: 20px;
        padding-top: 16px;
        border-top: 1px solid #e5e7eb;
        text-align: center;
      }
      
      .devaito-validate-btn {
        width: 100%;
        padding: 14px 20px;
        border-radius: 10px;
        border: none;
        background: #10b981;
        color: white;
        font-weight: 600;
        cursor: pointer;
        font-size: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-top: 16px;
        transition: all 0.3s ease;
      }
      
      .devaito-validate-btn:hover {
        background: #059669;
        transform: translateY(-1px);
      }
      
      .devaito-select-field {
        width: 100%;
        padding: 12px 16px;
        border: 1.5px solid #d1d5db;
        border-radius: 8px;
        font-size: 14px;
        background: #f9fafb;
        color: #1f2937;
        box-sizing: border-box;
      }
      
      @media (min-width: 550px) {
        .devaito-grid-responsive {
          display: grid !important;
          grid-template-columns: repeat(2, 1fr) !important;
          gap: 12px !important;
        }
      }
    `;
    document.head.appendChild(styleSheet);
  }
}