import uniqid from 'uniqid';

const globals = {
  title: 'Bib Game Players',
  menuItems: [
    { uid: uniqid(), text: 'Home', path: '/' },
    { uid: uniqid(), text: 'Lineup', path: '/lineup' },
    { uid: uniqid(), text: 'Weather', path: '/weather' },
    { uid: uniqid(), text: 'Location', path: '/location' },
    { uid: uniqid(), text: 'FAQ', path: '/faq' },
  ],
  responsive: {
    widthThreshold: 800,
  }
};

export default globals;
