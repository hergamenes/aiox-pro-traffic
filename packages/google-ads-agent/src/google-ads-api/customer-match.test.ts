import { describe, it, expect, vi, beforeEach } from 'vitest';

// ⚠️ NENHUM PII REAL — só hashes fake determinísticos.

// ---- Fake customer (mutateResources + offlineUserDataJobs) ----
const mutateResources = vi.fn(
  async (_ops?: unknown, _opts?: unknown) => ({
    mutate_operation_responses: [
      { user_list: { resource_name: 'customers/1112223333/userLists/999' } },
    ],
  }),
);
const createOfflineUserDataJob = vi.fn(
  async (_req?: unknown): Promise<{ resource_name?: string }> => ({
    resource_name: 'customers/1112223333/offlineUserDataJobs/555',
  }),
);
const addOfflineUserDataJobOperations = vi.fn(async (_req?: unknown): Promise<unknown> => ({}));
const runOfflineUserDataJob = vi.fn(
  async (_req?: unknown): Promise<{ name?: string }> => ({ name: 'operations/abc-123' }),
);

const fakeCustomer = {
  mutateResources,
  offlineUserDataJobs: {
    createOfflineUserDataJob,
    addOfflineUserDataJobOperations,
    runOfflineUserDataJob,
  },
};

vi.mock('./client.js', () => ({
  getCustomer: () => fakeCustomer,
}));

import {
  buildCrmUserListOperation,
  createCrmUserList,
  buildUserDataOperations,
  runCustomerMatchUpload,
} from './customer-match.js';
import type { HashedIdentifier } from '../types/audience.js';

const fakeClient = {} as unknown as Parameters<typeof createCrmUserList>[0];

// Hashes fake (não são hashes reais de PII — só strings hex de teste).
const HASH_EMAIL = 'a'.repeat(64);
const HASH_PHONE = 'b'.repeat(64);

beforeEach(() => {
  vi.clearAllMocks();
  mutateResources.mockResolvedValue({
    mutate_operation_responses: [
      { user_list: { resource_name: 'customers/1112223333/userLists/999' } },
    ],
  });
  createOfflineUserDataJob.mockResolvedValue({
    resource_name: 'customers/1112223333/offlineUserDataJobs/555',
  });
  runOfflineUserDataJob.mockResolvedValue({ name: 'operations/abc-123' });
});

interface UserListResourceView {
  name?: string;
  description?: string;
  membership_status?: string;
  crm_based_user_list?: { upload_key_type?: string; data_source_type?: string };
}

describe('buildCrmUserListOperation — builder puro (Fase 1)', () => {
  it('monta a MutateOperation com crm_based_user_list + CONTACT_INFO', () => {
    const op = buildCrmUserListOperation({ name: 'Base CRM', uploadKeyType: 'CONTACT_INFO' });
    expect(op.entity).toBe('user_list');
    expect(op.operation).toBe('create');
    const r = op.resource as unknown as UserListResourceView;
    expect(r.name).toBe('Base CRM');
    expect(r.membership_status).toBe('OPEN');
    expect(r.crm_based_user_list?.upload_key_type).toBe('CONTACT_INFO');
  });

  it('omite data_source_type (usa default FIRST_PARTY da API)', () => {
    const op = buildCrmUserListOperation({ name: 'X', uploadKeyType: 'CONTACT_INFO' });
    const r = op.resource as unknown as UserListResourceView;
    expect(r.crm_based_user_list?.data_source_type).toBeUndefined();
  });

  it('inclui description quando fornecida e omite quando não', () => {
    const withDesc = buildCrmUserListOperation({
      name: 'X',
      description: 'desc',
      uploadKeyType: 'CONTACT_INFO',
    });
    expect((withDesc.resource as unknown as UserListResourceView).description).toBe('desc');

    const noDesc = buildCrmUserListOperation({ name: 'X', uploadKeyType: 'CONTACT_INFO' });
    expect((noDesc.resource as unknown as UserListResourceView).description).toBeUndefined();
  });
});

interface OpView {
  create?: { user_identifiers?: Array<{ hashed_email?: string; hashed_phone_number?: string }> };
}

describe('buildUserDataOperations — builder puro (Fase 2)', () => {
  it('monta uma operação create por contato com os identifiers hasheados', () => {
    const ids: HashedIdentifier[] = [
      { hashedEmail: HASH_EMAIL, hashedPhoneNumber: HASH_PHONE },
      { hashedEmail: HASH_EMAIL },
    ];
    const ops = buildUserDataOperations(ids) as unknown as OpView[];

    expect(ops).toHaveLength(2);
    expect(ops[0].create?.user_identifiers).toHaveLength(2);
    expect(ops[0].create?.user_identifiers?.[0]).toEqual({ hashed_email: HASH_EMAIL });
    expect(ops[0].create?.user_identifiers?.[1]).toEqual({ hashed_phone_number: HASH_PHONE });

    expect(ops[1].create?.user_identifiers).toHaveLength(1);
    expect(ops[1].create?.user_identifiers?.[0]).toEqual({ hashed_email: HASH_EMAIL });
  });

  it('só telefone → um único identifier de phone', () => {
    const ops = buildUserDataOperations([{ hashedPhoneNumber: HASH_PHONE }]) as unknown as OpView[];
    expect(ops[0].create?.user_identifiers).toEqual([{ hashed_phone_number: HASH_PHONE }]);
  });

  it('array vazio → nenhuma operação', () => {
    expect(buildUserDataOperations([])).toEqual([]);
  });
});

