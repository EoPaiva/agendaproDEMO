const BETA_DB_KEY = 'agendapro-beta-db-v010';
const TOKEN_PREFIX = 'AGP_BETA_TOKEN_';
const DEV_TOKEN = 'AGP_BETA_DEV_TOKEN';

type BetaDb = {
  accounts: any[];
  companies: any[];
  agendas: any[];
  bookings: any[];
  payments: any[];
  manualPayments: any[];
  licenseKeys: any[];
  briefings: any[];
  implementations: any[];
  webhooks: any[];
  logs: any[];
  auditLogs: any[];
  settings: any[];
  supportNotes: any[];
};

function uid(prefix = 'beta') {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}

function slugify(value: string) {
  return String(value || 'agenda-demo')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 56) || 'agenda-demo';
}

function addDays(days: number) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

function today(offset = 0) {
  const date = new Date(Date.now() + offset * 24 * 60 * 60 * 1000);
  return date.toISOString().slice(0, 10);
}

function defaultScheduleConfig() {
  const workingDays: any = {
    sunday: { enabled: false, periods: [] },
    monday: { enabled: true, periods: [{ start: '08:00', end: '12:00' }, { start: '14:00', end: '18:00' }] },
    tuesday: { enabled: true, periods: [{ start: '08:00', end: '12:00' }, { start: '14:00', end: '18:00' }] },
    wednesday: { enabled: true, periods: [{ start: '08:00', end: '12:00' }, { start: '14:00', end: '18:00' }] },
    thursday: { enabled: true, periods: [{ start: '08:00', end: '12:00' }, { start: '14:00', end: '18:00' }] },
    friday: { enabled: true, periods: [{ start: '08:00', end: '12:00' }, { start: '14:00', end: '17:00' }] },
    saturday: { enabled: true, periods: [{ start: '08:00', end: '12:00' }] }
  };
  return {
    workingDays,
    blockedDates: [],
    slotInterval: 30,
    minAdvanceHours: 2,
    maxFutureDays: 45,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    reservePendingRequests: true,
    acceptNewBookings: true,
    cancellationLimitHours: 24,
    cancellationText: 'Cancelamentos devem ser solicitados com até 24h de antecedência.',
    closedMessage: 'Não há horários disponíveis nesta data.'
  };
}

