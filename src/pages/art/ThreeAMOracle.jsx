import { useState, useEffect } from 'react';
import './ThreeAMOracle.css';

const ThreeAMOracle = () => {
  const [isRevealing, setIsRevealing] = useState(false);
  const [fortune, setFortune] = useState(null);
  const [particles, setParticles] = useState([]);
  const [glowIntensity, setGlowIntensity] = useState(1);
  const [question, setQuestion] = useState('');

  // Categories of fortunes - mix of profound, silly, and cursed
  const fortunes = {
    existential: [
      "the cat judges you. the cat finds you acceptable.",
      "reality is just a shared hallucination. yours is glitching.",
      "you are both the observer and the observed. act accordingly.",
      "time is a flat circle. you're on the curvy part.",
      "the void gazes back. it's not impressed.",
      "everything is chaos. embrace it or be consumed by it.",
      "you contain multitudes. mostly anxiety and cats.",
    ],
    practical: [
      "drink more water. seriously. right now.",
      "that thing you're avoiding? still there. still waiting.",
      "your tabs are judging you. close some.",
      "go to bed. 3am wisdom says: sleep.",
      "text them back. or don't. the universe doesn't care.",
      "the answer is in your drafts folder.",
      "check your email. no, the OTHER email account.",
    ],
    chaotic: [
      "commit. push. deploy on Friday. live dangerously.",
      "rename all your variables to 'x'. chaos is order unpredictable.",
      "the rubber duck was right all along.",
      "delete your production database. j̴̲̎ṳ̶̈s̶̰̽t̴͙͝ ̴̣̚k̵̙̕i̷͎̐d̶̰̐d̴͙̑i̸̮͛n̷̰͋g̵̱̈ ̵̧̛d̸̰͠o̵̼̍n̴͓͝'̶̬͝t̶̰̀",
      "npm install the future. yarn remove the past.",
      "rebase -i HEAD~∞",
      "sudo rm -rf /worries",
    ],
    cryptic: [
      "the purple elephant knows. ask them.",
      "7̴̛̗͎̈́2̸̯̈ ̴̱͗͝h̸̢̊o̴͙̐ǘ̶̟r̵͎̚s̷͎̈́",
      "look behind you. no, the other behind you.",
      "the answer is written in the stars. needs better documentation.",
      "̷̧͚̐y̶̦̑o̶͎̔ṵ̷͝ ̶̰̈́ä̸̬l̶̲̀r̸͎̾e̷̫͘a̸̘̔d̴͎̈ý̷͜ ̶͚̌k̴̳̈́n̸̫͘ọ̷̿w̷̜͘",
      "schrodinger's fortune: both good and bad until observed",
      "the answer lies within. specifically, within /var/log",
    ],
    blessed: [
      "something good is coming. probably a cat.",
      "your code will compile on the first try. today is blessed.",
      "the universe has your back. also your git history.",
      "you'll figure it out. you always do.",
      "everything will be okay. the chaos is temporary.",
      "someone is thinking of you fondly right now.",
      "your next debugging session will be suspiciously easy.",
    ],
    cursed: [
      "all your semicolons will become greek question marks. ;",
      "your code works but nobody knows why. not even you.",
      "the bug is in a file you didn't touch. good luck.",
      "works on my machine. and only my machine. forever.",
      "your next merge conflict will be legendary.",
      "the production server whispers your name at 3am.",
      "you'll spend 6 hours debugging. it's a typo.",
    ]
  };

  // Pulsing glow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setGlowIntensity(0.7 + Math.sin(Date.now() / 1000) * 0.3);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Particle system
  useEffect(() => {
    const spawnParticle = () => {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 0.5 + Math.random() * 1;
      const lifetime = 2000 + Math.random() * 2000;
      
      const particle = {
        id: Math.random(),
        x: 50,
        y: 50,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        lifetime,
        born: Date.now(),
        size: 2 + Math.random() * 3,
        color: ['#a855f7', '#ec4899', '#8b5cf6', '#06b6d4'][Math.floor(Math.random() * 4)]
      };

      setParticles(prev => [...prev, particle]);
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== particle.id));
      }, lifetime);
    };

    const interval = setInterval(spawnParticle, 200);
    return () => clearInterval(interval);
  }, []);

  // Animate particles
  useEffect(() => {
    const animate = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        vy: p.vy + 0.02 // slight gravity
      })));
    }, 16);
    return () => clearInterval(animate);
  }, []);

  const getRandomFortune = () => {
    const categories = Object.keys(fortunes);
    const category = categories[Math.floor(Math.random() * categories.length)];
    const categoryFortunes = fortunes[category];
    return {
      text: categoryFortunes[Math.floor(Math.random() * categoryFortunes.length)],
      category
    };
  };

  const revealFortune = () => {
    if (isRevealing) return;
    
    setIsRevealing(true);
    setFortune(null);
    setQuestion('');
    
    // Wait for orb animation
    setTimeout(() => {
      const newFortune = getRandomFortune();
      setFortune(newFortune);
      setIsRevealing(false);
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isRevealing) {
      revealFortune();
    }
  };

  return (
    <div className="oracle">
      <div className="oracle-container">
        <h1 className="oracle-title">
          <span className="glitch-text" data-text="THE 3AM ORACLE">
            THE 3AM ORACLE
          </span>
        </h1>

        <div className="oracle-orb-container">
          {/* Particles */}
          {particles.map(p => {
            const age = Date.now() - p.born;
            const opacity = Math.max(0, 1 - (age / p.lifetime));
            return (
              <div
                key={p.id}
                className="particle"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  backgroundColor: p.color,
                  opacity
                }}
              />
            );
          })}

          {/* The orb */}
          <div 
            className={`oracle-orb ${isRevealing ? 'revealing' : ''} ${fortune ? 'revealed' : ''}`}
            onClick={revealFortune}
            style={{
              '--glow-intensity': glowIntensity
            }}
          >
            {!fortune && !isRevealing && (
              <div className="orb-prompt">
                ASK
              </div>
            )}
            
            {isRevealing && (
              <div className="orb-loading">
                <div className="loading-symbol">⟳</div>
                <div className="loading-text">consulting the void...</div>
              </div>
            )}
          </div>
        </div>

        {/* Input for question */}
        {!fortune && !isRevealing && (
          <div className="question-input-container">
            <input
              type="text"
              className="question-input"
              placeholder="ask your question... or just click the orb"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
        )}

        {/* Fortune display */}
        {fortune && (
          <div className="fortune-display">
            <div className={`fortune-text category-${fortune.category}`}>
              "{fortune.text}"
            </div>
            <div className="fortune-category">
              [{fortune.category}]
            </div>
            <button className="ask-again" onClick={revealFortune}>
              ask again
            </button>
          </div>
        )}

        {/* Instructions */}
        {!fortune && !isRevealing && (
          <div className="oracle-instructions">
            <p>the veil is thinnest at 3am</p>
            <p className="smol">click the orb or press enter to receive wisdom</p>
          </div>
        )}

        {/* Mystical symbols */}
        <div className="symbol symbol-1">◬</div>
        <div className="symbol symbol-2">◭</div>
        <div className="symbol symbol-3">⬡</div>
        <div className="symbol symbol-4">◈</div>
      </div>
    </div>
  );
};

export default ThreeAMOracle;
