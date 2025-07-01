const textStylesPlugin = ({ addUtilities }: any) => {
	const textStyles = {
    '.text-h1': {
      fontSize: '48px',
      fontWeight: 600,
    },
    '.title-h1': {
      fontSize: '32px',
      fontWeight: 600,
    },
    '.text-h2': {
      fontSize: '24px',
      fontWeight: 600,
    },
    '.text-body1': {
      fontSize: '20px',
      fontWeight: 600,
    },
    '.text-body2': {
      fontSize: '16px',
      fontWeight: 600,
    },
    '.text-body3': {
      fontSize: '14px',
      fontWeight: 600,
    },
    '.text-body4': {
      fontSize: '12px',
      fontWeight: 400,
    },
    '.text-button': {
      fontSize: '14px',
    },
    '.text-main': {
      fontSize: '15px',
    },
    '.text-title1': {
      fontSize: '19px',
      lineHeight: 'normal',
      fontWeight: 700,
    },
    '.text-title2': {
      fontSize: '22px',
      lineHeight: 'normal',
      fontWeight: 600,
    },
    '.text-title3': {
      fontSize: '25px',
      lineHeight: 'normal',
      fontWeight: 600,
    },
    '.text-subtitle': {
      fontSize: '16px',
    },
  };

	addUtilities(textStyles);
};

export default textStylesPlugin;
