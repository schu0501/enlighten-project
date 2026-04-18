import { TASK_LIBRARY, type TaskLibraryItem } from '../content/task-library';
import { getAgeLabelInChinese } from '../lib/age';
import { auth, getPrimaryChildForEmail } from '../lib/auth';
import { getDailyRecommendation } from '../lib/recommendation';

type TaskView = {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  topic: string;
  href: string;
};

type TaskFallback = {
  title: string;
  description: string;
};

export type TodayPageData = {
  childLabel: string;
  childNickname: string;
  primaryTask: TaskView;
  backupTasks: TaskView[];
};

export type TaskDetailData = {
  childLabel: string;
  childNickname: string;
  task: TaskView;
  steps: string[];
  fallbacks: TaskFallback[];
  offlineExtension: string;
  aiActions: string[];
};

const CHILD_LABEL_SEPARATOR = ` ${String.fromCodePoint(0x00b7)} `;

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function countMatches(source: string[], candidates: string[]) {
  const normalizedSource = source.map(normalizeText);

  return candidates.reduce((count, candidate) => {
    const normalizedCandidate = normalizeText(candidate);
    const matched = normalizedSource.some(
      (item) => item === normalizedCandidate || item.includes(normalizedCandidate) || normalizedCandidate.includes(item),
    );

    return matched ? count + 1 : count;
  }, 0);
}

function scoreTask(task: TaskLibraryItem, interests: string[], developmentSignals: string[]) {
  const interestMatches = countMatches(interests, task.interestTopics);
  const signalMatches = countMatches(developmentSignals, task.developmentSignals);
  const shortTaskBonus = task.durationMinutes <= 10 ? 1 : 0;

  return interestMatches * 50 + signalMatches * 20 + shortTaskBonus;
}

function rankTasks(tasks: TaskLibraryItem[], interests: string[], developmentSignals: string[]) {
  return tasks
    .map((task) => ({
      task,
      score: scoreTask(task, interests, developmentSignals),
    }))
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      if (left.task.durationMinutes !== right.task.durationMinutes) {
        return left.task.durationMinutes - right.task.durationMinutes;
      }

      return left.task.title.localeCompare(right.task.title);
    });
}

function toTaskView(task: TaskLibraryItem): TaskView {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    durationMinutes: task.durationMinutes,
    topic: task.topic,
    href: `/tasks/${task.id}`,
  };
}

function buildPlaybook(task: TaskLibraryItem): Omit<TaskDetailData, 'childLabel' | 'childNickname' | 'task'> {
  return {
    steps: [
      `\u4f60\u5148\u7528\u4e00\u53e5\u5f88\u8f7b\u7684\u8bdd\u5f00\u573a\uff0c\u6bd4\u5982\u201c\u6211\u4eec\u6765\u8bd5\u8bd5 ${task.title}\u3002\u201d`,
      '\u53ea\u505a 1 \u4e2a\u6700\u5c0f\u52a8\u4f5c\uff0c\u8ba9\u5b69\u5b50\u5148\u770b\u3001\u5148\u542c\u3001\u5148\u8ddf 1 \u6b21\u3002',
      '\u7ed3\u675f\u65f6\u8bf4\u51fa\u4e00\u4e2a\u5177\u4f53\u89c2\u5bdf\uff0c\u54ea\u6015\u53ea\u662f\u201c\u4f60\u521a\u624d\u4e00\u76f4\u5728\u8ba4\u771f\u770b\u201d\u3002',
    ],
    fallbacks: [
      {
        title: '\u5b69\u5b50\u53ea\u60f3\u770b',
        description: '\u628a\u76ee\u6807\u7f29\u6210 1 \u5206\u949f\u89c2\u5bdf\u7248\uff0c\u5148\u8ba9\u5b69\u5b50\u7ad9\u5728\u65c1\u8fb9\u4e5f\u7b97\u5f00\u59cb\u3002',
      },
      {
        title: '\u5b69\u5b50\u60f3\u6362\u5185\u5bb9',
        description: `\u4fdd\u7559 ${task.topic} \u4e3b\u9898\uff0c\u6362\u6210\u5bb6\u91cc\u73b0\u6210\u7684\u7269\u54c1\u6216\u8def\u4e0a\u80fd\u770b\u5230\u7684\u4e1c\u897f\u3002`,
      },
    ],
    offlineExtension:
      '\u6ca1\u6709\u5c4f\u5e55\u4e5f\u6ca1\u5173\u7cfb\uff0c\u6539\u6210\u201c\u770b\u89c1\u5c31\u8bf4\u3001\u6478\u5230\u5c31\u8bf4\u3001\u8d70\u5230\u5c31\u8bf4\u201d\u7684\u771f\u5b9e\u7269\u54c1\u7248\u3002',
    aiActions: ['\u6539\u6210 5 \u5206\u949f\u7248', '\u7ed9\u6211\u4e00\u53e5\u66f4\u81ea\u7136\u7684\u5f00\u573a\u767d', '\u5982\u679c\u5b69\u5b50\u4e0d\u914d\u5408\u600e\u4e48\u529e'],
  };
}

async function getCurrentChild() {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    return null;
  }

  return getPrimaryChildForEmail(email);
}

export async function getTodayPageData(): Promise<TodayPageData | null> {
  const child = await getCurrentChild();

  if (!child) {
    return null;
  }

  const recommendation = getDailyRecommendation({
    birthDate: child.birthDate,
    interests: [],
    developmentSignals: [],
  });
  const rankedTasks = rankTasks(
    TASK_LIBRARY.filter((task) => task.stageKeys.includes(recommendation.stageKey)),
    [],
    [],
  );

  return {
    childLabel: `${child.nickname}${CHILD_LABEL_SEPARATOR}${getAgeLabelInChinese(child.birthDate, new Date())}`,
    childNickname: child.nickname,
    primaryTask: toTaskView(recommendation),
    backupTasks: rankedTasks.filter(({ task }) => task.id !== recommendation.id).slice(0, 3).map(({ task }) => toTaskView(task)),
  };
}

export async function getTaskDetailData(slug: string): Promise<TaskDetailData | null> {
  const child = await getCurrentChild();
  const task = TASK_LIBRARY.find((item) => item.id === slug);

  if (!child || !task) {
    return null;
  }

  return {
    childLabel: `${child.nickname}${CHILD_LABEL_SEPARATOR}${getAgeLabelInChinese(child.birthDate, new Date())}`,
    childNickname: child.nickname,
    task: toTaskView(task),
    ...buildPlaybook(task),
  };
}
