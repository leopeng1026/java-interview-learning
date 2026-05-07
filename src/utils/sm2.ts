export interface ReviewInfo {
  intervalDays: number;
  easeFactor: number;
  repetition: number;
  nextReviewTime: Date;
}

export interface SM2Params {
  quality: number;
  easeFactor: number;
  interval: number;
  repetition: number;
}

export class SM2Algorithm {
  private static readonly MIN_EASE_FACTOR = 1.3;

  static calculate(params: SM2Params): ReviewInfo {
    const { quality, easeFactor, interval, repetition } = params;

    let newEaseFactor = easeFactor;
    let newInterval: number;
    let newRepetition: number;

    if (quality < 2) {
      newRepetition = 0;
      newInterval = 1;
      newEaseFactor = Math.max(
        this.MIN_EASE_FACTOR,
        easeFactor - 0.2
      );
    } else {
      newRepetition = repetition + 1;

      if (newRepetition === 1) {
        newInterval = 1;
      } else if (newRepetition === 2) {
        newInterval = 6;
      } else {
        newInterval = Math.round(interval * newEaseFactor);

        if (quality === 4) {
          newInterval = Math.round(newInterval * 1.3);
        }
      }

      newEaseFactor =
        easeFactor +
        (0.1 - (4 - quality) * (0.08 + (4 - quality) * 0.02));
      newEaseFactor = Math.max(this.MIN_EASE_FACTOR, newEaseFactor);
    }

    const nextReviewTime = new Date();
    nextReviewTime.setDate(
      nextReviewTime.getDate() + newInterval
    );
    nextReviewTime.setHours(9, 0, 0, 0);

    return {
      intervalDays: newInterval,
      easeFactor: newEaseFactor,
      repetition: newRepetition,
      nextReviewTime,
    };
  }

  static getMasteryLevel(
    easeFactor: number,
    repetition: number
  ): 'untrained' | 'learning' | 'familiar' | 'mastered' {
    if (repetition === 0) {
      return 'untrained';
    } else if (repetition <= 2) {
      return 'learning';
    } else if (easeFactor >= 2.5) {
      return 'mastered';
    } else {
      return 'familiar';
    }
  }

  static getMasteryColor(
    level: 'untrained' | 'learning' | 'familiar' | 'mastered'
  ): string {
    const colors = {
      untrained: 'text-gray-400',
      learning: 'text-orange-500',
      familiar: 'text-blue-500',
      mastered: 'text-green-500',
    };
    return colors[level];
  }

  static getMasteryLabel(
    level: 'untrained' | 'learning' | 'familiar' | 'mastered'
  ): string {
    const labels = {
      untrained: '未训练',
      learning: '学习中',
      familiar: '熟悉',
      mastered: '已掌握',
    };
    return labels[level];
  }

  static calculateMasteryRate(
    easeFactor: number,
    repetition: number
  ): number {
    if (repetition === 0) {
      return 0;
    }

    const baseRate = Math.min(repetition * 15, 60);
    const easeBonus = (easeFactor - this.MIN_EASE_FACTOR) / (3 - this.MIN_EASE_FACTOR) * 40;

    return Math.min(100, baseRate + easeBonus);
  }
}