function buildAgenda(overrides: any = {}) {
  const slug = overrides.slug || slugify(overrides.businessName || 'Clínica Aurora Beta');
  const rawPayload = {
    slug,
    publishedAt: overrides.publishedAt || new Date().toISOString(),
    business: {
      name: overrides.businessName || 'Clínica Aurora Beta',
      segment: overrides.segment || 'Clínica odontológica',
      whatsapp: overrides.whatsapp || '(35) 98804-2182',
      email: overrides.email || 'beta@agendapro.dev',
      address: overrides.address || 'Rua Beta, 120 - Centro',
      responsible: overrides.responsible || 'Dra. Helena Martins',
      description: overrides.description || 'Agenda demonstrativa isolada para testar a experiência pública do AgendaPro sem tocar dados de produção.'
    },
    visual: {
      primaryColor: overrides.primaryColor || '#2563EB',
      secondaryColor: '#0F172A',
      accentColor: '#10B981',
      logoUrl: '',
      slogan: 'Agende online em poucos passos'
    },
    services: overrides.services || [
      { id: 'consulta-inicial', name: 'Consulta inicial', duration: '40', durationMinutes: 40, price: 120, description: 'Avaliação inicial, diagnóstico e orientação.', active: true, category: 'Clínica geral' },
      { id: 'limpeza', name: 'Limpeza profissional', duration: '50', durationMinutes: 50, price: 180, description: 'Profilaxia e prevenção.', active: true, category: 'Clínica geral' },
      { id: 'clareamento', name: 'Clareamento dental', duration: '90', durationMinutes: 90, price: 600, description: 'Procedimento estético supervisionado.', active: true, category: 'Estética' }
    ],
    team: overrides.team || [
      { id: 'dra-helena', name: 'Dra. Helena Martins', role: 'Dentista responsável', whatsapp: '(35) 98804-2182', specialty: 'Clínica geral e estética' },
      { id: 'dra-camila', name: 'Dra. Camila Rocha', role: 'Ortodontista', whatsapp: '(35) 98804-2199', specialty: 'Ortodontia' }
    ],
    hours: { weekdays: '08:00 às 18:00', saturday: '08:00 às 12:00', interval: '30' },
    scheduleConfig: defaultScheduleConfig(),
    rules: { minNotice: '2h', cancellation: 'Cancelamentos com até 24h de antecedência.', notesRequired: false, confirmation: 'Confirmação manual pelo WhatsApp.' },
    bookedSlots: []
  };
  return {
    id: overrides.id || uid('agenda'),
    account_id: overrides.accountId || null,
    company_id: overrides.companyId || null,
    email: overrides.email || 'beta@agendapro.dev',
    full_name: overrides.fullName || 'Cliente Beta',
    whatsapp: rawPayload.business.whatsapp,
    business_name: rawPayload.business.name,
    public_slug: slug,
    public_link: `/#/agendar/${slug}`,
    plan_id: overrides.planId || 'professional',
    status: overrides.status || 'published',
    published_at: rawPayload.publishedAt,
    segment: rawPayload.business.segment,
    address: rawPayload.business.address,
    description: rawPayload.business.description,
    theme: {
      primary_color: rawPayload.visual.primaryColor,
      secondary_color: rawPayload.visual.secondaryColor,
      accent_color: rawPayload.visual.accentColor,
      logo_url: rawPayload.visual.logoUrl,
      slogan: rawPayload.visual.slogan
    },
    services: rawPayload.services,
    team: rawPayload.team,
    hours: rawPayload.hours,
    rules: rawPayload.rules,
    raw_payload: rawPayload,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides
  };
}

