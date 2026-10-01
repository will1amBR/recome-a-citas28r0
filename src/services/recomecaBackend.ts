import pb from '@/lib/pocketbase/client'

// PROFILES
export interface ProfileData {
  id?: string
  owner?: string
  nome_preferido?: string
  nome_social?: string
  nome_registro?: string
  genero?: string
  orientacao?: string
  descricao_identidade?: string
  dia_a_dia?: string
  momentos_risco?: string[]
  o_que_ajuda?: string[]
  rotina_livre?: string
  dark_mode?: boolean
  meta_dia?: string
  consentimento_lgpd?: boolean
  consentimento_lgpd_data?: string
  situacoes_risco?: string[]
}

export async function getProfile(userId: string): Promise<ProfileData | null> {
  try {
    const record = await pb.collection('profiles').getFirstListItem(`owner="${userId}"`)
    return record as unknown as ProfileData
  } catch {
    return null
  }
}

export async function upsertProfile(
  userId: string,
  data: Partial<ProfileData>,
): Promise<ProfileData> {
  const existing = await getProfile(userId)
  if (existing?.id) {
    const updated = await pb.collection('profiles').update(existing.id, data)
    return updated as unknown as ProfileData
  }
  const created = await pb.collection('profiles').create({
    ...data,
    owner: userId,
  })
  return created as unknown as ProfileData
}

// EMERGENCY CONTACTS
export interface EmergencyContactData {
  id?: string
  owner?: string
  nome: string
  telefone: string
  ja_avisou?: boolean
}

export async function getEmergencyContacts(userId: string): Promise<EmergencyContactData[]> {
  try {
    const list = await pb.collection('emergency_contacts').getFullList({
      filter: `owner="${userId}"`,
      sort: '-created',
    })
    return list as unknown as EmergencyContactData[]
  } catch {
    return []
  }
}

export async function upsertEmergencyContact(
  userId: string,
  contact: { nome: string; telefone: string; ja_avisou?: boolean; id?: string },
): Promise<EmergencyContactData> {
  if (contact.id) {
    const updated = await pb.collection('emergency_contacts').update(contact.id, contact)
    return updated as unknown as EmergencyContactData
  }
  // Se já tem um contato salvo para esse owner, atualiza
  const existingList = await getEmergencyContacts(userId)
  if (existingList.length > 0 && existingList[0].id) {
    const updated = await pb.collection('emergency_contacts').update(existingList[0].id, contact)
    return updated as unknown as EmergencyContactData
  }
  const created = await pb.collection('emergency_contacts').create({
    ...contact,
    owner: userId,
  })
  return created as unknown as EmergencyContactData
}

// USER SUBSTANCES
export interface UserSubstanceData {
  id?: string
  owner?: string
  tipo: string
  objetivo: string // 'parar' | 'reduzir'
  uso_inicial?: string
  data_inicio?: string
  meta_dia_texto?: string
  meta_dia_numero?: number
  melhor_sequencia?: number
  ativo?: boolean
}

export async function getUserSubstances(userId: string): Promise<UserSubstanceData[]> {
  try {
    const list = await pb.collection('user_substances').getFullList({
      filter: `owner="${userId}"`,
      sort: 'created',
    })
    return list as unknown as UserSubstanceData[]
  } catch {
    return []
  }
}

export async function createUserSubstance(
  userId: string,
  data: Omit<UserSubstanceData, 'id' | 'owner'>,
): Promise<UserSubstanceData> {
  const created = await pb.collection('user_substances').create({
    ...data,
    owner: userId,
    ativo: data.ativo ?? true,
  })
  return created as unknown as UserSubstanceData
}

export async function updateUserSubstance(
  id: string,
  data: Partial<UserSubstanceData>,
): Promise<UserSubstanceData> {
  const updated = await pb.collection('user_substances').update(id, data)
  return updated as unknown as UserSubstanceData
}

