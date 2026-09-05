import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');

test('shared accessibility controls are present', () => {
  for (const text of ['A- Decrease','A Reset','A+ Increase','High contrast','Reduce motion','Listen to this page','Pause listening','Stop listening','Reset accessibility']) {
    assert.ok(html.includes(text), `missing ${text}`);
  }
});

test('text sizing persists from 80 to 200 percent', () => {
  assert.ok(html.includes('roi-text-size'));
  assert.match(html, /Math\.max\([^\n]*80\)/);
  assert.match(html, /Math\.min\([^\n]*200\)/);
});

test('contrast and motion preferences persist', () => {
  assert.ok(html.includes('roi-high-contrast'));
  assert.ok(html.includes('roi-reduce-motion'));
  assert.match(html, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
});

test('read aloud excludes interactive inputs and supports pause/resume', () => {
  assert.ok(html.includes('cloneNode(true)'));
  assert.ok(html.includes('input, textarea, select, button, [data-speech-exclude]'));
  assert.ok(html.includes('speechSynthesis.pause()'));
  assert.ok(html.includes('speechSynthesis.resume()'));
});

test('calculator logic and core controls remain intact', () => {
  for (const marker of ['function calculate()', 'id="employees"', 'id="current-pct"', 'id="sector"', 'id="payroll"', 'id="digital"', 'id="results-region"', 'ROI Index']) {
    assert.ok(html.includes(marker), `missing calculator marker ${marker}`);
  }
});

test('accessibility note avoids unsupported conformance claims', () => {
  assert.ok(!html.includes('WCAG 2.0/2.1/2.2 Level AAA'));
  assert.ok(!html.includes('Screen reader compatible'));
  assert.ok(!html.includes('Colour contrast 7:1+'));
  assert.ok(html.includes('Targets WCAG 2.2 AA'));
  assert.ok(html.includes('Calculator inputs are processed in this browser'));
});