function seedDb(): BetaDb {
  const companyId = uid('company');
  const accountId = uid('account');
  const agenda = buildAgenda({ id: uid('agenda'), accountId, companyId, slug: 'clinica-aurora-beta', businessName: 'Clínica Aurora Beta' });
  return {
    accounts: [{ id: accountId, full_name: 'Cliente Beta', email: 'cliente@beta.com', whatsapp: '(35) 98804-2182', status: 'trial', metadata: { business_name: 'Clínica Aurora Beta' }, created_at: new Date().toISOString() }],
    companies: [{ id: companyId, account_id: accountId, name: 'Clínica Aurora Beta', slug: 'clinica-aurora-beta', current_plan_id: 'professional', subscription_status: 'trial', onboarding_status: 'published', plan_expires_at: addDays(30), whatsapp: '(35) 98804-2182', email: 'cliente@beta.com', address: 'Rua Beta, 120 - Centro' }],
    agendas: [agenda, buildAgenda({ slug: 'barbearia-prime-beta', businessName: 'Barbearia Prime Beta', segment: 'Barbearia', primaryColor: '#111827', services: [
      { id: 'corte', name: 'Corte masculino', duration: '40', durationMinutes: 40, price: 45, description: 'Corte personalizado.', active: true },
      { id: 'barba', name: 'Barba', duration: '30', durationMinutes: 30, price: 35, description: 'Barba com acabamento.', active: true },
      { id: 'combo', name: 'Corte + Barba', duration: '70', durationMinutes: 70, price: 75, description: 'Combo completo.', active: true }
    ] })],
    bookings: [
      { id: uid('booking'), agenda_slug: 'clinica-aurora-beta', customer_name: 'Ana Clara Martins', customer_phone: '(35) 99921-3020', customer_email: 'ana@email.com', service_name: 'Consulta inicial', requested_date: today(1), requested_time: '09:00', status: 'requested', value: 120, metadata: { source: 'beta_seed', durationMinutes: 40 } },
      { id: uid('booking'), agenda_slug: 'clinica-aurora-beta', customer_name: 'João Pedro Lima', customer_phone: '(35) 98877-1122', customer_email: 'joao@email.com', service_name: 'Limpeza profissional', requested_date: today(2), requested_time: '14:30', status: 'confirmed', value: 180, metadata: { source: 'beta_seed', durationMinutes: 50 } }
    ],
    payments: [{ id: uid('pay'), email: 'cliente@beta.com', amount: 99.9, provider: 'beta_checkout', status: 'paid', description: 'Plano Profissional Beta', created_at: new Date().toISOString() }],
    manualPayments: [{ id: uid('manual'), email: 'cliente@beta.com', business_name: 'Clínica Aurora Beta', amount: 99.9, plan_name: 'Profissional', status: 'pending_review', created_at: new Date().toISOString(), note: 'Pagamento manual demonstrativo.' }],
    licenseKeys: [{ id: uid('key'), key_prefix: 'AGP-BETA', key_masked: 'AGP-BETA-••••-FREE', key_hash: 'beta_seed', plan_id: 'professional', status: 'available', duration_days: 30, max_uses: 1, uses_count: 0, expires_at: addDays(90), created_at: new Date().toISOString(), notes: 'Key pública da demo: AGP-BETA-2026-FREE' }],
    briefings: [{ id: uid('briefing'), business_name: 'Clínica Aurora Beta', email: 'cliente@beta.com', status: 'reviewing', created_at: new Date().toISOString(), notes: 'Briefing demonstrativo para implantação assistida.' }],
    implementations: [{ id: uid('impl'), company_name: 'Clínica Aurora Beta', status: 'building', priority: 'normal', checklist: ['Dados do negócio', 'Serviços', 'Horários'], created_at: new Date().toISOString() }],
    webhooks: [{ id: uid('hook'), provider: 'mercado_pago_beta', event_type: 'payment.approved', status: 'processed', payload: { beta: true, amount: 99.9 }, created_at: new Date().toISOString() }],
    logs: [{ id: uid('log'), severity: 'info', action: 'beta_started', title: 'Ambiente beta iniciado', description: 'Dados carregados em localStorage.', created_at: new Date().toISOString(), metadata: { beta: true } }],
    auditLogs: [{ id: uid('audit'), actor_email: 'dev@agendapro.beta', action: 'seed_created', entity: 'beta', severity: 'info', created_at: new Date().toISOString(), metadata: { source: 'mockApi' } }],
    settings: [
      { id: 'plan:essential', key: 'plan:essential', value: { price: 49.9, setup: 100, status: 'active' } },
      { id: 'plan:professional', key: 'plan:professional', value: { price: 99.9, setup: 100, status: 'active' } },
      { id: 'plan:business', key: 'plan:business', value: { price: 199.9, setup: 100, status: 'active' } }
    ],
    supportNotes: [{ id: uid('note'), entity: 'company', entity_id: companyId, note: 'Nota demonstrativa de suporte 360º.', created_at: new Date().toISOString() }]
  };
}

function readDb(): BetaDb {
  try {
    const raw = localStorage.getItem(BETA_DB_KEY);
    if (raw) return JSON.parse(raw) as BetaDb;
  } catch {}
  const db = seedDb();
  writeDb(db);
  return db;
}

function writeDb(db: BetaDb) {
  localStorage.setItem(BETA_DB_KEY, JSON.stringify(db));
}

function json(payload: any, status = 200) {
  return new Response(JSON.stringify(payload), { status, headers: { 'Content-Type': 'application/json', 'X-AgendaPro-Beta': 'true' } });
}

async function readBody(init?: RequestInit) {
  if (!init?.body) return {};
  if (typeof init.body === 'string') {
    try { return JSON.parse(init.body); } catch { return {}; }
  }
  return {};
}

function activeAccountFromStorage(db: BetaDb) {
  try {
    const stored = JSON.parse(localStorage.getItem('agendapro-client-account') || 'null');
    if (stored?.email) return db.accounts.find(item => item.email === stored.email) || null;
  } catch {}
  return db.accounts[0] || null;
}

