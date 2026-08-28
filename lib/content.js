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
    date: "The Beginning",
    caption:
      "The day we met — I didn't know yet that this was the start of my favorite story.",
    image: "/photos/photo1.jpg",
  },
  {
    date: "First Trip",
    caption: "Getting lost together and somehow it was still the best day.",
    image: "/photos/photo2.jpg",
  },
  {
    date: "Just Because",
    caption: "No occasion, just us being ridiculous on a random Tuesday.",
    image: "/photos/photo3.jpg",
  },
  {
    date: "Right Now",
    caption: "Still choosing you, every single day.",
    image: "/photos/photo4.jpg",
  },
];

export const letter = {
  greeting: "My love,",
  paragraphs: [
    "Happy birthday to the person who somehow makes ordinary days feel like the good part of a story. I wanted to build you something that felt like us — a little messy, a little sentimental, made with way too much care.",
    "Thank you for the way you laugh at your own jokes before you finish telling them, for how you make me feel like home even when we're somewhere new, and for loving me exactly as I am.",
    "I hope this year gives you everything you deserve — and I hope I get to be there for all of it, cheering the loudest.",
  ],
  signoff: "Yours, always",
};

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
// site's /photobooth route once you deploy (e.g. Vercel).
export const shareConfig = {
  photoboothPath: "/photobooth",
  shareMessage:
    "We made a little birthday photobooth for Viktor's surprise — take a few photos and leave him a message! 📸💌",
};

export const wall = {
  title: `For ${site.boyfriendName} 💌`,
  subtitle: "Photos and birthday wishes from everyone who loves you",
  emptyMessage:
    "No messages yet — check back soon, friends are still leaving photos and wishes.",
  // Drop an mp3 into /public/music/ and point this at it (e.g. "/music/wall-song.mp3").
  musicSrc: "/music/wall-song.mp3",
  // Viktor needs this to open the wall. .
  password: "09071996", // his birthday, September 7 1996, as MMDDYYYY
};

// Only you should know this one. It gates the /admin page where you can
// delete photos/messages from the wall. Change it to something only you know.
export const adminConfig = {
  password: "changeme-admin",
};
