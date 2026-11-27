import { Img } from 'react-email';

import { getNexoMarkUrl } from 'src/constants/DefaultWorkspaceLogo';

const logoStyle = {
  marginBottom: '40px',
};

export const Logo = () => {
  return (
    <Img
      src={getNexoMarkUrl()}
      alt="Nexo"
      width="40"
      height="40"
      style={logoStyle}
    />
  );
};
