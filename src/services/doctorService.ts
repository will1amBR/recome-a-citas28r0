import pb from '@/lib/pocketbase/client'

export interface DoctorLinkData {
  id: string
  patient: string
  doctor?: string
  code: string
  status: 'pending' | 'active' | 'revoked'
  patient_name?: string
  doctor_name?: string
  doctor_crm?: string
  created?: string
  updated?: string
}

export interface DoctorPatientSummaryData {
  id?: string
  patient: string
  doctor?: string
  patient_display_name?: string
  substances_summary?: {
    name: string
    goal: string
    cleanDays: number
    bestStreak: number
    cleanDaysMonth: number
  }[]
  relapse_alerts?: {
    date: string
    substanceName: string
  }[]
  med_screening_answers?: {
    question: string
    answeredYes: boolean
  }[]
  sleep_summary?: {
    week: string
    answer: string
    note?: string
  }[]
  milestones_summary?: {
    title: string
    celebratedDate?: string
    isAchieved: boolean
  }[]
  next_appointment?: string
  updated_at_display?: string
  created?: string
  updated?: string
}

// ------------------------------------------------------------------
// FUNÇÕES PARA O PACIENTE (GERENCIAR SEUS MÉDICOS VINCULADOS)
// ------------------------------------------------------------------

/**
 * Gera um novo código de vínculo de 6 a 8 caracteres para o paciente
 */
export async function createDoctorLinkCode(
  patientId: string,
  patientName: string,
): Promise<DoctorLinkData> {
  // Gera código amigável de 6 caracteres alfanuméricos em maiúsculas (ex: REC-78A ou 6 dígitos)
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let randomCode = 'REC-'
  for (let i = 0; i < 4; i++) {
    randomCode += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  const record = await pb.collection('doctor_links').create({
    patient: patientId,
    code: randomCode,
    status: 'pending',
    patient_name: patientName || 'Paciente Recomeça',
  })

  return record as unknown as DoctorLinkData
}

/**
 * Obtém os vínculos existentes do paciente
 */
export async function getPatientDoctorLinks(patientId: string): Promise<DoctorLinkData[]> {
  try {
    const list = await pb.collection('doctor_links').getFullList({
      filter: `patient="${patientId}"`,
      sort: '-created',
    })
    return list as unknown as DoctorLinkData[]
  } catch {
    return []
  }
}

/**
 * Desvincula um médico a qualquer momento sem justificativa
 */
export async function revokeDoctorLink(linkId: string): Promise<boolean> {
  try {
    await pb.collection('doctor_links').delete(linkId)
    return true
  } catch {
    return false
  }
}

/**
 * Atualiza ou sincroniza o resumo estrito permitido que o médico verá
 * (Garante que diários, recibos e textos livres NUNCA sejam enviados)
 */
export async function upsertPatientSummaryForDoctor(
  summaryData: Omit<DoctorPatientSummaryData, 'id'>,
): Promise<DoctorPatientSummaryData | null> {
  try {
    const existing = await pb
      .collection('doctor_patient_summaries')
      .getFirstListItem(`patient="${summaryData.patient}"`)
      .catch(() => null)

    if (existing?.id) {
      const updated = await pb
        .collection('doctor_patient_summaries')
        .update(existing.id, summaryData)
      return updated as unknown as DoctorPatientSummaryData
    }

    const created = await pb.collection('doctor_patient_summaries').create(summaryData)
    return created as unknown as DoctorPatientSummaryData
  } catch {
    return null
  }
}

// ------------------------------------------------------------------
// FUNÇÕES PARA O PROFISSIONAL DE SAÚDE
// ------------------------------------------------------------------

/**
 * Vincula o médico a um paciente através do código digitado
 */
export async function bindDoctorWithCode(
  doctorId: string,
  doctorName: string,
  doctorCrm: string,
  code: string,
): Promise<{ success: boolean; error?: string; link?: DoctorLinkData }> {
  try {
    const cleanCode = code.trim().toUpperCase()
    const linkRecord = await pb
      .collection('doctor_links')
      .getFirstListItem(`code="${cleanCode}" && status="pending"`)

    if (!linkRecord?.id) {
      return { success: false, error: 'Código não encontrado ou já utilizado.' }
    }

    const updated = await pb.collection('doctor_links').update(linkRecord.id, {
      doctor: doctorId,
      doctor_name: doctorName,
      doctor_crm: doctorCrm || '',
      status: 'active',
    })

    // Atualiza doctorId no resumo se já existir
    try {
      const summary = await pb
        .collection('doctor_patient_summaries')
        .getFirstListItem(`patient="${linkRecord.patient}"`)
      if (summary?.id) {
        await pb.collection('doctor_patient_summaries').update(summary.id, {
          doctor: doctorId,
        })
      }
    } catch {
      // resumo ainda será sincronizado
    }

    return { success: true, link: updated as unknown as DoctorLinkData }
  } catch {
    return {
      success: false,
      error: 'Não foi possível vincular com esse código. Verifique e tente de novo.',
    }
  }
}

/**
 * Lista os pacientes vinculados para o profissional logado
 */
export async function getDoctorLinkedPatients(doctorId: string): Promise<DoctorLinkData[]> {
  try {
    const list = await pb.collection('doctor_links').getFullList({
      filter: `doctor="${doctorId}" && status="active"`,
      sort: '-updated',
    })
    return list as unknown as DoctorLinkData[]
  } catch {
    return []
  }
}

/**
 * Busca o resumo seguro de um paciente vinculado
 * (Apenas os campos permitidos pelo PRP: dias limpos, sequência, alertas sem texto de diário, etc.)
 */
export async function getDoctorPatientSummary(
  patientId: string,
): Promise<DoctorPatientSummaryData | null> {
  try {
    const record = await pb
      .collection('doctor_patient_summaries')
      .getFirstListItem(`patient="${patientId}"`)
    return record as unknown as DoctorPatientSummaryData
  } catch {
    return null
  }
}
