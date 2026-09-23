import {
  apiClient,
  normalizeApiError,
} from '../../api/client';

import type {
  CompleteInvitationPayload,
  CompleteInvitationResponse,
} from '../../types/api/invitation.types';

export const invitationApi = {
  async complete(
    payload: CompleteInvitationPayload,
  ): Promise<CompleteInvitationResponse> {
    try {
      const response =
        await apiClient.post<CompleteInvitationResponse>(
          '/auth/invitations/complete',
          payload,
        );

      return response.data;
    } catch (error) {
      throw normalizeApiError(error);
    }
  },
};