// USE LOGS
export interface UseLogData {
  id?: string
  owner?: string
  substancia?: string
  substancia_nome?: string
  quantidade?: number
  unidade?: string
  data_hora: string
  contexto?: string
  custo?: number
  quanto_comprou?: string
  quanto_usou?: string
  tempo_uso?: string
  dividiu?: string
  observacao?: string
}

export async function getUseLogs(userId: string, limit = 50): Promise<UseLogData[]> {
  try {
    const list = await pb.collection('use_logs').getList(1, limit, {
      filter: `owner="${userId}"`,
      sort: '-data_hora,-created',
    })
    return list.items as unknown as UseLogData[]
  } catch {
    return []
  }
}

export async function createUseLog(
  userId: string,
  data: Omit<UseLogData, 'id' | 'owner'>,
): Promise<UseLogData> {
  const created = await pb.collection('use_logs').create({
    ...data,
    owner: userId,
  })
  return created as unknown as UseLogData
}

export async function deleteUseLog(id: string): Promise<boolean> {
  try {
    await pb.collection('use_logs').delete(id)
    return true
  } catch {
    return false
  }
}

// EPISODES
export interface EpisodeData {
  id?: string
  owner?: string
  substancia?: string
  texto?: string
  humor?: string
  gatilho?: string[]
  antes?: string
  depois?: string
  valor_gasto?: number
  hora_chegada?: string
  hora_saida?: string
  itens?: string[]
  recibo_foto?: string | File
  data_hora?: string
  craving_time?: string
  details_json?: Record<string, unknown>
  created?: string
}

export async function getEpisodes(userId: string, limit = 50): Promise<EpisodeData[]> {
  try {
    const list = await pb.collection('episodes').getList(1, limit, {
      filter: `owner="${userId}"`,
      sort: '-created',
    })
    return list.items as unknown as EpisodeData[]
  } catch {
    return []
  }
}

export async function createEpisode(
  userId: string,
  data: Omit<EpisodeData, 'id' | 'owner'>,
  file?: File | null,
): Promise<EpisodeData> {
  if (file) {
    const formData = new FormData()
    formData.append('owner', userId)
    if (data.substancia) formData.append('substancia', data.substancia)
    if (data.texto) formData.append('texto', data.texto)
    if (data.humor) formData.append('humor', data.humor)
    if (data.antes) formData.append('antes', data.antes)
    if (data.depois) formData.append('depois', data.depois)
    if (typeof data.valor_gasto === 'number')
      formData.append('valor_gasto', String(data.valor_gasto))
    if (data.hora_chegada) formData.append('hora_chegada', data.hora_chegada)
    if (data.hora_saida) formData.append('hora_saida', data.hora_saida)
    if (data.data_hora) formData.append('data_hora', data.data_hora)
    if (data.craving_time) formData.append('craving_time', data.craving_time)
    if (data.gatilho) formData.append('gatilho', JSON.stringify(data.gatilho))
    if (data.itens) formData.append('itens', JSON.stringify(data.itens))
    if (data.details_json) formData.append('details_json', JSON.stringify(data.details_json))
    formData.append('recibo_foto', file)

    const created = await pb.collection('episodes').create(formData)
    return created as unknown as EpisodeData
  }

  const created = await pb.collection('episodes').create({
    ...data,
    owner: userId,
  })
  return created as unknown as EpisodeData
}

// CRAVINGS
export interface CravingData {
  id?: string
  owner?: string
  data_hora: string
  situacao?: string
  tecnica_usada?: string
  resultado?: string
  duracao?: string
  substancia_nome?: string
  created?: string
}

export async function getCravings(userId: string, limit = 50): Promise<CravingData[]> {
  try {
    const list = await pb.collection('cravings').getList(1, limit, {
      filter: `owner="${userId}"`,
      sort: '-created',
    })
    return list.items as unknown as CravingData[]
  } catch {
    return []
  }
}

export async function createCraving(
  userId: string,
  data: Omit<CravingData, 'id' | 'owner'>,
): Promise<CravingData> {
  const created = await pb.collection('cravings').create({
    ...data,
    owner: userId,
  })
  return created as unknown as CravingData
}

