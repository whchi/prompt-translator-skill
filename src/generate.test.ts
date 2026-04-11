import { describe, it, expect } from 'vitest';
import { SKILL_NAME, getExamples } from './generate.js';

describe('generate', () => {
	it('SKILL_NAME is fixed to prompt2eng', () => {
		expect(SKILL_NAME).toBe('prompt2eng');
	});

	describe('getExamples', () => {
		const mockData: Record<string, Array<{ input: string; output: string }>> = {
			zh: [{ input: '繁體中文', output: 'Traditional Chinese' }],
			'zh-CN': [{ input: '简体中文', output: 'Simplified Chinese' }],
			'zh-TW': [
				{ input: '繁體中文（台灣）', output: 'Traditional Chinese (Taiwan)' },
			],
			'zh-HK': [
				{
					input: '繁體中文（香港）',
					output: 'Traditional Chinese (Hong Kong)',
				},
			],
			es: [{ input: 'es base', output: 'Spanish base' }],
			'es-MX': [{ input: 'es-MX', output: 'Mexican Spanish' }],
		};

		it('should return region-specific examples when available', () => {
			const result = getExamples('zh-CN', mockData);
			expect(result.examples[0].input).toBe('简体中文');
		});

		it('should return region-specific examples for zh-TW', () => {
			const result = getExamples('zh-TW', mockData);
			expect(result.examples[0].input).toBe('繁體中文（台灣）');
		});

		it('should return region-specific examples for zh-HK', () => {
			const result = getExamples('zh-HK', mockData);
			expect(result.examples[0].input).toBe('繁體中文（香港）');
		});

		it('should fall back to base language when region not found', () => {
			const result = getExamples('zh', mockData);
			expect(result.examples[0].input).toBe('繁體中文');
		});

		it('should fall back to base when region variant missing', () => {
			const result = getExamples('es-ES', mockData);
			expect(result.examples[0].input).toBe('es base');
		});

		it('should prefer region-specific over base', () => {
			const result = getExamples('es-MX', mockData);
			expect(result.examples[0].input).toBe('es-MX');
		});

		it('should handle case-insensitive region tags', () => {
			const result = getExamples('zh-tw', mockData);
			expect(result.examples[0].input).toBe('繁體中文（台灣）');
		});

		it('should handle uppercase region tags', () => {
			const result = getExamples('ZH-TW', mockData);
			expect(result.examples[0].input).toBe('繁體中文（台灣）');
		});

		it('should fall back to zh when no match at all', () => {
			const result = getExamples('xx', mockData);
			expect(result.examples[0].input).toBe('繁體中文');
		});
	});
});
