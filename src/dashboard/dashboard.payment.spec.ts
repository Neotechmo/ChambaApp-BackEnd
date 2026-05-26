import { DashboardService } from './dashboard.service';

describe('DashboardService paid totals', () => {
  it('reports client spend and provider earnings from paid payments', async () => {
    const paidAt = new Date();
    const prisma = {
      solicitud: { findMany: jest.fn().mockResolvedValue([]) },
      favorito: { count: jest.fn().mockResolvedValue(0) },
      pago: {
        aggregate: jest.fn((args: unknown) => {
          expect(JSON.stringify(args)).toContain('"estado":"paid"');
          return Promise.resolve({ _sum: { monto: 350 } });
        }),
        findMany: jest.fn((args: unknown) => {
          expect(JSON.stringify(args)).toContain('"estado":"paid"');
          return Promise.resolve([{ monto: 350, fecha_pago: paidAt }]);
        }),
      },
    };
    const service = new DashboardService(prisma as never);

    const client = await service.client(10);
    const earnings = await service.earnings(20);

    expect(client.monthSpent).toBe(350);
    expect(earnings.monthTotal).toBe(350);
  });
});
