/**
 * Re-export cross-app types from @manager-acc/shared.
 * App-local types (if any) can be added alongside later.
 */
export type {
  User,
  AccStatus,
  MemberRole,
  MemberStatus,
  AccountFilterTab,
  Account,
  Member,
  HistoryEntry,
  AccountDetail,
  CreateAccountPayload,
  CreateAccountDto,
  UpdateAccountPayload,
  UpdateAccountDto,
  ApiSuccessResponse,
  ApiErrorResponse,
  ApiResponse,
  LoginDto,
  SignupDto,
  InvitationStatus,
  Invitation,
  CreateInvitationDto,
} from '@manager-acc/shared';
