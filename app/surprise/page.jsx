import PhotoTimeline from "@/components/PhotoTimeline";
import LoveLetter from "@/components/LoveLetter";
// import Playlist from "@/components/Playlist";
import BirthdayCake from "@/components/BirthdayCake";
import WallTeaser from "@/components/WallTeaser";
// import ShareLink from "@/components/ShareLink";
import { site } from "@/lib/content";

export default function SurprisePage() {
  return (
    <main className="min-h-[100dvh]">
      <header className="pt-20 pb-6 px-5 text-center">
        <p className="uppercase tracking-[0.35em] text-xs text-lavender-dark mb-4">
          happy birthday
        </p>
        <h1 className="font-display text-4xl md:text-5xl text-plum italic">
          {site.boyfriendName}
        </h1>
      </header>

      <PhotoTimeline />
      <LoveLetter />
      {/* <Playlist /> */}
      <BirthdayCake />
      <WallTeaser />
      {/* <ShareLink /> */}

      <footer className="text-center pb-10 pt-4">
        <p className="text-plum-light/50 text-xs">
          made with love, one line of code at a time
        </p>
      </footer>
    </main>
  );
}

