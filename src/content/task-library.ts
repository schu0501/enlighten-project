import type { ChildStageKey } from '../lib/stage';

export type TaskLibraryItem = {
  id: string;
  topic: string;
  title: string;
  description: string;
  durationMinutes: number;
  stageKeys: ChildStageKey[];
  interestTopics: string[];
  developmentSignals: string[];
};

export const TASK_LIBRARY: TaskLibraryItem[] = [
  {
    id: 'toddler-animal-sound-hunt',
    topic: '动物',
    title: '动物声音找一找',
    description: '和孩子一起模仿 3 种动物的叫声，顺便说出它们常见的动作。',
    durationMinutes: 8,
    stageKeys: ['toddler'],
    interestTopics: ['动物'],
    developmentSignals: ['开始说短句', '喜欢模仿声音'],
  },
  {
    id: 'toddler-transport-match',
    topic: '交通工具',
    title: '交通工具配对小游戏',
    description: '找出家里或路上看到的交通工具，说出它们会去哪儿。',
    durationMinutes: 10,
    stageKeys: ['toddler'],
    interestTopics: ['交通工具'],
    developmentSignals: ['开始说短句', '喜欢追问'],
  },
  {
    id: 'toddler-story-bite',
    topic: '故事',
    title: '一句接一句的小故事',
    description: '家长先说一句，孩子补一句，把熟悉角色串成一个小故事。',
    durationMinutes: 10,
    stageKeys: ['toddler', 'preschool'],
    interestTopics: ['故事'],
    developmentSignals: ['开始说短句', '爱听故事'],
  },
  {
    id: 'preschool-animal-observation',
    topic: '动物',
    title: '动物观察与提问',
    description: '观察一张动物图片，鼓励孩子描述外形、动作和生活环境。',
    durationMinutes: 12,
    stageKeys: ['preschool'],
    interestTopics: ['动物'],
    developmentSignals: ['爱听故事', '愿意表达想法'],
  },
  {
    id: 'infant-sensory-rhyme',
    topic: '声音',
    title: '声音和节奏回应',
    description: '用轻快的节奏和重复音节和孩子互动，观察表情和回应。',
    durationMinutes: 6,
    stageKeys: ['infant'],
    interestTopics: ['音乐'],
    developmentSignals: ['会看着家长回应'],
  },
  {
    id: 'preschool-routine-checklist',
    topic: '生活习惯',
    title: '出门前的小清单',
    description: '和孩子一起确认出门要带的东西，培养简单的规则意识。',
    durationMinutes: 9,
    stageKeys: ['preschool'],
    interestTopics: ['生活'],
    developmentSignals: ['能完成两步指令'],
  },
];
