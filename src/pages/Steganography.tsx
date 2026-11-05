import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { EyeOff, Eye, Upload, Download, Copy, Check, Shield, AlertTriangle, RefreshCw, Lock } from 'lucide-react';
import { useSeo } from '../lib/useSeo';

const MAGIC_HEADER = 'ELMAS_STEG:';

export default function Steganography() {
  useSeo({
    title: 'SteganoGhost — Stéganographie Pixel LSB | Elmas Core',
    description: 'Dissimulation imperceptible de messages secrets dans les pixels d\'images numériques via stéganographie LSB.',
  });

  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [secretText, setSecretText] = useState('');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [encodedImageSrc, setEncodedImageSrc] = useState<string | null>(null);
  const [decodedSecret, setDecodedSecret] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setImageSrc(event.target?.result as string);
      setEncodedImageSrc(null);
      setDecodedSecret(null);
      setStatusMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const handleEncode = () => {
    if (!imageSrc || !secretText.trim()) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      const fullMessage = MAGIC_HEADER + secretText;
      const encoder = new TextEncoder();
      const messageBytes = encoder.encode(fullMessage);
      const totalBits = messageBytes.length * 8;

      // Check capacity: each pixel has 3 usable channels (R, G, B)
      const maxBits = (data.length / 4) * 3;
      if (totalBits + 32 > maxBits) {
        setStatusMsg('Erreur : L\'image est trop petite pour contenir l\'intégralité du secret.');
        return;
      }

      // Encode 32-bit length header first
      const lengthBytes = new Uint8Array(4);
      new DataView(lengthBytes.buffer).setUint32(0, messageBytes.length, false);

      const allBytes = new Uint8Array(4 + messageBytes.length);
      allBytes.set(lengthBytes, 0);
      allBytes.set(messageBytes, 4);

      let bitIdx = 0;
      const totalToEncode = allBytes.length * 8;

      for (let i = 0; i < data.length && bitIdx < totalToEncode; i++) {
        if ((i + 1) % 4 === 0) continue; // Skip Alpha channel
        const byteIndex = Math.floor(bitIdx / 8);
        const bitPosition = 7 - (bitIdx % 8);
        const bit = (allBytes[byteIndex] >> bitPosition) & 1;

        data[i] = (data[i] & ~1) | bit;
        bitIdx++;
      }

      ctx.putImageData(imgData, 0, 0);
      const resultPng = canvas.toDataURL('image/png');
      setEncodedImageSrc(resultPng);
      setStatusMsg('Message secret encodé avec succès dans les pixels LSB !');
    };
    img.src = imageSrc;
  };

  const handleDecode = () => {
    if (!imageSrc) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Extract 32-bit length
      let bitIdx = 0;
      const lengthBytes = new Uint8Array(4);
      for (let i = 0; i < data.length && bitIdx < 32; i++) {
        if ((i + 1) % 4 === 0) continue;
        const byteIndex = Math.floor(bitIdx / 8);
        const bitPosition = 7 - (bitIdx % 8);
        const bit = data[i] & 1;
        lengthBytes[byteIndex] |= bit << bitPosition;
        bitIdx++;
      }

      const messageLength = new DataView(lengthBytes.buffer).getUint32(0, false);
      if (messageLength <= 0 || messageLength > 1000000) {
        setStatusMsg('Aucun message secret ElmasCore détecté dans cette image.');
        setDecodedSecret(null);
        return;
      }

      const messageBytes = new Uint8Array(messageLength);
      const totalMessageBits = messageLength * 8;
      let msgBitIdx = 0;

      for (let i = Math.floor((32 * 4) / 3); i < data.length && msgBitIdx < totalMessageBits; i++) {
        if ((i + 1) % 4 === 0) continue;
        const byteIndex = Math.floor(msgBitIdx / 8);
        const bitPosition = 7 - (msgBitIdx % 8);
        const bit = data[i] & 1;
        messageBytes[byteIndex] |= bit << bitPosition;
        msgBitIdx++;
      }

      const decodedString = new TextDecoder().decode(messageBytes);
      if (decodedString.startsWith(MAGIC_HEADER)) {
        const rawSecret = decodedString.slice(MAGIC_HEADER.length);
        setDecodedSecret(rawSecret);
        setStatusMsg('Payload stéganographique extrait avec succès !');
      } else {
        setStatusMsg('Signature stéganographique invalide ou image corrompue.');
        setDecodedSecret(null);
      }
    };
    img.src = imageSrc;
  };

  const handleCopyDecoded = async () => {
    if (!decodedSecret) return;
    await navigator.clipboard.writeText(decodedSecret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pt-24 md:pt-32 pb-24 px-6 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-10 max-w-3xl">
        <div className="flex items-center gap-2 text-accent text-xs font-mono uppercase tracking-wider mb-2 font-bold">
          <Lock size={14} /> Laboratoire R&D Stéganographique // SteganoGhost
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-text-primary tracking-tight leading-tight mb-3">
          Stéganographie LSB & Dissimulation
        </h1>
        <p className="text-text-secondary text-sm md:text-base leading-relaxed">
          Cachez des messages secrets directement dans les bits de poids faible des pixels d'une image PNG. L'image reste visuellement identique à l'original tout en transportant un secret invisible.
        </p>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 mt-6 p-1 bg-surface-card border border-border rounded-xl w-fit">
          <button
            onClick={() => { setMode('encode'); setStatusMsg(null); }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold font-mono flex items-center gap-2 transition-all ${
              mode === 'encode' ? 'bg-accent text-on-accent shadow-sm' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <EyeOff size={13} />
            <span>1. Dissimuler (Encoder)</span>
          </button>
          <button
            onClick={() => { setMode('decode'); setStatusMsg(null); }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold font-mono flex items-center gap-2 transition-all ${
              mode === 'decode' ? 'bg-accent text-on-accent shadow-sm' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Eye size={13} />
            <span>2. Révéler (Décoder)</span>
          </button>
        </div>
      </header>

      {/* Main interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column */}
        <div className="lg:col-span-6 space-y-6">
          <div className="card-tech p-6">
            <h2 className="text-xs font-bold font-mono text-text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
              <Upload size={14} className="text-accent" />
              <span>Image Porteuse ({mode === 'encode' ? 'Support' : 'Image à analyser'})</span>
            </h2>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleImageUpload}
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border hover:border-accent rounded-xl p-6 text-center cursor-pointer transition-colors bg-surface-lighter/50"
            >
              {imageSrc ? (
                <div className="space-y-3">
                  <img src={imageSrc} alt="Preview" className="max-h-48 mx-auto rounded-lg object-contain" />
                  <p className="text-xs font-mono text-accent">Cliquez pour changer d'image</p>
                </div>
              ) : (
                <div className="py-8">
                  <Upload size={28} className="mx-auto mb-2 text-text-muted" />
                  <p className="text-xs font-medium text-text-primary mb-1">
                    Déposez ou sélectionnez une image PNG / JPEG
                  </p>
                  <p className="text-[11px] text-text-muted">
                    Traitement 100% sécurisé et local dans le navigateur
                  </p>
                </div>
              )}
            </div>

            {mode === 'encode' && (
              <div className="mt-4 space-y-3">
                <label className="block text-xs font-mono text-text-secondary">
                  Message secret à dissimuler
                </label>
                <textarea
                  value={secretText}
                  onChange={(e) => setSecretText(e.target.value)}
                  placeholder="Tapez le texte confidentiel à injecter dans les pixels..."
                  rows={4}
                  className="w-full bg-surface-lighter border border-border rounded-xl p-3 text-xs font-mono text-text-primary focus:outline-none focus:border-accent resize-none"
                />

                <button
                  onClick={handleEncode}
                  disabled={!imageSrc || !secretText.trim()}
                  className="w-full py-3 bg-accent text-on-accent text-xs font-semibold rounded-xl hover:bg-accent-dark transition-all shadow-lift flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <EyeOff size={14} />
                  <span>Dissimuler le secret dans l'image</span>
                </button>
              </div>
            )}

            {mode === 'decode' && (
              <div className="mt-4">
                <button
                  onClick={handleDecode}
                  disabled={!imageSrc}
                  className="w-full py-3 bg-accent text-on-accent text-xs font-semibold rounded-xl hover:bg-accent-dark transition-all shadow-lift flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Eye size={14} />
                  <span>Analyser les pixels et extraire le secret</span>
                </button>
              </div>
            )}

            {statusMsg && (
              <div className="mt-4 p-3 rounded-lg bg-surface-soft border border-border text-xs font-mono text-text-primary flex items-center gap-2">
                <span>{statusMsg}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right column: Results */}
        <div className="lg:col-span-6 space-y-6">
          {mode === 'encode' && encodedImageSrc && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card-tech p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-sm font-bold text-text-primary">
                  Image Stéganographique Générée
                </h3>
                <a
                  href={encodedImageSrc}
                  download="steganoghost-carrier.png"
                  className="px-3 py-1.5 rounded-lg bg-accent text-on-accent text-xs font-mono font-medium flex items-center gap-1.5 shadow-sm"
                >
                  <Download size={13} />
                  <span>Télécharger PNG</span>
                </a>
              </div>

              <div className="bg-surface-lighter p-3 rounded-xl border border-border mb-3 flex items-center justify-center">
                <img src={encodedImageSrc} alt="Stego output" className="max-h-60 rounded-lg object-contain" />
              </div>

              <p className="text-[11px] text-text-muted font-mono leading-relaxed">
                ℹ️ Cette image contient votre secret encodé sans perte dans les bits LSB. Conservez impérativement le format <strong>PNG</strong> pour préserver l'intégrité des pixels.
              </p>
            </motion.div>
          )}

          {mode === 'decode' && decodedSecret && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card-tech p-6 border-emerald-500/30 bg-emerald-500/5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  SECRET DÉCODÉ AVEC SUCCÈS
                </span>
                <button
                  onClick={handleCopyDecoded}
                  className="px-3 py-1 rounded-lg bg-surface-elevated border border-border text-xs font-mono text-text-primary hover:text-accent flex items-center gap-1 shadow-sm"
                >
                  {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                  <span>{copied ? 'Copié !' : 'Copier'}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-surface-card border border-border font-mono text-xs text-text-primary whitespace-pre-wrap select-all">
                {decodedSecret}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
