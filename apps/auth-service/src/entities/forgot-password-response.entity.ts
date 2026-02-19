import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordResponseEntity {
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2YTc4YmNlOS0yNzYwLTQxODktYjk3Yy1hNDlmYTc4NDc0NTMiLCJlbWFpbCI6ImF0aGFydkBnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJBdGhhcnYiLCJsYXN0TmFtZSI6IktoYW1rYXIiLCJyb2xlIjoiU1RVREVOVCIsInBob25lTnVtYmVyIjoiKzkxOTg3NjU0MzIxMCIsImlhdCI6MTc2OTI2Njk4MiwiZXhwIjoxNzY5MjcwNTgyfQ.54SImff0QcBw5i3-r1avI5_ykLhRGohhgcol8brtmvw' })
    resetToken: string;

    constructor(partial: Partial<ForgotPasswordResponseEntity>) {
        Object.assign(this, partial);
    }
}
