import { PartialType } from "@nestjs/swagger";
import { CreateInvitationDto } from "./create_invitation.dto";

export class UpdateInvitationDto extends PartialType(CreateInvitationDto) {}