// PLAN TASKS & COMPLETIONS
export interface PlanTaskData {
  id?: string
  owner?: string
  texto: string
  categoria: string
  explicacao?: string
  custom?: boolean
}

export interface PlanCompletionData {
  id?: string
  owner?: string
  tarefa?: string
  tarefa_id_string?: string
  tarefa_titulo?: string
  data: string
  hora?: string
}

export async function getPlanTasks(userId: string): Promise<PlanTaskData[]> {
  try {
    const list = await pb.collection('plan_tasks').getFullList({
      filter: `owner="${userId}"`,
      sort: 'created',
    })
    return list as unknown as PlanTaskData[]
  } catch {
    return []
  }
}

export async function createPlanTask(
  userId: string,
  data: Omit<PlanTaskData, 'id' | 'owner'>,
): Promise<PlanTaskData> {
  const created = await pb.collection('plan_tasks').create({
    ...data,
    owner: userId,
  })
  return created as unknown as PlanTaskData
}

export async function deletePlanTask(id: string): Promise<boolean> {
  try {
    await pb.collection('plan_tasks').delete(id)
    return true
  } catch {
    return false
  }
}

export async function getPlanCompletions(
  userId: string,
  limit = 100,
): Promise<PlanCompletionData[]> {
  try {
    const list = await pb.collection('plan_completions').getList(1, limit, {
      filter: `owner="${userId}"`,
      sort: '-data,-hora',
    })
    return list.items as unknown as PlanCompletionData[]
  } catch {
    return []
  }
}

export async function togglePlanCompletion(
  userId: string,
  taskIdString: string,
  taskTitle: string,
  dateStr: string,
  horaStr: string,
): Promise<{ completed: boolean; id?: string }> {
  try {
    const existing = await pb
      .collection('plan_completions')
      .getFirstListItem(
        `owner="${userId}" && data="${dateStr}" && tarefa_id_string="${taskIdString}"`,
      )
    if (existing?.id) {
      await pb.collection('plan_completions').delete(existing.id)
      return { completed: false }
    }
  } catch {
    // not found, proceed to create
  }

  const created = await pb.collection('plan_completions').create({
    owner: userId,
    tarefa_id_string: taskIdString,
    tarefa_titulo: taskTitle,
    data: dateStr,
    hora: horaStr,
  })
  return { completed: true, id: created.id }
}

// DIARY ENTRIES
export interface DiaryEntryData {
  id?: string
  owner?: string
  data: string
  texto?: string
  humor?: string
  status_dia?: string
}

export async function getDiaryEntries(userId: string, limit = 60): Promise<DiaryEntryData[]> {
  try {
    const list = await pb.collection('diary_entries').getList(1, limit, {
      filter: `owner="${userId}"`,
      sort: '-data',
    })
    return list.items as unknown as DiaryEntryData[]
  } catch {
    return []
  }
}

export async function upsertDiaryEntry(
  userId: string,
  data: Omit<DiaryEntryData, 'id' | 'owner'>,
): Promise<DiaryEntryData> {
  try {
    const existing = await pb
      .collection('diary_entries')
      .getFirstListItem(`owner="${userId}" && data="${data.data}"`)
    if (existing?.id) {
      const updated = await pb.collection('diary_entries').update(existing.id, data)
      return updated as unknown as DiaryEntryData
    }
  } catch {
    // create new
  }

  const created = await pb.collection('diary_entries').create({
    ...data,
    owner: userId,
  })
  return created as unknown as DiaryEntryData
}

// SUPPORT RESOURCES
export interface SupportResourceData {
  id: string
  nome: string
  descricao?: string
  link?: string
  telefone?: string
  ordem?: number
}

export async function getSupportResources(): Promise<SupportResourceData[]> {
  try {
    const list = await pb.collection('support_resources').getFullList({
      sort: 'ordem,nome',
    })
    return list as unknown as SupportResourceData[]
  } catch {
    return []
  }
}
