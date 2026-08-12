import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SAMPLE_WORDS = {
  EASY: [
    { word: 'word', definition: 'A unit of language', partOfSpeech: 'noun' },
    { word: 'play', definition: 'To engage in activity for enjoyment', partOfSpeech: 'verb' },
    { word: 'game', definition: 'A form of competitive activity', partOfSpeech: 'noun' },
    { word: 'time', definition: 'The indefinite continued progress of existence', partOfSpeech: 'noun' },
    { word: 'make', definition: 'To form or create something', partOfSpeech: 'verb' },
    { word: 'take', definition: 'To lay hold of', partOfSpeech: 'verb' },
    { word: 'work', definition: 'Activity involving mental or physical effort', partOfSpeech: 'noun' },
    { word: 'find', definition: 'To discover or perceive by chance', partOfSpeech: 'verb' },
    { word: 'give', definition: 'To freely transfer possession', partOfSpeech: 'verb' },
    { word: 'tell', definition: 'To communicate information', partOfSpeech: 'verb' },
    { word: 'call', definition: 'To speak loudly to attract attention', partOfSpeech: 'verb' },
    { word: 'hand', definition: 'The end part of an arm', partOfSpeech: 'noun' },
    { word: 'home', definition: 'The place where one lives', partOfSpeech: 'noun' },
    { word: 'back', definition: 'The rear surface of the human body', partOfSpeech: 'noun' },
    { word: 'come', definition: 'To move toward something', partOfSpeech: 'verb' },
    { word: 'went', definition: 'Past tense of go', partOfSpeech: 'verb' },
    { word: 'said', definition: 'Past tense of say', partOfSpeech: 'verb' },
    { word: 'been', definition: 'Past participle of be', partOfSpeech: 'verb' },
    { word: 'have', definition: 'To possess or own', partOfSpeech: 'verb' },
    { word: 'part', definition: 'A piece or segment of something', partOfSpeech: 'noun' },
  ],
  MEDIUM: [
    { word: 'world', definition: 'The earth and all its inhabitants', partOfSpeech: 'noun' },
    { word: 'about', definition: 'Concerning or regarding', partOfSpeech: 'preposition' },
    { word: 'think', definition: 'To have a particular opinion', partOfSpeech: 'verb' },
    { word: 'after', definition: 'In the time following', partOfSpeech: 'preposition' },
    { word: 'place', definition: 'A particular position or location', partOfSpeech: 'noun' },
    { word: 'right', definition: 'Morally good or correct', partOfSpeech: 'adjective' },
    { word: 'small', definition: 'Of limited size', partOfSpeech: 'adjective' },
    { word: 'great', definition: 'Of an extent or intensity above normal', partOfSpeech: 'adjective' },
    { word: 'where', definition: 'In or to what place or position', partOfSpeech: 'adverb' },
    { word: 'every', definition: 'Used to refer to all members of a group', partOfSpeech: 'determiner' },
    { word: 'would', definition: 'Past form of will', partOfSpeech: 'modal verb' },
    { word: 'could', definition: 'Past form of can', partOfSpeech: 'modal verb' },
    { word: 'their', definition: 'Belonging to them', partOfSpeech: 'determiner' },
    { word: 'first', definition: 'Coming before all others', partOfSpeech: 'ordinal number' },
    { word: 'other', definition: 'Different from one already mentioned', partOfSpeech: 'determiner' },
    { word: 'night', definition: 'The period of darkness', partOfSpeech: 'noun' },
    { word: 'sound', definition: 'Vibrations that travel through air', partOfSpeech: 'noun' },
    { word: 'light', definition: 'Natural agent that stimulates sight', partOfSpeech: 'noun' },
    { word: 'never', definition: 'At no time in the past or future', partOfSpeech: 'adverb' },
    { word: 'point', definition: 'A particular spot or place', partOfSpeech: 'noun' },
  ],
  HARD: [
    { word: 'through', definition: 'Moving in one side and out of the other', partOfSpeech: 'preposition' },
    { word: 'between', definition: 'At or to a point in the middle', partOfSpeech: 'preposition' },
    { word: 'another', definition: 'Used to refer to an additional person', partOfSpeech: 'determiner' },
    { word: 'nothing', definition: 'Not anything', partOfSpeech: 'pronoun' },
    { word: 'against', definition: 'In opposition to', partOfSpeech: 'preposition' },
    { word: 'because', definition: 'For the reason that', partOfSpeech: 'conjunction' },
    { word: 'without', definition: 'In the absence of', partOfSpeech: 'preposition' },
    { word: 'brought', definition: 'Past tense of bring', partOfSpeech: 'verb' },
    { word: 'through', definition: 'From one end to another', partOfSpeech: 'preposition' },
    { word: 'thought', definition: 'Past tense of think', partOfSpeech: 'verb' },
    { word: 'special', definition: 'Better or different from usual', partOfSpeech: 'adjective' },
    { word: 'problem', definition: 'A matter requiring a solution', partOfSpeech: 'noun' },
    { word: 'present', definition: 'Existing or occurring now', partOfSpeech: 'adjective' },
    { word: 'several', definition: 'More than two but not many', partOfSpeech: 'determiner' },
    { word: 'general', definition: 'Affecting or concerning all', partOfSpeech: 'adjective' },
    { word: 'example', definition: 'A thing characteristic of its kind', partOfSpeech: 'noun' },
    { word: 'history', definition: 'The study of past events', partOfSpeech: 'noun' },
    { word: 'science', definition: 'The systematic study of nature', partOfSpeech: 'noun' },
    { word: 'pattern', definition: 'A repeated decorative design', partOfSpeech: 'noun' },
    { word: 'purpose', definition: 'The reason for which something is done', partOfSpeech: 'noun' },
  ],
  EXPERT: [
    { word: 'question', definition: 'A sentence worded to elicit information', partOfSpeech: 'noun' },
    { word: 'interest', definition: 'The state of wanting to know', partOfSpeech: 'noun' },
    { word: 'possible', definition: 'Able to be done', partOfSpeech: 'adjective' },
    { word: 'together', definition: 'With or in proximity to another', partOfSpeech: 'adverb' },
    { word: 'remember', definition: 'Have in or be able to bring to mind', partOfSpeech: 'verb' },
    { word: 'consider', definition: 'Think carefully about', partOfSpeech: 'verb' },
    { word: 'important', definition: 'Of great significance', partOfSpeech: 'adjective' },
    { word: 'complete', definition: 'Having all necessary parts', partOfSpeech: 'adjective' },
    { word: 'thousand', definition: 'The number equivalent to 1000', partOfSpeech: 'cardinal number' },
    { word: 'increase', definition: 'Become or make greater', partOfSpeech: 'verb' },
    { word: 'decision', definition: 'A conclusion reached after consideration', partOfSpeech: 'noun' },
    { word: 'material', definition: 'The matter from which something is made', partOfSpeech: 'noun' },
    { word: 'position', definition: 'A place where someone is located', partOfSpeech: 'noun' },
    { word: 'standard', definition: 'A level of quality', partOfSpeech: 'noun' },
    { word: 'strength', definition: 'The quality of being strong', partOfSpeech: 'noun' },
    { word: 'language', definition: 'Method of human communication', partOfSpeech: 'noun' },
    { word: 'evidence', definition: 'Information indicating truth', partOfSpeech: 'noun' },
    { word: 'research', definition: 'Systematic investigation', partOfSpeech: 'noun' },
    { word: 'organize', definition: 'Arrange systematically', partOfSpeech: 'verb' },
    { word: 'describe', definition: 'Give an account in words', partOfSpeech: 'verb' },
  ],
};