function companyForAccount(db: BetaDb, account: any) {
  return db.companies.find(item => item.account_id === account?.id || item.email === account?.email) || db.companies[0] || null;
}

function agendaForSlug(db: BetaDb, slug: string) {
  const localRaw = localStorage.getItem('agendapro-agenda-draft');
  try {
    const local = localRaw ? JSON.parse(localRaw) : null;
    if (local?.slug === slug) return buildAgenda({ slug, businessName: local.business?.name, email: local.ownerEmail || activeAccountFromStorage(db)?.email || 'cliente@beta.com', raw_payload: local, services: local.services || [], team: local.team || [], status: local.publishedAt ? 'published' : 'draft', published_at: local.publishedAt || null });
  } catch {}
  return db.agendas.find(item => item.public_slug === slug || item.slug === slug) || null;
}

function maskKey(raw: string) {
  const parts = String(raw || '').split('-');
  if (parts.length <= 2) return 'AGP-••••';
  return `${parts.slice(0, 2).join('-')}-••••-${parts[parts.length - 1] || 'KEY'}`;
}

async function handleAuth(action: string, init?: RequestInit) {
  const body = await readBody(init);
  const db = readDb();
  if (action === 'register-account') {
    const email = String(body.email || '').toLowerCase();
    if (!email || !body.businessName) return json({ ok: false, message: 'Preencha os dados da conta beta.' }, 400);
    let account = db.accounts.find(item => item.email === email);
    if (!account) {
      account = { id: uid('account'), full_name: body.fullName, email, whatsapp: body.whatsapp, status: 'trial', metadata: { business_name: body.businessName }, created_at: new Date().toISOString() };
      db.accounts.unshift(account);
    }
    let company = companyForAccount(db, account);
    if (!company || company.email !== email) {
      company = { id: uid('company'), account_id: account.id, name: body.businessName, slug: slugify(body.businessName), current_plan_id: body.planId || 'professional', subscription_status: 'trial', onboarding_status: 'draft', plan_expires_at: addDays(30), whatsapp: body.whatsapp, email };
      db.companies.unshift(company);
    }
    writeDb(db);
    return json({ ok: true, token: `${TOKEN_PREFIX}${account.id}`, account, company, publicSlug: company.slug, publicLink: `/#/agendar/${company.slug}` });
  }
  if (action === 'client-login') {
    const email = String(body.email || 'cliente@beta.com').toLowerCase();
    let account = db.accounts.find(item => String(item.email).toLowerCase() === email) || db.accounts[0];
    const company = companyForAccount(db, account);
    return json({ ok: true, token: `${TOKEN_PREFIX}${account.id}`, account, company });
  }
  return json({ ok: false, message: 'Ação beta de autenticação não encontrada.' }, 404);
}

async function handlePublic(action: string, url: URL, init?: RequestInit) {
  const db = readDb();
  if (action === 'get-public-agenda') {
    const slug = url.searchParams.get('slug') || 'clinica-aurora-beta';
    const agenda = agendaForSlug(db, slug);
    if (!agenda) return json({ ok: false, message: 'Agenda beta não encontrada.' }, 404);
    return json({ ok: true, agenda });
  }
  if (action === 'create-public-booking') {
    const body = await readBody(init);
    const booking = {
      id: uid('booking'),
      agenda_slug: body.slug,
      customer_name: body.name,
      customer_phone: body.phone,
      customer_email: body.email,
      service_id: body.serviceId,
      service_name: body.serviceName,
      requested_date: body.date,
      requested_time: body.time,
      status: 'requested',
      value: 0,
      created_at: new Date().toISOString(),
      metadata: { ...body, source: 'beta_public_booking' }
    };
    db.bookings.unshift(booking);
    db.logs.unshift({ id: uid('log'), severity: 'success', action: 'public_booking_created', title: 'Agendamento beta recebido', description: `${body.name} solicitou ${body.serviceName}.`, created_at: new Date().toISOString(), metadata: booking });
    writeDb(db);
    return json({ ok: true, request: booking });
  }
  if (action === 'create-briefing') {
    const body = await readBody(init);
    const item = { id: uid('briefing'), ...body, status: 'reviewing', created_at: new Date().toISOString() };
    db.briefings.unshift(item);
    writeDb(db);
    return json({ ok: true, briefing: item });
  }
  return json({ ok: false, message: 'Ação pública beta não encontrada.' }, 404);
}

