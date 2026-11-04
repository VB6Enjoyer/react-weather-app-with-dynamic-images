import { describe, expect, it } from 'vitest';
import { placeFromSearch, placeLabel, placeToSearch } from './placeUrl';

describe('placeToSearch', () => {
  it('stores typed searches as q', () => {
    expect(placeToSearch({ query: '  Paris ' })).toBe('?q=Paris');
  });

  it('rounds coordinates to two decimals and adds the name', () => {
    expect(placeToSearch({ lat: -31.3912, lon: -58.0209, label: 'Concordia' })).toBe(
      '?lat=-31.39&lon=-58.02&name=Concordia'
    );
  });

  it("falls back to the API's name when the place has no label", () => {
    expect(placeToSearch({ lat: 1, lon: 2 }, 'Buenos Aires')).toBe('?lat=1&lon=2&name=Buenos+Aires');
  });
});

describe('placeFromSearch', () => {
  it('reads typed searches', () => {
    expect(placeFromSearch('?q=Paris')).toEqual({ query: 'Paris' });
  });

  it('reads coordinates with an optional name', () => {
    expect(placeFromSearch('?lat=1.5&lon=-2&name=Somewhere')).toEqual({ lat: 1.5, lon: -2, label: 'Somewhere' });
    expect(placeFromSearch('?lat=1.5&lon=-2')).toEqual({ lat: 1.5, lon: -2, label: undefined });
  });

  it('prefers q when both are present', () => {
    expect(placeFromSearch('?q=Paris&lat=1&lon=2')).toEqual({ query: 'Paris' });
  });

  it('returns null when there is no usable place', () => {
    expect(placeFromSearch('')).toBeNull();
    expect(placeFromSearch('?q=%20%20')).toBeNull();
    expect(placeFromSearch('?lat=abc&lon=1')).toBeNull();
  });

  it('round-trips through placeToSearch', () => {
    const place = { lat: -31.39, lon: -58.02, label: 'Concordia' };
    expect(placeFromSearch(placeToSearch(place))).toEqual(place);
  });
});

describe('placeLabel', () => {
  it('gives the text to prefill the search box with', () => {
    expect(placeLabel({ query: 'Paris' })).toBe('Paris');
    expect(placeLabel({ lat: 1, lon: 2, label: 'Concordia' })).toBe('Concordia');
    expect(placeLabel(null)).toBe('');
  });
});
