import type { ChildStageKey } from './stage';

export type Topic = {
  id: string;
  title: string;
  summary: string;
  stageKeys: ChildStageKey[];
};

export const STAGE_LABELS: Record<ChildStageKey, string> = {
  infant: '婴儿觉察期',
  toddler: '幼儿启蒙期',
  preschool: '学前准备期',
};

export const TOPICS: Topic[] = [
  {
    id: 'animals',
    title: '动物',
    summary: '从叫声、动作和身体特征切入，让孩子先说出看见的东西。',
    stageKeys: ['toddler', 'preschool'],
  },
  {
    id: 'transport',
    title: '交通工具',
    summary: '把路上看到的车、船、飞机连到“去哪儿”的简单问题上。',
    stageKeys: ['toddler'],
  },
  {
    id: 'stories',
    title: '故事',
    summary: '用一句接一句的方式，让孩子跟着续说和复述。',
    stageKeys: ['toddler', 'preschool'],
  },
  {
    id: 'sounds',
    title: '声音',
    summary: '用拍手、拟声和节奏游戏，帮助孩子先听再模仿。',
    stageKeys: ['infant'],
  },
  {
    id: 'routine',
    title: '生活习惯',
    summary: '把穿衣、收拾和出门准备拆成孩子能跟上的小步骤。',
    stageKeys: ['preschool'],
  },
  {
    id: 'colors',
    title: '颜色和形状',
    summary: '从身边物品里找颜色、轮廓和分类线索，轻松做观察练习。',
    stageKeys: ['infant', 'toddler'],
  },
];
