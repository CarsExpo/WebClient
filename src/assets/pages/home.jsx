import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import logo1 from '../img/notebook.svg'
import logo2 from '../img/car.svg'
import logo3 from '../img/expo.svg'

const Home = () => {
  const [openBoxes, setOpenBoxes] = useState({});

  const handleClick = boxId => {
    setOpenBoxes(prev => ({
      ...prev,
      [boxId]: !prev[boxId]
    }));
  };
  return (
    <main className='home' id="acceuil">
      <div className="hero">
        <div className="glass">
          <h1>CarsExpo</h1>
          <p>Découvrez l'histoire en accéléré dans notre musée des automobiles d'exception!</p>
          <button><a href='#'><FontAwesomeIcon icon={faDiscord} /></a></button>
        </div>
      </div>
      <section className='first-section' id='qui-sommes-nous' >
        <div className="container slide-in">
          <div className="title">
            <h2>Qui sommes-nous ?</h2>
            <div className="underline"></div>
          </div>
          <div className="text">
            <p>1. Nous sommes le Musée de l'Automobile, dédié à l'histoire et l'exposition de l'automobile.</p>
            <p>2. Notre collection variée raconte l'évolution de l'industrie automobile.</p>
            <p>3. Nous sommes passionnés par la préservation et le partage de ce riche héritage.</p>
          </div>
        </div>
      </section>
      <section className='second-section' id='pourquoi-nous-rejoindre' >
        <div className="slide-in">
          <h2 className='title'>Pourquoi-nous choisir?</h2>
          <div className="container">
            <div className="box history">
              <div className="header">
                <img src={logo1} alt="Histoire" />
                <h2>Notre histoire</h2>
                <div className="underline"></div>
              </div>
              <div className="body">
                <p>
                  Notre musée a été fondé dans le but de préserver et de partager la riche histoire de l'automobile.
                  Nous présentons une collection variée de véhicules qui racontent l'évolution de l'industrie automobile.
                  Nos expositions retracent l'histoire de l'automobile, des premiers modèles à vapeur aux voitures électriques d'aujourd'hui.
                </p>
              </div>
            </div>
            <div className="box cars">
              <div className="header">
                <img src={logo2} alt="Véhicules" />
                <h2>Nos véhicules</h2>
                <div className="underlines"></div>
              </div>
              <div className="body">
                <p>
                  Notre collection comprend une sélection impressionnante de véhicules historiques.
                  Nous avons des voitures de toutes les époques, y compris des voitures à vapeur, des voitures à moteur à combustion interne, des voitures de sport classiques, et même des voitures électriques modernes.
                  Chacune de nos voitures a une histoire unique à raconter.
                </p>
              </div>
            </div>
            <div className="box expo">
              <div className="header">
                <img src={logo3} alt="Expositions" />
                <h2>Nos expositions</h2>
                <div className="underlines"></div>
              </div>
              <div className="body">
                <p>
                  Nos expositions sont conçues pour informer, éduquer et inspirer.
                  Chaque exposition offre aux visiteurs une perspective unique sur l'histoire de l'automobile.
                  Que vous soyez un passionné de voitures classiques, un passionné de technologie automobile ou simplement intéressé par l'histoire, il y a quelque chose pour tout le monde au Musée de l'Automobile.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className='thrid-section' id='faq' >
        <div className="slide-in">
          <div className="faq">
            <div className="box">
              <div className="header">
                <h2>Politiques du musée?</h2>
                <div className="icon" onClick={() => handleClick('box1')}>
                  <FontAwesomeIcon icon={openBoxes['box1'] ? faTimes : faPlus} />
                </div>
              </div>
              <div className="body">
                {openBoxes['box1'] &&
                  <div className="respons">
                    <p>Nous avons une politique assez simple.</p>
                    <p>Nous acceptons pas les objets et produit illicites sur le lieux.</p>
                    <p>Puis nous pensons que le respect est primordiale sur le lieux.</p>
                    <p>Toute forme de non respect seras sanctionné.</p>
                  </div>
                }
              </div>
            </div>
            <div className="box">
              <div className="header">
                <h2>Les partenariats?</h2>
                <div className="icon" onClick={() => handleClick('box2')}>
                  <FontAwesomeIcon icon={openBoxes['box2'] ? faTimes : faPlus} />
                </div>
              </div>
              <div className="body">
                {openBoxes['box2'] &&
                  <div className="respons">
                    <p>Vous voulez faire un partenariat avec nous?</p>
                    <p>C'est très simple il suffit d'ouvrir un ticket sur notre discord.</p>
                    <p>Nous prenons que les entreprise concernant l'automobile.</p>
                  </div>
                }
              </div>
            </div>
            <div className="box">
              <div className="header">
                <h2>Exposé mon véhicule?</h2>
                <div className="icon" onClick={() => handleClick('box3')}>
                  <FontAwesomeIcon icon={openBoxes['box3'] ? faTimes : faPlus} />
                </div>
              </div>
              <div className="body">
                {openBoxes['box3'] &&
                  <div className="respons">
                    <p>Vous voulez montré votre bijoux en publique? c'est possible!</p>
                    <p>Une seul chose est obligatoire un mot de la Dir,pour attester qu'il est a vous!</p>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;