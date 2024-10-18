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

const FAKES = [
  { name: 'Google Search', url: 'https://google.com/' },
  { name: 'Stack Overflow', url: 'https://stackoverflow.com/' },
  { name: 'Discord', url: 'https://app.discord.com/', favicon: './favicons/discord.ico' },
  { name: 'Gmail', url: 'https://mail.google.com/', title: 'Inbox - Gmail', favicon: './favicons/gmail.ico' },
  { name: 'Google Drive', url: 'https://drive.google.com/' },
  { name: 'Github', url: 'https://github.com/' },
  { name: 'Reddit', url: 'https://reddit.com/', title: 'Reddit - Dive into anything' },
  { name: 'Wikipedia', url: 'https://wikipedia.org/' },
  { name: 'Facebook', url: 'https://facebook.com/' },
  { name: 'YouTube', url: 'https://youtube.com/' },
  { name: 'LinkedIn', url: 'https://linkedin.com/' },
  { name: 'Instagram', url: 'https://instagram.com/', favicon: './favicons/instagram.png' },
  { name: 'WhatsApp', url: 'https://web.whatsapp.com/', favicon: './favicons/whatsapp.ico' },
  { name: 'X', url: 'https://x.com/', title: 'Home / X' },
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
      started: false,
      minDelay: 5,
      maxDelay: 10,
      volume: 50,
      randomPitch: true,
      hidePrank: true,
      redirect: true,
      fakeId: 0,
      fakes: FAKES,
    };
  },
  computed: {
    canStart() {
      return this.sounds.filter(sound => sound.active).length > 0;
    },
  },
  watch: {
    minDelay() {
      this.maxDelay = Math.max(this.minDelay, this.maxDelay);
    },
    maxDelay() {
      this.minDelay = Math.min(this.minDelay, this.maxDelay);
    },
    fakeId() {
      this.disguise();
    },
  },
  methods: {
    showApp() {
      document.getElementById("app").setAttribute("style", "");
    },
    hideApp() {
      document.getElementById("app").setAttribute("style", "display:none");
      document.body.setAttribute("style", "background: none");
    },
    onFocus() {
      if (this.started && this.redirect) {
        window.location.href = FAKES[this.fakeId].url;
      }
    },
    clearFavicon() {
      const oldLink = document.getElementById('dynamic-favicon');
      if (oldLink) {
        document.head.removeChild(oldLink);
      }
    },
    changeFavicon(src) {
      document.head = document.head || document.getElementsByTagName('head')[0];
      const link = document.createElement('link');
      const oldLink = document.getElementById('dynamic-favicon');
      link.id = 'dynamic-favicon';
      link.rel = 'shortcut icon';
      link.href = src;
      if (oldLink) {
        document.head.removeChild(oldLink);
      }
      document.head.appendChild(link);
    },
    loadSounds() {
      this.sounds = SOUNDS.map(sound => {
        sound.audio = new Audio(`./sounds/${sound.id}.wav`);
        sound.audio.preservesPitch = false;
        sound.active = true;
        return sound;
      });
    },
    disguise() {
      this.changeFavicon(FAKES[this.fakeId].favicon ?? FAKES[this.fakeId].url + 'favicon.ico');
      document.title = FAKES[this.fakeId].title ?? FAKES[this.fakeId].name;
    },
    start() {
      if (!this.started) {
        this.trigger();
        if (this.hidePrank) {
          this.hideApp();
        }
        this.disguise();
      }
    },
    trigger() {
      this.started = true;
      const time = random.int(this.minDelay * 60 * 1000, this.maxDelay * 60 * 1000);
      console.log(`Next in ${Math.round(time / (60 * 1000))} minutes`);
      setTimeout(this.playRandomSound, time);
    },
    selectAll() {
      this.sounds.forEach(sound => {
        sound.active = true;
      });
    },
    unselectAll() {
      this.sounds.forEach(sound => {
        sound.active = false;
      });
    },
    playRandomSound() {
      try {
        const sound = random.element(this.sounds.filter(sound => sound.active));
        if (sound !== null) {
          console.log(`Playing ${sound.id}`);
          sound.audio.playbackRate = this.randomPitch ? random.float(0.8, 1.2) : 1;
          sound.audio.volume = this.volume / 100;
          sound.audio.play();
        }
      } catch (error) {
        console.error(error);
      }
      this.trigger();
    },
  },
  mounted: function () {
    const self = this;
    setTimeout(this.showApp);
    this.loadSounds();
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        self.onFocus();
      }
    });
    document.addEventListener("beforeunload", self.onFocus);
  },
};

window.onload = () => {
  app = Vue.createApp(app);
  app.mount("#app");
};
