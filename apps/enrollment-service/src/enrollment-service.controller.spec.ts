import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentServiceController } from './enrollment-service.controller';
import { EnrollmentServiceService } from './enrollment-service.service';

describe('EnrollmentServiceController', () => {
  let enrollmentServiceController: EnrollmentServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [EnrollmentServiceController],
      providers: [EnrollmentServiceService],
    }).compile();

    enrollmentServiceController = app.get<EnrollmentServiceController>(EnrollmentServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(enrollmentServiceController.getHello()).toBe('Hello World!');
    });
  });
});
