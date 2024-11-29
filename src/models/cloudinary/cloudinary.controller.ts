import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import * as multer from 'multer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('images')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
export class ImagesController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload an image to Cloudinary' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Image file to upload',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Image uploaded successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request, image file missing or invalid',
  })
  @UseInterceptors(
    FileInterceptor('image', { storage: multer.memoryStorage() }),
  ) // Sử dụng memoryStorage
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file || !file.buffer || file.size === 0) {
      console.error('No file uploaded or file is empty');
      throw new Error('No file uploaded or file is empty');
    }
    try {
      const uploadedImage = await this.cloudinaryService.uploadImage(file);
      return {
        message: 'Image uploaded successfully',
        url: uploadedImage.secure_url,
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  }
}

@Controller('videos')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
export class VideosController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload a video to Cloudinary' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        video: {
          type: 'string',
          format: 'binary',
          description: 'Video file to upload',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Video uploaded successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request, video file missing or invalid',
  })
  @UseInterceptors(FileInterceptor('video'))
  async uploadVideo(@UploadedFile() file: Express.Multer.File) {
    if (!file || file.size === 0) {
      throw new Error('No file uploaded or file is empty');
    }
    try {
      const uploadedVideo = await this.cloudinaryService.uploadVideo(file);
      return {
        message: 'Video uploaded successfully',
        url: uploadedVideo.secure_url,
      };
    } catch (error) {
      console.error('Error uploading video:', error);
      throw new Error('Failed to upload video');
    }
  }
}
