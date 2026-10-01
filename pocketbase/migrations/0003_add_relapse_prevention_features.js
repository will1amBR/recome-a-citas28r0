migrate(
  (app) => {
    // Atualizar collection profiles com campos novos:
    // proxima_consulta_data, proxima_consulta_hora, proxima_consulta_medico, esconder_cartao_risco
    const profiles = app.findCollectionByNameOrId('profiles')
    profiles.fields.add(new TextField({ name: 'proxima_consulta_data' }))
    profiles.fields.add(new TextField({ name: 'proxima_consulta_hora' }))
    profiles.fields.add(new TextField({ name: 'proxima_consulta_medico' }))
    profiles.fields.add(new BoolField({ name: 'esconder_cartao_risco' }))
    app.save(profiles)

    // 1. plan_intentions (Plano Se-Então)
    const planIntentions = new Collection({
      name: 'plan_intentions',
      type: 'base',
      listRule: "@request.auth.id != '' && owner = @request.auth.id",
      viewRule: "@request.auth.id != '' && owner = @request.auth.id",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != '' && owner = @request.auth.id",
      deleteRule: "@request.auth.id != '' && owner = @request.auth.id",
      fields: [
        {
          name: 'owner',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'se_situacao', type: 'text', required: true },
        { name: 'entao_acao', type: 'text', required: true },
        { name: 'se_entao', type: 'text' },
        { name: 'ativo', type: 'bool' },
        { name: 'criado_em', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_plan_intentions_owner ON plan_intentions (owner)'],
    })
    app.save(planIntentions)

    // 2. sleep_checkins (Check-in de sono semanal)
    const sleepCheckins = new Collection({
      name: 'sleep_checkins',
      type: 'base',
      listRule: "@request.auth.id != '' && owner = @request.auth.id",
      viewRule: "@request.auth.id != '' && owner = @request.auth.id",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != '' && owner = @request.auth.id",
      deleteRule: "@request.auth.id != '' && owner = @request.auth.id",
      fields: [
        {
          name: 'owner',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'semana_ref', type: 'text', required: true },
        { name: 'resposta', type: 'text', required: true }, // 'bem' | 'mais_ou_menos' | 'dificil' | 'pior'
        { name: 'nota', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_sleep_checkins_owner_week ON sleep_checkins (owner, semana_ref)'],
    })
    app.save(sleepCheckins)

    // 3. milestones (Celebração de marcos sem repetição)
    const milestones = new Collection({
      name: 'milestones',
      type: 'base',
      listRule: "@request.auth.id != '' && owner = @request.auth.id",
      viewRule: "@request.auth.id != '' && owner = @request.auth.id",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != '' && owner = @request.auth.id",
      deleteRule: "@request.auth.id != '' && owner = @request.auth.id",
      fields: [
        {
          name: 'owner',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'tipo', type: 'text', required: true }, // 'dias_sobrio' | 'dinheiro_economizado' | 'ondas_fissura'
        { name: 'substancia_tipo', type: 'text' },
        { name: 'valor', type: 'number', required: true }, // 21, 30, 60, 90, 180, 365, 100, 500, 1000, 10
        { name: 'chave_unica', type: 'text', required: true },
        { name: 'data_comemorado', type: 'text' },
        { name: 'registrado_diario', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_milestones_owner ON milestones (owner)',
        'CREATE UNIQUE INDEX idx_milestones_owner_key ON milestones (owner, chave_unica)',
      ],
    })
    app.save(milestones)
  },
  (app) => {
    try {
      const col = app.findCollectionByNameOrId('milestones')
      app.delete(col)
    } catch (_) {}

    try {
      const col = app.findCollectionByNameOrId('sleep_checkins')
      app.delete(col)
    } catch (_) {}

    try {
      const col = app.findCollectionByNameOrId('plan_intentions')
      app.delete(col)
    } catch (_) {}

    try {
      const profiles = app.findCollectionByNameOrId('profiles')
      profiles.fields.removeByName('proxima_consulta_data')
      profiles.fields.removeByName('proxima_consulta_hora')
      profiles.fields.removeByName('proxima_consulta_medico')
      profiles.fields.removeByName('esconder_cartao_risco')
      app.save(profiles)
    } catch (_) {}
  },
)
