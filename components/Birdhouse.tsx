import React, { useMemo } from 'react';
import { Cork, User } from '../types';

interface BirdhouseProps {
  corks: Cork[];
  goalCorks: number;
}

const userStyles = {
    [User.Markus]: {
        initial: 'M',
        color: 'text-blue-900',
        bg: 'bg-blue-300',
        border: 'border-blue-500'
    },
    [User.Diana]: {
        initial: 'D',
        color: 'text-pink-900',
        bg: 'bg-pink-300',
        border: 'border-pink-500'
    }
};

const Birdhouse: React.FC<BirdhouseProps> = ({ corks, goalCorks }) => {
  const progress = goalCorks > 0 ? Math.min(corks.length / goalCorks, 1) : 0;

  // Stufenweise Animation basierend auf dem Fortschritt
  const wallsProgress = Math.min(progress / 0.6, 1);       // Wände bauen sich bis 60% auf
  const roofProgress = Math.min(Math.max(progress - 0.6, 0) / 0.3, 1);   // Dach von 60% bis 90%
  const perchProgress = Math.min(Math.max(progress - 0.9, 0) / 0.1, 1);  // Stange von 90% bis 100%

  const corkPositions = useMemo(() => {
      const positions = [];
      const containerWidth = 100; // %
      const corkDiameter = 11; // %
      const numCols = Math.floor(containerWidth / corkDiameter);

      for (let i = 0; i < goalCorks; i++) {
          const row = Math.floor(i / numCols);
          const col = i % numCols;
          
          const xJitter = (Math.random() - 0.5) * 3;
          const yJitter = (Math.random() - 0.5) * 3;
          
          const left = col * (corkDiameter - 1) + xJitter + 5;
          const bottom = row * (corkDiameter / 1.8) + yJitter;

          positions.push({
              bottom: `${bottom}%`,
              left: `${left}%`,
          });
      }
      return positions;
  }, [goalCorks]);

  const partTransition = "transition-all duration-1000 ease-in-out";
  const houseWidth = 12; // rem
  const houseDepth = 10; // rem
  const houseHeight = 10; // rem
  const roofAngle = 35; // degrees
  const roofPeakHeight = Math.tan(roofAngle * Math.PI / 180) * (houseWidth / 2); // in rem
  const roofSlopeLength = (houseWidth / 2) / Math.cos(roofAngle * Math.PI / 180); // in rem

  return (
    <div className="w-64 h-80 flex items-center justify-center" style={{ perspective: '1200px' }}>
      <div className="relative" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(-20deg) rotateY(35deg)' }}>
        
        {/* Boden */}
        <div className={`absolute bg-amber-700 origin-bottom ${partTransition}`} style={{ 
            width: `${houseWidth}rem`, 
            height: `${houseDepth}rem`,
            transform: `translateY(${houseHeight/2}rem) rotateX(90deg) scale(${wallsProgress})`,
            opacity: wallsProgress
        }}></div>

        {/* Rückwand */}
        <div className={`absolute bg-amber-500 origin-bottom ${partTransition}`} style={{
            width: `${houseWidth}rem`,
            height: `${houseHeight}rem`,
            transform: `translateZ(-${houseDepth/2}rem) scaleY(${wallsProgress})`
        }}>
            {/* Giebel Rückseite */}
            <div className={`absolute bottom-full left-0 origin-bottom ${partTransition}`} style={{
                width: 0, height: 0,
                borderLeft: `${houseWidth / 2}rem solid transparent`,
                borderRight: `${houseWidth / 2}rem solid transparent`,
                borderBottom: `${roofPeakHeight}rem solid #a16207`, // amber-700
                transform: `scaleY(${wallsProgress})`,
            }}></div>
        </div>
        
        {/* Linke Wand */}
        <div className={`absolute bg-amber-600 origin-bottom ${partTransition}`} style={{
            width: `${houseDepth}rem`,
            height: `${houseHeight}rem`,
            transform: `rotateY(90deg) translateZ(${houseWidth/2}rem) scaleY(${wallsProgress})`
        }}></div>

        {/* Rechte Wand */}
        <div className={`absolute bg-amber-600 origin-bottom ${partTransition}`} style={{
            width: `${houseDepth}rem`,
            height: `${houseHeight}rem`,
            transform: `rotateY(-90deg) translateZ(${houseWidth/2}rem) scaleY(${wallsProgress})`
        }}></div>

        {/* Vorderwand (transparent, um Korken zu sehen) */}
        <div className={`absolute bg-amber-300/60 backdrop-blur-[2px] border-4 border-amber-600 rounded-lg origin-bottom overflow-hidden ${partTransition}`} style={{
            width: `${houseWidth}rem`,
            height: `${houseHeight}rem`,
            transform: `translateZ(${houseDepth/2}rem) scaleY(${wallsProgress})`
        }}>
           {/* Giebel Vorderseite */}
           <div className={`absolute bottom-full left-0 origin-bottom ${partTransition}`} style={{
                width: 0, height: 0,
                borderLeft: `${houseWidth / 2}rem solid transparent`,
                borderRight: `${houseWidth / 2}rem solid transparent`,
                borderBottom: `${roofPeakHeight}rem solid rgba(245, 158, 11, 0.8)`, // amber-500 with opacity
                transform: `scaleY(${wallsProgress})`,
           }}></div>

           {/* Eingangsloch */}
           <div className="absolute top-6 left-1/2 -translate-x-1/2 w-10 h-10 bg-black rounded-full shadow-inner ring-4 ring-amber-600"></div>

           {/* Korken-Container */}
           <div className="absolute inset-0">
             {corks.slice(0, goalCorks).map((cork, index) => {
                 const style = userStyles[cork.user];
                 const position = corkPositions[index];
                 if (!position) return null;
                 return (
                     <div
                         key={cork.id}
                         className={`absolute w-6 h-6 rounded-full flex items-center justify-center font-black text-xs shadow-md transition-opacity duration-500 ${style.bg} ${style.border} border-2`}
                         style={{ ...position, transitionDelay: `${index * 15}ms` }}
                         title={`Hinzugefügt von ${cork.user}`}
                     >
                         <span className={style.color}>{style.initial}</span>
                     </div>
                 );
             })}
           </div>
        </div>

        {/* Dach Links */}
        <div 
            className={`absolute bg-red-700 ${partTransition}`} 
            style={{ 
                width: `${roofSlopeLength + 0.1}rem`, // Leichte Überlappung
                height: `${houseDepth}rem`,
                transform: `translateY(-${houseHeight/2}rem) rotateZ(-${roofAngle}deg) scale(${roofProgress})`,
                transformOrigin: `right center`,
                opacity: roofProgress
            }}
        ></div>
        
        {/* Dach Rechts */}
        <div 
            className={`absolute bg-red-600 ${partTransition}`} 
            style={{ 
                width: `${roofSlopeLength + 0.1}rem`, // Leichte Überlappung
                height: `${houseDepth}rem`,
                transform: `translateY(-${houseHeight/2}rem) rotateZ(${roofAngle}deg) scale(${roofProgress})`,
                transformOrigin: `left center`,
                opacity: roofProgress
            }}
        ></div>

        {/* Anflugstange */}
        <div className={`absolute w-1 h-8 bg-amber-800 rounded-full origin-top ${partTransition}`} style={{ 
            bottom: '2.5rem',
            left: `calc(50% - 2px)`,
            transform: `translateZ(${houseDepth/2 + 0.5}rem) rotateX(-10deg) scaleY(${perchProgress})`,
            opacity: perchProgress 
        }}></div>

      </div>
    </div>
  );
};

export default Birdhouse;
