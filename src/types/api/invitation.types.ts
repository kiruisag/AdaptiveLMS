export interface CompleteInvitationPayload {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

export interface CompleteInvitationData {
  membership_id: string | number;
  organization_id: string | number;
  status: string;
}

export interface CompleteInvitationResponse {
  message: string;
  data: CompleteInvitationData;
}
