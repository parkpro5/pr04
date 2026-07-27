import { httpClient } from './httpClient';

export async function createReceipt({ round, respondentId, name, signatureImage }) {
  const { data } = await httpClient.post('/receipt', { round, respondentId, name, signatureImage });
  return data;
}

export async function confirmReceipt(id) {
  const { data } = await httpClient.post(`/receipt/${id}/confirm`);
  return data.receipt;
}
