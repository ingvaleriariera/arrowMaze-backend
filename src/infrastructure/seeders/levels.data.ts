interface LevelSeedData {
  id: string;
  difficulty: string;
  moveLimit: number;
  boardLayout: string;
}

export const LEVELS_SEED: LevelSeedData[] = [
  {
    id: 'level-001',
    difficulty: 'easy',
    moveLimit: 15,
    boardLayout: JSON.stringify({
      grid:[
        [1,1,1,1],
        [1,1,1,1],
        [1,1,1,1],
        [1,1,1,1]
      ],
      rows: 4,
      cols: 4,
    }),
  },
  {
    id: 'level-002',
    difficulty: 'easy',
    moveLimit: 14,
    boardLayout: JSON.stringify({
      grid:[
        [0,1,0],
        [1,1,1],
        [0,1,0]
      ],
      rows: 3,
      cols: 3,
    }),
  },
  {
    id: 'level-003',
    difficulty: 'easy',
    moveLimit: 13,
    boardLayout: JSON.stringify({
      grid: [
        [0, 0, 1, 0, 0],
        [0, 1, 1, 1, 0],
        [1, 1, 1, 1, 1],
        [0, 1, 1, 1, 0],
        [0, 0, 1, 0, 0],
      ],
      rows: 5,
      cols: 5,
    }),
  },
  {
    id: 'level-004',
    difficulty: 'easy',
    moveLimit: 12,
    boardLayout: JSON.stringify({
      grid: [
        [0, 1, 1, 0],
        [1, 1, 1, 1],
        [1, 1, 1, 1],
        [0, 1, 1, 0],
      ],
      rows: 4,
      cols: 4,
    }),
  },
  {
    id: 'level-005',
    difficulty: 'easy',
    moveLimit: 10,
    boardLayout: JSON.stringify({
      grid: [
        [1, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 1, 1],
        [0, 0, 0, 1],
      ],
      rows: 4,
      cols: 4,
    }),
  },
  {
    id: 'level-006',
    difficulty: 'medium',
    moveLimit: 12,
    boardLayout: JSON.stringify({
      grid:[
        [0,0,1,1,0,1,1,0,0],
        [0,1,1,1,1,1,1,1,0],
        [1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1],
        [0,1,1,1,1,1,1,1,0],
        [0,0,1,1,1,1,1,0,0],
        [0,0,0,1,1,1,0,0,0],
        [0,0,0,0,1,0,0,0,0]
      ],
      rows: 9,
      cols: 9,
    }),
  },
  {
    id: 'level-007',
    difficulty: 'medium',
    moveLimit: 11,
    boardLayout: JSON.stringify({
      grid: [
        [1,1,1,1,1],
        [1,1,1,1,1],
        [1,1,1,1,1],
        [1,1,1,1,1],
        [1,1,1,1,1]
      ],
      rows: 5,
      cols: 5,
    }),
  },
  {
    id: 'level-008',
    difficulty: 'medium',
    moveLimit: 10,
    boardLayout: JSON.stringify({
      grid: [
        [1,1,1,1,1,1],
        [1,1,1,1,1,1],
        [1,1,1,1,1,1],
        [1,1,1,1,1,1],
        [1,1,1,1,1,1],
        [1,1,1,1,1,1]
      ],
      rows: 6,
      cols: 6,
    }),
  },
  {
    id: 'level-009',
    difficulty: 'medium',
    moveLimit: 9,
    boardLayout: JSON.stringify({
      grid: [
        [0,0,1,1,1,0,0],
        [0,0,1,1,1,0,0],
        [1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1],
        [0,0,1,1,1,0,0],
        [0,0,1,1,1,0,0]
      ],
      rows: 7,
      cols: 7,
    }),
  },
  {
    id: 'level-010',
    difficulty: 'medium',
    moveLimit: 8,
    boardLayout: JSON.stringify({
      grid: [
        [0,0,0,1,0,0,0],
        [0,0,1,1,1,0,0],
        [0,1,1,1,1,1,0],
        [1,1,1,1,1,1,1],
        [0,1,1,1,1,1,0],
        [0,0,1,1,1,0,0],
        [0,0,0,1,0,0,0]
      ],
      rows: 7,
      cols: 7,
    }),
  },
  {
    id: 'level-011',
    difficulty: 'hard',
    moveLimit: 9,
    boardLayout: JSON.stringify({
      grid: [
        [0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0],
      ],
      rows: 7,
      cols: 7,
    }),
  },
  {
    id: 'level-012',
    difficulty: 'hard',
    moveLimit: 8,
    boardLayout: JSON.stringify({
      grid: [
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
      ],
      rows: 8,
      cols: 8,
    }),
  },
  {
    id: 'level-013',
    difficulty: 'hard',
    moveLimit: 7,
    boardLayout: JSON.stringify({
      grid: [
        [1, 1, 1, 1, 1, 0, 0],
        [1, 1, 1, 1, 1, 0, 0],
        [0, 0, 1, 1, 0, 0, 0],
        [0, 0, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1],
        [0, 0, 0, 1, 1, 1, 1],
        [0, 0, 0, 1, 1, 1, 1],
      ],
      rows: 7,
      cols: 7,
    }),
  },
  {
    id: 'level-014',
    difficulty: 'hard',
    moveLimit: 6,
    boardLayout: JSON.stringify({
      grid: [
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
      ],
      rows: 8,
      cols: 8,
    }),
  },
  {
    id: 'level-015',
    difficulty: 'hard',
    moveLimit: 5,
    boardLayout: JSON.stringify({
      grid: [
        [1, 1, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 1, 1],
      ],
      rows: 8,
      cols: 8,
    }),
  },
];
