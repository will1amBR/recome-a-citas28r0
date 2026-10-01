migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    try {
      app.findAuthRecordByEmail('_pb_users_auth_', 'william@korenambiental.com')
      return // already seeded
    } catch (_) {}

    const record = new Record(users)
    record.setEmail('william@korenambiental.com')
    record.setPassword('Skip@Pass')
    record.setVerified(true)
    record.set('name', 'William')
    app.save(record)
  },
  (app) => {
    try {
      const record = app.findAuthRecordByEmail('_pb_users_auth_', 'william@korenambiental.com')
      app.delete(record)
    } catch (_) {}
  },
)
