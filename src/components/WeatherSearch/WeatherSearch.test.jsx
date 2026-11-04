import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { searchCities } from '../../api/openWeather';
import WeatherSearch from './WeatherSearch';

vi.mock('../../api/openWeather', () => ({
  searchCities: vi.fn(),
  isRequestCancelled: () => false,
}));

const CITIES = [
  { name: 'Concordia', lat: -31.39, lon: -58.02, country: 'AR', state: 'Entre Ríos' },
  { name: 'Concordia', lat: -31.39, lon: -58.02, country: 'AR', state: 'Entre Ríos' }, // Duplicate
  { name: 'Concordia', lat: 39.57, lon: -97.66, country: 'US', state: 'Kansas' },
];

function setup(props = {}) {
  const fetchData = vi.fn();
  const onLocate = vi.fn();
  render(<WeatherSearch fetchData={fetchData} onLocate={onLocate} isLoading={false} {...props} />);
  return { fetchData, onLocate, user: userEvent.setup(), input: screen.getByRole('combobox', { name: 'Location' }) };
}

beforeEach(() => {
  searchCities.mockReset();
  searchCities.mockResolvedValue(CITIES);
});

describe('WeatherSearch', () => {
  it('suggests matching places with their region, without duplicates', async () => {
    const { user, input } = setup();

    await user.type(input, 'Conc');

    const options = await screen.findAllByRole('option');
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveTextContent('Entre Ríos, Argentina');
    expect(options[1]).toHaveTextContent('Kansas, United States');
    expect(input).toHaveAttribute('aria-expanded', 'true');
  });

  it('picks a suggestion with the arrow keys and Enter', async () => {
    const { user, input, fetchData } = setup();

    await user.type(input, 'Conc');
    await screen.findAllByRole('option');
    await user.keyboard('{ArrowDown}{ArrowDown}');

    expect(screen.getAllByRole('option')[1]).toHaveAttribute('aria-selected', 'true');

    await user.keyboard('{Enter}');

    expect(fetchData).toHaveBeenCalledWith({ lat: 39.57, lon: -97.66, label: 'Concordia' });
    expect(input).toHaveValue('Concordia');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('picks a suggestion with the mouse', async () => {
    const { user, input, fetchData } = setup();

    await user.type(input, 'Conc');
    await user.click((await screen.findAllByRole('option'))[0]);

    expect(fetchData).toHaveBeenCalledWith({ lat: -31.39, lon: -58.02, label: 'Concordia' });
  });

  it('searches the typed text when submitted before suggestions load', async () => {
    const { user, input, fetchData } = setup();

    await user.type(input, 'Paris{Enter}');

    expect(fetchData).toHaveBeenCalledWith({ query: 'Paris' });

    // The pending lookup is dropped, so no list appears afterwards
    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(searchCities).not.toHaveBeenCalled();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes the suggestions with Escape', async () => {
    const { user, input } = setup();

    await user.type(input, 'Conc');
    await screen.findAllByRole('option');
    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });

  it('asks for the location when the location button is clicked', async () => {
    const { user, onLocate } = setup();

    await user.click(screen.getByRole('button', { name: 'Use my location' }));
    expect(onLocate).toHaveBeenCalledTimes(1);
  });

  it('disables searching while a search is loading', () => {
    setup({ isLoading: true });

    expect(screen.getByRole('button', { name: 'Search' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Use my location' })).toBeDisabled();
  });
});
