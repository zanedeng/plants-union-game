import GameApp from './game/Game';
import '../scss/app.scss';

/* Your JS Code goes here */
const game = new GameApp(document.getElementById('app'));
game.startup();
