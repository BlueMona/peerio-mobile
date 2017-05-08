const EN = process.env.EXECUTABLE_NAME || 'peeriomobile';
console.log(`Branding ${EN}`);

const brandingDefines = {
    name: EN,
    peeriomobile: {
        bg: '#2C95CF',
        tabsBg: '#f7f7f7',
        tabsFg: '#757575',
        logo: require('../assets/peerio-logo-white.png')
    },
    expandoo: {
        bg: '#009dfd',
        tabsBg: '#f7f7f7',
        tabsFg: '#757575',
        logo: require('../assets/expandoo-logo-white.png')
    }
};

const branding = brandingDefines[EN];
branding.name = EN;

export default branding;
