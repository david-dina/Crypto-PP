export const ProviderModal = ({ isOpen, onClose, providers, onSelectProvider }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Select a Wallet</h2>
        {providers.map((providerName, index) => (
          <button
            key={index}
            onClick={() => onSelectProvider(providerName)} // Pass the selected provider name
            className="provider-button"
          >
            <img src={`/icons/${providerName}.svg`} alt={providerName} />
            <span>{providerName}</span>
          </button>
        ))}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};