async function handleClient(action: string, url: URL, init?: RequestInit) {
  const db = readDb();
  const account = activeAccountFromStorage(db) || db.accounts[0];
  const company = companyForAccount(db, account);
  if (action === 'agenda-dashboard') {
    const slug = url.searchParams.get('slug') || company?.slug || 'clinica-aurora-beta';
    const agenda = agendaForSlug(db, slug);
    if (!agenda) return json({ ok: false, message: 'Agenda beta não encontrada.' }, 404);
    const appointments = db.bookings.filter(item => item.agenda_slug === slug);
    return json({ ok: true, agenda, appointments });
  }
  if (action === 'create-agenda') {
    const body = await readBody(init);
    const agendaPayload = body.agenda || {};
    const slug = slugify(agendaPayload.slug || agendaPayload.business?.name || company?.slug || 'agenda-beta');
    const agenda = buildAgenda({
      id: db.agendas.find(item => item.public_slug === slug)?.id || uid('agenda'),
      accountId: account?.id,
      companyId: company?.id,
      email: account?.email,
      fullName: account?.full_name,
      businessName: agendaPayload.business?.name || company?.name,
      slug,
      status: agendaPayload.publishedAt ? 'published' : 'draft',
      publishedAt: agendaPayload.publishedAt || new Date().toISOString(),
      raw_payload: agendaPayload,
      services: agendaPayload.services || [],
      team: agendaPayload.team || []
    });
    db.agendas = [agenda, ...db.agendas.filter(item => item.public_slug !== slug)];
    if (company) {
      company.slug = slug;
      company.name = agenda.business_name;
      company.onboarding_status = 'published';
    }
    db.logs.unshift({ id: uid('log'), severity: 'success', action: 'agenda_published', title: 'Agenda publicada no beta', description: `${agenda.business_name} publicada em /agendar/${slug}.`, created_at: new Date().toISOString(), metadata: { slug } });
    writeDb(db);
    return json({ ok: true, agenda, slug });
  }
  if (action === 'activate-license-key') {
    const body = await readBody(init);
    const rawKey = String(body.key || '').trim().toUpperCase();
    if (!rawKey) return json({ ok: false, message: 'Informe uma key.' }, 400);
    const found = db.licenseKeys.find(item => item.status === 'available') || null;
    if (found) {
      found.status = 'used';
      found.uses_count = Number(found.uses_count || 0) + 1;
      found.used_by_email = body.email;
      found.used_at = new Date().toISOString();
    }
    if (company) company.subscription_status = 'trial';
    writeDb(db);
    return json({ ok: true, planId: 'professional', planName: 'Profissional', expiresAt: addDays(30), key: maskKey(rawKey) });
  }
  if (action === 'create-manual-payment-request') {
    const body = await readBody(init);
    const item = { id: uid('manual'), email: account?.email, business_name: company?.name, amount: body.amount || 0, note: body.note || '', payment_link: body.paymentLink || '', status: 'pending_review', created_at: new Date().toISOString() };
    db.manualPayments.unshift(item);
    writeDb(db);
    return json({ ok: true, request: item });
  }
  if (action === 'update-public-booking-status') {
    const body = await readBody(init);
    const item = db.bookings.find(row => row.id === body.requestId);
    if (!item) return json({ ok: false, message: 'Solicitação beta não encontrada.' }, 404);
    item.status = body.status || item.status;
    if (body.date) item.requested_date = body.date;
    if (body.time) item.requested_time = body.time;
    item.updated_at = new Date().toISOString();
    db.auditLogs.unshift({ id: uid('audit'), actor_email: account?.email, action: 'booking_status_updated', entity: 'booking', entity_id: item.id, severity: 'info', created_at: new Date().toISOString(), metadata: item });
    writeDb(db);
    return json({ ok: true, request: item });
  }
  if (action === 'update-schedule-config') {
    const body = await readBody(init);
    const agenda = agendaForSlug(db, body.slug);
    if (!agenda) return json({ ok: false, message: 'Agenda beta não encontrada.' }, 404);
    agenda.raw_payload = { ...(agenda.raw_payload || {}), scheduleConfig: body.scheduleConfig };
    agenda.hours = { ...(agenda.hours || {}), interval: String(body.scheduleConfig?.slotInterval || 30) };
    agenda.updated_at = new Date().toISOString();
    writeDb(db);
    return json({ ok: true, agenda, scheduleConfig: body.scheduleConfig });
  }
  return json({ ok: false, message: 'Ação beta do cliente não encontrada.' }, 404);
}

