
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FnGetJobByStorageKey, S3UploadResult, TranscodeJobRecord } from "../types/transcoding.types";
import { DatabaseService, IPgQuery } from "@app/common";


@Injectable()
export class JobService {
    private readonly logger = new Logger(JobService.name);


    constructor(private readonly configService: ConfigService,
        private readonly databaseService: DatabaseService
    ) {


    }

    async getJobByStorageKey(storageKey: string): Promise<TranscodeJobRecord | null> {
        const pgQuery: IPgQuery = {
            query: 'SELECT * FROM fn_get_job_by_storage_key($1)',
            params: [
                storageKey
            ]
        };

        const queryResult = await this.databaseService.queryOne<FnGetJobByStorageKey>(pgQuery);

        if (!queryResult?.success) {
            this.logger.warn(`Job lookup failed: ${queryResult?.message}`);
            return null;
        }

        return queryResult.data;
    }

    async markJobProcessing(jobId: string): Promise<void> {

        const pgQuery: IPgQuery = {
            query: 'SELECT * FROM fn_start_transcode_job($1)',
            params: [
                jobId
            ]
        };

        await this.databaseService.queryOne(pgQuery);

        this.logger.log(`Job ${jobId} → PROCESSING`);
    }

    async markJobComplete(
        jobId: string,
        uploadResult: S3UploadResult,
        durationSeconds: number,): Promise<void> {

        const pgQuery: IPgQuery = {
            query: `SELECT * FROM fn_complete_transcode_job($1, $2, $3, $4, $5)`,
            params: [
                jobId,
                uploadResult.hlsMasterKey,
                uploadResult.thumbnailKey,
                `${durationSeconds} seconds`,
                JSON.stringify(uploadResult.renditions),
            ],
        };

        await this.databaseService.queryOne(pgQuery);
        this.logger.log(`Job ${jobId} → COMPLETED`);
    }

    async markJobFailed(jobId: string, errorMessage: string): Promise<void> {
        const pgQuery: IPgQuery = {
            query: 'SELECT * FROM fn_fail_transcode_job($1, $2)',
            params: [
                jobId,
                errorMessage
            ]
        };

        await this.databaseService.queryOne(pgQuery);

        this.logger.log(`Job ${jobId} → FAILED`);

    }

} 