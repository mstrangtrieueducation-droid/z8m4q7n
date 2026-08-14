const IMG = "assets/test8-images/";
const TOTAL_POINTS = 50;

const choice = (id, prompt, options, answer, explanation, image = "") => ({ id, type: "choice", prompt, options, answers: [answer], explanation, image, points: 1 });
const input = (id, prompt, answers, explanation, image = "") => ({ id, type: "input", prompt, answers, explanation, image, points: 1 });
const pictureChoice = (id, prompt, pictures, answer, explanation) => ({ id, type: "pictureChoice", prompt, pictures, answers: [answer], explanation, points: 1 });
const labelledPictures = (prefix, labels) => labels.map((label) => ({ value: label, image: `${IMG}${prefix}-${label}.png` }));

const sections = [
  { key: "A", label: "A", title: "One of the words is incorrect. Listen and circle the letter of the incorrect word.", note: "Listen carefully and choose a, b, or c.", points: 4, audio: "assets/audio-a.mp3", questions: [
    choice("A1", "1. a leaves | b oxygen | c roots", ["a", "b", "c"], "b", "Oxygen is the incorrect word in item 1, so the answer is b."),
    choice("A2", "2. a soil | b oxygen | c human", ["a", "b", "c"], "c", "Human is the incorrect word in item 2, so the answer is c."),
    choice("A3", "3. a petal | b pollen | c seed", ["a", "b", "c"], "a", "Petal is the incorrect word in item 3, so the answer is a."),
    choice("A4", "4. a important | b flat | c round", ["a", "b", "c"], "a", "Important is the incorrect word in item 4, so the answer is a.")
  ]},
  { key: "B", label: "B", title: "Complete the sentences.", note: "Use the words in the box. One word is not needed.", points: 3, wordBank: ["petals", "oxygen", "seeds", "sprout"], questions: [
    input("B1", "1. I am going to plant some flowers. First, I will put the ___ in the soil.", ["seeds"], "Seeds are put in soil so that new plants can grow."),
    input("B2", "2. I will know it is growing when I see a small ___ come out of the soil.", ["sprout"], "A sprout is the first small growth that appears above the soil."),
    input("B3", "3. Soon we will have a flower with colorful ___ on it!", ["petals"], "Petals are the colorful parts around the center of a flower.")
  ]},
  { key: "C", label: "C", title: "Complete the sentences. Then match them with the pictures.", note: "First write the missing word. Then choose the picture label a, b, or c. The letters are picture labels only.", points: 6, questions: [
    input("C1", "1. This flower has sweet ___.", ["nectar"], "Nectar is the sweet liquid in a flower that attracts birds and insects."),
    input("C2", "2. ___ eat a lot of different plants.", ["humans", "human beings", "people"], "Humans means people. The plural subject agrees with eat."),
    input("C3", "3. The ___ of this flower is very thick.", ["stem"], "The stem supports the flower and connects it to the roots."),
    pictureChoice("C4", "1. This flower has sweet nectar. Choose the matching picture.", labelledPictures("c", ["a", "b", "c"]), "c", "Picture c shows a hummingbird taking nectar from a flower."),
    pictureChoice("C5", "2. Humans eat a lot of different plants. Choose the matching picture.", labelledPictures("c", ["a", "b", "c"]), "a", "Picture a shows humans."),
    pictureChoice("C6", "3. The stem of this flower is very thick. Choose the matching picture.", labelledPictures("c", ["a", "b", "c"]), "b", "Picture b clearly shows the flower's thick stem.")
  ]},
  { key: "D", label: "D", title: "Check the correct answer.", note: "Choose the measure word that correctly completes each sentence.", points: 4, questions: [
    choice("D1", "1. Amanda bought a ___ of apples at the store.", ["bag", "bottle"], "bag", "Apples can be bought in a bag, not a bottle."),
    choice("D2", "2. We need a ___ of bread.", ["jar", "loaf"], "loaf", "A whole shaped piece of bread is a loaf of bread."),
    choice("D3", "3. It's so hot that I drank three ___ of water.", ["bottles", "kilograms"], "bottles", "Water can be counted in bottles; kilograms measure weight."),
    choice("D4", "4. Can you buy me a ___ of jam at the grocery store?", ["box", "jar"], "jar", "Jam is commonly sold in a jar.")
  ]},
  { key: "E", label: "E", title: "Complete the sentences.", note: "Use each word in the box once.", points: 4, wordBank: ["bag", "bottle", "kilogram", "cup"], questions: [
    input("E1", "1. I'm hungry. I'm going to order a ___ of soup at the cafe.", ["cup"], "A cup of soup is a common serving measure."),
    input("E2", "2. We bought a ___ of seeds to feed the birds.", ["bag"], "Seeds are commonly bought in a bag."),
    input("E3", "3. The baby has a ___ of milk before bed every night.", ["bottle"], "A baby commonly drinks a bottle of milk."),
    input("E4", "4. I need exactly one ___ of rice. It can't be heavier or lighter.", ["kilogram", "kg"], "Kilogram is a unit of weight, which matches heavier or lighter.")
  ]},
  { key: "F", label: "F", title: "Look and complete the sentences. Use measure words.", note: "Study each clean source picture and write the correct measure word.", points: 4, questions: [
    input("F1", "1. I drank a ___ of water.", ["cup"], "The picture shows a child drinking from a cup.", IMG + "f-1.png"),
    input("F2", "2. This is a big ___ of bread.", ["loaf"], "The picture shows one loaf of bread.", IMG + "f-2.png"),
    input("F3", "3. They are going to buy a ___ of crackers.", ["box"], "The crackers are in a box.", IMG + "f-3.png"),
    input("F4", "4. Mrs. Chu has a ___ of soil.", ["bag"], "The picture shows a bag labelled SOIL.", IMG + "f-4.png")
  ]},
  { key: "G", label: "G", title: "Listen and circle the correct answer.", note: "Listen to each statement and choose True or False.", points: 4, audio: "assets/audio-g.mp3", questions: [
    choice("G1", "1.", ["T", "F"], "T", "Statement 1 is true according to the recording."),
    choice("G2", "2.", ["T", "F"], "F", "Statement 2 is false according to the recording."),
    choice("G3", "3.", ["T", "F"], "T", "Statement 3 is true according to the recording."),
    choice("G4", "4.", ["T", "F"], "F", "Statement 4 is false according to the recording.")
  ]},
  { key: "H", label: "H", title: "Look and complete the sentences.", note: "Use the source pictures to identify each missing word.", points: 4, questions: [
    input("H1", "1. ___ are very healthy and delicious.", ["beans"], "The picture shows many beans.", IMG + "h-1.png"),
    input("H2", "2. We have planted a vegetable ___ behind our house.", ["garden"], "The picture shows a vegetable garden.", IMG + "h-2.png"),
    input("H3", "3. The ___ takes good care of her flowers and vegetables.", ["gardener"], "A gardener takes care of plants in a garden.", IMG + "h-3.png"),
    input("H4", "4. It was very hot yesterday, and it was difficult to see through the ___.", ["haze"], "Haze makes the air look unclear and can reduce visibility.", IMG + "h-4.png")
  ]},
  { key: "I", label: "I", title: "Unscramble the words and match.", note: "Write each word, then choose its definition label. The letters a-d are definition labels only.", points: 8, wordBank: ["a. a place where people live and help each other", "b. young people ages 13-19", "c. to give water to a plant", "d. eager to know or learn something"], questions: [
    { id: "I1", type: "paired", prompt: "1. t e a g e r s e n", points: 2, parts: [
      { key: "word", label: "Unscrambled word", type: "input", answers: ["teenagers"], explanation: "Teenagers is the correct spelling." },
      { key: "match", label: "Definition label", type: "choice", options: ["a", "b", "c", "d"], answers: ["b"], explanation: "Teenagers are young people ages 13-19, so the label is b." }
    ]},
    { id: "I2", type: "paired", prompt: "2. c o t y m m u n i", points: 2, parts: [
      { key: "word", label: "Unscrambled word", type: "input", answers: ["community"], explanation: "Community is the correct spelling." },
      { key: "match", label: "Definition label", type: "choice", options: ["a", "b", "c", "d"], answers: ["a"], explanation: "A community is a place where people live and help each other, so the label is a." }
    ]},
    { id: "I3", type: "paired", prompt: "3. u c i r u s o", points: 2, parts: [
      { key: "word", label: "Unscrambled word", type: "input", answers: ["curious"], explanation: "Curious is the correct spelling." },
      { key: "match", label: "Definition label", type: "choice", options: ["a", "b", "c", "d"], answers: ["d"], explanation: "Curious means eager to know or learn something, so the label is d." }
    ]},
    { id: "I4", type: "paired", prompt: "4. t e r w a", points: 2, parts: [
      { key: "word", label: "Unscrambled word", type: "input", answers: ["water"], explanation: "Water is the correct spelling." },
      { key: "match", label: "Definition label", type: "choice", options: ["a", "b", "c", "d"], answers: ["c"], explanation: "To water a plant means to give water to it, so the label is c." }
    ]}
  ]},
  { key: "J", label: "J", title: "Write the words in the correct order to make sentences.", note: "Use every word and write a complete sentence.", points: 3, questions: [
    input("J1", "1. Ms. Harrison / is / with / her / happy / garden", ["Ms. Harrison is happy with her garden", "Ms. Harrison is happy with her garden."], "The adjective pattern is be happy with something."),
    input("J2", "2. I / am / about / your / curious / community", ["I am curious about your community", "I am curious about your community."], "The adjective pattern is be curious about something."),
    input("J3", "3. plants / Inez / is / in / interested", ["Inez is interested in plants", "Inez is interested in plants."], "The adjective pattern is be interested in something.")
  ]},
  { key: "K", label: "K", title: "Look and write sentences. Use not when necessary.", note: "Use the picture clues and the correct adjective-preposition pattern.", points: 3, questions: [
    input("K1", "1. She / curious / ladybugs", ["She is not curious about ladybugs", "She isn't curious about ladybugs", "She is not curious about ladybugs.", "She isn't curious about ladybugs."], "The picture shows that she does not want to get close to the ladybugs. Use be curious about and add not.", IMG + "k-1.png"),
    input("K2", "2. He / surprised / the score", ["He is surprised at the score", "He's surprised at the score", "He is surprised at the score.", "He's surprised at the score."], "The score is unexpected, so use be surprised at the score.", IMG + "k-2.png"),
    input("K3", "3. He / excited / the snow", ["He is excited about the snow", "He's excited about the snow", "He is excited about the snow.", "He's excited about the snow."], "The picture shows that he is happy and excited. Use be excited about the snow.", IMG + "k-3.png")
  ]},
  { key: "L", label: "L", title: "Complete the sentences. Use the correct preposition.", note: "Complete each adjective-preposition pattern.", points: 3, questions: [
    input("L1", "1. I was curious ___ the community garden, so I asked the gardener to tell me more about it.", ["about"], "The fixed pattern is curious about something."),
    input("L2", "2. Lilly is not happy ___ her botany class. She thinks it's too difficult and there is too much homework.", ["with"], "The fixed pattern is happy with something."),
    input("L3", "3. Michelle and Daniela were so excited ___ the concert tomorrow that they couldn't sleep!", ["about"], "The fixed pattern is excited about something.")
  ]}
];
