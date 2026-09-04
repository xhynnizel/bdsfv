// ────────────────────────────────────────────────────────────────
// EDIT ME: everything on this page is what makes the site "yours."
// Swap the text, dates, and image paths below. Photos should be
// dropped into /public/photos/ and referenced by filename here.
// ────────────────────────────────────────────────────────────────

export const site = {
  boyfriendName: "Viktor",
  senderName: "Shane",
  birthdayMonthDay: "September 7th",
  // Used as a caption on pre-designed photobooth frames, e.g. "Sept. 7, 2026"
  birthdayDisplayDate: "Sept. 7th, 2026",
  notificationPreview: "You've got a new message from Shane 💌",
};

export const timeline = [
  {
    date: "Winter — Year 2025",
    caption:
      "The winter we met online — texting across time zones about anything and everything, and somehow it was already the best part of my day.",
    image: "/photos/photo-winter.jpg",
  },
  {
    date: "Spring — Year 2026",
    caption:
      "Still miles apart, but that spring I started missing you in a way I couldn't explain to anyone.",
    image: "/photos/photo-spring.jpg",
  },
  {
    date: "Summer — Year 2026",
    caption:
      "Different time zones, same goodnight texts — a whole summer of loving you from far away.",
    image: "/photos/photo-summer.jpg",
  },
  {
    date: "Fall — Year 2026",
    caption:
      "Counting down the leaves and the days until the distance between us is just a memory.",
    image: "/photos/photo4.jpg",
  },
  // {
  //   date: "Winter — Year 2026",
  //   caption:
  //     "Full circle, another winter — still long distance, still completely yours.",
  //   image: "/photos/photo4.jpg",
  // },
];
export const photoboothIntro = {
  // Drop your video into /public/video/intro.mp4 and it'll show up here.
  videoSrc: "/video/HellofromVityok.mp4",
  // Drop a photo into /public/stickers/ and it'll show up next to the signoff.
  senderPhoto: "/stickers/gf.png",
  greeting: "Hi, Family and friends!",
  paragraphs: [
    "Thank you for being here!",
    "I put this little site together as a surprise for Viktor's birthday, and I wanted you to be part of it too.",
    "As you click the \"Continue\" button below, you'll be taken to the message form. And then, you write him your message or a birthday wish — as short or as long as you'd like. If you want, you can also attach a photo. Just tap \"Attach a photo,\" upload or take 3 quick shots in the booth, decorate the strip with frames and stickers, and download it for yourself to keep. It'll automatically attach to your message when you hit send.",
    "Everything you send goes straight to his private birthday wall, which only he can open — so don't hold back, he won't see any of this until the night of his big day.",
  ],
  signoff: "Thank you for loving him with me. Let's go send him a birthday message!",
};

export const letter = {
  greeting: "My love,",
  paragraphs: [
    "Happy birthday!",
    "Today, I want to take a moment to celebrate not just another year of your life, but the incredible person you are. Seeing the dedication you bring to your craft as a voice actor inspires me every single day. Your passion for your dream is beautiful and deeply admirable.",
    // "I know this past year hasn't been the easiest, especially with the financial strain and the hurdles along the way. But even when things got tough, you found a way to create joy, keep fighting, and bring light into the everyday. That resilience says so much about your heart and character.",
    "I know this past year hasn't been the easiest. But even when things got tough, you found a way to create joy, keep fighting, and bring light into the everyday.",
    "As you step into this new chapter, I wish you endless growth, open doors, and all the success you sooooo richly deserve. Walk proudly through this life, Vityusha, and know that no matter where the journey takes you, I will be right here, cheering you on and supporting you through it all.",
    "I love you more than words can express, and I am endlessly grateful for the moments we share and the memories we create together.",
  ],
  signoff: "Yours, always",
};

    // "Happy birthday to the person who somehow makes ordinary days feel like the good part of a story. I wanted to build you something that felt like us — a little messy, a little sentimental, made with way too much care.",
    // "Thank you for the way you laugh at your own jokes before you finish telling them, for how you make me feel like home even when we're somewhere new, and for loving me exactly as I am.",
    // "I hope this year gives you everything you deserve — and I hope I get to be there for all of it, cheering the loudest.",

export const playlist = {
  title: "Songs that sound like you",
  subtitle: "Press play and read the letter again.",
  songs: [
    { title: "Song One", artist: "Artist Name", spotifyUrl: "" },
    { title: "Song Two", artist: "Artist Name", spotifyUrl: "" },
    { title: "Song Three", artist: "Artist Name", spotifyUrl: "" },
    { title: "Song Four", artist: "Artist Name", spotifyUrl: "" },
  ],
  // Optional: paste a Spotify playlist embed URL to show a real player instead
  // of the static list, e.g. "https://open.spotify.com/embed/playlist/XXXX"
  spotifyEmbedUrl: "",
};

export const cake = {
  candleCount: 30, // his age — edit me
  wishPromptedMessage:
    "Make a wish 🕯️ — then blow out the candles (tap the flame, or use your mic to actually blow!)",
  revealedMessage:
    "Whatever you wished for — I hope it comes true. And if it didn't already include me, I'm still not going anywhere. Happy birthday. I love you.",
};

// This is the link his friends will get. It should point at your deployed
// site's /sendamessage route once you deploy (e.g. Vercel).
export const shareConfig = {
  photoboothPath: "/sendamessage",
  shareMessage:
    "We made a little birthday photobooth for Viktor's surprise — take a few photos and leave him a message! 📸💌",
};

export const wall = {
  title: `For ${site.boyfriendName}`,
  subtitle: "Photos and birthday wishes from everyone who loves you",
  emptyMessage:
    "No messages yet — check back soon, friends are still leaving photos and wishes.",
  // Drop an mp3 into /public/music/ and point this at it (e.g. "/music/wall-song.mp3").
  musicSrc: "/music/wall-song.mp3",
  // Viktor needs this to open the wall. .
  password: "09071996", // his birthday, September 7 1996, as MMDDYYYY
};

export const surprise = {
  // Music for the surprise page
  musicSrc: "/music/hbd.mp3",
};

// Only you should know this one. It gates the /admin page where you can
// delete photos/messages from the wall. Change it to something only you know.
export const adminConfig = {
  password: "changeme-admin",
};
