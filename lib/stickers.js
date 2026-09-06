// ────────────────────────────────────────────────────────────────
// STICKER TRAY
// Image-based stickers friends can drag onto the photo strip before
// downloading. Files live in /public/stickers — add more by dropping
// a PNG there and adding a row below.
// ────────────────────────────────────────────────────────────────

export const stickers = [
  
  // Others
  { id: "heart-1", category: "others", label: "Heart 1", src: "/stickers/hearts/heart-pixel.png" },
  
  { id: "phrase-1", category: "others", label: "Cute", src: "/stickers/phrase/cute.png" },
  { id: "phrase-2", category: "others", label: "Have a gay day", src: "/stickers/phrase/have-a-gay-day.png" },
  { id: "phrase-3", category: "others", label: "Phrase 3", src: "/stickers/phrase/jap-phrase-1.png" },
  { id: "phrase-4", category: "others", label: "Phrase 4", src: "/stickers/phrase/jap-phrase-2.png" },
  { id: "phrase-5", category: "others", label: "Phrase 5", src: "/stickers/phrase/jap-phrase-3.png" },

  { id: "other-1", category: "others", label: "Other 1", src: "/stickers/bear-brown.png" },
  { id: "other-2", category: "others", label: "Other 2", src: "/stickers/bear-hat.png" },
  { id: "other-3", category: "others", label: "Other 3", src: "/stickers/book.png" },
  { id: "other-4", category: "others", label: "Other 4", src: "/stickers/bunny-cherry.png" },
  { id: "other-5", category: "others", label: "Other 5", src: "/stickers/bunny.png" },
  { id: "other-6", category: "others", label: "Other 6", src: "/stickers/camera.png" },
  { id: "other-7", category: "others", label: "Other 7", src: "/stickers/candy.png" },
  { id: "other-8", category: "others", label: "Other 8", src: "/stickers/duck.png" },
  { id: "other-9", category: "others", label: "Other 9", src: "/stickers/flower-pink.png" },
  { id: "other-10", category: "others", label: "Other 10", src: "/stickers/pup-polaroid.png" },
  { id: "other-11", category: "others", label: "Other 11", src: "/stickers/ribbon.png" },
  { id: "other-12", category: "others", label: "Other 12", src: "/stickers/star-peach.png" },
  { id: "other-13", category: "others", label: "Other 13", src: "/stickers/star-yellow.png" },

  // Viktor Cut-outs
  { id: "cutout-1", category: "viktor-cut-outs", label: "Cutout 1", src: "/stickers/cut-outs/v1.png" },
  { id: "cutout-2", category: "viktor-cut-outs", label: "Cutout 2", src: "/stickers/cut-outs/v2.png" },
  { id: "cutout-3", category: "viktor-cut-outs", label: "Cutout 3", src: "/stickers/cut-outs/v3.png" },
  { id: "cutout-4", category: "viktor-cut-outs", label: "Cutout 4", src: "/stickers/cut-outs/v4.png" },
  { id: "cutout-5", category: "viktor-cut-outs", label: "Cutout 5", src: "/stickers/cut-outs/v5.png" },
  { id: "cutout-6", category: "viktor-cut-outs", label: "Cutout 6", src: "/stickers/cut-outs/v6.png" },
  { id: "cutout-7", category: "viktor-cut-outs", label: "Cutout 7", src: "/stickers/cut-outs/v7.png" },
  // { id: "cutout-8", category: "viktor-cut-outs", label: "Cutout 8", src: "/stickers/cut-outs/v8.png" },
  { id: "cutout-9", category: "viktor-cut-outs", label: "Cutout 9", src: "/stickers/cut-outs/v9.png" },

  // Hearts
  // { id: "heart-1", category: "hearts", label: "Heart 1", src: "/stickers/hearts/heart-pixel.png" },
  // { id: "heart-2", category: "hearts", label: "Heart 2", src: "/stickers/hearts/heart-string.png" },
  // { id: "heart-3", category: "hearts", label: "Heart 3", src: "/stickers/hearts/heart-talk.png" },
  // { id: "heart-4", category: "hearts", label: "Heart 4", src: "/stickers/hearts/three-hearts.png" },
  // { id: "heart-5", category: "hearts", label: "Heart 5", src: "/stickers/hearts/three-hearts-2.png" },

  // Cats
  { id: "cat-1", category: "cats", label: "Cat 1", src: "/stickers/cats/cat-ears.png" },
  { id: "cat-2", category: "cats", label: "Cat 2", src: "/stickers/cats/cat-1.png" },
  { id: "cat-3", category: "cats", label: "Cat 3", src: "/stickers/cats/cat-2.png" },
  { id: "cat-4", category: "cats", label: "Cat 4", src: "/stickers/cats/cat-3.png" },
  { id: "cat-5", category: "cats", label: "Cat 5", src: "/stickers/cats/cat-brown.png" },
  { id: "cat-6", category: "cats", label: "Cat 6", src: "/stickers/cats/cat-calico.png" },
  { id: "cat-7", category: "cats", label: "Cat 7", src: "/stickers/cats/cat-gray.png" },
  { id: "cat-8", category: "cats", label: "Cat 8", src: "/stickers/cats/cat-gray-2.png" },
  { id: "cat-9", category: "cats", label: "Cat 9", src: "/stickers/cats/cat-orange.png" },
  { id: "cat-10", category: "cats", label: "Cat 10", src: "/stickers/cats/cat-orange-2.png" },
  { id: "cat-11", category: "cats", label: "Cat 11", src: "/stickers/cats/cat-orange-brown.png" },
  { id: "cat-12", category: "cats", label: "Cat 12", src: "/stickers/cats/catsandfish.png" },
  { id: "cat-13", category: "cats", label: "Cat 13", src: "/stickers/cats/three-cats.png" },

  // Food
  { id: "food-9", category: "food", label: "Cake", src: "/stickers/food/cake.png" },
  { id: "food-1", category: "food", label: "Banana", src: "/stickers/food/banana.png" },
  { id: "food-2", category: "food", label: "Mango", src: "/stickers/food/mango.png" },
  { id: "food-3", category: "food", label: "Cherry", src: "/stickers/food/cherry.png" },
  { id: "food-4", category: "food", label: "Strawberry", src: "/stickers/food/strawberry.png" },
  { id: "food-5", category: "food", label: "Watermelon Half", src: "/stickers/food/watermelon-half.png" },
  { id: "food-6", category: "food", label: "Watermelon Slice", src: "/stickers/food/watermelon-slice.png" },
  { id: "food-7", category: "food", label: "Croissant", src: "/stickers/food/croissant.png" },
  { id: "food-8", category: "food", label: "Taiyaki", src: "/stickers/food/taiyaki.png" },

  // Phrase
  // { id: "phrase-1", category: "phrase", label: "Cute", src: "/stickers/phrase/cute.png" },
  // { id: "phrase-2", category: "phrase", label: "Have a gay day", src: "/stickers/phrase/have-a-gay-day.png" },
  // { id: "phrase-3", category: "phrase", label: "Phrase 3", src: "/stickers/phrase/jap-phrase-1.png" },
  // { id: "phrase-4", category: "phrase", label: "Phrase 4", src: "/stickers/phrase/jap-phrase-2.png" },
  // { id: "phrase-5", category: "phrase", label: "Phrase 5", src: "/stickers/phrase/jap-phrase-3.png" },



];
