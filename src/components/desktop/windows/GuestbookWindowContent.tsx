import React, { useState, useEffect } from 'react';
import { Send, MessageSquareHeart, CheckCircle2, Mail, Github, Linkedin, MapPin } from 'lucide-react';
import { soundFx } from '../../../lib/soundFx';
import { supabase } from '../../../lib/supabase';

interface Note {
  id?: string;
  author: string;
  message: string;
  created_at?: string;
}

const DEFAULT_NOTES: Note[] = [
  {
    author: 'Farouk / Creative Dev',
    message: 'Masterclass de design et fluidité. Le feeling OS est ultra propre.',
    created_at: 'Système',
  },
  {
    author: 'Ingénieur Rust (Daloa)',
    message: 'DayanaOS a un temps de boot bluffant. Continuez la rigueur.',
    created_at: 'Système',
  },
];

export default function GuestbookWindowContent() {
  const [activeTab, setActiveTab] = useState<'guestbook' | 'contact'>('guestbook');
  const [notes, setNotes] = useState<Note[]>(DEFAULT_NOTES);
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    async function loadNotes() {
      try {
        const { data, error } = await supabase
          .from('guestbook_notes')
          .select('id, author, message, created_at')
          .order('created_at', { ascending: false })
          .limit(20);
        if (!error && data && data.length > 0) {
          setNotes(data);
        }
      } catch {
        // Fallback to default notes if guestbook_notes table is not yet initialized
      }
    }
    loadNotes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg.trim()) return;
    soundFx.playClick();

    const authorName = name.trim() || 'Visiteur DayanaOS';
    const content = msg.trim();
    const optimisticNote: Note = {
      author: authorName,
      message: content,
      created_at: 'À l\'instant',
    };

    setNotes([optimisticNote, ...notes]);
    setMsg('');
    setName('');
    setSent(true);
    setTimeout(() => setSent(false), 2500);

    try {
      await supabase.from('guestbook_notes').insert([{ author: authorName, message: content }]);
    } catch {
      // Ignored if table not yet migrated
    }
  };

  return (
    <div className="flex flex-col h-full gap-4 text-xs text-white">
      {/* Header Tabs */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/10 shrink-0 font-mono">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setActiveTab('guestbook');
            }}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all ${
              activeTab === 'guestbook'
                ? 'bg-accent text-white font-bold'
                : 'bg-white/[0.04] text-white/65 hover:text-white'
            }`}
          >
            <MessageSquareHeart size={13} />
            <span>Livre d&apos;or ({notes.length})</span>
          </button>
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setActiveTab('contact');
            }}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all ${
              activeTab === 'contact'
                ? 'bg-accent text-white font-bold'
                : 'bg-white/[0.04] text-white/65 hover:text-white'
            }`}
          >
            <Mail size={13} />
            <span>Canal Direct & Audit</span>
          </button>
        </div>
      </div>

      {activeTab === 'guestbook' ? (
        <div className="flex-1 flex flex-col gap-3 min-h-0">
          <form onSubmit={handleSubmit} className="space-y-2 shrink-0">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre nom / callsign"
                className="px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white outline-none focus:border-accent text-xs"
              />
              <input
                type="text"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Laisser une note sur DayanaOS..."
                className="sm:col-span-2 px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white outline-none focus:border-accent text-xs"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-accent hover:bg-accent-dark font-bold text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {sent ? (
                <>
                  <CheckCircle2 size={14} className="text-emerald-300" />
                  <span>Note enregistrée dans le registre !</span>
                </>
              ) : (
                <>
                  <Send size={14} />
                  <span>Signer le Livre d&apos;or</span>
                </>
              )}
            </button>
          </form>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {notes.map((n, i) => (
              <div key={n.id || i} className="p-3 rounded-xl bg-black/45 border border-white/10 space-y-1">
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="font-bold text-accent">{n.author}</span>
                  <span className="text-white/40 tabular-nums">
                    {n.created_at && n.created_at.includes('T')
                      ? new Date(n.created_at).toLocaleDateString('fr-FR')
                      : n.created_at || 'Nœud Core'}
                  </span>
                </div>
                <p className="text-white/80 text-[11px] leading-relaxed">{n.message}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3 overflow-y-auto pr-1">
          <div className="p-4 rounded-2xl bg-black/45 border border-white/10 space-y-2">
            <div className="font-mono text-[10px] text-accent uppercase">
              Liaison Directe // Architecture & Partenariats
            </div>
            <h4 className="font-display text-base font-bold text-white">
              Initier un projet ou un audit technique avec Elmas Core
            </h4>
            <p className="text-white/70 text-xs leading-relaxed">
              Vous avez un besoin critique en ingénierie système, application mobile résiliente, pipeline data ou simulation 3D ? Contactez directement le noyau.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
            <a
              href="mailto:founder@elmas.solutions"
              className="p-3.5 rounded-xl bg-white/[0.04] hover:bg-accent/15 border border-white/10 hover:border-accent/40 transition-all flex items-center gap-3"
            >
              <Mail size={18} className="text-accent shrink-0" />
              <div>
                <div className="text-[10px] text-white/40">EMAIL DIRECT</div>
                <div className="text-xs font-bold text-white">founder@elmas.solutions</div>
              </div>
            </a>

            <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center gap-3">
              <MapPin size={18} className="text-emerald-400 shrink-0" />
              <div>
                <div className="text-[10px] text-white/40">SIÈGE OPÉRATIONNEL</div>
                <div className="text-xs font-bold text-white tabular-nums">
                  Abidjan, CIV (05°19&apos;N 04°01&apos;W)
                </div>
              </div>
            </div>

            <a
              href="https://github.com/elm-as"
              target="_blank"
              rel="noreferrer"
              className="p-3.5 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 transition-all flex items-center gap-3"
            >
              <Github size={18} className="text-white shrink-0" />
              <div>
                <div className="text-[10px] text-white/40">DÉPÔTS & SOURCES</div>
                <div className="text-xs font-bold text-white">github.com/elm-as</div>
              </div>
            </a>

            <a
              href="https://www.linkedin.com/in/elmas-dev"
              target="_blank"
              rel="noreferrer"
              className="p-3.5 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 transition-all flex items-center gap-3"
            >
              <Linkedin size={18} className="text-sky-400 shrink-0" />
              <div>
                <div className="text-[10px] text-white/40">RÉSEAU EXÉCUTIF</div>
                <div className="text-xs font-bold text-white">linkedin.com/in/elmas-dev</div>
              </div>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
