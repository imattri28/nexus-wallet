import React, { useState } from 'react';
import { Wallet, HDNodeWallet, Mnemonic } from 'ethers';
import './App.css';

function App() {
  const [mnemonic, setMnemonic] = useState(null);
  const [wallets, setWallets] = useState([]);
  const [showMnemonic, setShowMnemonic] = useState(false); 

  const generateMnemonic = () => {
    const randomWallet = Wallet.createRandom();
    setMnemonic(randomWallet.mnemonic.phrase);
    setWallets([]); 
    setShowMnemonic(true);
  };

  const addWallet = () => {
    if (!mnemonic) return;

    try {
      // Generate Seed

      const mnemonicObj = Mnemonic.fromPhrase(mnemonic);
      const seed = mnemonicObj.computeSeed();
      const rootNode = HDNodeWallet.fromSeed(seed);
      const walletIndex = wallets.length;
      const derivationPath = `m/44'/60'/0'/0/${walletIndex}`;
      const childNode = rootNode.derivePath(derivationPath);

      const walletObject = {
        index: walletIndex,
        address: childNode.address,
        path: derivationPath
      };

      setWallets([...wallets, walletObject]);

    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="app-container">
      <div className="glass-card">
        <h1>◆ Nexus Wallet</h1>

        {/* SECTION 1: Generate Button or Seed Display */}
        
        {!mnemonic ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <p style={{ color: '#c4c3c3', marginBottom: '20px' }}>
              Create a secure wallet to get started.
            </p>
            <button onClick={generateMnemonic} className="btn-main btn-generate">
              ⚡ Create Seed Phrase
            </button>
          </div>
        ) : (
          <div className="seed-container">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <h3 style={{ margin: 0 }}>Secret Phrase</h3>
              <button 
                onClick={() => setShowMnemonic(!showMnemonic)}
                style={{background: 'none', border: 'none', color: '#00c6ff', cursor: 'pointer'}}
              >
                {showMnemonic ? "Hide" : "Show"}
              </button>
            </div>

            {showMnemonic && (
              <div className="mnemonic-grid">
                {mnemonic.split(" ").map((word, i) => (
                  <div key={i} className="word-chip">
                    <span style={{color: '#666', marginRight: '5px'}}>{i+1}.</span>
                    {word}
                  </div>
                ))}
              </div>
            )}
            {!showMnemonic && (
               <div style={{padding: '20px', textAlign: 'center', color: '#666', fontStyle: 'italic'}}>
                 •••• •••• •••• •••• •••• ••••
               </div>
            )}
          </div>
        )}

        <hr style={{borderColor: 'rgba(255,255,255,0.1)', margin: '20px 0'}} />

        {/* SECTION 2: Wallet List */}

        {mnemonic && (
          <div>
             <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                <h3 style={{margin: 0}}>Your Wallets</h3>
                <button onClick={addWallet} className="btn-main btn-add" style={{width: 'auto', padding: '10px 20px'}}>
                  + Add New
                </button>
             </div>

             <div className="wallet-list">
               {wallets.length === 0 && (
                 <p style={{textAlign: 'center', color: '#666'}}>Click "+ Add New" to generate your first wallet.</p>
               )}
               
               {wallets.map((wallet) => (
                 <div key={wallet.index} className="wallet-card">
                   <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                     <span style={{fontWeight: 'bold', fontSize: '18px'}}>Wallet {wallet.index + 1}</span>
                     <span className="eth-badge">ETH</span>
                   </div>
                   
                   <div className="address-text">
                     {wallet.address}
                   </div>
                 </div>
               ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;