import { httpClient } from './httpClient';

export async function uploadRoster(file) {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await httpClient.post('/roster/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function getRounds() {
  const { data } = await httpClient.get('/roster/rounds');
  return data.rounds;
}

export async function getRosterByRound(round) {
  const { data } = await httpClient.get(`/roster/${encodeURIComponent(round)}`);
  return data.rows;
}
