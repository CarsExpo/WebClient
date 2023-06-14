import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiscord } from '@fortawesome/free-brands-svg-icons';

const Home = () => {
  return (
    <main className='home'>
      <div className="hero">
        <div className="glass">
            <h1>CarsExpo</h1>
            <p>Découvrez l'histoire en accéléré dans notre musée des automobiles d'exception!</p>
            <button><a href='#'><FontAwesomeIcon icon={faDiscord} /></a></button>
        </div>
      </div>
      <div className="section">
      </div>
    </main>
  );
}

export default Home;