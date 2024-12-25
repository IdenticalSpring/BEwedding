import { PartialType } from "@nestjs/swagger";
import { CreateUserInvitationDto } from "./create_invitation.dto";

export class UpdateUserInvitationDto extends PartialType(CreateUserInvitationDto) {}