import { TASK_LIBRARY, type TaskLibraryItem } from '../content/task-library';
import { getStageSummary, type ChildStageKey } from './stage';

export type RecommendationInput = {
  birthDate: Date;
  interests: string[];
  developmentSignals: string[];
  now?: Date;
};

export type DailyRecommendation = TaskLibraryItem & {
  stageKey: ChildStageKey;
  stageLabel: string;
};

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function countMatches(source: string[], candidates: string[]) {
  const normalizedSource = source.map(normalizeText);
  return candidates.reduce((count, candidate) => {
    const normalizedCandidate = normalizeText(candidate);
    return normalizedSource.some((item) => item === normalizedCandidate || item.includes(normalizedCandidate) || normalizedCandidate.includes(item))
      ? count + 1
      : count;
  }, 0);
}

function scoreTask(task: TaskLibraryItem, interests: string[], developmentSignals: string[]) {
  const interestMatches = countMatches(interests, task.interestTopics);
  const signalMatches = countMatches(developmentSignals, task.developmentSignals);
  const shortTaskBonus = task.durationMinutes <= 10 ? 1 : 0;

  return interestMatches * 50 + signalMatches * 20 + shortTaskBonus;
}

export function getDailyRecommendation(input: RecommendationInput): DailyRecommendation {
  const stage = getStageSummary(input.birthDate, input.now ?? new Date());
  const stageTasks = TASK_LIBRARY.filter((task) => task.stageKeys.includes(stage.stageKey));
  const rankedTasks = stageTasks
    .map((task) => ({
      task,
      score: scoreTask(task, input.interests, input.developmentSignals),
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

  const chosenTask = rankedTasks[0]?.task ?? TASK_LIBRARY[0];

  return {
    ...chosenTask,
    stageKey: stage.stageKey,
    stageLabel: stage.stageLabel,
  };
}
