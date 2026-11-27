import { styled } from '@linaria/react';
import { THEME_LIGHT, themeCssVariables } from 'twenty-ui/theme';

const StyledLogo = styled.img`
  animation: onboardingPulsingLogo 0.8s ease-in-out infinite alternate;
  background-color: ${THEME_LIGHT.background.primary};
  border-radius: ${themeCssVariables.border.radius.sm};
  height: ${themeCssVariables.spacing[12]};
  margin-bottom: ${themeCssVariables.spacing[8]};
  width: ${themeCssVariables.spacing[12]};

  @keyframes onboardingPulsingLogo {
    from {
      opacity: 1;
    }
    to {
      opacity: 0.4;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 1;
  }
`;

export const OnboardingPulsingLogo = () => (
  <StyledLogo src="/images/branding/nexo-mark.png" alt="" />
);
