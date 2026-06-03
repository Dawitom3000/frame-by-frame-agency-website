import About from './components/About.jsx';
import CTA from './components/CTA.jsx';
import Footer from './components/Footer.jsx';
import Hero from './components/Hero.jsx';
import Intro from './components/Intro.jsx';
import Navbar from './components/Navbar.jsx';
import Portfolio from './components/Portfolio.jsx';
import Process from './components/Process.jsx';
import Services from './components/Services.jsx';
import SkillsTools from './components/SkillsTools.jsx';

export default function App() {
  return (
    <div className="min-h-screen overflow-hidden bg-ink text-white">
      <Navbar />
      <main>
        <Hero />
        <Intro />
        <Services />
        <About />
        <Portfolio />
        <Process />
        <SkillsTools />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
