/* exported app */
const SOUNDS = [
  { id: 'baba_booey', name: 'Baba Booey' },
  { id: 'bonk', name: 'Doge Bonk' },
  { id: 'boo_womp', name: 'Boo-womp (Spongebob)' },
  { id: 'bruh', name: 'Bruh' },
  { id: 'cash_register', name: 'Cash Register (Kaching)' },
  { id: 'censor_beep', name: 'Censor Beep' },
  { id: 'confetti', name: 'Confetti' },
  { id: 'fart_reverb', name: 'Fart with reverb' },
  { id: 'fart_wet', name: 'Wet Fart' },
  { id: 'gnome', name: 'Gnome' },
  { id: 'huh', name: 'Huh ?' },
  { id: 'mario_coin', name: 'Mario Coin' },
  { id: 'mario_jump', name: 'Mario Jump' },
  { id: 'metal_gear', name: 'Metal Gear Solid' },
  { id: 'microsoft_error', name: 'Windows XP Error' },
  { id: 'minecraft_cave', name: 'Minecraft Cave Ambiance' },
  { id: 'minecraft_door', name: 'Minecraft Door' },
  { id: 'minecraft_eating', name: 'Minecraft Eating' },
  { id: 'minecraft_glass', name: 'Minecraft Glass Break' },
  { id: 'minecraft_hurt', name: 'Minecraft Hurt' },
  { id: 'nope', name: 'Nope' },
  { id: 'quack', name: 'Quack' },
  { id: 'roblox_death', name: 'Roblox Death' },
  { id: 'wilhelm_scream', name: 'The Wilhelm Scream' },
  { id: 'wow', name: 'WOW' },
  { id: 'wrong_buzzer', name: 'Wrong Buzzer' },
];

const random = {
  element: function (array) {
    if (array.length == 0) {
      return null;
    }
    return array[Math.floor(Math.random() * array.length)];
  },
  int: function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  },
  float: function (min, max) {
    return (Math.random() * (max - min)) + min;
  }
};

let app = {
  data() {
    return {
      sounds: [],
    };
  },
  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
  },
  methods: {
    showApp() {
      document.getElementById("app").setAttribute("style", "");
    },
    onBlur() {
      // TODO document.getElementById("app").setAttribute("style", "display:none");
      // TODO
    },
    onFocus() {
      // TODO
    },
    loadSounds() {
      this.sounds = SOUNDS.map(sound => {
        sound.audio = new Audio(`./sounds/${sound.id}.wav`);
        sound.audio.preservesPitch = false;
        sound.active = true;
        return sound;
      });
    },
    start() {
      const audioCtx = new AudioContext();
      this.sounds.forEach(sound => {
        const source = audioCtx.createMediaElementSource(sound.audio);
        source.connect(audioCtx.destination);
      });
      this.trigger();
    },
    trigger() {
      const time = random.int(30, 300);
      console.log(`Next in ${time} seconds`);
      setTimeout(this.playRandomSound, time * 1000);
    },
    selectAll() {
      this.sounds.forEach(sound => {
        sound.active = true;
      });
    },
    deselectAll() {
      this.sounds.forEach(sound => {
        sound.active = false;
      });
    },
    playRandomSound() {
      const sound = random.element(this.sounds.filter(sound => sound.active));
      if (sound !== null) {
        console.log(`Playing ${sound.id}`);
        sound.audio.playbackRate = random.float(0.8, 1.2);
        sound.audio.play();
      }
      this.trigger();
    },
  },
  mounted: function () {
    const self = this;
    setTimeout(this.showApp);
    this.loadSounds();
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        self.onBlur();
      } else {
        self.onFocus();
      }
    });
  },
};

window.onload = () => {
  app = Vue.createApp(app);
  app.mount("#app");
};
