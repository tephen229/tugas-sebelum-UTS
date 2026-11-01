import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ScreeningStatus } from '../../common/enums/screening-status.enum';

// GET /screening-sessions?userId=..&petId=..&status=in_progress
export class FindScreeningSessionsDto {
  @IsOptional()
  @IsUUID('4', { message: 'User ID harus berupa UUID yang valid' })
  readonly userId?: string;

  @IsOptional()
  @IsUUID('4', { message: 'Pet ID harus berupa UUID yang valid' })
  readonly petId?: string;

  @IsOptional()
  @IsEnum(ScreeningStatus, {
    message: 'Status harus in_progress, completed, atau failed',
  })
  readonly status?: ScreeningStatus;
}