import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Background from './Background';

// jsdom never loads images, so record each preload and let tests finish it
let preloads;
class FakeImage {
  constructor() {
    preloads.push(this);
  }
}

beforeEach(() => {
  preloads = [];
  vi.stubGlobal('Image', FakeImage);
});
afterEach(() => vi.unstubAllGlobals());

const layerUrls = (container) =>
  [...container.querySelectorAll('.background-layer')].map((layer) => layer.style.backgroundImage);

const finishLoading = (url) =>
  act(() => {
    preloads.find((image) => image.src === url).onload();
  });

describe('Background', () => {
  it('shows the first image straight away, without fading', () => {
    const { container } = render(<Background url="first.jpg" />);

    expect(layerUrls(container)).toEqual(['url("first.jpg")']);
    expect(container.querySelector('.background-layer')).not.toHaveClass('fade-in');
  });

  it('adds a new image on top only after it has loaded', () => {
    const { container, rerender } = render(<Background url="first.jpg" />);

    rerender(<Background url="second.jpg" />);
    expect(layerUrls(container)).toEqual(['url("first.jpg")']);

    finishLoading('second.jpg');
    expect(layerUrls(container)).toEqual(['url("first.jpg")', 'url("second.jpg")']);
    expect(container.querySelectorAll('.background-layer')[1]).toHaveClass('fade-in');
  });

  it('keeps at most three layers, dropping the oldest', () => {
    const { container, rerender } = render(<Background url="1.jpg" />);

    for (const url of ['2.jpg', '3.jpg', '4.jpg']) {
      rerender(<Background url={url} />);
      finishLoading(url);
    }

    expect(layerUrls(container)).toEqual(['url("2.jpg")', 'url("3.jpg")', 'url("4.jpg")']);
  });

  it('ignores an image that finishes loading after a newer one was requested', () => {
    const { container, rerender } = render(<Background url="first.jpg" />);

    rerender(<Background url="slow.jpg" />);
    const slow = preloads.find((image) => image.src === 'slow.jpg');
    rerender(<Background url="fast.jpg" />);
    finishLoading('fast.jpg');
    act(() => slow.onload?.());

    expect(layerUrls(container)).toEqual(['url("first.jpg")', 'url("fast.jpg")']);
  });
});
