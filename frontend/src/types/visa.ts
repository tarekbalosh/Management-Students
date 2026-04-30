export type VisaStage = 
  | 'documents_preparation'
  | 'documents_submitted'
  | 'embassy_appointment'
  | 'interview_completed'
  | 'visa_approved'
  | 'visa_rejected'
  | 'visa_collected';

export interface StageHistoryEntry {
  stage: VisaStage;
  updatedBy?: string;
  updatedAt: string;
  notes?: string;
  appointmentDate?: string;
  appointmentLocation?: string;
  visaNumber?: string;
  validFrom?: string;
  validTo?: string;
  rejectionReason?: string;
}

export interface EmbassyDetails {
  name?: string;
  address?: string;
  phone?: string;
  country?: string;
  appointmentDate?: string;
}

export interface VisaDetails {
  type?: string;
  number?: string;
  issuedDate?: string;
  expiryDate?: string;
  scannedCopyUrl?: string;
}

export interface Reminder {
  type: 'appointment' | 'document_deadline' | 'expiry';
  scheduledFor: string;
  sent: boolean;
  sentAt?: string;
}

export interface VisaTracking {
  _id: string;
  applicationId: string;
  studentId: any;
  currentStage: VisaStage;
  stageHistory: StageHistoryEntry[];
  embassyDetails: EmbassyDetails;
  visaDetails: VisaDetails;
  reminders: Reminder[];
  notes?: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface VisaStats {
  total: number;
  approvalRate: number;
  rejectionRate: number;
  avgProcessingTimeDays: number;
  statsByUniversity: Array<{
    university: string;
    total: number;
    approved: number;
    rate: number;
  }>;
}
