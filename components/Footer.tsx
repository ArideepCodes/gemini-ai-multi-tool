
import React from 'react';

const owner = {
  name: "Arideep Kanshabanik",
  email: "arideepkanshabanik@gmail.com",
  socials: [
    { name: "GitHub", url: "https://github.com/ArideepCodes", user: "ArideepCodes" },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/arideep-kanshabanik", user: "arideep-kanshabanik" },
    { name: "Facebook", url: "https://www.facebook.com/arideep.kanshabanik.1", user: "arideep.kanshabanik.1" },
    { name: "Instagram", url: "https://instagram.com/greenflaghunyaar", user: "greenflaghunyaar" },
    { name: "Snapchat", user: "nightmode.crash" },
    { name: "Telegram", url: "https://t.me/Arideep_Kanshabanik", user: "@Arideep_Kanshabanik" },
    { name: "PayPal", url: "https://www.paypal.me/ArideepKanshabanik", user: "ArideepKanshabanik" }
  ]
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800/50 text-gray-400 mt-6 py-8">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-xl font-semibold text-white mb-2">{owner.name}</h3>
        <a href={`mailto:${owner.email}`} className="text-purple-400 hover:text-purple-300 transition-colors duration-200">
          {owner.email}
        </a>
        <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 my-4">
          {owner.socials.map(social => (
            social.url ? (
              <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors duration-200">
                {social.name}
              </a>
            ) : (
              <span key={social.name}>{social.name}: {social.user}</span>
            )
          ))}
        </div>
        <p className="text-sm">&copy; {new Date().getFullYear()} - All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
