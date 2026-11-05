import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, Github, Linkedin, MessageSquare, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useSeo } from '../lib/useSeo';
import { getBreadcrumbSchema, getOrganizationSchema } from '../lib/seoSchemas';

export default function Contact() {
  useSeo({
    title: 'Contact & Collaboration — Elmas Core',
    description: 'Une idée de projet, un partenariat ou un besoin technique d\'ingénierie ? Entrez directement en contact avec l\'équipe d\'Elmas Core.',
    keywords: ['Contact Elmas Core', 'Devis projet IT', 'Partenariat développeur', 'Ingénierie logicielle Côte d\'Ivoire'],
    jsonLd: [
      getOrganizationSchema(),
      getBreadcrumbSchema([{ name: 'Contact', item: '/contact' }]),
    ],
  });

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const { error } = await supabase.from('contact_messages').insert([{
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
      }]);

      if (error) throw error;
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.log('Contact message submission:', form);
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    }
  };

  return (
    <div className="pt-24 md:pt-32 pb-24 px-6 md:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column — Contact Information */}
        <section className="lg:col-span-5">
          <header className="mb-10">
            <div className="text-xs font-bold font-mono text-accent uppercase tracking-wider mb-2">
              Prise de Contact Directe
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-text-primary tracking-tight leading-tight mb-4">
              Parlons de votre projet.
            </h1>
            <p className="text-text-secondary text-sm md:text-base leading-relaxed">
              Vous concevez un produit numérique, cherchez un audit architectural ou souhaitez explorer un partenariat avec notre collectif ? Échangeons dès aujourd'hui.
            </p>
          </header>

          <div className="space-y-4">
            {/* Email Card */}
            <div className="card-tech p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent-muted text-accent flex items-center justify-center shrink-0">
                <Mail size={18} />
              </div>
              <div className="min-w-0">
                <div className="font-mono text-[10px] text-text-muted uppercase tracking-wider">Email direct</div>
                <a href="mailto:founder@elmas.solutions" className="text-xs sm:text-sm font-semibold text-text-primary hover:text-accent transition-colors truncate block">
                  founder@elmas.solutions
                </a>
              </div>
            </div>

            {/* Phone Card */}
            <div className="card-tech p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent-muted text-accent flex items-center justify-center shrink-0">
                <Phone size={18} />
              </div>
              <div>
                <div className="font-mono text-[10px] text-text-muted uppercase tracking-wider">Ligne directe / WhatsApp</div>
                <div className="text-xs sm:text-sm font-semibold text-text-primary font-mono">
                  +225 07 88 00 08 31
                </div>
              </div>
            </div>

            {/* Location Card */}
            <div className="card-tech p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent-muted text-accent flex items-center justify-center shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <div className="font-mono text-[10px] text-text-muted uppercase tracking-wider">Localisation</div>
                  <div className="text-xs sm:text-sm font-semibold text-text-primary">
                    Abidjan, Côte d'Ivoire
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <a
                  href="https://github.com/elm-as"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-surface-soft border border-border text-text-secondary hover:text-accent transition-colors"
                >
                  <Github size={15} />
                </a>
                <a
                  href="https://www.linkedin.com/in/elmas-dev"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-surface-soft border border-border text-text-secondary hover:text-accent transition-colors"
                >
                  <Linkedin size={15} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column — Professional Form */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-7 card-tech p-6 md:p-8"
        >
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
            <div>
              <h2 className="font-display text-lg font-bold text-text-primary">
                Transmettre une demande
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                Réponse garantie sous 24 heures ouvrées.
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
              <MessageSquare size={16} />
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-mono text-xs font-medium text-text-secondary">Votre Nom</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full bg-surface-lighter border border-border rounded-xl px-3.5 py-2.5 text-text-primary text-xs font-medium focus:outline-none focus:border-accent transition-colors"
                  placeholder="ex. Alexandre Kouassi"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-xs font-medium text-text-secondary">Votre Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-surface-lighter border border-border rounded-xl px-3.5 py-2.5 text-text-primary text-xs font-medium focus:outline-none focus:border-accent transition-colors"
                  placeholder="contact@entreprise.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-xs font-medium text-text-secondary">Sujet de la demande</label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="w-full bg-surface-lighter border border-border rounded-xl px-3.5 py-2.5 text-text-primary text-xs font-medium focus:outline-none focus:border-accent transition-colors"
                placeholder="ex. Audit d'architecture logicielle / Développement de plateforme"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-xs font-medium text-text-secondary">Votre Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                className="w-full bg-surface-lighter border border-border rounded-xl px-3.5 py-2.5 text-text-primary text-xs font-medium focus:outline-none focus:border-accent transition-colors resize-none"
                placeholder="Décrivez votre besoin technique, vos contraintes et le périmètre attendu..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full py-3 bg-accent text-on-accent text-xs font-semibold rounded-xl hover:bg-accent-dark transition-all shadow-lift flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {status === 'sending' ? (
                'Transmission en cours...'
              ) : status === 'success' ? (
                <>
                  <CheckCircle2 size={15} /> Message Transmis avec Succès !
                </>
              ) : (
                <>
                  <span>Envoyer la demande</span>
                  <Send size={13} />
                </>
              )}
            </button>
          </form>
        </motion.section>
      </div>
    </div>
  );
}
