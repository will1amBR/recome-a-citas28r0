migrate(
  (app) => {
    // 1. profiles
    const profiles = new Collection({
      name: 'profiles',
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
        { name: 'nome_preferido', type: 'text' },
        { name: 'nome_social', type: 'text' },
        { name: 'nome_registro', type: 'text' },
        { name: 'genero', type: 'text' },
        { name: 'orientacao', type: 'text' },
        { name: 'descricao_identidade', type: 'text' },
        { name: 'dia_a_dia', type: 'text' },
        { name: 'momentos_risco', type: 'json' },
        { name: 'o_que_ajuda', type: 'json' },
        { name: 'rotina_livre', type: 'text' },
        { name: 'dark_mode', type: 'bool' },
        { name: 'meta_dia', type: 'text' },
        { name: 'consentimento_lgpd', type: 'bool' },
        { name: 'consentimento_lgpd_data', type: 'text' },
        { name: 'situacoes_risco', type: 'json' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_profiles_owner ON profiles (owner)'],
    })
    app.save(profiles)

    // 2. emergency_contacts
    const emergencyContacts = new Collection({
      name: 'emergency_contacts',
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
        { name: 'nome', type: 'text', required: true },
        { name: 'telefone', type: 'text', required: true },
        { name: 'ja_avisou', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_contacts_owner ON emergency_contacts (owner)'],
    })
    app.save(emergencyContacts)

    // 3. user_substances
    const userSubstances = new Collection({
      name: 'user_substances',
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
        { name: 'tipo', type: 'text', required: true },
        { name: 'objetivo', type: 'text', required: true },
        { name: 'uso_inicial', type: 'text' },
        { name: 'data_inicio', type: 'text' },
        { name: 'meta_dia_texto', type: 'text' },
        { name: 'meta_dia_numero', type: 'number' },
        { name: 'melhor_sequencia', type: 'number' },
        { name: 'ativo', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_substances_owner ON user_substances (owner)'],
    })
    app.save(userSubstances)

    const userSubstancesColId = app.findCollectionByNameOrId('user_substances').id

    // 4. use_logs
    const useLogs = new Collection({
      name: 'use_logs',
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
        {
          name: 'substancia',
          type: 'relation',
          required: false,
          collectionId: userSubstancesColId,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'substancia_nome', type: 'text' },
        { name: 'quantidade', type: 'number' },
        { name: 'unidade', type: 'text' },
        { name: 'data_hora', type: 'text', required: true },
        { name: 'contexto', type: 'text' },
        { name: 'custo', type: 'number' },
        { name: 'quanto_comprou', type: 'text' },
        { name: 'quanto_usou', type: 'text' },
        { name: 'tempo_uso', type: 'text' },
        { name: 'dividiu', type: 'text' },
        { name: 'observacao', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_use_logs_owner_date ON use_logs (owner, data_hora DESC)'],
    })
    app.save(useLogs)

    // 5. episodes
    const episodes = new Collection({
      name: 'episodes',
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
        { name: 'substancia', type: 'text' },
        { name: 'texto', type: 'text' },
        { name: 'humor', type: 'text' },
        { name: 'gatilho', type: 'json' },
        { name: 'antes', type: 'text' },
        { name: 'depois', type: 'text' },
        { name: 'valor_gasto', type: 'number' },
        { name: 'hora_chegada', type: 'text' },
        { name: 'hora_saida', type: 'text' },
        { name: 'itens', type: 'json' },
        {
          name: 'recibo_foto',
          type: 'file',
          maxSelect: 1,
          maxSize: 10485760,
          protected: true,
          mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        },
        { name: 'data_hora', type: 'text' },
        { name: 'craving_time', type: 'text' },
        { name: 'details_json', type: 'json' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_episodes_owner ON episodes (owner, created DESC)'],
    })
    app.save(episodes)

    // 6. diary_entries
    const diaryEntries = new Collection({
      name: 'diary_entries',
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
        { name: 'data', type: 'text', required: true },
        { name: 'texto', type: 'text' },
        { name: 'humor', type: 'text' },
        { name: 'status_dia', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_diary_owner_date ON diary_entries (owner, data DESC)'],
    })
    app.save(diaryEntries)

    // 7. cravings
    const cravings = new Collection({
      name: 'cravings',
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
        { name: 'data_hora', type: 'text', required: true },
        { name: 'situacao', type: 'text' },
        { name: 'tecnica_usada', type: 'text' },
        { name: 'resultado', type: 'text' },
        { name: 'duracao', type: 'text' },
        { name: 'substancia_nome', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_cravings_owner ON cravings (owner, created DESC)'],
    })
    app.save(cravings)

    // 8. plan_tasks
    const planTasks = new Collection({
      name: 'plan_tasks',
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
        { name: 'texto', type: 'text', required: true },
        { name: 'categoria', type: 'text', required: true },
        { name: 'explicacao', type: 'text' },
        { name: 'custom', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_plan_tasks_owner ON plan_tasks (owner)'],
    })
    app.save(planTasks)

    const planTasksColId = app.findCollectionByNameOrId('plan_tasks').id

    // 8b. plan_completions
    const planCompletions = new Collection({
      name: 'plan_completions',
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
        {
          name: 'tarefa',
          type: 'relation',
          required: false,
          collectionId: planTasksColId,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'tarefa_id_string', type: 'text' },
        { name: 'tarefa_titulo', type: 'text' },
        { name: 'data', type: 'text', required: true },
        { name: 'hora', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_plan_comp_owner_date ON plan_completions (owner, data)'],
    })
    app.save(planCompletions)

    // 9. med_checkins
    const medCheckins = new Collection({
      name: 'med_checkins',
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
        { name: 'receitado_nome', type: 'text' },
        { name: 'receitado_horario', type: 'text' },
        { name: 'receitado_texto', type: 'text' },
        { name: 'tomado_hoje', type: 'bool' },
        { name: 'mais_para_mesmo_efeito', type: 'bool' },
        { name: 'antes_do_horario', type: 'bool' },
        { name: 'perdeu_caixa', type: 'bool' },
        { name: 'varios_medicos', type: 'bool' },
        { name: 'semana_ref', type: 'text' },
        { name: 'avisou', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_med_checkins_owner ON med_checkins (owner)'],
    })
    app.save(medCheckins)

    // 10. caregiver_links
    const caregiverLinks = new Collection({
      name: 'caregiver_links',
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
        { name: 'nome', type: 'text', required: true },
        { name: 'telefone', type: 'text', required: true },
        { name: 'permissoes', type: 'json' },
        { name: 'aceito', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_caregivers_owner ON caregiver_links (owner)'],
    })
    app.save(caregiverLinks)

    // 11. support_resources (público para leitura, admin para alteração)
    const supportResources = new Collection({
      name: 'support_resources',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'nome', type: 'text', required: true },
        { name: 'descricao', type: 'text' },
        { name: 'link', type: 'text' },
        { name: 'telefone', type: 'text' },
        { name: 'ordem', type: 'number' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_support_ordem ON support_resources (ordem)'],
    })
    app.save(supportResources)

    // Seed de support_resources oficiais do app
    const resourcesData = [
      {
        nome: 'CVV — Centro de Valorização da Vida',
        descricao: 'Apoio emocional e prevenção do suicídio, atendimento 24h gratuito e sigiloso.',
        link: 'https://cvv.org.br',
        telefone: '188',
        ordem: 1,
      },
      {
        nome: 'SAMU',
        descricao:
          'Serviço de Atendimento Móvel de Urgência em casos de emergência médica e intoxicação.',
        link: 'https://gov.br/saude',
        telefone: '192',
        ordem: 2,
      },
      {
        nome: 'CAPS — Centro de Atenção Psicossocial',
        descricao: 'Unidades públicas do SUS especializadas em saúde mental e dependência.',
        link: 'https://www.gov.br/saude/pt-br/composicao/saes/desmad/raps/caps',
        telefone: '',
        ordem: 3,
      },
      {
        nome: 'Alcoólicos Anônimos (A.A.)',
        descricao:
          'Irmandade de pessoas que compartilham experiências para resolver o problema comum com álcool.',
        link: 'https://aa.org.br',
        telefone: '',
        ordem: 4,
      },
      {
        nome: 'Narcóticos Anônimos (N.A.)',
        descricao: 'Comunidade de ajuda mútua para pessoas em recuperação do vício em drogas.',
        link: 'https://na.org.br',
        telefone: '',
        ordem: 5,
      },
      {
        nome: 'Al-Anon (Família e Amigos)',
        descricao: 'Apoio a familiares e amigos de pessoas que enfrentam o alcoolismo.',
        link: 'https://al-anon.org.br',
        telefone: '',
        ordem: 6,
      },
      {
        nome: 'Nar-Anon (Família e Amigos)',
        descricao: 'Grupos de apoio para quem convive com dependência química na família.',
        link: 'https://naranon.org.br',
        telefone: '',
        ordem: 7,
      },
      {
        nome: 'Amor-Exigente',
        descricao: 'Programa de auto e mútua ajuda voltado à família e prevenção.',
        link: 'https://amorexigente.org',
        telefone: '',
        ordem: 8,
      },
    ]

    const colResources = app.findCollectionByNameOrId('support_resources')
    for (let i = 0; i < resourcesData.length; i++) {
      const item = resourcesData[i]
      const rec = new Record(colResources)
      rec.set('nome', item.nome)
      rec.set('descricao', item.descricao)
      rec.set('link', item.link)
      rec.set('telefone', item.telefone)
      rec.set('ordem', item.ordem)
      app.save(rec)
    }
  },
  (app) => {
    const toDelete = [
      'caregiver_links',
      'med_checkins',
      'plan_completions',
      'plan_tasks',
      'cravings',
      'diary_entries',
      'episodes',
      'use_logs',
      'user_substances',
      'emergency_contacts',
      'profiles',
      'support_resources',
    ]
    for (let i = 0; i < toDelete.length; i++) {
      try {
        const col = app.findCollectionByNameOrId(toDelete[i])
        app.delete(col)
      } catch (_) {}
    }
  },
)
