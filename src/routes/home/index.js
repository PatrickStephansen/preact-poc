import { h } from 'preact';
import style from './style';
import { EffectTest } from '../../components/effect-test';

const Home = () => (
	<div class={style.home}>
		<h1>Home</h1>
		<p>This is the Home component.</p>
		<EffectTest/>
	</div>
);

export default Home;