async function main() {
  console.log('Starting database seed...');

  for (const [difficulty, words] of Object.entries(SAMPLE_WORDS)) {
    console.log(`Seeding ${difficulty} words...`);
    
    for (const wordData of words) {
      await prisma.word.upsert({
        where: { word: wordData.word },
        update: {},
        create: {
          word: wordData.word,
          length: wordData.word.length,
          difficulty: difficulty,
          definition: wordData.definition,
          partOfSpeech: wordData.partOfSpeech,
          examples: [],
          synonyms: [],
        },
      });
    }
  }

  console.log('Seeding achievements...');
  
  const achievements = [
    {
      name: 'first_win',
      title: 'First Victory',
      description: 'Win your first game',
      icon: '🎯',
      category: 'milestone',
      requirement: 1,
      xpReward: 50,
      coinReward: 10,
      rarity: 'COMMON',
    },
    {
      name: 'win_streak_5',
      title: 'On Fire',
      description: 'Win 5 games in a row',
      icon: '🔥',
      category: 'streak',
      requirement: 5,
      xpReward: 150,
      coinReward: 25,
      rarity: 'RARE',
    },
    {
      name: 'perfect_game',
      title: 'Perfect',
      description: 'Win a game on the first guess',
      icon: '💎',
      category: 'skill',
      requirement: 1,
      xpReward: 200,
      coinReward: 50,
      rarity: 'EPIC',
    },
    {
      name: 'games_played_100',
      title: 'Dedicated',
      description: 'Play 100 games',
      icon: '🏆',
      category: 'milestone',
      requirement: 100,
      xpReward: 300,
      coinReward: 75,
      rarity: 'LEGENDARY',
    },
  ];

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { name: achievement.name },
      update: {},
      create: achievement,
    });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dailyWord = await prisma.word.findFirst({
    where: { difficulty: 'MEDIUM' },
  });

  if (dailyWord) {
    await prisma.dailyWord.upsert({
      where: { date: today },
      update: {},
      create: {
        date: today,
        wordId: dailyWord.id,
      },
    });
  }

  console.log('Database seed completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
