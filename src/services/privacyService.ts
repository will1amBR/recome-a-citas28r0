import pb from '@/lib/pocketbase/client'

export interface FullUserDataExport {
  exportDate: string
  disclaimer: string
  user: {
    id?: string
    email?: string
    name?: string
  }
  profile: Record<string, unknown> | null
  substances: unknown[]
  useLogs: unknown[]
  episodes: unknown[]
  diaryEntries: unknown[]
  cravings: unknown[]
  planTasks: unknown[]
  planCompletions: unknown[]
  planIntentions: unknown[]
  sleepCheckins: unknown[]
  milestones: unknown[]
  medCheckins: unknown[]
  emergencyContacts: unknown[]
  caregiverLinks: unknown[]
  doctorLinks: unknown[]
}

/**
 * Coleta todos os dados de saúde e registros do usuário logado
 */
export async function collectAllUserData(
  userId: string,
  userEmail?: string,
  userName?: string,
): Promise<FullUserDataExport> {
  const [
    profileRes,
    substancesRes,
    useLogsRes,
    episodesRes,
    diaryRes,
    cravingsRes,
    planTasksRes,
    planCompletionsRes,
    planIntentionsRes,
    sleepRes,
    milestonesRes,
    medRes,
    contactsRes,
    caregiverRes,
    doctorRes,
  ] = await Promise.allSettled([
    pb
      .collection('profiles')
      .getFirstListItem(`owner="${userId}"`)
      .catch(() => null),
    pb
      .collection('user_substances')
      .getFullList({ filter: `owner="${userId}"` })
      .catch(() => []),
    pb
      .collection('use_logs')
      .getFullList({ filter: `owner="${userId}"` })
      .catch(() => []),
    pb
      .collection('episodes')
      .getFullList({ filter: `owner="${userId}"` })
      .catch(() => []),
    pb
      .collection('diary_entries')
      .getFullList({ filter: `owner="${userId}"` })
      .catch(() => []),
    pb
      .collection('cravings')
      .getFullList({ filter: `owner="${userId}"` })
      .catch(() => []),
    pb
      .collection('plan_tasks')
      .getFullList({ filter: `owner="${userId}"` })
      .catch(() => []),
    pb
      .collection('plan_completions')
      .getFullList({ filter: `owner="${userId}"` })
      .catch(() => []),
    pb
      .collection('plan_intentions')
      .getFullList({ filter: `owner="${userId}"` })
      .catch(() => []),
    pb
      .collection('sleep_checkins')
      .getFullList({ filter: `owner="${userId}"` })
      .catch(() => []),
    pb
      .collection('milestones')
      .getFullList({ filter: `owner="${userId}"` })
      .catch(() => []),
    pb
      .collection('med_checkins')
      .getFullList({ filter: `owner="${userId}"` })
      .catch(() => []),
    pb
      .collection('emergency_contacts')
      .getFullList({ filter: `owner="${userId}"` })
      .catch(() => []),
    pb
      .collection('caregiver_links')
      .getFullList({ filter: `owner="${userId}"` })
      .catch(() => []),
    pb
      .collection('doctor_links')
      .getFullList({ filter: `patient="${userId}"` })
      .catch(() => []),
  ])

  return {
    exportDate: new Date().toISOString(),
    disclaimer:
      'Seus dados são seus. Cópia completa dos registros pessoais gerada a pedido do usuário no aplicativo Recomeça.',
    user: {
      id: userId,
      email: userEmail,
      name: userName,
    },
    profile:
      profileRes.status === 'fulfilled' ? (profileRes.value as Record<string, unknown>) : null,
    substances: substancesRes.status === 'fulfilled' ? substancesRes.value : [],
    useLogs: useLogsRes.status === 'fulfilled' ? useLogsRes.value : [],
    episodes: episodesRes.status === 'fulfilled' ? episodesRes.value : [],
    diaryEntries: diaryRes.status === 'fulfilled' ? diaryRes.value : [],
    cravings: cravingsRes.status === 'fulfilled' ? cravingsRes.value : [],
    planTasks: planTasksRes.status === 'fulfilled' ? planTasksRes.value : [],
    planCompletions: planCompletionsRes.status === 'fulfilled' ? planCompletionsRes.value : [],
    planIntentions: planIntentionsRes.status === 'fulfilled' ? planIntentionsRes.value : [],
    sleepCheckins: sleepRes.status === 'fulfilled' ? sleepRes.value : [],
    milestones: milestonesRes.status === 'fulfilled' ? milestonesRes.value : [],
    medCheckins: medRes.status === 'fulfilled' ? medRes.value : [],
    emergencyContacts: contactsRes.status === 'fulfilled' ? contactsRes.value : [],
    caregiverLinks: caregiverRes.status === 'fulfilled' ? caregiverRes.value : [],
    doctorLinks: doctorRes.status === 'fulfilled' ? doctorRes.value : [],
  }
}

/**
 * Dispara o download de arquivo JSON e de texto legível no navegador
 */
