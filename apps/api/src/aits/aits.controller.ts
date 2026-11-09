import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes } from "@nestjs/swagger";
import { PERMISSIONS } from "@repo/shared";
import { Validate } from "nestjs-typebox";

import { BaseResponse, baseResponse, UUIDSchema, UUIDType } from "src/common";
import { RequirePermission } from "src/common/decorators/require-permission.decorator";
import { CurrentUser } from "src/common/decorators/user.decorator";
import { PermissionsGuard } from "src/common/guards/permissions.guard";
import { CurrentUserType } from "src/common/types/current-user.type";
import { getBaseFileTypePipe } from "src/file/utils/baseFileTypePipe";

import {
  KnowledgeInput,
  KnowledgeTransition,
  knowledgeDownloadSchema,
  knowledgeInputSchema,
  knowledgeListSchema,
  knowledgeSchema,
  knowledgeTransitionSchema,
} from "./aits.schema";
import { AitsService } from "./aits.service";

@Controller("aits/knowledge")
@UseGuards(PermissionsGuard)
export class AitsController {
  constructor(private readonly aitsService: AitsService) {}

  @Get()
  @RequirePermission(PERMISSIONS.DASHBOARD_READ)
  @Validate({ response: baseResponse(knowledgeListSchema) })
  async listKnowledge(@CurrentUser() user: CurrentUserType) {
    return new BaseResponse(await this.aitsService.list(user));
  }

  @Post()
  @RequirePermission(PERMISSIONS.SETTINGS_MANAGE)
  @Validate({
    request: [{ type: "body", schema: knowledgeInputSchema }],
    response: baseResponse(knowledgeSchema),
  })
  async createKnowledge(@Body() body: KnowledgeInput, @CurrentUser() user: CurrentUserType) {
    return new BaseResponse(await this.aitsService.create(user, body));
  }

  @Post(":id/revisions")
  @RequirePermission(PERMISSIONS.SETTINGS_MANAGE)
  @Validate({
    request: [
      { type: "param", name: "id", schema: UUIDSchema },
      { type: "body", schema: knowledgeInputSchema },
    ],
    response: baseResponse(knowledgeSchema),
  })
  async reviseKnowledge(
    @Param("id") id: UUIDType,
    @Body() body: KnowledgeInput,
    @CurrentUser() user: CurrentUserType,
  ) {
    return new BaseResponse(await this.aitsService.create(user, body, id));
  }

  @Post(":id/transition")
  @RequirePermission(PERMISSIONS.SETTINGS_MANAGE)
  @Validate({
    request: [
      { type: "param", name: "id", schema: UUIDSchema },
      { type: "body", schema: knowledgeTransitionSchema },
    ],
    response: baseResponse(knowledgeSchema),
  })
  async transitionKnowledge(
    @Param("id") id: UUIDType,
    @Body() body: KnowledgeTransition,
    @CurrentUser() user: CurrentUserType,
  ) {
    return new BaseResponse(await this.aitsService.transition(user, id, body));
  }

  @Post(":id/file")
  @RequirePermission(PERMISSIONS.SETTINGS_MANAGE)
  @UseInterceptors(FileInterceptor("file", { limits: { fileSize: 10 * 1024 * 1024, files: 1 } }))
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      required: ["file"],
      properties: { file: { type: "string", format: "binary" } },
    },
  })
  @Validate({
    request: [{ type: "param", name: "id", schema: UUIDSchema }],
    response: baseResponse(knowledgeSchema),
  })
  async uploadKnowledge(
    @Param("id") id: UUIDType,
    @UploadedFile(
      getBaseFileTypePipe(
        /^(application\/pdf|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document|text\/plain)$/,
        10 * 1024 * 1024,
        true,
      ).build(),
    )
    file: Express.Multer.File,
    @CurrentUser() user: CurrentUserType,
  ) {
    return new BaseResponse(await this.aitsService.upload(user, id, file));
  }

  @Get(":id/file")
  @RequirePermission(PERMISSIONS.DASHBOARD_READ)
  @Validate({
    request: [{ type: "param", name: "id", schema: UUIDSchema }],
    response: baseResponse(knowledgeDownloadSchema),
  })
  async downloadKnowledge(@Param("id") id: UUIDType, @CurrentUser() user: CurrentUserType) {
    return new BaseResponse(await this.aitsService.download(user, id));
  }
}
