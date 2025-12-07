import React from 'react';
import { Twitter, Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1a1b26] text-slate-400 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="text-center md:text-left">
            <h4 className="text-white text-lg font-bold mb-2">FinCompare</h4>
            <p className="text-sm max-w-md">Empowering investors with crystal clear data analytics and side-by-side mutual fund comparisons.</p>
          </div>

          <div className="flex gap-6 text-sm font-medium">
            <a href="#" className="hover:text-white transition-colors">About Us</a>
            <a href="#" className="hover:text-white transition-colors">Methodology</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>

          <div className="flex gap-4">
             <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-white transition-all"><Twitter size={18} /></a>
             <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-white transition-all"><Linkedin size={18} /></a>
             <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-white transition-all"><Mail size={18} /></a>
          </div>
        </div>
        <div className="border-t border-white/10 mt-10 pt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} FinCompare Analytics. All rights reserved. Data provided for demonstration purposes only.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