describe('createCrmUserList — executor Fase 1 (SDK mockado)', () => {
  it('cria a lista e lê o resource_name (validate_only=false)', async () => {
    const op = buildCrmUserListOperation({ name: 'X', uploadKeyType: 'CONTACT_INFO' });
    const result = await createCrmUserList(fakeClient, {
      customerId: '1112223333',
      refreshToken: 'rt',
      operation: op,
    });

    expect(result.resourceName).toBe('customers/1112223333/userLists/999');
    expect(mutateResources).toHaveBeenCalledTimes(1);
    const [, opts] = mutateResources.mock.calls[0] as [unknown, { validate_only: boolean }];
    expect(opts.validate_only).toBe(false);
  });

  it('propaga erro da API', async () => {
    mutateResources.mockRejectedValueOnce(new Error('PERMISSION_DENIED'));
    const op = buildCrmUserListOperation({ name: 'X', uploadKeyType: 'CONTACT_INFO' });
    await expect(
      createCrmUserList(fakeClient, { customerId: '1112223333', refreshToken: 'rt', operation: op }),
    ).rejects.toThrow(/PERMISSION_DENIED/);
  });
});

describe('runCustomerMatchUpload — executor Fase 2 (SDK mockado)', () => {
  const ops = () => buildUserDataOperations([{ hashedEmail: HASH_EMAIL }, { hashedPhoneNumber: HASH_PHONE }]);

  it('encadeia create → add → run e devolve job/operation + contagem', async () => {
    const result = await runCustomerMatchUpload(fakeClient, {
      customerId: '1112223333',
      refreshToken: 'rt',
      userListResourceName: 'customers/1112223333/userLists/999',
      operations: ops(),
    });

    expect(createOfflineUserDataJob).toHaveBeenCalledTimes(1);
    expect(addOfflineUserDataJobOperations).toHaveBeenCalledTimes(1);
    expect(runOfflineUserDataJob).toHaveBeenCalledTimes(1);

    // create referencia a lista via customer_match_user_list_metadata.user_list
    const createReq = createOfflineUserDataJob.mock.calls[0][0] as {
      customer_id: string;
      job: { type: string; customer_match_user_list_metadata: { user_list: string } };
    };
    expect(createReq.customer_id).toBe('1112223333');
    expect(createReq.job.type).toBe('CUSTOMER_MATCH_USER_LIST');
    expect(createReq.job.customer_match_user_list_metadata.user_list).toBe(
      'customers/1112223333/userLists/999',
    );

    // add usa o resource_name do job criado
    const addReq = addOfflineUserDataJobOperations.mock.calls[0][0] as {
      resource_name: string;
      operations: unknown[];
    };
    expect(addReq.resource_name).toBe('customers/1112223333/offlineUserDataJobs/555');
    expect(addReq.operations).toHaveLength(2);

    expect(result.jobResourceName).toBe('customers/1112223333/offlineUserDataJobs/555');
    expect(result.uploadedCount).toBe(2);
    expect(result.operationName).toBe('operations/abc-123');
  });

  it('lança erro claro quando a API não retorna resource_name do job', async () => {
    createOfflineUserDataJob.mockResolvedValueOnce({});
    await expect(
      runCustomerMatchUpload(fakeClient, {
        customerId: '1112223333',
        refreshToken: 'rt',
        userListResourceName: 'customers/1112223333/userLists/999',
        operations: ops(),
      }),
    ).rejects.toThrow(/resource_name do job/i);
    // Não deve chamar add/run se o job não foi criado.
    expect(addOfflineUserDataJobOperations).not.toHaveBeenCalled();
    expect(runOfflineUserDataJob).not.toHaveBeenCalled();
  });

  it('funciona quando run não devolve operation.name (operationName omitido)', async () => {
    runOfflineUserDataJob.mockResolvedValueOnce({});
    const result = await runCustomerMatchUpload(fakeClient, {
      customerId: '1112223333',
      refreshToken: 'rt',
      userListResourceName: 'customers/1112223333/userLists/999',
      operations: ops(),
    });
    expect(result.operationName).toBeUndefined();
    expect(result.jobResourceName).toBe('customers/1112223333/offlineUserDataJobs/555');
  });

  it('propaga erro da API na fase de upload', async () => {
    addOfflineUserDataJobOperations.mockRejectedValueOnce(new Error('INVALID_ARGUMENT'));
    await expect(
      runCustomerMatchUpload(fakeClient, {
        customerId: '1112223333',
        refreshToken: 'rt',
        userListResourceName: 'customers/1112223333/userLists/999',
        operations: ops(),
      }),
    ).rejects.toThrow(/INVALID_ARGUMENT/);
  });
});