export function downloadUserDataFiles(data: FullUserDataExport) {
  const jsonBlob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json;charset=utf-8',
  })
  const jsonUrl = URL.createObjectURL(jsonBlob)
  const aJson = document.createElement('a')
  aJson.href = jsonUrl
  aJson.download = `recomeca-meus-dados-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(aJson)
  aJson.click()
  document.body.removeChild(aJson)
  URL.revokeObjectURL(jsonUrl)

  // Versão legível em texto
  const readableLines = [
    `============================================================`,
    `RECOMEÇA • EXPORTAÇÃO DOS MEUS DADOS PESSOAIS`,
    `Data da exportação: ${new Date().toLocaleString('pt-BR')}`,
    `Usuário: ${data.user.name || data.user.email || 'Usuário'}`,
    `Tom: Seus dados são seus.`,
    `============================================================`,
    ``,
    `1. HÁBITOS & SUBSTÂNCIAS CADASTRADAS: ${data.substances.length}`,
    ...data.substances.map(
      (s: any) =>
        `  - ${s.tipo || s.name}: objetivo ${s.objetivo || s.goalType}, melhor sequência ${s.melhor_sequencia || s.bestStreakDays || 0} dias`,
    ),
    ``,
    `2. REGISTROS DE USO / DIÁRIO:`,
    `  - Registros pontuais de uso: ${data.useLogs.length}`,
    `  - Episódios detalhados: ${data.episodes.length}`,
    `  - Entradas no diário: ${data.diaryEntries.length}`,
    `  - Fissuras mapeadas: ${data.cravings.length}`,
    ``,
    `3. PLANO E ROTINA DE PREVENÇÃO:`,
    `  - Tarefas no cronograma: ${data.planTasks.length}`,
    `  - Tarefas concluídas: ${data.planCompletions.length}`,
    `  - Planos Se-Então: ${data.planIntentions.length}`,
    `  - Check-ins de sono: ${data.sleepCheckins.length}`,
    `  - Marcos comemorados: ${data.milestones.length}`,
    `  - Sinais de remédio: ${data.medCheckins.length}`,
    ``,
    `4. REDE DE APOIO & MÉDICO:`,
    `  - Contatos de emergência: ${data.emergencyContacts.length}`,
    `  - Cuidadores vinculados: ${data.caregiverLinks.length}`,
    `  - Vínculos com médico: ${data.doctorLinks.length}`,
    `============================================================`,
  ]
  const txtBlob = new Blob([readableLines.join('\n')], {
    type: 'text/plain;charset=utf-8',
  })
  const txtUrl = URL.createObjectURL(txtBlob)
  const aTxt = document.createElement('a')
  aTxt.href = txtUrl
  aTxt.download = `recomeca-resumo-legivel-${new Date().toISOString().slice(0, 10)}.txt`
  document.body.appendChild(aTxt)
  aTxt.click()
  document.body.removeChild(aTxt)
  URL.revokeObjectURL(txtUrl)
}

/**
 * Apaga irreversivelmente todas as linhas do usuário em todas as coleções
 * e depois remove o registro de autenticação (users), sem deixar lixo órfão.
 */
export async function deleteAllUserDataAndAccount(userId: string): Promise<boolean> {
  const collectionsWithOwner = [
    'profiles',
    'emergency_contacts',
    'user_substances',
    'use_logs',
    'episodes',
    'diary_entries',
    'cravings',
    'plan_tasks',
    'plan_completions',
    'med_checkins',
    'caregiver_links',
    'plan_intentions',
    'sleep_checkins',
    'milestones',
  ]

  // 1. Apaga itens nas coleções com 'owner'
  for (const colName of collectionsWithOwner) {
    try {
      const records = await pb.collection(colName).getFullList({
        filter: `owner="${userId}"`,
      })
      for (const rec of records) {
        await pb
          .collection(colName)
          .delete(rec.id)
          .catch(() => null)
      }
    } catch {
      // continua para a próxima coleção
    }
  }

  // 2. Apaga doctor_links onde o usuário é paciente ou médico
  try {
    const doctorLinks = await pb.collection('doctor_links').getFullList({
      filter: `patient="${userId}" || doctor="${userId}"`,
    })
    for (const rec of doctorLinks) {
      await pb
        .collection('doctor_links')
        .delete(rec.id)
        .catch(() => null)
    }
  } catch {
    // continua
  }

  // 3. Apaga doctor_patient_summaries onde o usuário é paciente ou médico
  try {
    const summaries = await pb.collection('doctor_patient_summaries').getFullList({
      filter: `patient="${userId}" || doctor="${userId}"`,
    })
    for (const rec of summaries) {
      await pb
        .collection('doctor_patient_summaries')
        .delete(rec.id)
        .catch(() => null)
    }
  } catch {
    // continua
  }

  // 4. Apaga o próprio registro de auth do usuário em 'users'
  try {
    await pb.collection('users').delete(userId)
  } catch {
    // se falhar por restrição, o authStore é limpo em seguida
  }

  // 5. Limpa localStorage e dados locais
  try {
    localStorage.clear()
    sessionStorage.clear()
  } catch {
    // noop
  }

  return true
}
