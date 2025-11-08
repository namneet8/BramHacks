export const heroOptions = {
  autoPlay: true,

  fullScreen: {
    enable: false,
    zIndex: 0,
  },

  detectRetina: true,
  fpsLimit: 120,

  interactivity: {
    detectsOn: '#hero',
    events: {
      onDiv: [
        {
          selectors: '#repulse-div',
          enable: true,
          mode: 'bounce',
          type: 'circle',
        },
        {
          selectors: '#repulse-div',
          enable: true,
          mode: 'repulse',
          type: 'circle',
        },
        {
          selectors: '#repulse-span',
          enable: true,
          mode: 'repulse',
          type: 'circle',
        },
        {
          selectors: '#repulse-span',
          enable: true,
          mode: 'bounce',
          type: 'circle',
        },
        {
          selectors: '#togglebutton',
          enable: true,
          mode: 'repulse',
          type: 'circle',
        },
        {
          selectors: '#togglebutton',
          enable: true,
          mode: 'bounce',
          type: 'circle',
        },
        {
          selectors: '#scroller',
          enable: true,
          mode: 'repulse',
          type: 'circle',
        },
        {
          selectors: '#scroller',
          enable: true,
          mode: 'bounce',
          type: 'circle',
        },
      ],

      onHover: {
        enable: true,
        mode: 'bubble',
        parallax: {
          enable: true,
          force: 350,
          smooth: 20,
        },
      },
      resize: {
        delay: 0.5,
        enable: true,
      },
    },

    modes: {
      bounce: {
        distance: 100,
      },
      bubble: {
        distance: 120,
        duration: 0.4,
        size: 8,
        color: {
          value: ['#ffffff', '#a8d8ff', '#ffd700'],
        },
        opacity: 1,
        mix: false,
      },

      repulse: {
        distance: 190,
        factor: 200,
        speed: 1,
        maxSpeed: 50,
      },
    },
  },

  particles: {
    collisions: {
      enable: true,
      mode: 'bounce',
    },
    color: {
      value: ['#ffffff', '#e8f4ff', '#fff9e6'],
    },
    move: {
      angle: {
        offset: 0,
        value: 50,
      },
      center: {
        x: 50,
        y: 50,
        mode: 'percent',
        radius: 0
      },
      direction: ['top-left', 'bottom-left', 'bottom-right', 'top-right'],
      drift: 0,
      enable: true,
      random: true,
      size: false,
      speed: { min: 0.1, max: 0.5 },
      outMode: 'bounce',
      radius: -10
    },
    number: {
      limit: 0,
      value: 120,
    },

    opacity: {
      random: {
        enable: true,
        minimumValue: 0.2,
        maxValue: 1,
      },
      value: 0.8,
      animation: {
        count: 0,
        enable: true,
        speed: 1,
        decay: 0,
        sync: false,
        destroy: 'none',
        startValue: 'random',
        minimumValue: 0.2,
        maxValue: 1,
      },
    },

    shape: {
      type: ['circle', 'star'],
      star: {
        sides: 5,
      },
    },

    size: {
      random: {
        enable: true,
        minimumValue: 1,
        maxValue: 4,
      },
      value: 2,
      animation: {
        count: 0,
        enable: true,
        speed: 3,
        decay: 0,
        sync: false,
        destroy: 'none',
        startValue: 'random',
        minimumValue: 0.5,
        maxValue: 5,
      },
    },

    stroke: {
      width: 0,
    },

    lineLinked: {
      enable: false,
    },
  },

  emitters: {
    direction: 'bottom-right',
    rate: {
      quantity: 1,
      delay: 3,
    },
    size: {
      width: 0,
      height: 0,
    },
    position: {
      x: { random: { enable: true, minimumValue: 0 }, value: 50 },
      y: 0,
    },
    particles: {
      color: {
        value: '#ffffff',
      },
      shape: {
        type: 'circle',
      },
      size: {
        value: 5,
      },
      opacity: {
        value: 1,
      },
      life: {
        duration: {
          value: 3,
        },
        count: 1,
      },
      move: {
        enable: true,
        gravity: {
          enable: false,
        },
        speed: 40,
        direction: 'bottom-right',
        straight: true,
        outModes: {
          default: 'destroy',
        },
      },
      trail: {
        enable: true,
        length: 30,
        fill: {
          color: {
            value: '#000000',
          },
        },
      },
      destroy: {
        mode: 'none',
      },
    },
  },

  pauseOnBlur: true,
  pauseOnOutsideViewport: true,
  smooth: true,
};