import { httpClient } from './httpClient';

export async function staffLogin(employeeId, name) {
  const { data } = await httpClient.post('/auth/staff-login', { employeeId, name });
  return data;
}
