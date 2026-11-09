import { Module } from "@nestjs/common";

import { S3Module } from "src/s3/s3.module";

import { AitsController } from "./aits.controller";
import { AitsRepository } from "./aits.repository";
import { AitsService } from "./aits.service";

@Module({
  imports: [S3Module],
  controllers: [AitsController],
  providers: [AitsRepository, AitsService],
})
export class AitsModule {}
