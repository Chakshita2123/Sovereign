import { Shield, Github, Twitter, Linkedin } from 'lucide-react';
import { motion } from 'motion/react';

export function Footer() {
  const navLinks = [
    { label: 'Documentation', href: '#' },
    { label: 'API Reference', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Contact', href: '#' }
  ];

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' }
  ];

  return (
    <footer className="relative overflow-hidden">
      {/* Gradient line */}
      <div className="h-[1px] w-full"
           style={{
             background: 'linear-gradient(90deg, transparent, #00C2FF, #7B2FFF, transparent)'
           }} />

      <div className="py-12"
           style={{ background: '#030912' }}>
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                   style={{
                     background: 'linear-gradient(135deg, #00C2FF, #7B2FFF)'
                   }}>
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                VaultID
              </span>
            </motion.div>

            {/* Nav links - centered */}
            <motion.nav
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex flex-wrap items-center justify-center gap-8"
            >
              {navLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  className="text-sm text-[#7A8FA6] hover:text-[#00C2FF] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </motion.nav>

            {/* Social icons */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-4"
            >
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-all"
                  style={{
                    background: 'rgba(10, 22, 40, 0.6)',
                    border: '1px solid rgba(0, 194, 255, 0.15)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0, 194, 255, 0.5)';
                    e.currentTarget.style.background = 'rgba(0, 194, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0, 194, 255, 0.15)';
                    e.currentTarget.style.background = 'rgba(10, 22, 40, 0.6)';
                  }}
                >
                  <social.icon className="w-4 h-4 text-[#7A8FA6]" />
                </a>
              ))}
            </motion.div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-8 border-t border-[rgba(0,194,255,0.1)] text-center">
            <p className="text-sm text-[#7A8FA6]">
              © 2026 VaultID. Self-sovereign identity for everyone.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
