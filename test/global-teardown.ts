export default async function globalTeardown() {
  if (global.__PG_CONTAINER__) {
    await global.__PG_CONTAINER__.stop({ timeout: 10_000 });
    console.log('\n🐳 Contenedor PostgreSQL detenido.');
  }
}
