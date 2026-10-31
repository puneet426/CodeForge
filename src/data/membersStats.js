import { BATCHES } from './members';

export const MEMBER_COUNT = BATCHES.reduce((n, b) => n + b.members.length, 0);
