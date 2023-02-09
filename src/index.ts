import './style/style.css';
import AppInitializer from './app/appInit';

const SlayTheSpireClone = new AppInitializer();

SlayTheSpireClone.start().catch((err) => {
  console.log(err);
});
