// @ts-ignore
import renderMagicBoxShell from '@devhub/magicbox-shell';
import '@devhub/magicbox-shell/dist/style.css';

const setup = () => {
  console.log('setup hit');
  renderMagicBoxShell({});
};

setup();