async function handlePayments(action: string, init?: RequestInit) {
  const body = await readBody(init);
  const db = readDb();
  const account = activeAccountFromStorage(db) || db.accounts[0];
  const item = { id: uid('pay'), email: account?.email, amount: body.includeImplementation ? 199.9 : 99.9, plan_id: body.planId || 'professional', provider: 'beta_checkout', status: 'paid', description: 'Checkout beta simulado', created_at: new Date().toISOString() };
  db.payments.unshift(item);
  writeDb(db);
  if (action === 'create-checkout') return json({ ok: true, initPoint: `${window.location.origin}${window.location.pathname}#/pagamento/sucesso?beta=1`, payment: item });
  return json({ ok: false, message: 'Ação de pagamento beta não encontrada.' }, 404);
}

function dashboardPayload(db: BetaDb) {
  return {
    ok: true,
    beta: true,
    generatedAt: new Date().toISOString(),
    accounts: db.accounts,
    clients: db.accounts,
    companies: db.companies,
    agendas: db.agendas,
    createdAgendas: db.agendas,
    appointments: db.bookings,
    bookingRequests: db.bookings,
    payments: db.payments,
    manualPayments: db.manualPayments,
    manualPaymentRequests: db.manualPayments,
    licenseKeys: db.licenseKeys,
    keys: db.licenseKeys,
    briefings: db.briefings,
    implementations: db.implementations,
    webhooks: db.webhooks,
    webhookEvents: db.webhooks,
    logs: db.logs,
    activityLogs: db.logs,
    auditLogs: db.auditLogs,
    settings: db.settings,
    supportNotes: db.supportNotes,
    plans: db.settings.filter(item => String(item.key || '').startsWith('plan:'))
  };
}

function findCollection(db: BetaDb, entity: string) {
  const normalized = entity.replace(/s$/, '');
  if (['client', 'account'].includes(normalized)) return db.accounts;
  if (normalized === 'company') return db.companies;
  if (normalized === 'agenda') return db.agendas;
  if (['appointment', 'booking'].includes(normalized)) return db.bookings;
  if (normalized === 'payment') return db.payments;
  if (normalized === 'manual_payment') return db.manualPayments;
  if (['license_key', 'key'].includes(normalized)) return db.licenseKeys;
  if (normalized === 'briefing') return db.briefings;
  if (normalized === 'implementation') return db.implementations;
  if (normalized === 'webhook') return db.webhooks;
  if (normalized === 'setting' || normalized === 'plan') return db.settings;
  return db.logs;
}

