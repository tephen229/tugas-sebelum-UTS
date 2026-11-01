import { User } from '../users/entities/user.entity';
import { Species } from '../species/entities/species.entity';
import { Breed } from '../breeds/entities/breed.entity';
import { Pet } from '../pets/entities/pet.entity';
import { ScreeningSession } from '../screening-sessions/entities/screening-session.entity';
import { QuestionnaireQuestion } from '../questionnaire-questions/entities/questionnaire-question.entity';
import { ScreeningAnswer } from '../screening-answers/entities/screening-answer.entity';
import { ChatMessage } from '../chat-messages/entities/chat-message.entity';
import { ImageScan } from '../image-scans/entities/image-scan.entity';
import { Disease } from '../diseases/entities/disease.entity';
import { ScreeningResult } from '../screening-results/entities/screening-result.entity';
import { VeterinaryService } from '../veterinary-services/entities/veterinary-service.entity';
import { ServiceReview } from '../service-reviews/entities/service-review.entity';
import { FavoriteService } from '../favorite-services/entities/favorite-service.entity';

// Daftar seluruh entity. Dibutuhkan sementara karena entity User dan Pet punya relasi
// ke entity yang modulnya belum kita buat. Tanpa daftar ini TypeORM gagal start.
export const ALL_ENTITIES = [
  User,
  Species,
  Breed,
  Pet,
  ScreeningSession,
  QuestionnaireQuestion,
  ScreeningAnswer,
  ChatMessage,
  ImageScan,
  Disease,
  ScreeningResult,
  VeterinaryService,
  ServiceReview,
  FavoriteService,
];