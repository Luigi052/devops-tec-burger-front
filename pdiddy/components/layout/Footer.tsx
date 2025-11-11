import React from 'react';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-neutral-300 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🍔</span>
              <span className="font-bold text-xl text-white">Pdiddy</span>
            </div>
            <p className="text-sm text-neutral-400">
              Sua plataforma de compras de comida online. Qualidade e sabor na palma da sua mão.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="hover:text-primary-400 transition-colors duration-200 focus:outline-none focus:underline"
                >
                  Início
                </Link>
              </li>
              <li>
                <Link
                  href="/carrinho"
                  className="hover:text-primary-400 transition-colors duration-200 focus:outline-none focus:underline"
                >
                  Carrinho
                </Link>
              </li>
              <li>
                <Link
                  href="/perfil"
                  className="hover:text-primary-400 transition-colors duration-200 focus:outline-none focus:underline"
                >
                  Meu Perfil
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contato</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="mailto:contato@pdiddy.com"
                  className="hover:text-primary-400 transition-colors duration-200 focus:outline-none focus:underline"
                >
                  contato@pdiddy.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+5511999999999"
                  className="hover:text-primary-400 transition-colors duration-200 focus:outline-none focus:underline"
                >
                  (11) 99999-9999
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 mt-8 pt-6 text-center text-sm text-neutral-400">
          <p>&copy; {currentYear} Pdiddy. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
