import { WORKSHOP_DATA, type Exercise, type Purpose, type Level } from "@/data/data";

export type Curriculum = {
  icebreakers: Exercise[];
  main: Exercise[];
  closing: Exercise | null;
  totalDuration: number;
};

const LEVEL_ORDER: Record<string, number> = { "初級": 1, "中級": 2, "上級": 3 };

export function generateCurriculum({
  people,
  purpose,
  level,
  duration,
}: {
  people: number;
  purpose: Purpose;
  level: Level;
  duration: number;
}): Curriculum {
  const result: Curriculum = { icebreakers: [], main: [], closing: null, totalDuration: 0 };
  const userLevel = LEVEL_ORDER[level] || 1;

  const validIcebreakers = WORKSHOP_DATA.icebreakers.filter(
    (e) => people >= e.minPeople && people <= e.maxPeople && LEVEL_ORDER[e.level] <= userLevel
  );
  const validClosings = WORKSHOP_DATA.closings.filter(
    (e) => people >= e.minPeople && people <= e.maxPeople
  );
  const purposeExercises = (WORKSHOP_DATA.mainExercises[purpose] || []).filter(
    (e) => people >= e.minPeople && people <= e.maxPeople && LEVEL_ORDER[e.level] <= userLevel
  );

  const icebreakerCount = duration >= 60 ? 2 : 1;
  if (validIcebreakers.length > 0) {
    const shuffledIce = [...validIcebreakers].sort(() => Math.random() - 0.5);
    const picked = shuffledIce.slice(0, Math.min(icebreakerCount, shuffledIce.length));
    result.icebreakers = picked;
    result.totalDuration += picked.reduce((sum, e) => sum + e.duration, 0);
  }

  if (validClosings.length > 0) {
    result.closing = validClosings[Math.floor(Math.random() * validClosings.length)];
    result.totalDuration += result.closing.duration;
  }

  const remainingTime = duration - result.totalDuration - 10;
  let timeUsed = 0;
  const shuffled = [...purposeExercises].sort(() => Math.random() - 0.5);

  for (const ex of shuffled) {
    if (timeUsed + ex.duration <= remainingTime) {
      result.main.push(ex);
      timeUsed += ex.duration;
    }
  }

  if (result.main.length < 2 && timeUsed < remainingTime - 15) {
    for (const ex of shuffled) {
      if (!result.main.find((m) => m.name === ex.name) && timeUsed + ex.duration <= remainingTime) {
        result.main.push(ex);
        timeUsed += ex.duration;
      }
    }
  }

  const icebreakerTotal = result.icebreakers.reduce((sum, e) => sum + e.duration, 0);
  result.totalDuration =
    icebreakerTotal + timeUsed + (result.closing?.duration || 0);
  return result;
}
