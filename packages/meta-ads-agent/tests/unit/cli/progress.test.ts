import { describe, it, expect } from 'vitest';
import { COLORS, STEP_LABELS, STEP_SUCCESS, formatDuration } from '../../../src/cli/progress.js';

describe('progress module', () => {
  describe('COLORS', () => {
    it('should export GREEN ANSI code', () => {
      expect(COLORS.GREEN).toBe('\x1b[32m');
    });

    it('should export RED ANSI code', () => {
      expect(COLORS.RED).toBe('\x1b[31m');
    });

    it('should export YELLOW ANSI code', () => {
      expect(COLORS.YELLOW).toBe('\x1b[33m');
    });

    it('should export BOLD ANSI code', () => {
      expect(COLORS.BOLD).toBe('\x1b[1m');
    });

    it('should export RESET ANSI code', () => {
      expect(COLORS.RESET).toBe('\x1b[0m');
    });
  });

  describe('STEP_LABELS', () => {
    it('should contain all 5 steps', () => {
      const keys = Object.keys(STEP_LABELS);
      expect(keys).toHaveLength(5);
      expect(keys).toEqual(['validate', 'upload', 'campaign', 'adset', 'activate']);
    });

    it('should have numbered labels [n/5]', () => {
      expect(STEP_LABELS.validate).toContain('[1/5]');
      expect(STEP_LABELS.upload).toContain('[2/5]');
      expect(STEP_LABELS.campaign).toContain('[3/5]');
      expect(STEP_LABELS.adset).toContain('[4/5]');
      expect(STEP_LABELS.activate).toContain('[5/5]');
    });
  });

  describe('STEP_SUCCESS', () => {
    it('should contain all 5 steps', () => {
      const keys = Object.keys(STEP_SUCCESS);
      expect(keys).toHaveLength(5);
    });

    it('should have numbered success messages', () => {
      expect(STEP_SUCCESS.validate).toContain('[1/5]');
      expect(STEP_SUCCESS.activate).toContain('[5/5]');
    });
  });

  describe('formatDuration', () => {
    it('should format sub-second durations', () => {
      expect(formatDuration(500)).toBe('0.5s');
    });

    it('should format durations under 1 second with decimal', () => {
      expect(formatDuration(750)).toBe('0.8s');
    });

    it('should format seconds with one decimal', () => {
      expect(formatDuration(1234)).toBe('1.2s');
    });

    it('should format exact seconds', () => {
      expect(formatDuration(5000)).toBe('5.0s');
    });

    it('should format minutes and seconds', () => {
      expect(formatDuration(65000)).toBe('1m 05s');
    });

    it('should format multiple minutes', () => {
      expect(formatDuration(125000)).toBe('2m 05s');
    });

    it('should pad seconds with zero in minute format', () => {
      expect(formatDuration(63000)).toBe('1m 03s');
    });
  });
});