async function handleDev(action: string, init?: RequestInit) {
  const db = readDb();
  if (action === 'login') {
    return json({ ok: true, session: { token: DEV_TOKEN, email: 'dev@agendapro.beta', role: 'developer_beta', expiresAt: addDays(1) } });
  }
  if (action === 'dashboard') return json(dashboardPayload(db));
  if (action === 'create-license-key') {
    const body = await readBody(init);
    const quantity = Math.max(1, Math.min(Number(body.quantity || 1), 50));
    const keys = Array.from({ length: quantity }, () => {
      const raw = `AGP-BETA-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
      const item = { id: uid('key'), rawKey: raw, key_prefix: raw.split('-').slice(0, 2).join('-'), key_masked: maskKey(raw), key_hash: uid('hash'), plan_id: body.planId || 'professional', status: 'available', duration_days: Number(body.durationDays || 30), max_uses: Number(body.maxUses || 1), uses_count: 0, expires_at: addDays(Number(body.validityDays || 90)), created_at: new Date().toISOString(), notes: body.notes || 'Key beta gerada pela Central Dev.' };
      db.licenseKeys.unshift(item);
      return raw;
    });
    db.auditLogs.unshift({ id: uid('audit'), actor_email: 'dev@agendapro.beta', action: 'license_key_created', entity: 'license_key', severity: 'success', created_at: new Date().toISOString(), metadata: { quantity } });
    writeDb(db);
    return json({ ok: true, keys });
  }
  if (action === 'execute') {
    const body = await readBody(init);
    const collection = findCollection(db, String(body.entity || 'log'));
    const id = String(body.id || '');
    let item = collection.find((row: any) => String(row.id || row.key) === id);
    if (!item && body.action !== 'create') return json({ ok: false, message: 'Item beta não encontrado.' }, 404);
    if (body.action === 'update') Object.assign(item, body.payload || {}, { updated_at: new Date().toISOString() });
    if (['revoke', 'disable', 'suspend', 'pause'].includes(body.action)) Object.assign(item, { status: body.action === 'revoke' ? 'revoked' : body.action === 'pause' ? 'paused' : 'disabled', updated_at: new Date().toISOString() });
    if (['activate', 'approve', 'publish', 'resolve', 'mark_resolved'].includes(body.action)) Object.assign(item, { status: body.action === 'approve' ? 'approved_manual' : body.action === 'publish' ? 'published' : body.action === 'resolve' || body.action === 'mark_resolved' ? 'resolved' : 'active', updated_at: new Date().toISOString() });
    if (['reject', 'reprove', 'request_adjustment'].includes(body.action)) Object.assign(item, { status: body.action === 'request_adjustment' ? 'needs_adjustment' : 'rejected_manual', review_note: body.reason || body.payload?.reason || '', updated_at: new Date().toISOString() });
    db.auditLogs.unshift({ id: uid('audit'), actor_email: 'dev@agendapro.beta', action: body.action, entity: body.entity, entity_id: id, severity: 'info', created_at: new Date().toISOString(), reason: body.reason || '', metadata: body.payload || {} });
    writeDb(db);
    return json({ ok: true, item });
  }
  return json({ ok: false, message: 'Ação beta da Central Dev não encontrada.' }, 404);
}

export function installBetaMockApi() {
  if (typeof window === 'undefined') return;
  if ((window as any).__AGENDAPRO_BETA_MOCK__) return;
  if (import.meta.env.VITE_AGENDAPRO_BETA_MODE === 'false') return;
  (window as any).__AGENDAPRO_BETA_MOCK__ = true;
  const originalFetch = window.fetch.bind(window);
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const rawUrl = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    const url = new URL(rawUrl, window.location.origin);
    if (!url.pathname.startsWith('/api/')) return originalFetch(input, init);
    const action = url.searchParams.get('action') || '';
    try {
      if (url.pathname.endsWith('/api/auth')) return handleAuth(action, init);
      if (url.pathname.endsWith('/api/public')) return handlePublic(action, url, init);
      if (url.pathname.endsWith('/api/client')) return handleClient(action, url, init);
      if (url.pathname.endsWith('/api/payments')) return handlePayments(action, init);
      if (url.pathname.endsWith('/api/dev')) return handleDev(action, init);
      if (url.pathname.endsWith('/api/mercadopago-webhook')) return json({ ok: true, beta: true, message: 'Webhook simulado recebido.' });
      return json({ ok: false, message: 'Endpoint beta não mapeado.' }, 404);
    } catch (error) {
      return json({ ok: false, message: error instanceof Error ? error.message : 'Erro no mock beta.' }, 500);
    }
  };
}
