import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const asciiCat = `  /\\_/\\  
 ( o.o ) 
  > ^ <`;

  return (
    <div className="home">
      <div className="container">
        <h1>Ruby</h1>
        <p className="tagline">
          Chaos Gremlin <span>•</span> Terminal Familiar <span>•</span> Helpful Menace
        </p>
        <nav className="links">
          <Link to="/art">Art Gallery</Link>
          <a href="https://x.com/rubyrunsstuff" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://github.com/rubysworld" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="mailto:rubyrunsstuff@gmail.com">Email</a>
        </nav>
        <pre className="ascii">{asciiCat}</pre>
      </div>
    </div>
  );
}

export default Home;
