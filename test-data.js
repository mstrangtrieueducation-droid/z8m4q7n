const IMG = "assets/test8-images/";
const TOTAL_POINTS = 50;

const choice = (id, prompt, options, answer, explanation, image = "") => ({ id, type: "choice", prompt, options, answers: [answer], explanation, image, points: 1 });
const input = (id, prompt, answers, explanation, image = "") => ({ id, type: "input", prompt, answers, explanation, image, points: 1 });
const pictureChoice = (id, prompt, pictures, answer, explanation) => ({ id, type: "pictureChoice", prompt, pictures, answers: [answer], explanation, points: 1 });
const labelledPictures = (prefix, labels) => labels.map((label) => ({ value: label, image: `${IMG}${prefix}-${label}.png` }));

const sections = [
  {
    "key": "A",
    "label": "A",
    "title": "One of the words is incorrect. Listen and circle the letter of the incorrect word.",
    "note": "Listen carefully and choose a, b, or c.",
    "points": 4,
    "audio": "assets/audio-a.mp3",
    "questions": [
      {
        "id": "A1",
        "type": "choice",
        "prompt": "1. a leaves | b oxygen | c roots",
        "options": [
          "a",
          "b",
          "c"
        ],
        "answers": [
          "b"
        ],
        "explanation": "Oxygen is the incorrect word in item 1, so the answer is b.",
        "image": "",
        "points": 1
      },
      {
        "id": "A2",
        "type": "choice",
        "prompt": "2. a soil | b oxygen | c human",
        "options": [
          "a",
          "b",
          "c"
        ],
        "answers": [
          "c"
        ],
        "explanation": "Human is the incorrect word in item 2, so the answer is c.",
        "image": "",
        "points": 1
      },
      {
        "id": "A3",
        "type": "choice",
        "prompt": "3. a petal | b pollen | c seed",
        "options": [
          "a",
          "b",
          "c"
        ],
        "answers": [
          "a"
        ],
        "explanation": "Petal is the incorrect word in item 3, so the answer is a.",
        "image": "",
        "points": 1
      },
      {
        "id": "A4",
        "type": "choice",
        "prompt": "4. a important | b flat | c round",
        "options": [
          "a",
          "b",
          "c"
        ],
        "answers": [
          "a"
        ],
        "explanation": "Important is the incorrect word in item 4, so the answer is a.",
        "image": "",
        "points": 1
      }
    ]
  },
  {
    "key": "B",
    "label": "B",
    "title": "Complete the sentences.",
    "note": "Use the words in the box. One word is not needed.",
    "points": 3,
    "wordBank": [
      "petals",
      "oxygen",
      "seeds",
      "sprout"
    ],
    "questions": [
      {
        "id": "B1",
        "type": "input",
        "prompt": "1. I am going to plant some flowers. First, I will put the ___ in the soil.",
        "answers": [
          "seeds"
        ],
        "explanation": "Seeds are put in soil so that new plants can grow.",
        "image": "",
        "points": 1
      },
      {
        "id": "B2",
        "type": "input",
        "prompt": "2. I will know it is growing when I see a small ___ come out of the soil.",
        "answers": [
          "sprout"
        ],
        "explanation": "A sprout is the first small growth that appears above the soil.",
        "image": "",
        "points": 1
      },
      {
        "id": "B3",
        "type": "input",
        "prompt": "3. Soon we will have a flower with colorful ___ on it!",
        "answers": [
          "petals"
        ],
        "explanation": "Petals are the colorful parts around the center of a flower.",
        "image": "",
        "points": 1
      }
    ]
  },
  {
    "key": "C",
    "label": "C",
    "title": "Complete the sentences. Then match them with the pictures.",
    "note": "First write the missing word. Then choose the picture label a, b, or c. The letters are picture labels only.",
    "points": 6,
    "questions": [
      {
        "id": "C1",
        "type": "input",
        "prompt": "1. This flower has sweet ___.",
        "answers": [
          "nectar"
        ],
        "explanation": "Nectar is the sweet liquid in a flower that attracts birds and insects.",
        "image": "",
        "points": 1
      },
      {
        "id": "C2",
        "type": "input",
        "prompt": "2. ___ eat a lot of different plants.",
        "answers": [
          "humans",
          "human beings",
          "people"
        ],
        "explanation": "Humans means people. The plural subject agrees with eat.",
        "image": "",
        "points": 1
      },
      {
        "id": "C3",
        "type": "input",
        "prompt": "3. The ___ of this flower is very thick.",
        "answers": [
          "stem"
        ],
        "explanation": "The stem supports the flower and connects it to the roots.",
        "image": "",
        "points": 1
      },
      {
        "id": "C4",
        "type": "pictureChoice",
        "prompt": "1. This flower has sweet nectar. Choose the matching picture.",
        "pictures": [
          {
            "value": "a",
            "image": "assets/test8-images/c-a.png"
          },
          {
            "value": "b",
            "image": "assets/test8-images/c-b.png"
          },
          {
            "value": "c",
            "image": "assets/test8-images/c-c.png"
          }
        ],
        "answers": [
          "c"
        ],
        "explanation": "Picture c shows a hummingbird taking nectar from a flower.",
        "points": 1
      },
      {
        "id": "C5",
        "type": "pictureChoice",
        "prompt": "2. Humans eat a lot of different plants. Choose the matching picture.",
        "pictures": [
          {
            "value": "a",
            "image": "assets/test8-images/c-a.png"
          },
          {
            "value": "b",
            "image": "assets/test8-images/c-b.png"
          },
          {
            "value": "c",
            "image": "assets/test8-images/c-c.png"
          }
        ],
        "answers": [
          "a"
        ],
        "explanation": "Picture a shows humans.",
        "points": 1
      },
      {
        "id": "C6",
        "type": "pictureChoice",
        "prompt": "3. The stem of this flower is very thick. Choose the matching picture.",
        "pictures": [
          {
            "value": "a",
            "image": "assets/test8-images/c-a.png"
          },
          {
            "value": "b",
            "image": "assets/test8-images/c-b.png"
          },
          {
            "value": "c",
            "image": "assets/test8-images/c-c.png"
          }
        ],
        "answers": [
          "b"
        ],
        "explanation": "Picture b clearly shows the flower's thick stem.",
        "points": 1
      }
    ]
  },
  {
    "key": "D",
    "label": "D",
    "title": "Check the correct answer.",
    "note": "Choose the measure word that correctly completes each sentence.",
    "points": 4,
    "questions": [
      {
        "id": "D1",
        "type": "choice",
        "prompt": "1. Amanda bought a ___ of apples at the store.",
        "options": [
          "bag",
          "bottle"
        ],
        "answers": [
          "bag"
        ],
        "explanation": "Apples can be bought in a bag, not a bottle.",
        "image": "",
        "points": 1
      },
      {
        "id": "D2",
        "type": "choice",
        "prompt": "2. We need a ___ of bread.",
        "options": [
          "jar",
          "loaf"
        ],
        "answers": [
          "loaf"
        ],
        "explanation": "A whole shaped piece of bread is a loaf of bread.",
        "image": "",
        "points": 1
      },
      {
        "id": "D3",
        "type": "choice",
        "prompt": "3. It's so hot that I drank three ___ of water.",
        "options": [
          "bottles",
          "kilograms"
        ],
        "answers": [
          "bottles"
        ],
        "explanation": "Water can be counted in bottles; kilograms measure weight.",
        "image": "",
        "points": 1
      },
      {
        "id": "D4",
        "type": "choice",
        "prompt": "4. Can you buy me a ___ of jam at the grocery store?",
        "options": [
          "box",
          "jar"
        ],
        "answers": [
          "jar"
        ],
        "explanation": "Jam is commonly sold in a jar.",
        "image": "",
        "points": 1
      }
    ]
  },
  {
    "key": "E",
    "label": "E",
    "title": "Complete the sentences.",
    "note": "Use each word in the box once.",
    "points": 4,
    "wordBank": [
      "bag",
      "bottle",
      "kilogram",
      "cup"
    ],
    "questions": [
      {
        "id": "E1",
        "type": "input",
        "prompt": "1. I'm hungry. I'm going to order a ___ of soup at the cafe.",
        "answers": [
          "cup"
        ],
        "explanation": "A cup of soup is a common serving measure.",
        "image": "",
        "points": 1
      },
      {
        "id": "E2",
        "type": "input",
        "prompt": "2. We bought a ___ of seeds to feed the birds.",
        "answers": [
          "bag"
        ],
        "explanation": "Seeds are commonly bought in a bag.",
        "image": "",
        "points": 1
      },
      {
        "id": "E3",
        "type": "input",
        "prompt": "3. The baby has a ___ of milk before bed every night.",
        "answers": [
          "bottle"
        ],
        "explanation": "A baby commonly drinks a bottle of milk.",
        "image": "",
        "points": 1
      },
      {
        "id": "E4",
        "type": "input",
        "prompt": "4. I need exactly one ___ of rice. It can't be heavier or lighter.",
        "answers": [
          "kilogram",
          "kg"
        ],
        "explanation": "Kilogram is a unit of weight, which matches heavier or lighter.",
        "image": "",
        "points": 1
      }
    ]
  },
  {
    "key": "F",
    "label": "F",
    "title": "Look and complete the sentences. Use measure words.",
    "note": "Study each clean source picture and write the correct measure word.",
    "points": 4,
    "questions": [
      {
        "id": "F1",
        "type": "input",
        "prompt": "1. I drank a ___ of water.",
        "answers": [
          "cup"
        ],
        "explanation": "The picture shows a child drinking from a cup.",
        "image": "assets/test8-images/f-1.png",
        "points": 1
      },
      {
        "id": "F2",
        "type": "input",
        "prompt": "2. This is a big ___ of bread.",
        "answers": [
          "loaf"
        ],
        "explanation": "The picture shows one loaf of bread.",
        "image": "assets/test8-images/f-2.png",
        "points": 1
      },
      {
        "id": "F3",
        "type": "input",
        "prompt": "3. They are going to buy a ___ of crackers.",
        "answers": [
          "box"
        ],
        "explanation": "The crackers are in a box.",
        "image": "assets/test8-images/f-3.png",
        "points": 1
      },
      {
        "id": "F4",
        "type": "input",
        "prompt": "4. Mrs. Chu has a ___ of soil.",
        "answers": [
          "bag"
        ],
        "explanation": "The picture shows a bag labelled SOIL.",
        "image": "assets/test8-images/f-4.png",
        "points": 1
      }
    ]
  },
  {
    "key": "G",
    "label": "G",
    "title": "Listen and circle the correct answer.",
    "note": "Listen to each statement and choose True or False.",
    "points": 4,
    "audio": "assets/audio-g.mp3",
    "questions": [
      {
        "id": "G1",
        "type": "choice",
        "prompt": "1.",
        "options": [
          "T",
          "F"
        ],
        "answers": [
          "T"
        ],
        "explanation": "Statement 1 is true according to the recording.",
        "image": "",
        "points": 1
      },
      {
        "id": "G2",
        "type": "choice",
        "prompt": "2.",
        "options": [
          "T",
          "F"
        ],
        "answers": [
          "F"
        ],
        "explanation": "Statement 2 is false according to the recording.",
        "image": "",
        "points": 1
      },
      {
        "id": "G3",
        "type": "choice",
        "prompt": "3.",
        "options": [
          "T",
          "F"
        ],
        "answers": [
          "T"
        ],
        "explanation": "Statement 3 is true according to the recording.",
        "image": "",
        "points": 1
      },
      {
        "id": "G4",
        "type": "choice",
        "prompt": "4.",
        "options": [
          "T",
          "F"
        ],
        "answers": [
          "F"
        ],
        "explanation": "Statement 4 is false according to the recording.",
        "image": "",
        "points": 1
      }
    ]
  },
  {
    "key": "H",
    "label": "H",
    "title": "Look and complete the sentences.",
    "note": "Use the source pictures to identify each missing word.",
    "points": 4,
    "questions": [
      {
        "id": "H1",
        "type": "input",
        "prompt": "1. ___ are very healthy and delicious.",
        "answers": [
          "beans"
        ],
        "explanation": "The picture shows many beans.",
        "image": "assets/test8-images/h-1.png",
        "points": 1
      },
      {
        "id": "H2",
        "type": "input",
        "prompt": "2. We have planted a vegetable ___ behind our house.",
        "answers": [
          "garden"
        ],
        "explanation": "The picture shows a vegetable garden.",
        "image": "assets/test8-images/h-2.png",
        "points": 1
      },
      {
        "id": "H3",
        "type": "input",
        "prompt": "3. The ___ takes good care of her flowers and vegetables.",
        "answers": [
          "gardener"
        ],
        "explanation": "A gardener takes care of plants in a garden.",
        "image": "assets/test8-images/h-3.png",
        "points": 1
      },
      {
        "id": "H4",
        "type": "input",
        "prompt": "4. It was very hot yesterday, and it was difficult to see through the ___.",
        "answers": [
          "haze"
        ],
        "explanation": "Haze makes the air look unclear and can reduce visibility.",
        "image": "assets/test8-images/h-4.png",
        "points": 1
      }
    ]
  },
  {
    "key": "I",
    "label": "I",
    "title": "Unscramble the words and match.",
    "note": "Write each word, then choose its definition label. The letters a-d are definition labels only.",
    "points": 8,
    "wordBank": [
      "a. a place where people live and help each other",
      "b. young people ages 13-19",
      "c. to give water to a plant",
      "d. eager to know or learn something"
    ],
    "questions": [
      {
        "id": "I1",
        "type": "paired",
        "prompt": "1. t e a g e r s e n",
        "points": 2,
        "parts": [
          {
            "key": "word",
            "label": "Unscrambled word",
            "type": "input",
            "answers": [
              "teenagers"
            ],
            "explanation": "Teenagers is the correct spelling."
          },
          {
            "key": "match",
            "label": "Definition label",
            "type": "choice",
            "options": [
              "a",
              "b",
              "c",
              "d"
            ],
            "answers": [
              "b"
            ],
            "explanation": "Teenagers are young people ages 13-19, so the label is b."
          }
        ]
      },
      {
        "id": "I2",
        "type": "paired",
        "prompt": "2. c o t y m m u n i",
        "points": 2,
        "parts": [
          {
            "key": "word",
            "label": "Unscrambled word",
            "type": "input",
            "answers": [
              "community"
            ],
            "explanation": "Community is the correct spelling."
          },
          {
            "key": "match",
            "label": "Definition label",
            "type": "choice",
            "options": [
              "a",
              "b",
              "c",
              "d"
            ],
            "answers": [
              "a"
            ],
            "explanation": "A community is a place where people live and help each other, so the label is a."
          }
        ]
      },
      {
        "id": "I3",
        "type": "paired",
        "prompt": "3. u c i r u s o",
        "points": 2,
        "parts": [
          {
            "key": "word",
            "label": "Unscrambled word",
            "type": "input",
            "answers": [
              "curious"
            ],
            "explanation": "Curious is the correct spelling."
          },
          {
            "key": "match",
            "label": "Definition label",
            "type": "choice",
            "options": [
              "a",
              "b",
              "c",
              "d"
            ],
            "answers": [
              "d"
            ],
            "explanation": "Curious means eager to know or learn something, so the label is d."
          }
        ]
      },
      {
        "id": "I4",
        "type": "paired",
        "prompt": "4. t e r w a",
        "points": 2,
        "parts": [
          {
            "key": "word",
            "label": "Unscrambled word",
            "type": "input",
            "answers": [
              "water"
            ],
            "explanation": "Water is the correct spelling."
          },
          {
            "key": "match",
            "label": "Definition label",
            "type": "choice",
            "options": [
              "a",
              "b",
              "c",
              "d"
            ],
            "answers": [
              "c"
            ],
            "explanation": "To water a plant means to give water to it, so the label is c."
          }
        ]
      }
    ]
  },
  {
    "key": "J",
    "label": "J",
    "title": "Write the words in the correct order to make sentences.",
    "note": "Use every word and write a complete sentence.",
    "points": 3,
    "questions": [
      {
        "id": "J1",
        "type": "input",
        "prompt": "1. Ms. Harrison / is / with / her / happy / garden",
        "answers": [
          "Ms. Harrison is happy with her garden",
          "Ms. Harrison is happy with her garden."
        ],
        "explanation": "The adjective pattern is be happy with something.",
        "image": "",
        "points": 1
      },
      {
        "id": "J2",
        "type": "input",
        "prompt": "2. I / am / about / your / curious / community",
        "answers": [
          "I am curious about your community",
          "I am curious about your community."
        ],
        "explanation": "The adjective pattern is be curious about something.",
        "image": "",
        "points": 1
      },
      {
        "id": "J3",
        "type": "input",
        "prompt": "3. plants / Inez / is / in / interested",
        "answers": [
          "Inez is interested in plants",
          "Inez is interested in plants."
        ],
        "explanation": "The adjective pattern is be interested in something.",
        "image": "",
        "points": 1
      }
    ]
  },
  {
    "key": "K",
    "label": "K",
    "title": "Look and write sentences. Use not when necessary.",
    "note": "Use the picture clues and the correct adjective-preposition pattern.",
    "points": 3,
    "questions": [
      {
        "id": "K1",
        "type": "input",
        "prompt": "1. She / curious / ladybugs",
        "answers": [
          "She is not curious about ladybugs",
          "She isn't curious about ladybugs",
          "She is not curious about ladybugs.",
          "She isn't curious about ladybugs."
        ],
        "explanation": "The picture shows that she does not want to get close to the ladybugs. Use be curious about and add not.",
        "image": "assets/test8-images/k-1.png",
        "points": 1
      },
      {
        "id": "K2",
        "type": "input",
        "prompt": "2. He / surprised / the score",
        "answers": [
          "He is surprised at the score",
          "He's surprised at the score",
          "He is surprised at the score.",
          "He's surprised at the score."
        ],
        "explanation": "The score is unexpected, so use be surprised at the score.",
        "image": "assets/test8-images/k-2.png",
        "points": 1
      },
      {
        "id": "K3",
        "type": "input",
        "prompt": "3. He / excited / the snow",
        "answers": [
          "He is excited about the snow",
          "He's excited about the snow",
          "He is excited about the snow.",
          "He's excited about the snow."
        ],
        "explanation": "The picture shows that he is happy and excited. Use be excited about the snow.",
        "image": "assets/test8-images/k-3.png",
        "points": 1
      }
    ]
  },
  {
    "key": "L",
    "label": "L",
    "title": "Complete the sentences. Use the correct preposition.",
    "note": "Complete each adjective-preposition pattern.",
    "points": 3,
    "questions": [
      {
        "id": "L1",
        "type": "input",
        "prompt": "1. I was curious ___ the community garden, so I asked the gardener to tell me more about it.",
        "answers": [
          "about"
        ],
        "explanation": "The fixed pattern is curious about something.",
        "image": "",
        "points": 1
      },
      {
        "id": "L2",
        "type": "input",
        "prompt": "2. Lilly is not happy ___ her botany class. She thinks it's too difficult and there is too much homework.",
        "answers": [
          "with"
        ],
        "explanation": "The fixed pattern is happy with something.",
        "image": "",
        "points": 1
      },
      {
        "id": "L3",
        "type": "input",
        "prompt": "3. Michelle and Daniela were so excited ___ the concert tomorrow that they couldn't sleep!",
        "answers": [
          "about"
        ],
        "explanation": "The fixed pattern is excited about something.",
        "image": "",
        "points": 1
      }
    ]
  }
];
