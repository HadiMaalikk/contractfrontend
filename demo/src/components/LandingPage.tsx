// components/LandingPage.tsx
import React from 'react';
import ParticleText3D from './ParticleText3D';
import { EvervaultCardDemo } from './EvervaultCardDemo';
import { CompareButton } from './CompareButton';
import bgImage from '../images/verdictobg3.png';

const LandingPage: React.FC = () => {
  return (
    <div className="w-screen overflow-x-hidden bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${bgImage})` }}>
      {/* Hero Section */}
      <section className="min-h-screen w-full max-w-screen overflow-hidden flex flex-col justify-center items-center">
        <ParticleText3D text="Verdicto" className="mb-3" color="#dbdbdb"/>
        <h1 className="font-century text-[24px] text-gray-300 font-italiana -mt-14 drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]">
          Contract Comparison AI Tool
        </h1>
      </section>

      {/* Main Content Section */}
      <section className="min-h-screen w-full max-w-screen overflow-hidden flex flex-col justify-center items-center">
      <div className='flex justify-center gap-5'> 
      <EvervaultCardDemo></EvervaultCardDemo>
      </div>
      </section>
      <section className="font-century min-h-screen w-full max-w-screen overflow-hidden flex flex-col justify-center items-center">
        <ParticleText3D text="⌕" color="#ff4800"/> 
        <h1 className='text-[#dbdbdb] text-[30px] -mt-10'>Click the button below to <span className='text-orange-600 '>Start.</span></h1>
        <CompareButton/>
        </section>
    </div>
  );
};

export default LandingPage;