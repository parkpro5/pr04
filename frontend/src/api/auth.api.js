import { httpClient } from './httpClient';

export async function staffLogin(employeeId, name, secretKey) {
  const { data } = await httpClient.post('/auth/staff-login', { employeeId, name, secretKey });
  return data;
}
