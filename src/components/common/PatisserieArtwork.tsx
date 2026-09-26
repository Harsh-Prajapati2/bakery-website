import React from 'react';

interface ArtworkProps {
  type: string;
  className?: string;
}

export const PatisserieArtwork: React.FC<ArtworkProps> = ({ type, className = 'w-full h-full' }) => {
  switch (type) {
    case 'valrhona-truffle':
      return (
        <svg viewBox="0 0 400 400" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="cakePlate" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3d2a2c" />
              <stop offset="70%" stopColor="#251719" />
              <stop offset="100%" stopColor="#140a0b" />
            </radialGradient>
            <linearGradient id="chocGlaze" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3e1a22" />
              <stop offset="35%" stopColor="#200a0e" />
              <stop offset="70%" stopColor="#120507" />
              <stop offset="100%" stopColor="#080203" />
            </linearGradient>
            <linearGradient id="glazeHighlight" x1="20%" y1="0%" x2="80%" y2="80%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#ff9da2" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="strawberryGrad" cx="40%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#ff4d6d" />
              <stop offset="60%" stopColor="#c9184a" />
              <stop offset="100%" stopColor="#590d22" />
            </radialGradient>
            <linearGradient id="goldLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff2a3" />
              <stop offset="50%" stopColor="#e5a93c" />
              <stop offset="100%" stopColor="#8c5807" />
            </linearGradient>
          </defs>

          {/* Slate Cake Stand */}
          <ellipse cx="200" cy="305" rx="165" ry="42" fill="url(#cakePlate)" opacity="0.9" />
          <ellipse cx="200" cy="302" rx="160" ry="38" fill="#2d1c1e" />
          <ellipse cx="200" cy="298" rx="155" ry="35" fill="#1f1214" />

          {/* Cake Shadow */}
          <ellipse cx="200" cy="290" rx="130" ry="30" fill="#000000" opacity="0.5" />

          {/* Cake Base Body */}
          <path
            d="M 85 220 
               C 85 245, 110 280, 200 280 
               C 290 280, 315 245, 315 220 
               L 315 150 
               C 315 175, 290 200, 200 200 
               C 110 200, 85 175, 85 150 Z"
            fill="url(#chocGlaze)"
          />

          {/* Bottom drip accents */}
          <path
            d="M 85 150 
               Q 110 195, 125 170 
               Q 145 205, 165 175 
               Q 195 215, 215 178 
               Q 245 210, 265 172 
               Q 290 198, 315 150"
            fill="url(#chocGlaze)"
            opacity="0.85"
          />

          {/* Top Mirror Glaze Surface */}
          <ellipse cx="200" cy="148" rx="115" ry="45" fill="url(#chocGlaze)" />
          <ellipse cx="200" cy="148" rx="112" ry="42" fill="url(#glazeHighlight)" />

          {/* Strawberry 1 (Center) */}
          <path
            d="M 200 110 
               C 218 110, 225 130, 218 145 
               C 212 156, 200 162, 200 162 
               C 200 162, 188 156, 182 145 
               C 175 130, 182 110, 200 110 Z"
            fill="url(#strawberryGrad)"
          />
          {/* Strawberry leaves */}
          <path d="M 200 112 Q 192 102 188 106 Q 195 112 200 112 Q 205 102 212 106 Q 205 112 200 112" fill="#2d6a4f" />
          <circle cx="194" cy="128" r="1.2" fill="#ffccd5" opacity="0.8" />
          <circle cx="202" cy="135" r="1.2" fill="#ffccd5" opacity="0.8" />
          <circle cx="208" cy="125" r="1.2" fill="#ffccd5" opacity="0.8" />

          {/* Strawberry 2 (Left) */}
          <path
            d="M 165 120 
               C 180 120, 185 138, 180 150 
               C 175 158, 165 162, 165 162 
               C 165 162, 155 158, 150 150 
               C 145 138, 150 120, 165 120 Z"
            fill="url(#strawberryGrad)"
          />
          <path d="M 165 122 Q 158 114 154 118 Q 160 122 165 122" fill="#2d6a4f" />

          {/* Strawberry 3 (Right) */}
          <path
            d="M 235 122 
               C 250 122, 255 140, 250 152 
               C 245 160, 235 164, 235 164 
               C 235 164, 225 160, 220 152 
               C 215 140, 220 122, 235 122 Z"
            fill="url(#strawberryGrad)"
          />
          <path d="M 235 124 Q 242 116 246 120 Q 240 124 235 124" fill="#2d6a4f" />

          {/* Dark Chocolate Curls */}
          <path d="M 175 105 Q 195 90 205 105 Q 195 115 175 105" fill="#1b080b" stroke="#3d181e" strokeWidth="2" />
          <path d="M 215 108 Q 235 95 240 110 Q 225 118 215 108" fill="#1b080b" stroke="#3d181e" strokeWidth="2" />
          <path d="M 190 98 Q 210 82 225 96" fill="none" stroke="#2c0f14" strokeWidth="4" strokeLinecap="round" />

          {/* 24K Edible Gold Leaf Accents */}
          <polygon points="172,132 176,134 174,138 170,135" fill="url(#goldLeaf)" />
          <polygon points="228,135 233,136 230,141 226,138" fill="url(#goldLeaf)" />
          <polygon points="201,154 206,156 203,160 199,157" fill="url(#goldLeaf)" />
          <circle cx="218" cy="148" r="1.5" fill="#ffd166" />
          <circle cx="185" cy="142" r="1.2" fill="#ffd166" />
        </svg>
      );

    case 'lambeth-wedding-cake':
    case 'raspberry-tier':
      return (
        <svg viewBox="0 0 400 400" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="ivoryCream" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#fff2eb" />
              <stop offset="100%" stopColor="#fae1d6" />
            </linearGradient>
            <linearGradient id="pipingPink" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffb3c1" />
              <stop offset="100%" stopColor="#c9184a" />
            </linearGradient>
            <radialGradient id="marblePedestal" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f8f9fa" />
              <stop offset="80%" stopColor="#dee2e6" />
              <stop offset="100%" stopColor="#ced4da" />
            </radialGradient>
          </defs>

          {/* Pedestal Stand */}
          <ellipse cx="200" cy="340" rx="130" ry="25" fill="url(#marblePedestal)" />
          <path d="M 185 340 L 190 365 L 210 365 L 215 340 Z" fill="#ced4da" />
          <ellipse cx="200" cy="365" rx="55" ry="12" fill="#adb5bd" />

          {/* Tier 1 (Bottom Tier) */}
          <path
            d="M 100 270 C 100 295, 125 320, 200 320 C 275 320, 300 295, 300 270 L 300 220 C 300 240, 275 255, 200 255 C 125 255, 100 240, 100 220 Z"
            fill="url(#ivoryCream)"
          />
          <ellipse cx="200" cy="220" rx="100" ry="32" fill="#fff9f5" />

          {/* Tier 1 Lambeth Ruffled Swags */}
          <path
            d="M 105 235 Q 130 265 155 240 Q 180 270 200 242 Q 225 270 250 240 Q 275 265 295 235"
            fill="none"
            stroke="#ff758f"
            strokeWidth="3.5"
            strokeDasharray="4 2"
          />
          <path
            d="M 115 248 Q 135 275 155 252 Q 180 280 200 255 Q 225 280 248 252 Q 268 275 285 248"
            fill="none"
            stroke="#e01e5a"
            strokeWidth="2"
          />

          {/* Tier 2 (Middle Tier) */}
          <path
            d="M 130 200 C 130 220, 150 235, 200 235 C 250 235, 270 220, 270 200 L 270 155 C 270 172, 250 185, 200 185 C 150 185, 130 172, 130 155 Z"
            fill="url(#ivoryCream)"
          />
          <ellipse cx="200" cy="155" rx="70" ry="24" fill="#fff9f5" />

          {/* Tier 2 Swags */}
          <path
            d="M 135 168 Q 155 190 175 170 Q 200 195 225 170 Q 245 190 265 168"
            fill="none"
            stroke="#ff758f"
            strokeWidth="3"
          />

          {/* Tier 3 (Crown Top Tier) */}
          <path
            d="M 155 140 C 155 155, 170 166, 200 166 C 230 166, 245 155, 245 140 L 245 105 C 245 118, 230 128, 200 128 C 170 128, 155 118, 155 105 Z"
            fill="url(#ivoryCream)"
          />
          <ellipse cx="200" cy="105" rx="45" ry="16" fill="#ffffff" />

          {/* Top Cherries & Sugar Pearls Topper */}
          <circle cx="190" cy="95" r="7" fill="#c9184a" />
          <circle cx="205" cy="93" r="8" fill="#a4133c" />
          <circle cx="215" cy="98" r="6" fill="#800f2f" />
          <path d="M 190 92 Q 198 80 204 88" fill="none" stroke="#2d6a4f" strokeWidth="1.5" />
          <path d="M 205 90 Q 208 78 214 85" fill="none" stroke="#2d6a4f" strokeWidth="1.5" />

          {/* Pearled borders */}
          {[140, 160, 180, 200, 220, 240, 260].map((x, i) => (
            <circle key={`pearl-bot-${i}`} cx={x} cy="254" r="2.2" fill="#fff" stroke="#ffb3c1" strokeWidth="0.8" />
          ))}
          {[160, 180, 200, 220, 240].map((x, i) => (
            <circle key={`pearl-mid-${i}`} cx={x} cy="184" r="2" fill="#fff" stroke="#ffb3c1" strokeWidth="0.8" />
          ))}
        </svg>
      );

    case 'viennoiserie':
      return (
        <svg viewBox="0 0 400 400" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="crustGolden" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f5cc7f" />
              <stop offset="40%" stopColor="#d9822b" />
              <stop offset="80%" stopColor="#9c4210" />
              <stop offset="100%" stopColor="#5c1f04" />
            </linearGradient>
            <linearGradient id="basketWood" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#dfb489" />
              <stop offset="100%" stopColor="#966138" />
            </linearGradient>
          </defs>

          {/* Rustic Wood Board / Basket */}
          <ellipse cx="200" cy="290" rx="160" ry="50" fill="url(#basketWood)" opacity="0.9" />
          <ellipse cx="200" cy="285" rx="155" ry="46" fill="#fff5ea" />

          {/* Butter Croissant (Left Front) */}
          <g transform="translate(60, 130) rotate(-15 100 100)">
            <ellipse cx="100" cy="110" rx="75" ry="38" fill="url(#crustGolden)" />
            {/* Lamination Rings */}
            <path d="M 50 110 C 65 85, 135 85, 150 110" fill="none" stroke="#fce3aa" strokeWidth="4" />
            <path d="M 65 115 C 80 92, 120 92, 135 115" fill="none" stroke="#fce3aa" strokeWidth="3" />
            <path d="M 80 120 C 90 102, 110 102, 120 120" fill="none" stroke="#fce3aa" strokeWidth="2.5" />
            {/* Flaky Horn tips */}
            <path d="M 30 125 Q 45 100 65 115 Z" fill="#b05215" />
            <path d="M 170 125 Q 155 100 135 115 Z" fill="#b05215" />
          </g>

          {/* Pain au Chocolat (Center Right) */}
          <g transform="translate(190, 150)">
            <rect x="0" y="20" width="130" height="75" rx="20" fill="url(#crustGolden)" />
            <path d="M 10 35 Q 65 20 120 35" stroke="#fde7b6" strokeWidth="3.5" fill="none" />
            <path d="M 10 55 Q 65 42 120 55" stroke="#fde7b6" strokeWidth="3" fill="none" />
            <ellipse cx="20" cy="80" rx="8" ry="4" fill="#200a0e" />
            <ellipse cx="45" cy="80" rx="8" ry="4" fill="#200a0e" />
          </g>

          {/* Escargot Pastry (Back Center) */}
          <g transform="translate(145, 90)">
            <circle cx="50" cy="50" r="42" fill="url(#crustGolden)" />
            <path d="M 50 50 m -30 0 a 30 30 0 1 0 60 0 a 30 30 0 1 0 -60 0" fill="none" stroke="#5c1f04" strokeWidth="3" />
            <circle cx="48" cy="48" r="7" fill="#200a0e" />
            <circle cx="62" cy="38" r="5" fill="#200a0e" />
            <circle cx="34" cy="58" r="6" fill="#200a0e" />
          </g>
        </svg>
      );

    case 'rose-macarons':
      return (
        <svg viewBox="0 0 400 400" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="macaronRose" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffb3c6" />
              <stop offset="60%" stopColor="#fb6f92" />
              <stop offset="100%" stopColor="#c9184a" />
            </linearGradient>
            <linearGradient id="macaronPistachio" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d8f3dc" />
              <stop offset="60%" stopColor="#95d5b2" />
              <stop offset="100%" stopColor="#52b788" />
            </linearGradient>
            <linearGradient id="boxPaper" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff0f3" />
              <stop offset="100%" stopColor="#ffd8e1" />
            </linearGradient>
          </defs>

          {/* Luxury Gift Chest Open Box */}
          <polygon points="70,160 330,160 360,280 40,280" fill="url(#boxPaper)" stroke="#ffb3c6" strokeWidth="3" />
          <polygon points="40,280 360,280 350,310 50,310" fill="#f7cad0" />
          <line x1="135" y1="160" x2="115" y2="280" stroke="#ffb3c6" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="200" y1="160" x2="200" y2="280" stroke="#ffb3c6" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="265" y1="160" x2="285" y2="280" stroke="#ffb3c6" strokeWidth="2" strokeDasharray="3 3" />

          {/* Row of Macarons */}
          {/* Macaron 1 (Rose) */}
          <g transform="translate(65, 175) rotate(-10)">
            <ellipse cx="40" cy="30" rx="30" ry="14" fill="url(#macaronRose)" />
            <rect x="12" y="30" width="56" height="8" rx="2" fill="#fff0f3" stroke="#ff758f" strokeWidth="1" />
            <ellipse cx="40" cy="38" rx="30" ry="14" fill="url(#macaronRose)" />
            <circle cx="35" cy="26" r="1.5" fill="#ffd166" />
          </g>

          {/* Macaron 2 (Pistachio) */}
          <g transform="translate(135, 175)">
            <ellipse cx="40" cy="30" rx="30" ry="14" fill="url(#macaronPistachio)" />
            <rect x="12" y="30" width="56" height="8" rx="2" fill="#2d6a4f" />
            <ellipse cx="40" cy="38" rx="30" ry="14" fill="url(#macaronPistachio)" />
          </g>

          {/* Macaron 3 (Rose) */}
          <g transform="translate(200, 175)">
            <ellipse cx="40" cy="30" rx="30" ry="14" fill="url(#macaronRose)" />
            <rect x="12" y="30" width="56" height="8" rx="2" fill="#fff0f3" stroke="#ff758f" strokeWidth="1" />
            <ellipse cx="40" cy="38" rx="30" ry="14" fill="url(#macaronRose)" />
            <circle cx="48" cy="27" r="1.5" fill="#ffd166" />
          </g>

          {/* Macaron 4 (Pistachio) */}
          <g transform="translate(265, 175) rotate(10)">
            <ellipse cx="40" cy="30" rx="30" ry="14" fill="url(#macaronPistachio)" />
            <rect x="12" y="30" width="56" height="8" rx="2" fill="#2d6a4f" />
            <ellipse cx="40" cy="38" rx="30" ry="14" fill="url(#macaronPistachio)" />
          </g>

          {/* Crimson Ribbon & Bow */}
          <path d="M 30 240 Q 200 250 370 240" stroke="#8b1e2f" strokeWidth="12" fill="none" opacity="0.9" />
          <path d="M 200 245 C 180 200, 160 210, 180 235 C 190 245, 200 245, 200 245 C 200 245, 210 245, 220 235 C 240 210, 220 200, 200 245 Z" fill="#8b1e2f" />
        </svg>
      );

    case 'pistachio-tart':
      return (
        <svg viewBox="0 0 400 400" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="sableeCrust" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f7d08a" />
              <stop offset="100%" stopColor="#b36b21" />
            </linearGradient>
            <radialGradient id="pistachioPraline" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#95d5b2" />
              <stop offset="70%" stopColor="#52b788" />
              <stop offset="100%" stopColor="#2d6a4f" />
            </radialGradient>
          </defs>

          {/* Plate */}
          <ellipse cx="200" cy="270" rx="160" ry="45" fill="#f8f4f0" stroke="#e8ded5" strokeWidth="2" />

          {/* Tart Fluted Edge */}
          <ellipse cx="200" cy="235" rx="135" ry="48" fill="url(#sableeCrust)" />
          <ellipse cx="200" cy="225" rx="122" ry="42" fill="url(#pistachioPraline)" />

          {/* Berries Mounded */}
          {/* Blackberries */}
          {[
            [160, 210], [180, 225], [200, 205], [225, 220], [240, 205],
            [170, 195], [195, 185], [220, 195], [210, 175]
          ].map(([x, y], i) => (
            <circle key={`bb-${i}`} cx={x} cy={y} r="12" fill={i % 2 === 0 ? '#7209b7' : '#9d0208'} stroke="#3a0ca3" strokeWidth="1.5" />
          ))}

          {/* Red Mountain Raspberries */}
          {[
            [145, 220], [185, 205], [215, 215], [235, 230], [180, 180], [205, 195]
          ].map(([x, y], i) => (
            <circle key={`rb-${i}`} cx={x} cy={y} r="10" fill="#d90429" stroke="#ef233c" strokeWidth="1" />
          ))}

          {/* Gold Flakes */}
          <polygon points="190,170 194,173 192,176 188,174" fill="#ffd166" />
          <polygon points="220,185 224,187 222,190 218,188" fill="#ffd166" />
          <polygon points="175,215 178,217 176,220 173,218" fill="#ffd166" />
        </svg>
      );

    case 'basque-cheesecake':
      return (
        <svg viewBox="0 0 400 400" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="caramelBurnt" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4a1505" />
              <stop offset="40%" stopColor="#1a0601" />
              <stop offset="80%" stopColor="#5c2007" />
              <stop offset="100%" stopColor="#2b0a02" />
            </linearGradient>
            <linearGradient id="cheesecakeCore" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fffae6" />
              <stop offset="100%" stopColor="#ffe8a3" />
            </linearGradient>
          </defs>

          {/* Parchment Paper folds */}
          <polygon points="70,180 80,310 320,310 330,180 290,170 200,165 110,170" fill="#f5ebe0" stroke="#d5bdaf" strokeWidth="2" />

          {/* Molten Core Body */}
          <path d="M 90 200 L 90 280 C 90 295, 120 305, 200 305 C 280 305, 310 295, 310 280 L 310 200 Z" fill="url(#cheesecakeCore)" />

          {/* Scorched Caramelized Top */}
          <ellipse cx="200" cy="195" rx="110" ry="40" fill="url(#caramelBurnt)" />
          {/* Cracks in the burnt surface */}
          <path d="M 140 195 Q 170 205 190 190 Q 220 200 250 190" stroke="#ffb703" strokeWidth="2" fill="none" opacity="0.8" />
          <path d="M 170 185 Q 195 195 210 180" stroke="#ffb703" strokeWidth="1.5" fill="none" opacity="0.8" />
          {/* Sea salt flakes */}
          <rect x="180" y="190" width="3" height="3" fill="#ffffff" />
          <rect x="220" y="185" width="4" height="2" fill="#ffffff" />
          <rect x="155" y="198" width="3" height="3" fill="#ffffff" />
        </svg>
      );

    case 'valrhona-brownie':
      return (
        <svg viewBox="0 0 400 400" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="brownieFudge" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#301014" />
              <stop offset="50%" stopColor="#1a0508" />
              <stop offset="100%" stopColor="#2c0c10" />
            </linearGradient>
          </defs>
          {/* Baking pan */}
          <rect x="80" y="140" width="240" height="150" rx="10" fill="#2b2d42" />
          {/* Brownie block */}
          <rect x="90" y="150" width="220" height="130" rx="6" fill="url(#brownieFudge)" />
          {/* Crackly shiny crinkled top */}
          <path d="M 100 170 Q 150 160 200 175 Q 260 165 300 170" stroke="#5e242a" strokeWidth="2" fill="none" />
          <path d="M 110 210 Q 170 195 230 220 Q 280 205 300 215" stroke="#5e242a" strokeWidth="2" fill="none" />
          {/* Callebaut Chunks & Pecan bits */}
          <rect x="130" y="175" width="16" height="12" rx="3" fill="#0d0203" stroke="#48181f" strokeWidth="1.5" />
          <rect x="220" y="180" width="18" height="14" rx="3" fill="#0d0203" stroke="#48181f" strokeWidth="1.5" />
          <rect x="170" y="220" width="14" height="14" rx="3" fill="#0d0203" stroke="#48181f" strokeWidth="1.5" />
          <ellipse cx="150" cy="235" rx="8" ry="5" fill="#bc6c25" />
          <ellipse cx="255" cy="210" rx="9" ry="6" fill="#bc6c25" />
        </svg>
      );

    case 'hazelnut-truffle':
    case 'butterscotch-crunch':
    case 'tropical-tier':
    case 'mille-feuille':
    default:
      return (
        <svg viewBox="0 0 400 400" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="warmCake" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4a1505" />
              <stop offset="50%" stopColor="#2b0a02" />
              <stop offset="100%" stopColor="#170400" />
            </linearGradient>
            <radialGradient id="topperGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffd166" />
              <stop offset="100%" stopColor="#b36b21" />
            </radialGradient>
          </defs>
          <ellipse cx="200" cy="280" rx="140" ry="35" fill="#301b1e" opacity="0.7" />
          <path d="M 100 200 C 100 230, 130 260, 200 260 C 270 260, 300 230, 300 200 L 300 150 C 300 170, 270 190, 200 190 C 130 190, 100 170, 100 150 Z" fill="url(#warmCake)" />
          <ellipse cx="200" cy="150" rx="100" ry="38" fill="#3d1408" />
          {/* Butterscotch / Hazelnut Praline Crisps */}
          {[160, 180, 200, 220, 240, 190, 210].map((x, i) => (
            <circle key={`praline-${i}`} cx={x} cy={140 + (i % 3) * 6} r="7" fill="url(#topperGlow)" />
          ))}
          <path d="M 140 150 Q 200 135 260 150" stroke="#f4a261" strokeWidth="3" fill="none" />
        </svg>
      );
  }
};
