migrate(
  (app) => {
    // 1. Adicionar campos 'role' e 'crm_conselho' na coleção users
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    if (!users.fields.getByName('role')) {
      users.fields.add(
        new SelectField({
          name: 'role',
          values: ['paciente', 'profissional'],
          maxSelect: 1,
        }),
      )
    }
    if (!users.fields.getByName('crm_conselho')) {
      users.fields.add(
        new TextField({
          name: 'crm_conselho',
        }),
      )
    }
    app.save(users)

    // 2. Criar coleção doctor_links
    // Permite que o paciente crie um código de vínculo de 6 a 8 caracteres
    // e o profissional se vincule usando o código.
    // O paciente pode listar/ver/excluir seus links.
    // O profissional vinculado pode listar/ver os links que apontam para ele (doctor = @request.auth.id)
    // Regra de criação: qualquer usuário autenticado pode criar.
    // Regra de atualização: paciente dono ou profissional autenticado (para vincular seu doctor).
    const doctorLinks = new Collection({
      name: 'doctor_links',
      type: 'base',
      listRule:
        "@request.auth.id != '' && (patient = @request.auth.id || doctor = @request.auth.id)",
      viewRule:
        "@request.auth.id != '' && (patient = @request.auth.id || doctor = @request.auth.id)",
      createRule: "@request.auth.id != ''",
      updateRule:
        "@request.auth.id != '' && (patient = @request.auth.id || doctor = @request.auth.id || (code != '' && (doctor = '' || doctor = null)))",
      deleteRule: "@request.auth.id != '' && patient = @request.auth.id",
      fields: [
        {
          name: 'patient',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        {
          name: 'doctor',
          type: 'relation',
          required: false,
          collectionId: '_pb_users_auth_',
          cascadeDelete: false,
          maxSelect: 1,
        },
        { name: 'code', type: 'text', required: true },
        { name: 'status', type: 'text' }, // 'pending' | 'active' | 'revoked'
        { name: 'patient_name', type: 'text' },
        { name: 'doctor_name', type: 'text' },
        { name: 'doctor_crm', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_doctor_links_patient ON doctor_links (patient)',
        'CREATE INDEX idx_doctor_links_doctor ON doctor_links (doctor)',
        'CREATE INDEX idx_doctor_links_code ON doctor_links (code)',
      ],
    })
    app.save(doctorLinks)

    // 3. Criar coleção doctor_patient_summaries (RESUMO PERMITIDO PARA O MÉDICO)
    // O paciente atualiza este registro ou gera quando o vínculo está ativo.
    // O médico lê SOMENTE este resumo! NUNCA diário, NUNCA texto de episódios, NUNCA fotos.
    // list/view rule: paciente dono ou médico vinculado
    const doctorSummaries = new Collection({
      name: 'doctor_patient_summaries',
      type: 'base',
      listRule:
        "@request.auth.id != '' && (patient = @request.auth.id || doctor = @request.auth.id)",
      viewRule:
        "@request.auth.id != '' && (patient = @request.auth.id || doctor = @request.auth.id)",
      createRule: "@request.auth.id != ''",
      updateRule:
        "@request.auth.id != '' && (patient = @request.auth.id || doctor = @request.auth.id)",
      deleteRule: "@request.auth.id != '' && patient = @request.auth.id",
      fields: [
        {
          name: 'patient',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        {
          name: 'doctor',
          type: 'relation',
          required: false,
          collectionId: '_pb_users_auth_',
          cascadeDelete: false,
          maxSelect: 1,
        },
        { name: 'patient_display_name', type: 'text' },
        { name: 'substances_summary', type: 'json' }, // dias limpos por substância, melhor sequência, dias livres no mês
        { name: 'relapse_alerts', type: 'json' }, // datas dos episódios sem texto do diário
        { name: 'med_screening_answers', type: 'json' }, // respostas das 4 perguntas semanais
        { name: 'sleep_summary', type: 'json' }, // resumo de sono
        { name: 'milestones_summary', type: 'json' }, // próximos marcos
        { name: 'next_appointment', type: 'text' }, // próxima consulta
        { name: 'updated_at_display', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_doc_summaries_patient ON doctor_patient_summaries (patient)',
        'CREATE INDEX idx_doc_summaries_doctor ON doctor_patient_summaries (doctor)',
      ],
    })
    app.save(doctorSummaries)
  },
  (app) => {
    try {
      const summaries = app.findCollectionByNameOrId('doctor_patient_summaries')
      app.delete(summaries)
    } catch (_) {}

    try {
      const links = app.findCollectionByNameOrId('doctor_links')
      app.delete(links)
    } catch (_) {}

    try {
      const users = app.findCollectionByNameOrId('_pb_users_auth_')
      users.fields.removeByName('role')
      users.fields.removeByName('crm_conselho')
      app.save(users)
    } catch (_) {}
  },
)
