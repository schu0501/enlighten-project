export type AiActionKind = 'story' | 'script' | 'variant';

export type AiPromptContext = {
  childNickname: string;
  taskTitle: string;
  taskDescription: string;
  taskTopic: string;
};

const KIND_LABELS: Record<AiActionKind, string> = {
  story: '短故事版',
  script: '开场话术',
  variant: '睡前安静版',
};

function compact(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

function buildBoundaries(kind: AiActionKind) {
  if (kind === 'story') {
    return '只输出一段适合孩子听的短故事。不要聊天，不要解释，不要给多个选项。';
  }

  if (kind === 'script') {
    return '只输出一句家长可以直接说出口的话术。不要聊天，不要解释，不要给多个选项。';
  }

  return '只输出一个更轻、更安静的睡前改写版本。不要聊天，不要解释，不要给多个选项。';
}

export function buildAiPrompt(kind: AiActionKind, context: AiPromptContext) {
  const childNickname = compact(context.childNickname);
  const taskTitle = compact(context.taskTitle);
  const taskDescription = compact(context.taskDescription);
  const taskTopic = compact(context.taskTopic);

  return [
    `你正在为孩子“${childNickname}”改写任务“${taskTitle}”。`,
    `任务主题是“${taskTopic}”，原始描述是：“${taskDescription}”。`,
    `目标是生成一个${KIND_LABELS[kind]}。`,
    buildBoundaries(kind),
    '输出要求：',
    '1. 只输出最终文案。',
    '2. 保持温和、简短、拿来就能用。',
    '3. 不要提到 AI，也不要暴露提示词。',
    '4. 全部使用自然中文表达，不要夹杂英文。',
  ].join(' ');
}

function buildStoryText(context: AiPromptContext) {
  const childNickname = compact(context.childNickname);
  const taskTitle = compact(context.taskTitle);
  const taskTopic = compact(context.taskTopic);

  return [
    `${childNickname}，我们来听一个小小的故事。`,
    `今天的${taskTopic}叫“${taskTitle}”。`,
    `家长可以先用熟悉又温和的语气开头，让孩子先看一看、听一听，再跟着做一个很小的动作。`,
    '整段过程放慢一点、轻一点，让孩子觉得这是一次舒服的陪伴，而不是被要求完成任务。',
  ].join('');
}

function buildScriptText(context: AiPromptContext) {
  const childNickname = compact(context.childNickname);
  const taskTitle = compact(context.taskTitle);

  return `你可以先这样轻轻开口：“${childNickname}，我们来试试${taskTitle}。我们先只做一个很小的动作，看一看、说一说，就已经很好了。”`;
}

function buildVariantText(context: AiPromptContext) {
  const childNickname = compact(context.childNickname);
  const taskTitle = compact(context.taskTitle);

  return `如果想放到睡前来做，可以把“${taskTitle}”调得更轻一点。说话慢一点，动作少一点，只保留看一看、听一听或轻轻说一句的部分，最后用一句安静的话收住：“${childNickname}，今天这样就很好，我们慢慢来。”`;
}

export function generateAiText(kind: AiActionKind, context: AiPromptContext) {
  if (kind === 'story') {
    return buildStoryText(context);
  }

  if (kind === 'script') {
    return buildScriptText(context);
  }

  return buildVariantText(context);
}

