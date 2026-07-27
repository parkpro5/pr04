import { httpClient } from './httpClient';

export async function verifyRespondent({ round, respondentId, name }) {
  const { data } = await httpClient.post('/verify', { round, respondentId, name });
  return data;
}
