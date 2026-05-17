import { ApiResponse } from "@app/common";

export interface ISqlFnResult<T> extends ApiResponse<T> { }


export type FnGetLectureOwnerResult = ISqlFnResult<{
    courseId: string;
    lectureId: string;
}>;

export type FnCreateLectureContentResult = ISqlFnResult<{
  contentId: string;
}>;

export type FnCreateTranscodeJobResult = ISqlFnResult<{
  jobId: string;
}>;