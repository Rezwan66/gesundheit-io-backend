var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express4 from "express";

// src/app/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// src/generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// src/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": 'model Admin {\n  id            String    @id @default(uuid(7))\n  name          String\n  email         String    @unique\n  profilePhoto  String?\n  contactNumber String?\n  isDeleted     Boolean   @default(false)\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n  deletedAt     DateTime?\n\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([email])\n  @@index([isDeleted])\n  @@map("admins")\n}\n\nmodel Appointment {\n  id             String            @id @default(uuid(7))\n  videoCallingId String            @unique @db.Uuid()\n  status         AppointmentStatus @default(SCHEDULED)\n  paymentStatus  PaymentStatus     @default(UNPAID)\n  createdAt      DateTime          @default(now())\n  updatedAt      DateTime          @updatedAt\n\n  patientId String\n  patient   Patient @relation(fields: [patientId], references: [id], onDelete: Cascade)\n\n  doctorId String\n  doctor   Doctor @relation(fields: [doctorId], references: [id], onDelete: Cascade)\n\n  scheduleId String\n  schedule   Schedule @relation(fields: [scheduleId], references: [id], onDelete: Cascade)\n\n  prescription Prescription?\n  review       Review?\n  payment      Payment?\n\n  @@index([patientId])\n  @@index([doctorId])\n  @@index([scheduleId])\n  @@index([status])\n  @@map("appointments")\n}\n\nmodel User {\n  id                 String     @id\n  name               String\n  email              String\n  emailVerified      Boolean    @default(false)\n  role               Role       @default(PATIENT)\n  status             UserStatus @default(ACTIVE)\n  needPasswordChange Boolean    @default(false)\n  isDeleted          Boolean    @default(false)\n  deletedAt          DateTime?\n  image              String?\n  createdAt          DateTime   @default(now())\n  updatedAt          DateTime   @updatedAt\n  sessions           Session[]\n  accounts           Account[]\n  patient            Patient?\n  doctor             Doctor?\n  admin              Admin?\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel Doctor {\n  id String @id @default(uuid(7))\n\n  name          String\n  email         String    @unique\n  profilePhoto  String?\n  contactNumber String?\n  address       String?\n  isDeleted     Boolean   @default(false)\n  deletedAt     DateTime?\n\n  registrationNumber  String @unique\n  experience          Int    @default(0)\n  gender              Gender\n  appointmentFee      Float\n  qualification       String\n  currentWorkingPlace String\n  designation         String\n  averageRating       Float  @default(0.0)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  //relations\n  userId          String            @unique\n  user            User              @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n  specialties     DoctorSpecialty[]\n  appointments    Appointment[]\n  prescriptions   Prescription[]\n  reviews         Review[]\n  doctorSchedules DoctorSchedules[]\n\n  @@index([email], name: "idx_doctor_email")\n  @@index([isDeleted], name: "idx_doctor_isDeleted")\n  @@map("doctor")\n}\n\nenum Role {\n  SUPER_ADMIN\n  ADMIN\n  DOCTOR\n  PATIENT\n}\n\nenum UserStatus {\n  ACTIVE\n  BLOCKED\n  DELETED\n}\n\nenum Gender {\n  MALE\n  FEMALE\n  OTHER\n}\n\nenum BloodGroup {\n  A_POSITIVE\n  A_NEGATIVE\n  B_POSITIVE\n  B_NEGATIVE\n  AB_POSITIVE\n  AB_NEGATIVE\n  O_POSITIVE\n  O_NEGATIVE\n}\n\nenum AppointmentStatus {\n  SCHEDULED\n  INPROGRESS\n  COMPLETED\n  CANCELED\n}\n\nenum PaymentStatus {\n  PAID\n  UNPAID\n}\n\nmodel MedicalReport {\n  id         String   @id @default(uuid(7))\n  reportName String\n  reportLink String\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  patientId String\n  patient   Patient @relation(fields: [patientId], references: [id], onDelete: Cascade)\n\n  @@index([patientId])\n  @@map("medical_reports")\n}\n\nmodel Patient {\n  id String @id @default(uuid(7))\n\n  name          String\n  email         String    @unique\n  profilePhoto  String?\n  contactNumber String?\n  address       String?\n  isDeleted     Boolean   @default(false)\n  deletedAt     DateTime?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n\n  // relations\n  userId            String             @unique\n  user              User               @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n  appointments      Appointment[]\n  medicalReports    MedicalReport[]\n  patientHealthData PatientHealthData?\n  prescriptions     Prescription[]\n  reviews           Review[]\n\n  @@index([email], name: "idx_patient_email")\n  @@index([isDeleted], name: "idx_patient_isDeleted")\n  @@map("patient")\n}\n\nmodel PatientHealthData {\n  id                  String     @id @default(uuid(7))\n  gender              Gender\n  dateOfBirth         DateTime\n  bloodGroup          BloodGroup\n  hasAllergies        Boolean    @default(false)\n  hasDiabetes         Boolean    @default(false)\n  height              String\n  weight              String\n  smokingStatus       Boolean    @default(false)\n  dietaryPreferences  String?\n  pregnancyStatus     Boolean    @default(false)\n  mentalHealthHistory String?\n  immunizationStatus  String?\n  hasPastSurgeries    Boolean    @default(false)\n  recentAnxiety       Boolean    @default(false)\n  recentDepression    Boolean    @default(false)\n  maritalStatus       String?\n  createdAt           DateTime   @default(now())\n  updatedAt           DateTime   @updatedAt\n\n  patientId String  @unique\n  patient   Patient @relation(fields: [patientId], references: [id], onDelete: Cascade)\n\n  @@index([patientId])\n  @@map("patient_health_data")\n}\n\nmodel Payment {\n  id                 String        @id @default(uuid(7))\n  amount             Float\n  transactionId      String        @unique @db.Uuid()\n  stripeEventId      String?       @unique\n  status             PaymentStatus @default(UNPAID)\n  invoiceUrl         String?\n  paymentGatewayData Json?\n  createdAt          DateTime      @default(now())\n  updatedAt          DateTime      @updatedAt\n\n  appointmentId String      @unique\n  appointment   Appointment @relation(fields: [appointmentId], references: [id], onDelete: Cascade)\n\n  @@index([appointmentId])\n  @@index([transactionId])\n  @@map("payments")\n}\n\nmodel Prescription {\n  id           String   @id @default(uuid(7))\n  followUpDate DateTime\n  instructions String   @db.Text\n  pdfUrl       String?\n  createdAt    DateTime @default(now())\n  updatedAt    DateTime @updatedAt\n\n  appointmentId String      @unique\n  appointment   Appointment @relation(fields: [appointmentId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  patientId String\n  patient   Patient @relation(fields: [patientId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  doctorId String\n  doctor   Doctor @relation(fields: [doctorId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  @@index([appointmentId])\n  @@index([patientId])\n  @@index([doctorId])\n  @@map("prescriptions")\n}\n\nmodel Review {\n  id        String   @id @default(uuid(7))\n  rating    Float    @default(0.0)\n  comment   String?  @db.Text\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  appointmentId String      @unique\n  appointment   Appointment @relation(fields: [appointmentId], references: [id], onDelete: Cascade)\n\n  patientId String\n  patient   Patient @relation(fields: [patientId], references: [id], onDelete: Cascade)\n\n  doctorId String\n  doctor   Doctor @relation(fields: [doctorId], references: [id], onDelete: Cascade)\n\n  @@index([appointmentId])\n  @@index([patientId])\n  @@index([doctorId])\n  @@map("reviews")\n}\n\nmodel Schedule {\n  id              String            @id @default(uuid(7))\n  startDateTime   DateTime\n  endDateTime     DateTime\n  createdAt       DateTime          @default(now())\n  updatedAt       DateTime          @updatedAt\n  doctorSchedules DoctorSchedules[]\n  appointments    Appointment[]\n\n  @@map("schedules")\n}\n\nmodel DoctorSchedules {\n  doctorId String\n  doctor   Doctor @relation(fields: [doctorId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  scheduleId String\n  schedule   Schedule @relation(fields: [scheduleId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  isBooked  Boolean  @default(false)\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@id([doctorId, scheduleId])\n  @@index([doctorId])\n  @@index([scheduleId])\n  @@map("doctor_schedules")\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Specialty {\n  id String @id @default(uuid(7))\n\n  title       String  @unique @db.VarChar(100)\n  description String? @db.Text\n  icon        String? @db.VarChar(255)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  isDeleted         Boolean           @default(false)\n  deletedAt         DateTime?\n  doctorSpecialties DoctorSpecialty[]\n\n  @@index([isDeleted], name: "idx_specialty_isDeleted")\n  @@index([title], name: "idx_specialty_title")\n  @@map("specialties")\n}\n\nmodel DoctorSpecialty {\n  id          String @id @default(uuid(7))\n  doctorId    String\n  specialtyId String\n\n  doctor    Doctor    @relation(fields: [doctorId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n  specialty Specialty @relation(fields: [specialtyId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  @@unique([doctorId, specialtyId])\n  @@index([doctorId], name: "idx_doctor_specialty_doctorId")\n  @@index([specialtyId], name: "idx_doctor_specialty_specialtyId")\n  @@map("doctor_specialties")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Admin":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"contactNumber","kind":"scalar","type":"String"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AdminToUser"}],"dbName":"admins"},"Appointment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"videoCallingId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"AppointmentStatus"},{"name":"paymentStatus","kind":"enum","type":"PaymentStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"patientId","kind":"scalar","type":"String"},{"name":"patient","kind":"object","type":"Patient","relationName":"AppointmentToPatient"},{"name":"doctorId","kind":"scalar","type":"String"},{"name":"doctor","kind":"object","type":"Doctor","relationName":"AppointmentToDoctor"},{"name":"scheduleId","kind":"scalar","type":"String"},{"name":"schedule","kind":"object","type":"Schedule","relationName":"AppointmentToSchedule"},{"name":"prescription","kind":"object","type":"Prescription","relationName":"AppointmentToPrescription"},{"name":"review","kind":"object","type":"Review","relationName":"AppointmentToReview"},{"name":"payment","kind":"object","type":"Payment","relationName":"AppointmentToPayment"}],"dbName":"appointments"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"needPasswordChange","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"patient","kind":"object","type":"Patient","relationName":"PatientToUser"},{"name":"doctor","kind":"object","type":"Doctor","relationName":"DoctorToUser"},{"name":"admin","kind":"object","type":"Admin","relationName":"AdminToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Doctor":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"contactNumber","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"registrationNumber","kind":"scalar","type":"String"},{"name":"experience","kind":"scalar","type":"Int"},{"name":"gender","kind":"enum","type":"Gender"},{"name":"appointmentFee","kind":"scalar","type":"Float"},{"name":"qualification","kind":"scalar","type":"String"},{"name":"currentWorkingPlace","kind":"scalar","type":"String"},{"name":"designation","kind":"scalar","type":"String"},{"name":"averageRating","kind":"scalar","type":"Float"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"DoctorToUser"},{"name":"specialties","kind":"object","type":"DoctorSpecialty","relationName":"DoctorToDoctorSpecialty"},{"name":"appointments","kind":"object","type":"Appointment","relationName":"AppointmentToDoctor"},{"name":"prescriptions","kind":"object","type":"Prescription","relationName":"DoctorToPrescription"},{"name":"reviews","kind":"object","type":"Review","relationName":"DoctorToReview"},{"name":"doctorSchedules","kind":"object","type":"DoctorSchedules","relationName":"DoctorToDoctorSchedules"}],"dbName":"doctor"},"MedicalReport":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"reportName","kind":"scalar","type":"String"},{"name":"reportLink","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"patientId","kind":"scalar","type":"String"},{"name":"patient","kind":"object","type":"Patient","relationName":"MedicalReportToPatient"}],"dbName":"medical_reports"},"Patient":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"contactNumber","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"PatientToUser"},{"name":"appointments","kind":"object","type":"Appointment","relationName":"AppointmentToPatient"},{"name":"medicalReports","kind":"object","type":"MedicalReport","relationName":"MedicalReportToPatient"},{"name":"patientHealthData","kind":"object","type":"PatientHealthData","relationName":"PatientToPatientHealthData"},{"name":"prescriptions","kind":"object","type":"Prescription","relationName":"PatientToPrescription"},{"name":"reviews","kind":"object","type":"Review","relationName":"PatientToReview"}],"dbName":"patient"},"PatientHealthData":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"gender","kind":"enum","type":"Gender"},{"name":"dateOfBirth","kind":"scalar","type":"DateTime"},{"name":"bloodGroup","kind":"enum","type":"BloodGroup"},{"name":"hasAllergies","kind":"scalar","type":"Boolean"},{"name":"hasDiabetes","kind":"scalar","type":"Boolean"},{"name":"height","kind":"scalar","type":"String"},{"name":"weight","kind":"scalar","type":"String"},{"name":"smokingStatus","kind":"scalar","type":"Boolean"},{"name":"dietaryPreferences","kind":"scalar","type":"String"},{"name":"pregnancyStatus","kind":"scalar","type":"Boolean"},{"name":"mentalHealthHistory","kind":"scalar","type":"String"},{"name":"immunizationStatus","kind":"scalar","type":"String"},{"name":"hasPastSurgeries","kind":"scalar","type":"Boolean"},{"name":"recentAnxiety","kind":"scalar","type":"Boolean"},{"name":"recentDepression","kind":"scalar","type":"Boolean"},{"name":"maritalStatus","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"patientId","kind":"scalar","type":"String"},{"name":"patient","kind":"object","type":"Patient","relationName":"PatientToPatientHealthData"}],"dbName":"patient_health_data"},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"stripeEventId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"invoiceUrl","kind":"scalar","type":"String"},{"name":"paymentGatewayData","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"appointmentId","kind":"scalar","type":"String"},{"name":"appointment","kind":"object","type":"Appointment","relationName":"AppointmentToPayment"}],"dbName":"payments"},"Prescription":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"followUpDate","kind":"scalar","type":"DateTime"},{"name":"instructions","kind":"scalar","type":"String"},{"name":"pdfUrl","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"appointmentId","kind":"scalar","type":"String"},{"name":"appointment","kind":"object","type":"Appointment","relationName":"AppointmentToPrescription"},{"name":"patientId","kind":"scalar","type":"String"},{"name":"patient","kind":"object","type":"Patient","relationName":"PatientToPrescription"},{"name":"doctorId","kind":"scalar","type":"String"},{"name":"doctor","kind":"object","type":"Doctor","relationName":"DoctorToPrescription"}],"dbName":"prescriptions"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Float"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"appointmentId","kind":"scalar","type":"String"},{"name":"appointment","kind":"object","type":"Appointment","relationName":"AppointmentToReview"},{"name":"patientId","kind":"scalar","type":"String"},{"name":"patient","kind":"object","type":"Patient","relationName":"PatientToReview"},{"name":"doctorId","kind":"scalar","type":"String"},{"name":"doctor","kind":"object","type":"Doctor","relationName":"DoctorToReview"}],"dbName":"reviews"},"Schedule":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"startDateTime","kind":"scalar","type":"DateTime"},{"name":"endDateTime","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"doctorSchedules","kind":"object","type":"DoctorSchedules","relationName":"DoctorSchedulesToSchedule"},{"name":"appointments","kind":"object","type":"Appointment","relationName":"AppointmentToSchedule"}],"dbName":"schedules"},"DoctorSchedules":{"fields":[{"name":"doctorId","kind":"scalar","type":"String"},{"name":"doctor","kind":"object","type":"Doctor","relationName":"DoctorToDoctorSchedules"},{"name":"scheduleId","kind":"scalar","type":"String"},{"name":"schedule","kind":"object","type":"Schedule","relationName":"DoctorSchedulesToSchedule"},{"name":"isBooked","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"doctor_schedules"},"Specialty":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"icon","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"doctorSpecialties","kind":"object","type":"DoctorSpecialty","relationName":"DoctorSpecialtyToSpecialty"}],"dbName":"specialties"},"DoctorSpecialty":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"doctorId","kind":"scalar","type":"String"},{"name":"specialtyId","kind":"scalar","type":"String"},{"name":"doctor","kind":"object","type":"Doctor","relationName":"DoctorToDoctorSpecialty"},{"name":"specialty","kind":"object","type":"Specialty","relationName":"DoctorSpecialtyToSpecialty"}],"dbName":"doctor_specialties"}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AdminScalarFieldEnum: () => AdminScalarFieldEnum,
  AnyNull: () => AnyNull2,
  AppointmentScalarFieldEnum: () => AppointmentScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  DoctorScalarFieldEnum: () => DoctorScalarFieldEnum,
  DoctorSchedulesScalarFieldEnum: () => DoctorSchedulesScalarFieldEnum,
  DoctorSpecialtyScalarFieldEnum: () => DoctorSpecialtyScalarFieldEnum,
  JsonNull: () => JsonNull2,
  JsonNullValueFilter: () => JsonNullValueFilter,
  MedicalReportScalarFieldEnum: () => MedicalReportScalarFieldEnum,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullableJsonNullValueInput: () => NullableJsonNullValueInput,
  NullsOrder: () => NullsOrder,
  PatientHealthDataScalarFieldEnum: () => PatientHealthDataScalarFieldEnum,
  PatientScalarFieldEnum: () => PatientScalarFieldEnum,
  PaymentScalarFieldEnum: () => PaymentScalarFieldEnum,
  PrescriptionScalarFieldEnum: () => PrescriptionScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  ScheduleScalarFieldEnum: () => ScheduleScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  SpecialtyScalarFieldEnum: () => SpecialtyScalarFieldEnum,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.3.0",
  engine: "9d6ad21cbbceab97458517b147a6a09ff43aa735"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  Admin: "Admin",
  Appointment: "Appointment",
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  Doctor: "Doctor",
  MedicalReport: "MedicalReport",
  Patient: "Patient",
  PatientHealthData: "PatientHealthData",
  Payment: "Payment",
  Prescription: "Prescription",
  Review: "Review",
  Schedule: "Schedule",
  DoctorSchedules: "DoctorSchedules",
  Specialty: "Specialty",
  DoctorSpecialty: "DoctorSpecialty"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var AdminScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  profilePhoto: "profilePhoto",
  contactNumber: "contactNumber",
  isDeleted: "isDeleted",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  deletedAt: "deletedAt",
  userId: "userId"
};
var AppointmentScalarFieldEnum = {
  id: "id",
  videoCallingId: "videoCallingId",
  status: "status",
  paymentStatus: "paymentStatus",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  patientId: "patientId",
  doctorId: "doctorId",
  scheduleId: "scheduleId"
};
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  role: "role",
  status: "status",
  needPasswordChange: "needPasswordChange",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  image: "image",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var DoctorScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  profilePhoto: "profilePhoto",
  contactNumber: "contactNumber",
  address: "address",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  registrationNumber: "registrationNumber",
  experience: "experience",
  gender: "gender",
  appointmentFee: "appointmentFee",
  qualification: "qualification",
  currentWorkingPlace: "currentWorkingPlace",
  designation: "designation",
  averageRating: "averageRating",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  userId: "userId"
};
var MedicalReportScalarFieldEnum = {
  id: "id",
  reportName: "reportName",
  reportLink: "reportLink",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  patientId: "patientId"
};
var PatientScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  profilePhoto: "profilePhoto",
  contactNumber: "contactNumber",
  address: "address",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  userId: "userId"
};
var PatientHealthDataScalarFieldEnum = {
  id: "id",
  gender: "gender",
  dateOfBirth: "dateOfBirth",
  bloodGroup: "bloodGroup",
  hasAllergies: "hasAllergies",
  hasDiabetes: "hasDiabetes",
  height: "height",
  weight: "weight",
  smokingStatus: "smokingStatus",
  dietaryPreferences: "dietaryPreferences",
  pregnancyStatus: "pregnancyStatus",
  mentalHealthHistory: "mentalHealthHistory",
  immunizationStatus: "immunizationStatus",
  hasPastSurgeries: "hasPastSurgeries",
  recentAnxiety: "recentAnxiety",
  recentDepression: "recentDepression",
  maritalStatus: "maritalStatus",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  patientId: "patientId"
};
var PaymentScalarFieldEnum = {
  id: "id",
  amount: "amount",
  transactionId: "transactionId",
  stripeEventId: "stripeEventId",
  status: "status",
  invoiceUrl: "invoiceUrl",
  paymentGatewayData: "paymentGatewayData",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  appointmentId: "appointmentId"
};
var PrescriptionScalarFieldEnum = {
  id: "id",
  followUpDate: "followUpDate",
  instructions: "instructions",
  pdfUrl: "pdfUrl",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  appointmentId: "appointmentId",
  patientId: "patientId",
  doctorId: "doctorId"
};
var ReviewScalarFieldEnum = {
  id: "id",
  rating: "rating",
  comment: "comment",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  appointmentId: "appointmentId",
  patientId: "patientId",
  doctorId: "doctorId"
};
var ScheduleScalarFieldEnum = {
  id: "id",
  startDateTime: "startDateTime",
  endDateTime: "endDateTime",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var DoctorSchedulesScalarFieldEnum = {
  doctorId: "doctorId",
  scheduleId: "scheduleId",
  isBooked: "isBooked",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SpecialtyScalarFieldEnum = {
  id: "id",
  title: "title",
  description: "description",
  icon: "icon",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt"
};
var DoctorSpecialtyScalarFieldEnum = {
  id: "id",
  doctorId: "doctorId",
  specialtyId: "specialtyId"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var NullableJsonNullValueInput = {
  DbNull: DbNull2,
  JsonNull: JsonNull2
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var JsonNullValueFilter = {
  DbNull: DbNull2,
  JsonNull: JsonNull2,
  AnyNull: AnyNull2
};
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/prisma/enums.ts
var Role = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  DOCTOR: "DOCTOR",
  PATIENT: "PATIENT"
};
var UserStatus = {
  ACTIVE: "ACTIVE",
  BLOCKED: "BLOCKED",
  DELETED: "DELETED"
};
var Gender = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER"
};
var BloodGroup = {
  A_POSITIVE: "A_POSITIVE",
  A_NEGATIVE: "A_NEGATIVE",
  B_POSITIVE: "B_POSITIVE",
  B_NEGATIVE: "B_NEGATIVE",
  AB_POSITIVE: "AB_POSITIVE",
  AB_NEGATIVE: "AB_NEGATIVE",
  O_POSITIVE: "O_POSITIVE",
  O_NEGATIVE: "O_NEGATIVE"
};
var AppointmentStatus = {
  SCHEDULED: "SCHEDULED",
  INPROGRESS: "INPROGRESS",
  COMPLETED: "COMPLETED",
  CANCELED: "CANCELED"
};
var PaymentStatus = {
  PAID: "PAID",
  UNPAID: "UNPAID"
};

// src/generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/app/config/env.ts
import dotenv from "dotenv";

// src/app/errorHelpers/AppError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};
var AppError_default = AppError;

// src/app/config/env.ts
import status from "http-status";
dotenv.config();
var loadEnvVariables = () => {
  const requiredEnvVariables = [
    "NODE_ENV",
    "PORT",
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRES_IN",
    "REFRESH_TOKEN_EXPIRES_IN",
    "BETTER_AUTH_SESSION_EXPIRES_IN",
    "BETTER_AUTH_SESSION_UPDATE_AGE",
    "EMAIL_SENDER_SMTP_USER",
    "EMAIL_SENDER_SMTP_PASS",
    "EMAIL_SENDER_SMTP_HOST",
    "EMAIL_SENDER_SMTP_PORT",
    "EMAIL_SENDER_SMTP_FROM",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CALLBACK_URL",
    "FRONTEND_URL",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "SUPER_ADMIN_EMAIL",
    "SUPER_ADMIN_PASSWORD"
  ];
  requiredEnvVariables.forEach((variable) => {
    if (!process.env[variable]) {
      throw new AppError_default(
        status.INTERNAL_SERVER_ERROR,
        `Environment variable ${variable} is required but not set in .env file.`
      );
    }
  });
  return {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
    BETTER_AUTH_SESSION_EXPIRES_IN: process.env.BETTER_AUTH_SESSION_EXPIRES_IN,
    BETTER_AUTH_SESSION_UPDATE_AGE: process.env.BETTER_AUTH_SESSION_UPDATE_AGE,
    EMAIL_SENDER: {
      SMTP_USER: process.env.EMAIL_SENDER_SMTP_USER,
      SMTP_PASS: process.env.EMAIL_SENDER_SMTP_PASS,
      SMTP_HOST: process.env.EMAIL_SENDER_SMTP_HOST,
      SMTP_PORT: process.env.EMAIL_SENDER_SMTP_PORT,
      SMTP_FROM: process.env.EMAIL_SENDER_SMTP_FROM
    },
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    FRONTEND_URL: process.env.FRONTEND_URL,
    CLOUDINARY: {
      CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      API_KEY: process.env.CLOUDINARY_API_KEY,
      API_SECRET: process.env.CLOUDINARY_API_SECRET
    },
    STRIPE: {
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET
    },
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD
  };
};
var envVars = loadEnvVariables();

// src/app/lib/prisma.ts
var connectionString = envVars.DATABASE_URL;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/app/routes/index.ts
import { Router as Router11 } from "express";

// src/app/module/specialty/specialty.route.ts
import { Router } from "express";

// src/app/module/specialty/specialty.service.ts
var createSpecialty = async (payload) => {
  const specialty = await prisma.specialty.create({
    data: payload
  });
  return specialty;
};
var getAllSpecialties = async () => {
  const specialties = await prisma.specialty.findMany();
  return specialties;
};
var deleteSpecialty = async (id) => {
  const specialty = await prisma.specialty.delete({
    where: { id }
  });
  return specialty;
};
var updateSpecialty = async (id, payload) => {
  const specialty = await prisma.specialty.update({
    where: { id },
    data: payload
  });
  return specialty;
};
var SpecialtyService = {
  createSpecialty,
  getAllSpecialties,
  deleteSpecialty,
  updateSpecialty
};

// src/app/shared/catchAsync.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// src/app/shared/sendResponse.ts
var sendResponse = (res, responseData) => {
  const { httpStatusCode, success, message, data, meta } = responseData;
  res.status(httpStatusCode).json({
    success,
    message,
    data,
    meta
  });
};

// src/app/module/specialty/specialty.controller.ts
var createSpecialty2 = catchAsync(async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  const payload = {
    ...req.body,
    icon: req.file?.path
  };
  const result = await SpecialtyService.createSpecialty(payload);
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Specialty created successfully",
    data: result
  });
});
var getAllSpecialties2 = catchAsync(async (req, res) => {
  const result = await SpecialtyService.getAllSpecialties();
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Specialties fetched successfully",
    data: result
  });
});
var deleteSpecialty2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SpecialtyService.deleteSpecialty(id);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Specialty deleted successfully",
    data: result
  });
});
var updateSpecialty2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await SpecialtyService.updateSpecialty(id, payload);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Specialty updated successfully",
    data: result
  });
});
var SpecialtyController = {
  createSpecialty: createSpecialty2,
  getAllSpecialties: getAllSpecialties2,
  deleteSpecialty: deleteSpecialty2,
  updateSpecialty: updateSpecialty2
};

// src/app/utils/cookie.ts
var setCookie = (res, key, value, options) => {
  res.cookie(key, value, options);
};
var getCookie = (req, key) => {
  return req.cookies[key];
};
var clearCookie = (res, key, options) => {
  res.clearCookie(key, options);
};
var cookieUtils = { setCookie, getCookie, clearCookie };

// src/app/middleware/checkAuth.ts
import status2 from "http-status";

// src/app/utils/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secret, { expiresIn }) => {
  const token = jwt.sign(payload, secret, { expiresIn });
  return token;
};
var verifyToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return { success: true, data: decoded };
  } catch (error) {
    return { success: false, message: error.message, error };
  }
};
var decodeToken = (token) => {
  const decoded = jwt.decode(token);
  return decoded;
};
var jwtUtils = { createToken, verifyToken, decodeToken };

// src/app/middleware/checkAuth.ts
var checkAuth = (...authRoles) => async (req, res, next) => {
  try {
    const sessionToken = cookieUtils.getCookie(
      req,
      "better-auth.session_token"
    );
    if (!sessionToken) {
      throw new Error("Unauthorized access: No session token provided");
    }
    if (sessionToken) {
      const sessionExists = await prisma.session.findFirst({
        where: {
          token: sessionToken,
          expiresAt: {
            gt: /* @__PURE__ */ new Date()
          }
        },
        include: {
          user: true
        }
      });
      if (sessionExists && sessionExists.user) {
        const user = sessionExists.user;
        const now = /* @__PURE__ */ new Date();
        const expiresAt = new Date(sessionExists.expiresAt);
        const createdAt = new Date(sessionExists.createdAt);
        const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
        const timeRemaining = expiresAt.getTime() - now.getTime();
        const percentRemaining = timeRemaining / sessionLifeTime * 100;
        if (percentRemaining < 20) {
          res.setHeader("X-Session-Refresh", "true");
          res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
          res.setHeader("X-Time-Remaining", timeRemaining.toString());
          console.log("Session Expiring Soon!!");
        }
        if (user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED) {
          throw new AppError_default(
            status2.UNAUTHORIZED,
            "Unauthorized access: User is blocked or deleted"
          );
        }
        if (user.isDeleted) {
          throw new AppError_default(
            status2.UNAUTHORIZED,
            "Unauthorized access: User is deleted"
          );
        }
        if (authRoles.length > 0 && !authRoles.includes(user.role)) {
          throw new AppError_default(
            status2.FORBIDDEN,
            "Forbidden access: You do not have permission to access this resource"
          );
        }
        req.user = {
          userId: user.id,
          role: user.role,
          email: user.email
        };
      }
    }
    const accessToken = cookieUtils.getCookie(req, "accessToken");
    if (!accessToken) {
      throw new AppError_default(
        status2.UNAUTHORIZED,
        "Unauthorized access: No access token provided"
      );
    }
    const verifiedToken = jwtUtils.verifyToken(
      accessToken,
      envVars.ACCESS_TOKEN_SECRET
    );
    if (!verifiedToken.success) {
      throw new AppError_default(
        status2.UNAUTHORIZED,
        "Unauthorized access: Invalid access token"
      );
    }
    if (authRoles.length > 0 && !authRoles.includes(verifiedToken.data.role)) {
      throw new AppError_default(
        status2.FORBIDDEN,
        "Forbidden access: You do not have permission to access this resource"
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};

// src/app/config/multer.config.ts
import { CloudinaryStorage } from "multer-storage-cloudinary";

// src/app/config/cloudinary.config.ts
import { v2 as cloudinary } from "cloudinary";
import status3 from "http-status";
cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUD_NAME,
  api_key: envVars.CLOUDINARY.API_KEY,
  api_secret: envVars.CLOUDINARY.API_SECRET
});
var uploadFileToCloudinary = async (buffer, fileName) => {
  if (!buffer || !fileName) {
    throw new AppError_default(
      status3.BAD_REQUEST,
      "File buffer and file name are required for upload"
    );
  }
  const extension = fileName.split(".").pop()?.toLocaleLowerCase();
  const fileNameWithoutExtension = fileName.split(".").slice(0, -1).join(".").toLocaleLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
  const uniqueName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileNameWithoutExtension;
  const folder = extension === "pdf" ? "pdfs" : "images";
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        public_id: `gesundheit-io/${folder}/${uniqueName}`,
        folder: `gesundheit-io/${folder}`
      },
      (error, result) => {
        if (error) {
          return reject(
            new AppError_default(
              status3.INTERNAL_SERVER_ERROR,
              "Failed to upload file to Cloudinary"
            )
          );
        }
        resolve(result);
      }
    ).end(buffer);
  });
};
var deleteFileFromCloudinary = async (url) => {
  try {
    const regex = /\/v\d+\/(.+?)(?:\.[a-zA-Z0-9]+)+$/;
    const match = url.match(regex);
    if (match && match[1]) {
      const publicId = match[1];
      await cloudinary.uploader.destroy(publicId, {
        resource_type: "image"
      });
      console.log(`File ${publicId} deleted from cloudinary`);
    }
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    throw new AppError_default(
      status3.INTERNAL_SERVER_ERROR,
      "Failed to delete file from Cloudinary"
    );
  }
};
var cloudinaryUpload = cloudinary;

// src/app/config/multer.config.ts
import multer from "multer";
var storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: async (req, file) => {
    const originalName = file.originalname;
    const extension = originalName.split(".").pop()?.toLocaleLowerCase();
    const fileNameWithoutExtension = originalName.split(".").slice(0, -1).join(".").toLocaleLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
    const uniqueName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileNameWithoutExtension;
    const folder = extension === "pdf" ? "pdfs" : "images";
    return {
      folder: `gesundheit-io/${folder}`,
      public_id: uniqueName,
      resource_type: "auto"
    };
  }
});
var multerUpload = multer({ storage });

// src/app/middleware/validateRequest.ts
var validateRequest = (zodSchema) => {
  return (req, res, next) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    const parsedResult = zodSchema.safeParse(req.body);
    if (!parsedResult.success) {
      next(parsedResult.error);
    }
    req.body = parsedResult.data;
    next();
  };
};

// src/app/module/specialty/specialty.validation.ts
import z from "zod";
var createSpecialtyZodSchema = z.object({
  title: z.string("Title is required"),
  description: z.string("Description is required").optional()
});
var SpecialtyValidation = {
  createSpecialtyZodSchema
};

// src/app/module/specialty/specialty.route.ts
var router = Router();
router.post(
  "/",
  // checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("file"),
  validateRequest(SpecialtyValidation.createSpecialtyZodSchema),
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  SpecialtyController.createSpecialty
);
router.get("/", SpecialtyController.getAllSpecialties);
router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  SpecialtyController.deleteSpecialty
);
router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  SpecialtyController.updateSpecialty
);
var SpecialtyRoutes = router;

// src/app/module/auth/auth.route.ts
import { Router as Router2 } from "express";

// src/app/module/auth/auth.service.ts
import status5 from "http-status";

// src/app/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer, emailOTP } from "better-auth/plugins";

// src/app/utils/email.ts
import nodemailer from "nodemailer";
import status4 from "http-status";
import path2 from "path";
import ejs from "ejs";
var transporter = nodemailer.createTransport({
  host: envVars.EMAIL_SENDER.SMTP_HOST,
  secure: true,
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASS
  },
  port: +envVars.EMAIL_SENDER.SMTP_PORT
});
var sendEmail = async ({
  to,
  subject,
  templateName,
  templateData,
  attachments
}) => {
  try {
    const templatePath = path2.resolve(
      process.cwd(),
      `src/app/templates/${templateName}.ejs`
    );
    const html = await ejs.renderFile(templatePath, templateData);
    const info = await transporter.sendMail({
      from: envVars.EMAIL_SENDER.SMTP_FROM,
      to,
      subject,
      html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType
      }))
    });
    console.log(`Email sent to ${to} : ${info.messageId}`);
  } catch (error) {
    console.log("Email sending error:", error.message);
    throw new AppError_default(status4.INTERNAL_SERVER_ERROR, "Failed to send email");
  }
};

// src/app/lib/auth.ts
var auth = betterAuth({
  baseURL: envVars.BETTER_AUTH_URL,
  secret: envVars.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql"
    // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true
  },
  socialProviders: {
    google: {
      clientId: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      mapProfileToUser: () => {
        return {
          role: Role.PATIENT,
          status: UserStatus.ACTIVE,
          needPasswordChange: false,
          emailVerified: true,
          isDeleted: false,
          deletedAt: null
        };
      }
    }
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: Role.PATIENT
      },
      status: {
        type: "string",
        required: true,
        defaultValue: UserStatus.ACTIVE
      },
      needPasswordChange: {
        type: "boolean",
        required: true,
        defaultValue: false
      },
      isDeleted: {
        type: "boolean",
        required: true,
        defaultValue: false
      },
      deletedAt: {
        type: "date",
        required: false,
        defaultValue: null
      }
    }
  },
  plugins: [
    bearer(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "email-verification") {
          const user = await prisma.user.findUnique({ where: { email } });
          if (!user) {
            return console.log(
              `User with email ${email} not found. Cannot send verification OTP.`
            );
          }
          if (user && user.role === Role.SUPER_ADMIN) {
            return console.log(
              `User with email ${email} is a super admin. Skipping sending verification OTP.`
            );
          }
          if (user && !user.emailVerified) {
            sendEmail({
              to: email,
              subject: "Verify your email",
              templateName: "otp",
              templateData: { name: user?.name, otp }
            });
          }
        } else if (type === "forget-password") {
          const user = await prisma.user.findUnique({ where: { email } });
          if (user) {
            sendEmail({
              to: email,
              subject: "Your OTP for password reset",
              templateName: "otp",
              templateData: { name: user.name, otp }
            });
          }
        }
      },
      expiresIn: 2 * 60,
      // 2 minutes in seconds
      otpLength: 6
    })
  ],
  session: {
    expiresIn: 60 * 60 * 60 * 24,
    // 1 day in seconds
    updateAge: 60 * 60 * 60 * 24,
    // 1 day in seconds
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 60 * 24
      // 1 day in seconds
    }
  },
  redirectURLs: {
    signIn: `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success`
  },
  trustedOrigins: [
    envVars.BETTER_AUTH_URL || "http://localhost:5000",
    envVars.FRONTEND_URL
  ],
  // trustedOrigins: [process.env.BETTER_AUTH_URL || 'http://localhost:5000'],
  advanced: {
    // disableCSRFCheck: true,
    useSecureCookies: false,
    // Set to true in production when using HTTPS
    cookies: {
      state: {
        attributes: {
          sameSite: "none",
          // Set to 'lax' or 'strict' in production
          secure: true,
          // Set to true in production when using HTTPS
          httpOnly: true,
          // Prevents client-side JavaScript from accessing the cookie
          path: "/"
          // Cookie is valid for the entire site
        }
      },
      sessionToken: {
        attributes: {
          sameSite: "none",
          // Set to 'lax' or 'strict' in production
          secure: true,
          // Set to true in production when using HTTPS
          httpOnly: true,
          // Prevents client-side JavaScript from accessing the cookie
          path: "/"
          // Cookie is valid for the entire site
        }
      }
    }
  }
});

// src/app/utils/token.ts
var getAccessToken = (payload) => {
  const accessToken = jwtUtils.createToken(payload, envVars.ACCESS_TOKEN_SECRET, {
    expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN
  });
  return accessToken;
};
var getRefreshToken = (payload) => {
  const refreshToken = jwtUtils.createToken(payload, envVars.REFRESH_TOKEN_SECRET, {
    expiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN
  });
  return refreshToken;
};
var setAccessTokenCookie = (res, token) => {
  cookieUtils.setCookie(res, "accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 60 * 60 * 24 * 1e3
    // 1 day
  });
};
var setRefreshTokenCookie = (res, token) => {
  cookieUtils.setCookie(res, "refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 60 * 60 * 24 * 1e3 * 7
    // 7 days
  });
};
var setBetterAuthSessionCookie = (res, token) => {
  cookieUtils.setCookie(res, "better-auth.session_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 60 * 60 * 24 * 1e3
    // 1 day
  });
};
var tokenUtils = {
  getAccessToken,
  getRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setBetterAuthSessionCookie
};

// src/app/module/auth/auth.service.ts
var registerPatient = async (payload) => {
  const { name, email, password } = payload;
  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password
      //default values
      // needsPasswordChange: false,
      // role: Role.PATIENT
    }
  });
  if (!data.user) {
    throw new AppError_default(status5.BAD_REQUEST, "Failed to register patient");
  }
  try {
    const patient = await prisma.$transaction(async (tx) => {
      const patientTx = await tx.patient.create({
        data: {
          userId: data.user.id,
          name: payload.name,
          email: payload.email
        }
      });
      return patientTx;
    });
    const accessToken = tokenUtils.getAccessToken({
      userId: data.user.id,
      role: data.user.role,
      name: data.user.name,
      email: data.user.email,
      status: data.user.status,
      isDeleted: data.user.isDeleted,
      emailVerified: data.user.emailVerified
    });
    const refreshToken = tokenUtils.getRefreshToken({
      userId: data.user.id,
      role: data.user.role,
      name: data.user.name,
      email: data.user.email,
      status: data.user.status,
      isDeleted: data.user.isDeleted,
      emailVerified: data.user.emailVerified
    });
    return {
      ...data,
      accessToken,
      refreshToken,
      patient
    };
  } catch (error) {
    console.log("Transaction error : ", error);
    await prisma.user.delete({
      where: {
        id: data.user.id
      }
    });
    throw error;
  }
};
var loginUser = async (payload) => {
  const { email, password } = payload;
  const data = await auth.api.signInEmail({
    body: {
      email,
      password
    }
  });
  if (data.user.status === UserStatus.BLOCKED) {
    throw new AppError_default(status5.FORBIDDEN, "User is blocked");
  }
  if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
    throw new AppError_default(status5.NOT_FOUND, "User is deleted");
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified
  });
  return {
    ...data,
    accessToken,
    refreshToken
  };
};
var getMe = async (user) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      id: user.userId
    },
    include: {
      patient: {
        include: {
          appointments: true,
          reviews: true,
          prescriptions: true,
          medicalReports: true,
          patientHealthData: true
        }
      },
      doctor: {
        include: {
          specialties: true,
          appointments: true,
          reviews: true,
          prescriptions: true
        }
      },
      admin: true
    }
  });
  if (!isUserExists) {
    throw new AppError_default(status5.NOT_FOUND, "User not found");
  }
  return isUserExists;
};
var getNewToken = async (refreshToken, sessionToken) => {
  const isSessionTokenExists = await prisma.session.findUnique({
    where: {
      token: sessionToken
    },
    include: {
      user: true
    }
  });
  if (!isSessionTokenExists) {
    throw new AppError_default(status5.UNAUTHORIZED, "Invalid session token");
  }
  const verifiedRefreshToken = jwtUtils.verifyToken(
    refreshToken,
    envVars.REFRESH_TOKEN_SECRET
  );
  if (!verifiedRefreshToken.success && verifiedRefreshToken.error) {
    throw new AppError_default(status5.UNAUTHORIZED, "Invalid refresh token");
  }
  const data = verifiedRefreshToken.data;
  const newAccessToken = tokenUtils.getAccessToken({
    userId: data.userId,
    role: data.role,
    name: data.name,
    email: data.email,
    status: data.status,
    isDeleted: data.isDeleted,
    emailVerified: data.emailVerified
  });
  const newRefreshToken = tokenUtils.getRefreshToken({
    userId: data.userId,
    role: data.role,
    name: data.name,
    email: data.email,
    status: data.status,
    isDeleted: data.isDeleted,
    emailVerified: data.emailVerified
  });
  const { token } = await prisma.session.update({
    where: {
      token: sessionToken
    },
    data: {
      token: sessionToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1e3),
      updatedAt: /* @__PURE__ */ new Date()
    }
  });
  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    sessionToken: token
  };
};
var changePassword = async (payload, sessionToken) => {
  const session = await auth.api.getSession({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  if (!session) {
    throw new AppError_default(status5.UNAUTHORIZED, "Invalid session token");
  }
  const { currentPassword, newPassword } = payload;
  const result = await auth.api.changePassword({
    body: {
      currentPassword,
      newPassword,
      revokeOtherSessions: true
    },
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  if (session.user.needPasswordChange) {
    await prisma.user.update({
      where: {
        id: session.user.id
      },
      data: {
        needPasswordChange: false
      }
    });
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVerified: session.user.emailVerified
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVerified: session.user.emailVerified
  });
  return {
    ...result,
    accessToken,
    refreshToken
  };
};
var logoutUser = async (sessionToken) => {
  const result = await auth.api.signOut({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  return result;
};
var verifyEmail = async (email, otp) => {
  const result = await auth.api.verifyEmailOTP({
    body: {
      email,
      otp
    }
  });
  if (result.status && !result.user.emailVerified) {
    await prisma.user.update({
      where: {
        email
      },
      data: {
        emailVerified: true
      }
    });
  }
};
var forgetPassword = async (email) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!isUserExist) {
    throw new AppError_default(status5.NOT_FOUND, "User not found");
  }
  if (!isUserExist.emailVerified) {
    throw new AppError_default(status5.BAD_REQUEST, "Email not verified");
  }
  if (isUserExist.isDeleted || isUserExist.status === UserStatus.DELETED) {
    throw new AppError_default(status5.NOT_FOUND, "User not found");
  }
  await auth.api.requestPasswordResetEmailOTP({
    body: {
      email
    }
  });
};
var resetPassword = async (email, otp, newPassword) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!isUserExist) {
    throw new AppError_default(status5.NOT_FOUND, "User not found");
  }
  if (!isUserExist.emailVerified) {
    throw new AppError_default(status5.BAD_REQUEST, "Email not verified");
  }
  if (isUserExist.isDeleted || isUserExist.status === UserStatus.DELETED) {
    throw new AppError_default(status5.NOT_FOUND, "User not found");
  }
  await auth.api.resetPasswordEmailOTP({
    body: {
      email,
      otp,
      password: newPassword
    }
  });
  if (isUserExist.needPasswordChange) {
    await prisma.user.update({
      where: {
        id: isUserExist.id
      },
      data: {
        needPasswordChange: false
      }
    });
  }
  await prisma.session.deleteMany({
    where: {
      userId: isUserExist.id
    }
  });
};
var googleLoginSuccess = async (session) => {
  const isPatientExists = await prisma.patient.findUnique({
    where: {
      userId: session.user.id
    }
  });
  if (!isPatientExists) {
    await prisma.patient.create({
      data: {
        userId: session.user.id,
        name: session.user.name,
        email: session.user.email
      }
    });
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name
  });
  return {
    accessToken,
    refreshToken
  };
};
var AuthService = {
  registerPatient,
  loginUser,
  getMe,
  getNewToken,
  changePassword,
  logoutUser,
  verifyEmail,
  forgetPassword,
  resetPassword,
  googleLoginSuccess
};

// src/app/module/auth/auth.controller.ts
import status6 from "http-status";
var registerPatient2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthService.registerPatient(payload);
  const { accessToken, refreshToken, token, ...rest } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    httpStatusCode: status6.CREATED,
    success: true,
    message: "Patient registered successfully",
    data: {
      token,
      accessToken,
      refreshToken,
      ...rest
    }
  });
});
var loginUser2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthService.loginUser(payload);
  const { accessToken, refreshToken, token, ...rest } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "User logged in successfully",
    data: {
      token,
      accessToken,
      refreshToken,
      ...rest
    }
  });
});
var getMe2 = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await AuthService.getMe(user);
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "User profile retrieved successfully",
    data: result
  });
});
var getNewToken2 = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const betterAuthSessionToken = req.cookies["better-auth.session_token"];
  if (!refreshToken) {
    throw new AppError_default(status6.BAD_REQUEST, "Refresh token is missing");
  }
  const result = await AuthService.getNewToken(
    refreshToken,
    betterAuthSessionToken
  );
  const { accessToken, refreshToken: newRefreshToken, sessionToken } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, newRefreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, sessionToken);
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "New access token generated successfully",
    data: { accessToken, refreshToken: newRefreshToken, sessionToken }
  });
});
var changePassword2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const betterAuthSessionToken = req.cookies["better-auth.session_token"];
  const result = await AuthService.changePassword(
    payload,
    betterAuthSessionToken
  );
  const { accessToken, refreshToken, token } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "Password changed successfully",
    data: result
  });
});
var logoutUser2 = catchAsync(async (req, res) => {
  const betterAuthSessionToken = req.cookies["better-auth.session_token"];
  const result = await AuthService.logoutUser(betterAuthSessionToken);
  cookieUtils.clearCookie(res, "accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  cookieUtils.clearCookie(res, "refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  cookieUtils.clearCookie(res, "better-auth.session_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "User logged out successfully",
    data: result
  });
});
var verifyEmail2 = catchAsync(async (req, res) => {
  const { email, otp } = req.body;
  await AuthService.verifyEmail(email, otp);
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "Email verified successfully"
  });
});
var forgetPassword2 = catchAsync(async (req, res) => {
  const { email } = req.body;
  await AuthService.forgetPassword(email);
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "Password reset OTP sent to email successfully"
  });
});
var resetPassword2 = catchAsync(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  await AuthService.resetPassword(email, otp, newPassword);
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "Password reset successfully"
  });
});
var googleLogin = catchAsync((req, res) => {
  const redirectPath = req.query.redirect || "/dashboard";
  const encodedRedirectPath = encodeURIComponent(redirectPath);
  const callbackURL = `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success?redirect=${encodedRedirectPath}`;
  res.render("googleRedirect", {
    callbackURL,
    betterAuthUrl: envVars.BETTER_AUTH_URL
  });
});
var googleLoginSuccess2 = catchAsync(async (req, res) => {
  const redirectPath = req.query.redirect || "/dashboard";
  const sessionToken = req.cookies["better-auth.session_token"];
  if (!sessionToken) {
    return res.redirect(`${envVars.FRONTEND_URL}/login?error=oauth_failed`);
  }
  const session = await auth.api.getSession({
    headers: {
      Cookie: `better-auth.session_token=${sessionToken}`
    }
  });
  if (!session) {
    return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_session_found`);
  }
  if (session && !session.user) {
    return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_user_found`);
  }
  const result = await AuthService.googleLoginSuccess(session);
  const { accessToken, refreshToken } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  const isValidRedirectPath = redirectPath.startsWith("/") && !redirectPath.startsWith("//");
  const finalRedirectPath = isValidRedirectPath ? redirectPath : "/dashboard";
  res.redirect(`${envVars.FRONTEND_URL}${finalRedirectPath}`);
});
var handleOAuthError = catchAsync(async (req, res) => {
  const error = req.query.error || "oauth_failed";
  res.redirect(`${envVars.FRONTEND_URL}/login?error=${error}`);
});
var AuthController = {
  registerPatient: registerPatient2,
  loginUser: loginUser2,
  getMe: getMe2,
  getNewToken: getNewToken2,
  changePassword: changePassword2,
  logoutUser: logoutUser2,
  verifyEmail: verifyEmail2,
  forgetPassword: forgetPassword2,
  resetPassword: resetPassword2,
  googleLogin,
  googleLoginSuccess: googleLoginSuccess2,
  handleOAuthError
};

// src/app/module/auth/auth.route.ts
var router2 = Router2();
router2.post("/register", AuthController.registerPatient);
router2.post("/login", AuthController.loginUser);
router2.get(
  "/me",
  checkAuth(Role.ADMIN, Role.DOCTOR, Role.PATIENT, Role.SUPER_ADMIN),
  AuthController.getMe
);
router2.post("/refresh-token", AuthController.getNewToken);
router2.post(
  "/change-password",
  checkAuth(Role.ADMIN, Role.DOCTOR, Role.PATIENT, Role.SUPER_ADMIN),
  AuthController.changePassword
);
router2.post(
  "/logout",
  checkAuth(Role.ADMIN, Role.DOCTOR, Role.PATIENT, Role.SUPER_ADMIN),
  AuthController.logoutUser
);
router2.post("/verify-email", AuthController.verifyEmail);
router2.post("/forget-password", AuthController.forgetPassword);
router2.post("/reset-password", AuthController.resetPassword);
router2.get("/login/google", AuthController.googleLogin);
router2.get("/google/success", AuthController.googleLoginSuccess);
router2.get("/oauth/error", AuthController.handleOAuthError);
var AuthRoutes = router2;

// src/app/module/user/user.route.ts
import { Router as Router3 } from "express";

// src/app/module/user/user.service.ts
import status7 from "http-status";
var createDoctor = async (payload) => {
  const specialties = [];
  for (const specialtyId of payload.specialties) {
    const specialty = await prisma.specialty.findUnique({
      where: { id: specialtyId }
    });
    if (!specialty) {
      throw new AppError_default(
        status7.NOT_FOUND,
        `Specialty with ID ${specialtyId} not found`
      );
    }
    specialties.push(specialty);
  }
  const userExists = await prisma.user.findUnique({
    where: { email: payload.doctor.email }
  });
  if (userExists) {
    throw new AppError_default(status7.CONFLICT, `User with this email already exists`);
  }
  const userData = await auth.api.signUpEmail({
    body: {
      email: payload.doctor.email,
      password: payload.password,
      name: payload.doctor.name,
      role: Role.DOCTOR,
      needPasswordChange: true
    }
  });
  try {
    const result = await prisma.$transaction(async (tx) => {
      const doctorData = await tx.doctor.create({
        data: {
          userId: userData.user.id,
          ...payload.doctor
        }
      });
      const doctorSpecialtyData = specialties.map((specialty) => {
        return {
          doctorId: doctorData.id,
          specialtyId: specialty.id
        };
      });
      await tx.doctorSpecialty.createMany({
        data: doctorSpecialtyData
      });
      const doctor = await tx.doctor.findUnique({
        where: { id: doctorData.id },
        select: {
          id: true,
          userId: true,
          name: true,
          email: true,
          profilePhoto: true,
          contactNumber: true,
          address: true,
          registrationNumber: true,
          experience: true,
          gender: true,
          appointmentFee: true,
          qualification: true,
          currentWorkingPlace: true,
          designation: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              status: true,
              emailVerified: true,
              image: true,
              isDeleted: true,
              deletedAt: true,
              createdAt: true,
              updatedAt: true
            }
          },
          specialties: {
            select: {
              specialty: {
                select: {
                  id: true,
                  title: true
                }
              }
            }
          }
        }
      });
      return doctor;
    });
    return result;
  } catch (error) {
    console.log("Transaction error :", error);
    await prisma.user.delete({
      where: { id: userData.user.id }
    });
    throw error;
  }
};
var createAdmin = async (payload) => {
  const userExists = await prisma.user.findUnique({
    where: {
      email: payload.admin.email
    }
  });
  if (userExists) {
    throw new AppError_default(status7.CONFLICT, "User with this email already exists");
  }
  const { admin, role, password } = payload;
  const userData = await auth.api.signUpEmail({
    body: {
      ...admin,
      password,
      role,
      needPasswordChange: true
    }
  });
  try {
    const adminData = await prisma.admin.create({
      data: {
        userId: userData.user.id,
        ...admin
      }
    });
    return adminData;
  } catch (error) {
    console.log("Error creating admin: ", error);
    await prisma.user.delete({
      where: {
        id: userData.user.id
      }
    });
    throw error;
  }
};
var UserService = {
  createDoctor,
  createAdmin
};

// src/app/module/user/user.controller.ts
import status8 from "http-status";
var createDoctor2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await UserService.createDoctor(payload);
  sendResponse(res, {
    httpStatusCode: status8.CREATED,
    success: true,
    message: "Doctor created successfully",
    data: result
  });
});
var createAdmin2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await UserService.createAdmin(payload);
  sendResponse(res, {
    httpStatusCode: status8.CREATED,
    success: true,
    message: "Admin registered successfully",
    data: result
  });
});
var UserController = {
  createDoctor: createDoctor2,
  createAdmin: createAdmin2
};

// src/app/module/user/user.validation.ts
import z2 from "zod";
var createDoctorZodSchema = z2.object({
  password: z2.string("Password is required").min(6, "Password must be at least 6 characters").max(20, "Password must be at most 20 characters"),
  doctor: z2.object({
    name: z2.string("Name is required and must be string").min(5, "Name must be at least 5 characters").max(30, "Name must be at most 30 characters"),
    email: z2.email("Invalid email address"),
    contactNumber: z2.string("Contact number is required").min(11, "Contact number must be at least 11 digits").max(14, "Contact number must be at most 10 digits"),
    address: z2.string("Address is invalid").min(10, "Address must be at least 10 characters").max(100, "Address must be at most 100 characters").optional(),
    registrationNumber: z2.string("Registration number is required"),
    experience: z2.int("Experience must be an integer").nonnegative("Experience cannot be negative").optional(),
    gender: z2.enum(
      [Gender.MALE, Gender.FEMALE],
      'Gender must be either "MALE" or "FEMALE"'
    ),
    appointmentFee: z2.number("Appointment fee must be a number").nonnegative("Appointment fee cannot be negative"),
    qualification: z2.string("Qualification is required").min(2, "Qualification must be at least 2 characters").max(50, "Qualification must be at most 50 characters"),
    currentWorkingPlace: z2.string("Current working place is required").min(2, "Current working place must be at least 2 characters").max(50, "Current working place must be at most 50 characters"),
    designation: z2.string("Designation is required").min(2, "Designation must be at least 2 characters").max(50, "Designation must be at most 50 characters")
  }),
  specialties: z2.array(z2.uuid(), "Specialties must be an array of strings").min(1, "At least one specialty is required")
});
var createAdminZodSchema = z2.object({
  password: z2.string("Password is required").min(6, "Password must be at least 6 characters").max(20, "Password must be at most 20 characters"),
  admin: z2.object({
    name: z2.string("Name is required and must be string").min(5, "Name must be at least 5 characters").max(30, "Name must be at most 30 characters"),
    email: z2.email("Invalid email address"),
    contactNumber: z2.string("Contact number is required").min(11, "Contact number must be at least 11 characters").max(14, "Contact number must be at most 15 characters").optional(),
    profilePhoto: z2.url("Profile photo must be a valid URL").optional()
  }),
  role: z2.enum(
    ["ADMIN", "SUPER_ADMIN"],
    "Role must be either ADMIN or SUPER_ADMIN"
  )
});

// src/app/module/user/user.route.ts
var router3 = Router3();
router3.post(
  "/create-doctor",
  //   (req, res, next) => {
  //     const parsedResult = createDoctorZodSchema.safeParse(req.body);
  //     if (!parsedResult.success) {
  //       next(parsedResult.error);
  //     }
  //     // Sanitizing the data
  //     req.body = parsedResult.data;
  //     next();
  //   },
  validateRequest(createDoctorZodSchema),
  UserController.createDoctor
);
router3.post(
  "/create-admin",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  UserController.createAdmin
);
var UserRoutes = router3;

// src/app/module/doctor/doctor.route.ts
import { Router as Router4 } from "express";

// src/app/module/doctor/doctor.service.ts
import status9 from "http-status";

// src/app/utils/QueryBuilder.ts
var QueryBuilder = class {
  constructor(model, queryParams, config2 = {}) {
    this.model = model;
    this.queryParams = queryParams;
    this.config = config2;
    this.query = {
      where: {},
      include: {},
      orderBy: {},
      skip: 0,
      take: 10
    };
    this.countQuery = {
      where: {}
    };
  }
  query;
  countQuery;
  page = 1;
  limit = 10;
  skip = 0;
  sortBy = "createdAt";
  sortOrder = "desc";
  selectFields;
  search() {
    const { searchTerm } = this.queryParams;
    const { searchableFields } = this.config;
    if (searchTerm && searchableFields && searchableFields.length > 0) {
      const searchConditions = searchableFields.map(
        (field) => {
          if (field.includes(".")) {
            const parts = field.split(".");
            if (parts.length === 2) {
              const [relation, nestedField] = parts;
              const stringFilter2 = {
                contains: searchTerm,
                mode: "insensitive"
              };
              return {
                [relation]: {
                  [nestedField]: stringFilter2
                }
              };
            } else if (parts.length === 3) {
              const [relation, nestedRelation, nestedField] = parts;
              const stringFilter2 = {
                contains: searchTerm,
                mode: "insensitive"
              };
              return {
                [relation]: {
                  some: {
                    [nestedRelation]: {
                      [nestedField]: stringFilter2
                    }
                  }
                }
              };
            }
          }
          const stringFilter = {
            contains: searchTerm,
            mode: "insensitive"
          };
          return {
            [field]: stringFilter
          };
        }
      );
      const whereConditions = this.query.where;
      whereConditions.OR = searchConditions;
      const countWhereConditions = this.countQuery.where;
      countWhereConditions.OR = searchConditions;
    }
    return this;
  }
  // /doctors?searchTerm=john&page=1&sortBy=name&specialty=cardiology&appointmentFee[lt]=100 => {}
  // { specialty: 'cardiology', appointmentFee: { lt: '100' } }
  filter() {
    const { filterableFields } = this.config;
    const excludedField = [
      "searchTerm",
      "page",
      "limit",
      "sortBy",
      "sortOrder",
      "fields",
      "include"
    ];
    const filterParams = {};
    Object.keys(this.queryParams).forEach((key) => {
      if (!excludedField.includes(key)) {
        filterParams[key] = this.queryParams[key];
      }
    });
    const queryWhere = this.query.where;
    const countQueryWhere = this.countQuery.where;
    Object.keys(filterParams).forEach((key) => {
      const value = filterParams[key];
      if (value === void 0 || value === "") {
        return;
      }
      const isAllowedField = !filterableFields || filterableFields.length === 0 || filterableFields.includes(key);
      if (key.includes(".")) {
        const parts = key.split(".");
        if (filterableFields && !filterableFields.includes(key)) {
          return;
        }
        if (parts.length === 2) {
          const [relation, nestedField] = parts;
          if (!queryWhere[relation]) {
            queryWhere[relation] = {};
            countQueryWhere[relation] = {};
          }
          const queryRelation = queryWhere[relation];
          const countRelation = countQueryWhere[relation];
          queryRelation[nestedField] = this.parseFilterValue(value);
          countRelation[nestedField] = this.parseFilterValue(value);
          return;
        } else if (parts.length === 3) {
          const [relation, nestedRelation, nestedField] = parts;
          if (!queryWhere[relation]) {
            queryWhere[relation] = {
              some: {}
            };
            countQueryWhere[relation] = {
              some: {}
            };
          }
          const queryRelation = queryWhere[relation];
          const countRelation = countQueryWhere[relation];
          if (!queryRelation.some) {
            queryRelation.some = {};
          }
          if (!countRelation.some) {
            countRelation.some = {};
          }
          const querySome = queryRelation.some;
          const countSome = countRelation.some;
          if (!querySome[nestedRelation]) {
            querySome[nestedRelation] = {};
          }
          if (!countSome[nestedRelation]) {
            countSome[nestedRelation] = {};
          }
          const queryNestedRelation = querySome[nestedRelation];
          const countNestedRelation = countSome[nestedRelation];
          queryNestedRelation[nestedField] = this.parseFilterValue(value);
          countNestedRelation[nestedField] = this.parseFilterValue(value);
          return;
        }
      }
      if (!isAllowedField) {
        return;
      }
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        queryWhere[key] = this.parseRangeFilter(
          value
        );
        countQueryWhere[key] = this.parseRangeFilter(
          value
        );
        return;
      }
      queryWhere[key] = this.parseFilterValue(value);
      countQueryWhere[key] = this.parseFilterValue(value);
    });
    return this;
  }
  paginate() {
    const page = Number(this.queryParams.page) || 1;
    const limit = Number(this.queryParams.limit) || 10;
    this.page = page;
    this.limit = limit;
    this.skip = (page - 1) * limit;
    this.query.skip = this.skip;
    this.query.take = this.limit;
    return this;
  }
  sort() {
    const sortBy = this.queryParams.sortBy || "createdAt";
    const sortOrder = this.queryParams.sortOrder === "asc" ? "asc" : "desc";
    this.sortBy = sortBy;
    this.sortOrder = sortOrder;
    if (sortBy.includes(".")) {
      const parts = sortBy.split(".");
      if (parts.length === 2) {
        const [relation, nestedField] = parts;
        this.query.orderBy = {
          [relation]: {
            [nestedField]: sortOrder
          }
        };
      } else if (parts.length === 3) {
        const [relation, nestedRelation, nestedField] = parts;
        this.query.orderBy = {
          [relation]: {
            [nestedRelation]: {
              [nestedField]: sortOrder
            }
          }
        };
      } else {
        this.query.orderBy = {
          [sortBy]: sortOrder
        };
      }
    } else {
      this.query.orderBy = {
        [sortBy]: sortOrder
      };
    }
    return this;
  }
  fields() {
    const fieldsParam = this.queryParams.fields;
    if (fieldsParam && typeof fieldsParam === "string") {
      const fieldsArray = fieldsParam?.split(",").map((field) => field.trim());
      this.selectFields = {};
      fieldsArray?.forEach((field) => {
        if (this.selectFields) {
          this.selectFields[field] = true;
        }
      });
      this.query.select = this.selectFields;
      delete this.query.include;
    }
    return this;
  }
  include(relation) {
    if (this.selectFields) {
      return this;
    }
    this.query.include = {
      ...this.query.include,
      ...relation
    };
    return this;
  }
  dynamicInclude(includeConfig, defaultInclude) {
    if (this.selectFields) {
      return this;
    }
    const result = {};
    defaultInclude?.forEach((field) => {
      if (includeConfig[field]) {
        result[field] = includeConfig[field];
      }
    });
    const includeParam = this.queryParams.include;
    if (includeParam && typeof includeParam === "string") {
      const requestedRelations = includeParam.split(",").map((relation) => relation.trim());
      requestedRelations.forEach((relation) => {
        if (includeConfig[relation]) {
          result[relation] = includeConfig[relation];
        }
      });
    }
    this.query.include = {
      ...this.query.include,
      ...result
    };
    return this;
  }
  where(condition) {
    this.query.where = this.deepMerge(
      this.query.where,
      condition
    );
    this.countQuery.where = this.deepMerge(
      this.countQuery.where,
      condition
    );
    return this;
  }
  async execute() {
    const [total, data] = await Promise.all([
      this.model.count(
        this.countQuery
      ),
      this.model.findMany(
        this.query
      )
    ]);
    const totalPages = Math.ceil(total / this.limit);
    return {
      data,
      meta: {
        page: this.page,
        limit: this.limit,
        total,
        totalPages
      }
    };
  }
  async count() {
    return await this.model.count(
      this.countQuery
    );
  }
  getQuery() {
    return this.query;
  }
  deepMerge(target, source) {
    const result = { ...target };
    for (const key in source) {
      if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
        if (result[key] && typeof result[key] === "object" && !Array.isArray(result[key])) {
          result[key] = this.deepMerge(
            result[key],
            source[key]
          );
        } else {
          result[key] = source[key];
        }
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }
  parseFilterValue(value) {
    if (value === "true") {
      return true;
    }
    if (value === "false") {
      return false;
    }
    if (typeof value === "string" && !isNaN(Number(value)) && value != "") {
      return Number(value);
    }
    if (Array.isArray(value)) {
      return { in: value.map((item) => this.parseFilterValue(item)) };
    }
    return value;
  }
  parseRangeFilter(value) {
    const rangeQuery = {};
    Object.keys(value).forEach((operator) => {
      const operatorValue = value[operator];
      const parsedValue = typeof operatorValue === "string" && !isNaN(Number(operatorValue)) ? Number(operatorValue) : operatorValue;
      switch (operator) {
        case "lt":
        case "lte":
        case "gt":
        case "gte":
        case "equals":
        case "not":
        case "contains":
        case "startsWith":
        case "endsWith":
          rangeQuery[operator] = parsedValue;
          break;
        case "in":
        case "notIn":
          if (Array.isArray(operatorValue)) {
            rangeQuery[operator] = operatorValue;
          } else {
            rangeQuery[operator] = [parsedValue];
          }
          break;
        default:
          break;
      }
    });
    return Object.keys(rangeQuery).length > 0 ? rangeQuery : value;
  }
};

// src/app/module/doctor/doctor.constant.ts
var doctorSearchableFields = [
  "name",
  "email",
  "qualification",
  "designation",
  "currentWorkingPlace",
  "registrationNumber",
  "specialties.specialty.title"
];
var doctorFilterableFields = [
  "gender",
  "isDeleted",
  "appointmentFee",
  "experience",
  "registrationNumber",
  "specialties.specialtyId",
  "currentWorkingPlace",
  "designation",
  "qualification",
  "specialties.specialty.title",
  "user.role"
];
var doctorIncludeConfig = {
  user: true,
  specialties: {
    include: {
      specialty: true
    }
  },
  appointments: {
    include: {
      patient: true,
      doctor: true
    }
  },
  doctorSchedules: {
    include: {
      schedule: true
    }
  },
  prescriptions: true,
  reviews: true
};

// src/app/module/doctor/doctor.service.ts
var getAllDoctors = async (query) => {
  const queryBuilder = new QueryBuilder(prisma.doctor, query, {
    searchableFields: doctorSearchableFields,
    filterableFields: doctorFilterableFields
  });
  const result = await queryBuilder.search().filter().where({
    isDeleted: false
  }).include({
    user: true,
    // specialties: true,
    specialties: {
      include: {
        specialty: true
      }
    }
  }).dynamicInclude(doctorIncludeConfig).paginate().sort().fields().execute();
  console.log(result);
  return result;
};
var getDoctorById = async (id) => {
  const doctor = await prisma.doctor.findUnique({
    where: {
      id,
      isDeleted: false
    },
    include: {
      user: true,
      specialties: {
        include: {
          specialty: true
        }
      },
      appointments: {
        include: {
          patient: true,
          schedule: true,
          prescription: true
        }
      },
      doctorSchedules: {
        include: {
          schedule: true
        }
      },
      reviews: true
    }
  });
  return doctor;
};
var updateDoctor = async (id, payload) => {
  const isDoctorExist = await prisma.doctor.findUnique({
    where: {
      id
    }
  });
  if (!isDoctorExist) {
    throw new AppError_default(status9.NOT_FOUND, "Doctor not found");
  }
  const { doctor: doctorData, specialties } = payload;
  await prisma.$transaction(async (tx) => {
    if (doctorData) {
      await tx.doctor.update({
        where: {
          id
        },
        data: {
          ...doctorData
        }
      });
    }
    if (specialties && specialties.length > 0) {
      for (const specialty of specialties) {
        const { specialtyId, shouldDelete } = specialty;
        if (shouldDelete) {
          await tx.doctorSpecialty.delete({
            where: {
              doctorId_specialtyId: {
                doctorId: id,
                specialtyId
              }
            }
          });
        } else {
          await tx.doctorSpecialty.upsert({
            where: {
              doctorId_specialtyId: {
                doctorId: id,
                specialtyId
              }
            },
            create: {
              doctorId: id,
              specialtyId
            },
            update: {}
          });
        }
      }
    }
  });
  const doctor = await getDoctorById(id);
  return doctor;
};
var deleteDoctor = async (id) => {
  const isDoctorExist = await prisma.doctor.findUnique({
    where: { id },
    include: { user: true }
  });
  if (!isDoctorExist) {
    throw new AppError_default(status9.NOT_FOUND, "Doctor not found");
  }
  await prisma.$transaction(async (tx) => {
    await tx.doctor.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: /* @__PURE__ */ new Date()
      }
    });
    await tx.user.update({
      where: { id: isDoctorExist.userId },
      data: {
        isDeleted: true,
        deletedAt: /* @__PURE__ */ new Date(),
        status: UserStatus.DELETED
        // Optional: you may also want to block the user
      }
    });
    await tx.session.deleteMany({
      where: { userId: isDoctorExist.userId }
    });
    await tx.doctorSpecialty.deleteMany({
      where: { doctorId: id }
    });
  });
  return { message: "Doctor deleted successfully" };
};
var DoctorService = {
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor
};

// src/app/module/doctor/doctor.controller.ts
import status10 from "http-status";
var getAllDoctors2 = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await DoctorService.getAllDoctors(query);
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "Doctors fetched successfully",
    data: result.data,
    meta: result.meta
  });
});
var getDoctorById2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const doctor = await DoctorService.getDoctorById(id);
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "Doctor fetched successfully",
    data: doctor
  });
});
var updateDoctor2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const updatedDoctor = await DoctorService.updateDoctor(id, payload);
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "Doctor updated successfully",
    data: updatedDoctor
  });
});
var deleteDoctor2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DoctorService.deleteDoctor(id);
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "Doctor deleted successfully",
    data: result
  });
});
var DoctorController = {
  getAllDoctors: getAllDoctors2,
  getDoctorById: getDoctorById2,
  updateDoctor: updateDoctor2,
  deleteDoctor: deleteDoctor2
};

// src/app/module/doctor/doctor.validation.ts
import z3 from "zod";
var updateDoctorZodSchema = z3.object({
  doctor: z3.object({
    name: z3.string("Name must be string").min(5, "Name must be at least 5 characters").max(30, "Name must be at most 30 characters").optional(),
    profilePhoto: z3.url("Profile photo must be a valid URL").optional(),
    contactNumber: z3.string("Contact number must be string").min(11, "Contact number must be at least 11 characters").max(14, "Contact number must be at most 15 characters").optional(),
    address: z3.string("Address must be string").min(10, "Address must be at least 10 characters").max(100, "Address must be at most 100 characters").optional(),
    registrationNumber: z3.string("Registration number must be string").optional(),
    experience: z3.int("Experience must be an integer").nonnegative("Experience cannot be negative").optional(),
    gender: z3.enum(
      [Gender.MALE, Gender.FEMALE],
      "Gender must be either MALE or FEMALE"
    ).optional(),
    appointmentFee: z3.number("Appointment fee must be a number").nonnegative("Appointment fee cannot be negative").optional(),
    qualification: z3.string("Qualification must be string").min(2, "Qualification must be at least 2 characters").max(50, "Qualification must be at most 50 characters").optional(),
    currentWorkingPlace: z3.string("Current working place must be string").min(2, "Current working place must be at least 2 characters").max(50, "Current working place must be at most 50 characters").optional(),
    designation: z3.string("Designation must be string").min(2, "Designation must be at least 2 characters").max(50, "Designation must be at most 50 characters").optional()
  }).optional(),
  specialties: z3.array(
    z3.object({
      specialtyId: z3.uuid("Specialty ID must be a valid UUID"),
      shouldDelete: z3.boolean("shouldDelete must be a boolean").optional()
    })
  ).optional()
});

// src/app/module/doctor/doctor.route.ts
var router4 = Router4();
router4.get(
  "/",
  // checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DoctorController.getAllDoctors
);
router4.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DoctorController.getDoctorById
);
router4.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateDoctorZodSchema),
  DoctorController.updateDoctor
);
router4.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DoctorController.deleteDoctor
);
var DoctorRoutes = router4;

// src/app/module/admin/admin.route.ts
import { Router as Router5 } from "express";

// src/app/module/admin/admin.controller.ts
import status12 from "http-status";

// src/app/module/admin/admin.service.ts
import status11 from "http-status";
var getAllAdmins = async () => {
  const admins = await prisma.admin.findMany({
    include: {
      user: true
    }
  });
  return admins;
};
var getAdminById = async (id) => {
  const admin = await prisma.admin.findUnique({
    where: {
      id
    },
    include: {
      user: true
    }
  });
  return admin;
};
var updateAdmin = async (id, payload) => {
  const isAdminExist = await prisma.admin.findUnique({
    where: {
      id
    }
  });
  if (!isAdminExist) {
    throw new AppError_default(status11.NOT_FOUND, "Admin Or Super Admin not found");
  }
  const { admin } = payload;
  const updatedAdmin = await prisma.admin.update({
    where: {
      id
    },
    data: {
      ...admin
    }
  });
  return updatedAdmin;
};
var deleteAdmin = async (id, user) => {
  const isAdminExist = await prisma.admin.findUnique({
    where: {
      id
    }
  });
  if (!isAdminExist) {
    throw new AppError_default(status11.NOT_FOUND, "Admin Or Super Admin not found");
  }
  if (isAdminExist.id === user.userId) {
    throw new AppError_default(status11.BAD_REQUEST, "You cannot delete yourself");
  }
  const result = await prisma.$transaction(async (tx) => {
    await tx.admin.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: /* @__PURE__ */ new Date()
      }
    });
    await tx.user.update({
      where: { id: isAdminExist.userId },
      data: {
        isDeleted: true,
        deletedAt: /* @__PURE__ */ new Date(),
        status: UserStatus.DELETED
        // Optional: you may also want to block the user
      }
    });
    await tx.session.deleteMany({
      where: { userId: isAdminExist.userId }
    });
    await tx.account.deleteMany({
      where: { userId: isAdminExist.userId }
    });
    const admin = await getAdminById(id);
    return admin;
  });
  return result;
};
var changeUserStatus = async (user, payload) => {
  const isAdminExists = await prisma.admin.findUniqueOrThrow({
    where: { email: user.email },
    include: { user: true }
  });
  const { userId, userStatus } = payload;
  const userToChangeStatus = await prisma.user.findUniqueOrThrow({
    where: { id: userId }
  });
  const selfStatusChange = isAdminExists.userId === userId;
  if (selfStatusChange) {
    throw new AppError_default(status11.BAD_REQUEST, "You cannot change your own status");
  }
  if (isAdminExists.user.role === Role.ADMIN && userToChangeStatus.role === Role.SUPER_ADMIN) {
    throw new AppError_default(
      status11.BAD_REQUEST,
      "You cannot change the status of super admin. Only super admin can change the status of another super admin."
    );
  }
  if (isAdminExists.user.role === Role.ADMIN && userToChangeStatus.role === Role.ADMIN) {
    throw new AppError_default(
      status11.BAD_REQUEST,
      "You cannot change the status of another admin. Only super admin can change the status of admin."
    );
  }
  if (userStatus === UserStatus.DELETED) {
    throw new AppError_default(
      status11.BAD_REQUEST,
      "You cannot set user status to deleted. To delete a user, you have to use role specific delete api. For example, to delete an doctor user, you have to use delete doctor api which will set the user status to deleted and also set isDeleted to true and also delete the user session and account"
    );
  }
  const updatedUser = await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      status: userStatus
    }
  });
  return updatedUser;
};
var changeUserRole = async (user, payload) => {
  const isSuperAdminExists = await prisma.admin.findFirstOrThrow({
    where: { email: user.email, user: { role: Role.SUPER_ADMIN } },
    include: { user: true }
  });
  const { userId, role } = payload;
  const userToChangeRole = await prisma.user.findUniqueOrThrow({
    where: { id: userId }
  });
  const selfRoleChange = isSuperAdminExists.userId === userId;
  if (selfRoleChange) {
    throw new AppError_default(status11.BAD_REQUEST, "You cannot change your own role");
  }
  if (userToChangeRole.role === Role.DOCTOR || userToChangeRole.role === Role.PATIENT) {
    throw new AppError_default(
      status11.BAD_REQUEST,
      "Role of Patient and Doctor user cannot be changed by anyone. If needed, they have to be deleted and recreated with new role."
    );
  }
  const updatedUser = await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      role
    }
  });
  return updatedUser;
};
var AdminService = {
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  changeUserStatus,
  changeUserRole
};

// src/app/module/admin/admin.controller.ts
var getAllAdmins2 = catchAsync(async (req, res) => {
  const result = await AdminService.getAllAdmins();
  sendResponse(res, {
    httpStatusCode: status12.OK,
    success: true,
    message: "Admins fetched successfully",
    data: result
  });
});
var getAdminById2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const admin = await AdminService.getAdminById(id);
  sendResponse(res, {
    httpStatusCode: status12.OK,
    success: true,
    message: "Admin fetched successfully",
    data: admin
  });
});
var updateAdmin2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const updatedAdmin = await AdminService.updateAdmin(id, payload);
  sendResponse(res, {
    httpStatusCode: status12.OK,
    success: true,
    message: "Admin updated successfully",
    data: updatedAdmin
  });
});
var deleteAdmin2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  const result = await AdminService.deleteAdmin(id, user);
  sendResponse(res, {
    httpStatusCode: status12.OK,
    success: true,
    message: "Admin deleted successfully",
    data: result
  });
});
var changeUserStatus2 = catchAsync(async (req, res) => {
  const user = req.user;
  const payload = req.body;
  const result = await AdminService.changeUserStatus(user, payload);
  sendResponse(res, {
    httpStatusCode: status12.OK,
    success: true,
    message: "User status changed successfully",
    data: result
  });
});
var changeUserRole2 = catchAsync(async (req, res) => {
  const user = req.user;
  const payload = req.body;
  const result = await AdminService.changeUserRole(user, payload);
  sendResponse(res, {
    httpStatusCode: status12.OK,
    success: true,
    message: "User role changed successfully",
    data: result
  });
});
var AdminController = {
  getAllAdmins: getAllAdmins2,
  updateAdmin: updateAdmin2,
  deleteAdmin: deleteAdmin2,
  getAdminById: getAdminById2,
  changeUserStatus: changeUserStatus2,
  changeUserRole: changeUserRole2
};

// src/app/module/admin/admin.validation.ts
import z4 from "zod";
var updateAdminZodSchema = z4.object({
  admin: z4.object({
    name: z4.string("Name must be a string").optional(),
    profilePhoto: z4.url("Profile photo must be a valid URL").optional(),
    contactNumber: z4.string("Contact number must be a string").min(11, "Contact number must be at least 11 characters").max(14, "Contact number must be at most 15 characters").optional()
  }).optional()
});

// src/app/module/admin/admin.route.ts
var router5 = Router5();
router5.get("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), AdminController.getAllAdmins);
router5.get("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), AdminController.getAdminById);
router5.patch("/:id", checkAuth(Role.SUPER_ADMIN), validateRequest(updateAdminZodSchema), AdminController.updateAdmin);
router5.delete("/:id", checkAuth(Role.SUPER_ADMIN), AdminController.deleteAdmin);
router5.patch("/change-user-status", checkAuth(Role.SUPER_ADMIN, Role.ADMIN), AdminController.changeUserStatus);
router5.patch("/change-user-role", checkAuth(Role.SUPER_ADMIN), AdminController.changeUserRole);
var AdminRoutes = router5;

// src/app/module/schedule/schedule.route.ts
import { Router as Router6 } from "express";

// src/app/module/schedule/schedule.controller.ts
import status13 from "http-status";

// src/app/module/schedule/schedule.service.ts
import { addHours, addMinutes, format } from "date-fns";

// src/app/module/schedule/schedule.constant.ts
var scheduleFilterableFields = [
  "id",
  "startDateTime",
  "endDateTime"
  // 'appointments.doctors.id',
];
var scheduleSearchableFields = [
  "id",
  "startDateTime",
  "endDateTime"
];
var scheduleIncludeConfig = {
  appointments: {
    include: {
      doctor: true,
      patient: true,
      payment: true,
      prescription: true,
      review: true
    }
  },
  doctorSchedules: true
};

// src/app/module/schedule/schedule.utils.ts
var convertDateTime = async (date) => {
  const offset = date.getTimezoneOffset() * 6e4;
  return new Date(date.getTime() + offset);
};

// src/app/module/schedule/schedule.service.ts
var createSchedule = async (payload) => {
  const { startDate, endDate, startTime, endTime } = payload;
  const interval = 30;
  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);
  const schedules = [];
  while (currentDate <= lastDate) {
    const startDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(startTime.split(":")[0])
        ),
        Number(startTime.split(":")[1])
      )
    );
    const endDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(endTime.split(":")[0])
        ),
        Number(endTime.split(":")[1])
      )
    );
    while (startDateTime < endDateTime) {
      const s = await convertDateTime(startDateTime);
      const e = await convertDateTime(addMinutes(startDateTime, interval));
      const scheduleData = {
        startDateTime: s,
        endDateTime: e
      };
      const existingSchedule = await prisma.schedule.findFirst({
        where: {
          startDateTime: scheduleData.startDateTime,
          endDateTime: scheduleData.endDateTime
        }
      });
      if (!existingSchedule) {
        const result = await prisma.schedule.create({
          data: scheduleData
        });
        console.log(result);
        schedules.push(result);
      }
      startDateTime.setMinutes(startDateTime.getMinutes() + interval);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return schedules;
};
var getAllSchedules = async (query) => {
  const queryBuilder = new QueryBuilder(prisma.schedule, query, {
    searchableFields: scheduleSearchableFields,
    filterableFields: scheduleFilterableFields
  });
  const result = await queryBuilder.search().filter().paginate().dynamicInclude(scheduleIncludeConfig).sort().fields().execute();
  return result;
};
var getScheduleById = async (id) => {
  const schedule = await prisma.schedule.findUnique({
    where: {
      id
    }
  });
  return schedule;
};
var updateSchedule = async (id, payload) => {
  const { startDate, endDate, startTime, endTime } = payload;
  const startDateTime = new Date(
    addMinutes(
      addHours(
        `${format(new Date(startDate), "yyyy-MM-dd")}`,
        Number(startTime.split(":")[0])
      ),
      Number(startTime.split(":")[1])
    )
  );
  const endDateTime = new Date(
    addMinutes(
      addHours(
        `${format(new Date(endDate), "yyyy-MM-dd")}`,
        Number(endTime.split(":")[0])
      ),
      Number(endTime.split(":")[1])
    )
  );
  const updatedSchedule = await prisma.schedule.update({
    where: {
      id
    },
    data: {
      startDateTime,
      endDateTime
    }
  });
  return updatedSchedule;
};
var deleteSchedule = async (id) => {
  await prisma.schedule.delete({
    where: {
      id
    }
  });
  return true;
};
var ScheduleService = {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule
};

// src/app/module/schedule/schedule.controller.ts
var createSchedule2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const schedule = await ScheduleService.createSchedule(payload);
  sendResponse(res, {
    success: true,
    httpStatusCode: status13.CREATED,
    message: "Schedule created successfully",
    data: schedule
  });
});
var getAllSchedules2 = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await ScheduleService.getAllSchedules(query);
  sendResponse(res, {
    success: true,
    httpStatusCode: status13.OK,
    message: "Schedules retrieved successfully",
    data: result.data,
    meta: result.meta
  });
});
var getScheduleById2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const schedule = await ScheduleService.getScheduleById(id);
  sendResponse(res, {
    success: true,
    httpStatusCode: status13.OK,
    message: "Schedule retrieved successfully",
    data: schedule
  });
});
var updateSchedule2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const updatedSchedule = await ScheduleService.updateSchedule(id, payload);
  sendResponse(res, {
    success: true,
    httpStatusCode: status13.OK,
    message: "Schedule updated successfully",
    data: updatedSchedule
  });
});
var deleteSchedule2 = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    await ScheduleService.deleteSchedule(id);
    sendResponse(res, {
      success: true,
      httpStatusCode: status13.OK,
      message: "Schedule deleted successfully"
    });
  }
);
var ScheduleController = {
  createSchedule: createSchedule2,
  getAllSchedules: getAllSchedules2,
  getScheduleById: getScheduleById2,
  updateSchedule: updateSchedule2,
  deleteSchedule: deleteSchedule2
};

// src/app/module/schedule/schedule.validation.ts
import z5 from "zod";
var createScheduleZodSchema = z5.object({
  startDate: z5.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format"
  }),
  endDate: z5.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format"
  }),
  startTime: z5.string().refine((time) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time), {
    message: "Invalid time format"
  }),
  endTime: z5.string().refine((time) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time), {
    message: "Invalid time format"
  })
});
var updateScheduleZodSchema = z5.object({
  startDate: z5.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format"
  }).optional(),
  endDate: z5.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format"
  }).optional(),
  startTime: z5.string().refine((time) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time), {
    message: "Invalid time format"
  }).optional(),
  endTime: z5.string().refine((time) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time), {
    message: "Invalid time format"
  }).optional()
});
var ScheduleValidation = {
  createScheduleZodSchema,
  updateScheduleZodSchema
};

// src/app/module/schedule/schedule.route.ts
var router6 = Router6();
router6.post(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(ScheduleValidation.createScheduleZodSchema),
  ScheduleController.createSchedule
);
router6.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.DOCTOR),
  ScheduleController.getAllSchedules
);
router6.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.DOCTOR),
  ScheduleController.getScheduleById
);
router6.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(ScheduleValidation.updateScheduleZodSchema),
  ScheduleController.updateSchedule
);
router6.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  ScheduleController.deleteSchedule
);
var scheduleRoutes = router6;

// src/app/module/doctorSchedule/doctorSchedule.route.ts
import { Router as Router7 } from "express";

// src/app/module/doctorSchedule/doctorSchedule.controller.ts
import status14 from "http-status";

// src/app/module/doctorSchedule/doctorSchedule.constant.ts
var doctorScheduleSearchableFields = [
  "id",
  "doctorId",
  "scheduleId"
];
var doctorScheduleFilterableFields = [
  "id",
  "doctorId",
  "scheduleId",
  "createdAt",
  "updatedAt",
  "isBooked",
  "schedule.startDateTime",
  "schedule.endDateTime"
];
var doctorScheduleIncludeConfig = {
  doctor: {
    include: {
      user: true,
      appointments: true,
      specialties: true
    }
  },
  schedule: true
};

// src/app/module/doctorSchedule/doctorSchedule.service.ts
var createMyDoctorSchedule = async (user, payload) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email
    }
  });
  const doctorScheduleData = payload.scheduleIds.map((scheduleId) => ({
    doctorId: doctorData.id,
    scheduleId
  }));
  await prisma.doctorSchedules.createMany({
    data: doctorScheduleData
  });
  const result = await prisma.doctorSchedules.findMany({
    where: {
      doctorId: doctorData.id,
      scheduleId: {
        in: payload.scheduleIds
      }
    },
    include: {
      schedule: true
    }
  });
  return result;
};
var getMyDoctorSchedules = async (user, query) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email
    }
  });
  const queryBuilder = new QueryBuilder(
    prisma.doctorSchedules,
    {
      doctorId: doctorData.id,
      ...query
    },
    {
      filterableFields: doctorScheduleFilterableFields,
      searchableFields: doctorScheduleSearchableFields
    }
  );
  const doctorSchedules = await queryBuilder.search().filter().paginate().include({
    schedule: true,
    doctor: {
      include: {
        user: true
      }
    }
  }).sort().fields().dynamicInclude(doctorScheduleIncludeConfig).execute();
  return doctorSchedules;
};
var getAllDoctorSchedules = async (query) => {
  const queryBuilder = new QueryBuilder(prisma.doctorSchedules, query, {
    filterableFields: doctorScheduleFilterableFields,
    searchableFields: doctorScheduleSearchableFields
  });
  const result = await queryBuilder.search().filter().paginate().dynamicInclude(doctorScheduleIncludeConfig).sort().execute();
  return result;
};
var getDoctorScheduleById = async (doctorId, scheduleId) => {
  const doctorSchedule = await prisma.doctorSchedules.findUnique({
    where: {
      doctorId_scheduleId: {
        doctorId,
        scheduleId
      }
    },
    include: {
      schedule: true,
      doctor: true
    }
  });
  return doctorSchedule;
};
var updateMyDoctorSchedule = async (user, payload) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email
    }
  });
  const deleteIds = payload.scheduleIds.filter((schedule) => schedule.shouldDelete).map((schedule) => schedule.id);
  const createIds = payload.scheduleIds.filter((schedule) => !schedule.shouldDelete).map((schedule) => schedule.id);
  const result = await prisma.$transaction(async (tx) => {
    await tx.doctorSchedules.deleteMany({
      where: {
        isBooked: false,
        doctorId: doctorData.id,
        scheduleId: {
          in: deleteIds
        }
      }
    });
    const doctorScheduleData = createIds.map((scheduleId) => ({
      doctorId: doctorData.id,
      scheduleId
    }));
    const result2 = await tx.doctorSchedules.createMany({
      data: doctorScheduleData
    });
    return result2;
  });
  return result;
};
var deleteMyDoctorSchedule = async (id, user) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email
    }
  });
  await prisma.doctorSchedules.deleteMany({
    where: {
      isBooked: false,
      doctorId: doctorData.id,
      scheduleId: id
    }
  });
};
var DoctorScheduleService = {
  createMyDoctorSchedule,
  getAllDoctorSchedules,
  getDoctorScheduleById,
  updateMyDoctorSchedule,
  deleteMyDoctorSchedule,
  getMyDoctorSchedules
};

// src/app/module/doctorSchedule/doctorSchedule.controller.ts
var createMyDoctorSchedule2 = catchAsync(
  async (req, res) => {
    const payload = req.body;
    const user = req.user;
    const doctorSchedule = await DoctorScheduleService.createMyDoctorSchedule(
      user,
      payload
    );
    sendResponse(res, {
      success: true,
      httpStatusCode: status14.CREATED,
      message: "Doctor schedule created successfully",
      data: doctorSchedule
    });
  }
);
var getMyDoctorSchedules2 = catchAsync(async (req, res) => {
  const user = req.user;
  const query = req.query;
  const result = await DoctorScheduleService.getMyDoctorSchedules(
    user,
    query
  );
  sendResponse(res, {
    success: true,
    httpStatusCode: status14.OK,
    message: "Doctor schedules retrieved successfully",
    data: result.data,
    meta: result.meta
  });
});
var getAllDoctorSchedules2 = catchAsync(
  async (req, res) => {
    const query = req.query;
    const result = await DoctorScheduleService.getAllDoctorSchedules(
      query
    );
    sendResponse(res, {
      success: true,
      httpStatusCode: status14.OK,
      message: "All doctor schedules retrieved successfully",
      data: result.data,
      meta: result.meta
    });
  }
);
var getDoctorScheduleById2 = catchAsync(
  async (req, res) => {
    const doctorId = req.params.doctorId;
    const scheduleId = req.params.scheduleId;
    const doctorSchedule = await DoctorScheduleService.getDoctorScheduleById(
      doctorId,
      scheduleId
    );
    sendResponse(res, {
      success: true,
      httpStatusCode: status14.OK,
      message: "Doctor schedule retrieved successfully",
      data: doctorSchedule
    });
  }
);
var updateMyDoctorSchedule2 = catchAsync(
  async (req, res) => {
    const payload = req.body;
    const user = req.user;
    const updatedDoctorSchedule = await DoctorScheduleService.updateMyDoctorSchedule(user, payload);
    sendResponse(res, {
      success: true,
      httpStatusCode: status14.OK,
      message: "Doctor schedule updated successfully",
      data: updatedDoctorSchedule
    });
  }
);
var deleteMyDoctorSchedule2 = catchAsync(
  async (req, res) => {
    const id = req.params.id;
    const user = req.user;
    await DoctorScheduleService.deleteMyDoctorSchedule(id, user);
    sendResponse(res, {
      success: true,
      httpStatusCode: status14.OK,
      message: "Doctor schedule deleted successfully"
    });
  }
);
var DoctorScheduleController = {
  createMyDoctorSchedule: createMyDoctorSchedule2,
  getMyDoctorSchedules: getMyDoctorSchedules2,
  getAllDoctorSchedules: getAllDoctorSchedules2,
  getDoctorScheduleById: getDoctorScheduleById2,
  updateMyDoctorSchedule: updateMyDoctorSchedule2,
  deleteMyDoctorSchedule: deleteMyDoctorSchedule2
};

// src/app/module/doctorSchedule/doctorSchedule.route.ts
var router7 = Router7();
router7.post(
  "/create-my-doctor-schedule",
  checkAuth(Role.DOCTOR),
  DoctorScheduleController.createMyDoctorSchedule
);
router7.get("/my-doctor-schedules", checkAuth(Role.DOCTOR), DoctorScheduleController.getMyDoctorSchedules);
router7.get("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), DoctorScheduleController.getAllDoctorSchedules);
router7.get("/:doctorId/schedule/:scheduleId", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), DoctorScheduleController.getDoctorScheduleById);
router7.patch(
  "/update-my-doctor-schedule",
  checkAuth(Role.DOCTOR),
  DoctorScheduleController.updateMyDoctorSchedule
);
router7.delete("/delete-my-doctor-schedule/:id", checkAuth(Role.DOCTOR), DoctorScheduleController.deleteMyDoctorSchedule);
var DoctorScheduleRoutes = router7;

// src/app/module/appointment/appointment.route.ts
import { Router as Router8 } from "express";

// src/app/module/appointment/appointment.controller.ts
import status16 from "http-status";

// src/app/module/appointment/appointment.service.ts
import status15 from "http-status";
import { v7 as uuidv7 } from "uuid";

// src/app/config/stripe.config.ts
import Stripe from "stripe";
var stripe = new Stripe(envVars.STRIPE.STRIPE_SECRET_KEY);

// src/app/module/appointment/appointment.service.ts
var bookAppointment = async (payload, user) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email
    }
  });
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: payload.doctorId,
      isDeleted: false
    }
  });
  const scheduleData = await prisma.schedule.findUniqueOrThrow({
    where: {
      id: payload.scheduleId
    }
  });
  const doctorSchedule = await prisma.doctorSchedules.findUniqueOrThrow({
    where: {
      doctorId_scheduleId: {
        doctorId: doctorData.id,
        scheduleId: scheduleData.id
      }
    }
  });
  const videoCallingId = String(uuidv7());
  const result = await prisma.$transaction(async (tx) => {
    const appointmentData = await tx.appointment.create({
      data: {
        doctorId: payload.doctorId,
        patientId: patientData.id,
        scheduleId: doctorSchedule.scheduleId,
        videoCallingId
      }
    });
    await tx.doctorSchedules.update({
      where: {
        doctorId_scheduleId: {
          doctorId: payload.doctorId,
          scheduleId: payload.scheduleId
        }
      },
      data: {
        isBooked: true
      }
    });
    const transactionId = String(uuidv7());
    const paymentData = await tx.payment.create({
      data: {
        appointmentId: appointmentData.id,
        amount: doctorData.appointmentFee,
        transactionId
      }
    });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Appointment with Dr. ${doctorData.name}`
            },
            unit_amount: doctorData.appointmentFee * 100
          },
          quantity: 1
        }
      ],
      metadata: {
        appointmentId: appointmentData.id,
        paymentId: paymentData.id
      },
      success_url: `${envVars.FRONTEND_URL}/dashboard/payment/payment-success`,
      // cancel_url: `${envVars.FRONTEND_URL}/dashboard/payment/payment-failed`,
      cancel_url: `${envVars.FRONTEND_URL}/dashboard/appointments`
    });
    return {
      appointmentData,
      paymentData,
      paymentUrl: session.url
    };
  });
  return {
    appointment: result.appointmentData,
    payment: result.paymentData,
    paymentUrl: result.paymentUrl
  };
};
var getMyAppointments = async (user) => {
  const patientData = await prisma.patient.findUnique({
    where: {
      email: user?.email
    }
  });
  const doctorData = await prisma.doctor.findUnique({
    where: {
      email: user?.email
    }
  });
  let appointments = [];
  if (patientData) {
    appointments = await prisma.appointment.findMany({
      where: {
        patientId: patientData.id
      },
      include: {
        doctor: true,
        schedule: true
      }
    });
  } else if (doctorData) {
    appointments = await prisma.appointment.findMany({
      where: {
        doctorId: doctorData.id
      },
      include: {
        patient: true,
        schedule: true
      }
    });
  } else {
    throw new Error("User not found");
  }
  return appointments;
};
var changeAppointmentStatus = async (appointmentId, appointmentStatus, user) => {
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: appointmentId
      // status: AppointmentStatus.SCHEDULED
    },
    include: {
      doctor: true
    }
  });
  if (user?.role === Role.DOCTOR) {
    if (!(user?.email === appointmentData.doctor.email))
      throw new AppError_default(status15.BAD_REQUEST, "This is not your appointment");
  }
  return await prisma.appointment.update({
    where: {
      id: appointmentId
    },
    data: {
      status: appointmentStatus
    }
  });
};
var getMySingleAppointment = async (appointmentId, user) => {
  const patientData = await prisma.patient.findUnique({
    where: {
      email: user?.email
    }
  });
  const doctorData = await prisma.doctor.findUnique({
    where: {
      email: user?.email
    }
  });
  let appointment;
  if (patientData) {
    appointment = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        patientId: patientData.id
      },
      include: {
        doctor: true,
        schedule: true
      }
    });
  } else if (doctorData) {
    appointment = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        doctorId: doctorData.id
      },
      include: {
        patient: true,
        schedule: true
      }
    });
  }
  if (!appointment) {
    throw new AppError_default(status15.NOT_FOUND, "Appointment not found");
  }
  return appointment;
};
var getAllAppointments = async () => {
  const appointments = await prisma.appointment.findMany({
    include: {
      doctor: true,
      patient: true,
      schedule: true
    }
  });
  return appointments;
};
var bookAppointmentWithPayLater = async (payload, user) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email
    }
  });
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: payload.doctorId,
      isDeleted: false
    }
  });
  const scheduleData = await prisma.schedule.findUniqueOrThrow({
    where: {
      id: payload.scheduleId
    }
  });
  const doctorSchedule = await prisma.doctorSchedules.findUniqueOrThrow({
    where: {
      doctorId_scheduleId: {
        doctorId: doctorData.id,
        scheduleId: scheduleData.id
      }
    }
  });
  const videoCallingId = String(uuidv7());
  const result = await prisma.$transaction(async (tx) => {
    const appointmentData = await tx.appointment.create({
      data: {
        doctorId: payload.doctorId,
        patientId: patientData.id,
        scheduleId: doctorSchedule.scheduleId,
        videoCallingId
      }
    });
    await tx.doctorSchedules.update({
      where: {
        doctorId_scheduleId: {
          doctorId: payload.doctorId,
          scheduleId: payload.scheduleId
        }
      },
      data: {
        isBooked: true
      }
    });
    const transactionId = String(uuidv7());
    const paymentData = await tx.payment.create({
      data: {
        appointmentId: appointmentData.id,
        amount: doctorData.appointmentFee,
        transactionId
      }
    });
    return {
      appointment: appointmentData,
      payment: paymentData
    };
  });
  return result;
};
var initiatePayment = async (appointmentId, user) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email
    }
  });
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: appointmentId,
      patientId: patientData.id
    },
    include: {
      doctor: true,
      payment: true
    }
  });
  if (!appointmentData) {
    throw new AppError_default(status15.NOT_FOUND, "Appointment not found");
  }
  if (!appointmentData.payment) {
    throw new AppError_default(
      status15.NOT_FOUND,
      "Payment data not found for this appointment"
    );
  }
  if (appointmentData.payment?.status === PaymentStatus.PAID) {
    throw new AppError_default(
      status15.BAD_REQUEST,
      "Payment already completed for this appointment"
    );
  }
  if (appointmentData.status === AppointmentStatus.CANCELED) {
    throw new AppError_default(status15.BAD_REQUEST, "Appointment is canceled");
  }
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: `Appointment with Dr. ${appointmentData.doctor.name}`
          },
          unit_amount: appointmentData.doctor.appointmentFee * 100
        },
        quantity: 1
      }
    ],
    metadata: {
      appointmentId: appointmentData.id,
      paymentId: appointmentData.payment.id
    },
    success_url: `${envVars.FRONTEND_URL}/dashboard/payment/payment-success?appointment_id=${appointmentData.id}&payment_id=${appointmentData.payment.id}`,
    // cancel_url: `${envVars.FRONTEND_URL}/dashboard/payment/payment-failed`,
    cancel_url: `${envVars.FRONTEND_URL}/dashboard/appointments?error=payment_cancelled`
  });
  return {
    paymentUrl: session.url
  };
};
var cancelUnpaidAppointments = async () => {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1e3);
  const unpaidAppointments = await prisma.appointment.findMany({
    where: {
      // status: AppointmentStatus.SCHEDULED,
      createdAt: {
        lte: thirtyMinutesAgo
      },
      paymentStatus: PaymentStatus.UNPAID
    }
  });
  const appointmentToCancel = unpaidAppointments.map(
    (appointment) => appointment.id
  );
  await prisma.$transaction(async (tx) => {
    await tx.appointment.updateMany({
      where: {
        id: {
          in: appointmentToCancel
        }
      },
      data: {
        status: AppointmentStatus.CANCELED
      }
    });
    await tx.payment.deleteMany({
      where: {
        appointmentId: {
          in: appointmentToCancel
        }
      }
    });
    for (const unpaidAppointment of unpaidAppointments) {
      await tx.doctorSchedules.update({
        where: {
          doctorId_scheduleId: {
            doctorId: unpaidAppointment.doctorId,
            scheduleId: unpaidAppointment.scheduleId
          }
        },
        data: {
          isBooked: false
        }
      });
    }
  });
};
var AppointmentService = {
  bookAppointment,
  getMyAppointments,
  changeAppointmentStatus,
  getMySingleAppointment,
  getAllAppointments,
  bookAppointmentWithPayLater,
  initiatePayment,
  cancelUnpaidAppointments
};

// src/app/module/appointment/appointment.controller.ts
var bookAppointment2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const user = req.user;
  const appointment = await AppointmentService.bookAppointment(payload, user);
  sendResponse(res, {
    success: true,
    httpStatusCode: status16.CREATED,
    message: "Appointment booked successfully",
    data: appointment
  });
});
var getMyAppointments2 = catchAsync(async (req, res) => {
  const user = req.user;
  const appointments = await AppointmentService.getMyAppointments(user);
  sendResponse(res, {
    success: true,
    httpStatusCode: status16.OK,
    message: "Appointments retrieved successfully",
    data: appointments
  });
});
var changeAppointmentStatus2 = catchAsync(
  async (req, res) => {
    const appointmentId = req.params.id;
    const payload = req.body;
    const user = req.user;
    const updatedAppointment = await AppointmentService.changeAppointmentStatus(
      appointmentId,
      payload,
      user
    );
    sendResponse(res, {
      success: true,
      httpStatusCode: status16.OK,
      message: "Appointment status updated successfully",
      data: updatedAppointment
    });
  }
);
var getMySingleAppointment2 = catchAsync(
  async (req, res) => {
    const appointmentId = req.params.id;
    const user = req.user;
    const appointment = await AppointmentService.getMySingleAppointment(
      appointmentId,
      user
    );
    sendResponse(res, {
      success: true,
      httpStatusCode: status16.OK,
      message: "Appointment retrieved successfully",
      data: appointment
    });
  }
);
var getAllAppointments2 = catchAsync(async (req, res) => {
  const appointments = await AppointmentService.getAllAppointments();
  sendResponse(res, {
    success: true,
    httpStatusCode: status16.OK,
    message: "All appointments retrieved successfully",
    data: appointments
  });
});
var bookAppointmentWithPayLater2 = catchAsync(
  async (req, res) => {
    const payload = req.body;
    const user = req.user;
    const appointment = await AppointmentService.bookAppointmentWithPayLater(
      payload,
      user
    );
    sendResponse(res, {
      success: true,
      httpStatusCode: status16.CREATED,
      message: "Appointment booked successfully with Pay Later option",
      data: appointment
    });
  }
);
var initiatePayment2 = catchAsync(async (req, res) => {
  const appointmentId = req.params.id;
  const user = req.user;
  const paymentInfo = await AppointmentService.initiatePayment(
    appointmentId,
    user
  );
  sendResponse(res, {
    success: true,
    httpStatusCode: status16.OK,
    message: "Payment initiated successfully",
    data: paymentInfo
  });
});
var AppointmentController = {
  bookAppointment: bookAppointment2,
  getMyAppointments: getMyAppointments2,
  changeAppointmentStatus: changeAppointmentStatus2,
  getMySingleAppointment: getMySingleAppointment2,
  getAllAppointments: getAllAppointments2,
  bookAppointmentWithPayLater: bookAppointmentWithPayLater2,
  initiatePayment: initiatePayment2
};

// src/app/module/appointment/appointment.route.ts
var router8 = Router8();
router8.post("/book-appointment", checkAuth(Role.PATIENT), AppointmentController.bookAppointment);
router8.get("/my-appointments", checkAuth(Role.PATIENT, Role.DOCTOR), AppointmentController.getMyAppointments);
router8.patch("/change-appointment-status/:id", checkAuth(Role.PATIENT, Role.DOCTOR, Role.ADMIN, Role.SUPER_ADMIN), AppointmentController.changeAppointmentStatus);
router8.get("/my-single-appointment/:id", checkAuth(Role.PATIENT, Role.DOCTOR), AppointmentController.getMySingleAppointment);
router8.get("/all-appointments", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), AppointmentController.getAllAppointments);
router8.post("/book-appointment-with-pay-later", checkAuth(Role.PATIENT), AppointmentController.bookAppointmentWithPayLater);
router8.post("/initiate-payment/:id", checkAuth(Role.PATIENT), AppointmentController.initiatePayment);
var AppointmentRoutes = router8;

// src/app/module/patient/patient.route.ts
import { Router as Router9 } from "express";

// src/app/module/patient/patient.validation.ts
import z6 from "zod";
var updatePatientProfileZodSchema = z6.object({
  patientInfo: z6.object({
    name: z6.string("Name must be a string").min(1, "Name cannot be empty").max(100, "Name must be less than 100 characters").optional(),
    profilePhoto: z6.url("Profile photo must be a valid URL").optional(),
    contactNumber: z6.string("Contact number must be a string").min(11, "Contact number must be at least 11 digits").max(15, "Contact number must be less than 15 digits").optional(),
    address: z6.string("Address must be a string").min(1, "Address cannot be empty").max(200, "Address must be less than 200 characters").optional()
  }).optional(),
  patientHealthData: z6.object({
    gender: z6.enum([Gender.FEMALE, Gender.MALE, Gender.OTHER]).optional(),
    dateOfBirth: z6.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format"
    }).optional(),
    bloodGroup: z6.enum([
      BloodGroup.A_POSITIVE,
      BloodGroup.A_NEGATIVE,
      BloodGroup.B_POSITIVE,
      BloodGroup.B_NEGATIVE,
      BloodGroup.AB_POSITIVE,
      BloodGroup.AB_NEGATIVE,
      BloodGroup.O_POSITIVE,
      BloodGroup.O_NEGATIVE
    ]).optional(),
    hasAllergies: z6.boolean().optional(),
    hasDiabetes: z6.boolean().optional(),
    height: z6.string().optional(),
    weight: z6.string().optional(),
    smokingStatus: z6.boolean().optional(),
    dietaryPreferences: z6.string().optional(),
    pregnancyStatus: z6.boolean().optional(),
    mentalHealthHistory: z6.string().optional(),
    immunizationStatus: z6.string().optional(),
    hasPastSurgeries: z6.boolean().optional(),
    recentAnxiety: z6.boolean().optional(),
    recentDepression: z6.boolean().optional(),
    maritalStatus: z6.string().optional()
  }).optional(),
  medicalReports: z6.array(
    z6.object({
      shouldDelete: z6.boolean().optional(),
      reportId: z6.uuid().optional(),
      reportName: z6.string().optional(),
      reportLink: z6.url("Report link must be a valid URL").optional()
    })
  ).optional().refine(
    (reports) => {
      if (!reports || reports.length === 0) return true;
      for (const report of reports) {
        if (report.shouldDelete === true && !report.reportId) {
          return false;
        }
        if (report.reportId && !report.shouldDelete) {
          return false;
        }
        if (report.reportName && !report.reportLink) {
          return false;
        }
        if (report.reportLink && !report.reportName) {
          return false;
        }
        return true;
      }
    },
    {
      message: "Invalid medical report data. Please ensure that if shouldDelete is true, reportId is provided, and if reportId is provided, shouldDelete must be true. Also, if reportName is provided, reportLink must also be provided, and vice versa."
    }
  )
});
var PatientValidation = {
  updatePatientProfileZodSchema
};

// src/app/module/patient/patient.utils.ts
import { isValid, parse } from "date-fns";
var convertToDateTime = (dateString) => {
  if (!dateString) return void 0;
  const date = parse(dateString, "yyyy-MM-dd", /* @__PURE__ */ new Date());
  if (!isValid(date)) return void 0;
  return date;
};

// src/app/module/patient/patient.service.ts
var updateMyProfile = async (user, payload) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email
    },
    include: {
      patientHealthData: true,
      medicalReports: true
    }
  });
  await prisma.$transaction(async (tx) => {
    if (payload.patientInfo) {
      await tx.patient.update({
        where: { id: patientData.id },
        data: { ...payload.patientInfo }
      });
      if (payload.patientInfo.name || payload.patientInfo.profilePhoto) {
        const userData = {
          name: payload.patientInfo.name ? payload.patientInfo.name : patientData.name,
          image: payload.patientInfo.profilePhoto ? payload.patientInfo.profilePhoto : patientData.profilePhoto
        };
        await tx.user.update({
          where: { id: patientData.userId },
          data: { ...userData }
        });
      }
    }
    if (payload.patientHealthData) {
      const healthDataToSave = { ...payload.patientHealthData };
      if (payload.patientHealthData.dateOfBirth) {
        healthDataToSave.dateOfBirth = convertToDateTime(
          typeof healthDataToSave.dateOfBirth === "string" ? healthDataToSave.dateOfBirth : void 0
        );
      }
      await tx.patientHealthData.upsert({
        where: { patientId: patientData.id },
        update: healthDataToSave,
        create: {
          patientId: patientData.id,
          ...healthDataToSave
        }
      });
    }
    if (payload.medicalReports && Array.isArray(payload.medicalReports) && payload.medicalReports.length > 0) {
      for (const report of payload.medicalReports) {
        if (report.shouldDelete && report.reportId) {
          const deletedReport = await tx.medicalReport.delete({
            where: {
              id: report.reportId
            }
          });
          if (deletedReport.reportLink) {
            await deleteFileFromCloudinary(deletedReport.reportLink);
          }
        } else if (report.reportName && report.reportLink) {
          await tx.medicalReport.create({
            data: {
              patientId: patientData.id,
              reportName: report.reportName,
              reportLink: report.reportLink
            }
          });
        }
      }
    }
  });
  const result = await prisma.patient.findUnique({
    where: { id: patientData.id },
    include: {
      user: true,
      patientHealthData: true,
      medicalReports: true
    }
  });
  return result;
};
var PatientService = {
  updateMyProfile
};

// src/app/module/patient/patient.controller.ts
import status17 from "http-status";
var updateMyProfile2 = catchAsync(async (req, res) => {
  const user = req.user;
  const payload = req.body;
  const result = await PatientService.updateMyProfile(user, payload);
  sendResponse(res, {
    httpStatusCode: status17.OK,
    success: true,
    message: "Profile updated successfully",
    data: result
  });
});
var PatientController = {
  updateMyProfile: updateMyProfile2
};

// src/app/module/patient/patient.middleware.ts
var updateMyPatientProfileMiddleware = (req, res, next) => {
  if (req.body.data) {
    req.body = JSON.parse(req.body.data);
  }
  const payload = req.body;
  const files = req.files;
  if (files?.profilePhoto?.[0]) {
    if (!payload.patientInfo) payload.patientInfo = {};
    payload.patientInfo.profilePhoto = files.profilePhoto[0].path;
  }
  if (files?.medicalReports && files?.medicalReports?.length > 0) {
    const newReports = files.medicalReports.map((file) => ({
      reportName: file.originalname || `Medical Report - ${(/* @__PURE__ */ new Date()).getTime()}`,
      reportLink: file.path
    }));
    if (payload.medicalReports && Array.isArray(payload.medicalReports)) {
      payload.medicalReports = [...payload.medicalReports, ...newReports];
    } else {
      payload.medicalReports = newReports;
    }
  }
  req.body = payload;
  next();
};

// src/app/module/patient/patient.route.ts
var router9 = Router9();
router9.patch(
  "/update-my-profile",
  checkAuth(Role.PATIENT),
  multerUpload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "medicalReports", maxCount: 5 }
  ]),
  // Middleware to process the uploaded files
  //   (req: Request, res: Response, next: NextFunction) => {
  //     const payload: IUpdatePatientProfilePayload = req.body;
  //     const files = req.files as { [fieldName: string]: Express.Multer.File[] | undefined };
  //     if (files?.profilePhoto?.[0]) {
  //       if (!payload.patientInfo) payload.patientInfo = {} as IUpdatePatientInfoPayload;
  //       payload.patientInfo.profilePhoto = files.profilePhoto[0].path;
  //     }
  //     if (files?.medicalReports && files?.medicalReports?.length > 0) {
  //       const newReports = files.medicalReports.map(file => ({
  //         reportName: file.originalname || `Medical Report - ${new Date().getTime()}`,
  //         reportLink: file.path,
  //       }));
  //       if (payload.medicalReports && Array.isArray(payload.medicalReports)) {
  //         payload.medicalReports = [...payload.medicalReports, ...newReports];
  //       } else {
  //         payload.medicalReports = newReports;
  //       }
  //     }
  //     req.body = payload;
  //     next();
  //   },
  updateMyPatientProfileMiddleware,
  validateRequest(PatientValidation.updatePatientProfileZodSchema),
  PatientController.updateMyProfile
);
var PatientRoutes = router9;

// src/app/module/prescription/prescription.route.ts
import express from "express";

// src/app/module/prescription/prescription.controller.ts
import httpStatus from "http-status";

// src/app/module/prescription/prescription.service.ts
import status18 from "http-status";

// src/app/module/prescription/prescription.utils.ts
import PDFDocument from "pdfkit";
var generatePrescriptionPDF = async (prescriptionData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 50
      });
      const chunks = [];
      doc.on("data", (chunk) => {
        chunks.push(chunk);
      });
      doc.on("end", () => {
        resolve(Buffer.concat(chunks));
      });
      doc.on("error", (error) => {
        reject(error);
      });
      doc.fontSize(24).font("Helvetica-Bold").text("PRESCRIPTION", {
        align: "center"
      });
      doc.moveDown(0.5);
      doc.fontSize(10).font("Helvetica").text("GESUNDHEIT-IO", {
        align: "center"
      });
      doc.text("Your Health, Our Priority", { align: "center" });
      doc.moveDown(1);
      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(1);
      doc.fontSize(11).font("Helvetica-Bold").text("Doctor Information");
      doc.fontSize(10).font("Helvetica").text(`Name: ${prescriptionData.doctorName}`).text(`Email: ${prescriptionData.doctorEmail}`);
      doc.moveDown(0.8);
      doc.fontSize(11).font("Helvetica-Bold").text("Patient Information");
      doc.fontSize(10).font("Helvetica").text(`Name: ${prescriptionData.patientName}`).text(`Email: ${prescriptionData.patientEmail}`);
      doc.moveDown(0.8);
      doc.fontSize(11).font("Helvetica-Bold").text("Prescription Details");
      doc.fontSize(10).font("Helvetica").text(`Prescription ID: ${prescriptionData.prescriptionId}`).text(`Appointment Date: ${new Date(prescriptionData.appointmentDate).toLocaleDateString()}`).text(`Issued Date: ${new Date(prescriptionData.createdAt).toLocaleDateString()}`);
      if (prescriptionData.followUpDate) {
        doc.text(`Follow-up Date: ${new Date(prescriptionData.followUpDate).toLocaleDateString()}`);
      }
      doc.moveDown(1);
      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(1);
      doc.fontSize(11).font("Helvetica-Bold").text("Instructions");
      doc.fontSize(10).font("Helvetica");
      doc.text(prescriptionData.instructions, {
        align: "left",
        width: 445
      });
      doc.moveDown(1);
      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(1);
      doc.fontSize(9).font("Helvetica").text(
        "This is an electronically generated prescription. Please follow all instructions provided by your doctor.",
        {
          align: "center"
        }
      );
      doc.text(`For more information, visit: ${envVars.FRONTEND_URL}`, {
        align: "center"
      });
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

// src/app/module/prescription/prescription.service.ts
var givePrescription = async (user, payload) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user?.email
    }
  });
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId
    },
    include: {
      patient: true,
      doctor: {
        include: {
          specialties: true
        }
      },
      schedule: {
        include: {
          doctorSchedules: true
        }
      }
    }
  });
  if (appointmentData.doctorId !== doctorData.id) {
    throw new AppError_default(status18.BAD_REQUEST, "You can only give prescription for your own appointments");
  }
  const isAlreadyPrescribed = await prisma.prescription.findFirst({
    where: {
      appointmentId: payload.appointmentId
    }
  });
  if (isAlreadyPrescribed) {
    throw new AppError_default(status18.BAD_REQUEST, "You have already given prescription for this appointment. You can update the prescription instead.");
  }
  const followUpDate = new Date(payload.followUpDate);
  const result = await prisma.$transaction(async (tx) => {
    const result2 = await tx.prescription.create({
      data: {
        ...payload,
        followUpDate,
        doctorId: appointmentData.doctorId,
        patientId: appointmentData.patientId
      }
    });
    const pdfBuffer = await generatePrescriptionPDF({
      doctorName: doctorData.name,
      patientName: appointmentData.patient.name,
      appointmentDate: appointmentData.schedule.startDateTime,
      instructions: payload.instructions,
      followUpDate,
      doctorEmail: doctorData.email,
      patientEmail: appointmentData.patient.email,
      prescriptionId: result2.id,
      createdAt: /* @__PURE__ */ new Date()
    });
    const fileName = `Prescription-${Date.now()}.pdf`;
    const uploadedFile = await uploadFileToCloudinary(pdfBuffer, fileName);
    const pdfUrl = uploadedFile.secure_url;
    const updatedPrescription = await tx.prescription.update({
      where: {
        id: result2.id
      },
      data: {
        pdfUrl
      }
    });
    try {
      const patient = appointmentData.patient;
      const doctor = appointmentData.doctor;
      await sendEmail({
        to: patient.email,
        subject: `You have received a new prescription from Dr. ${doctor.name}`,
        templateName: "prescription",
        templateData: {
          doctorName: doctor.name,
          patientName: patient.name,
          specialization: doctor.specialties.map((s) => s.title).join(", "),
          appointmentDate: new Date(appointmentData.schedule.startDateTime).toLocaleString(),
          issuedDate: (/* @__PURE__ */ new Date()).toLocaleDateString(),
          prescriptionId: result2.id,
          instructions: payload.instructions,
          followUpDate: followUpDate.toLocaleDateString(),
          pdfUrl
        },
        attachments: [
          {
            filename: fileName,
            content: pdfBuffer,
            contentType: "application/pdf"
          }
        ]
      });
    } catch (error) {
      console.log("Failed To send email notification for prescription", error);
    }
    return updatedPrescription;
  }, {
    maxWait: 15e3,
    timeout: 2e4
  });
  return result;
};
var myPrescriptions = async (user) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      email: user?.email
    }
  });
  if (!isUserExists) {
    throw new AppError_default(status18.NOT_FOUND, "User not found");
  }
  if (isUserExists.role === Role.DOCTOR) {
    const prescriptions = await prisma.prescription.findMany({
      where: {
        doctor: {
          email: user?.email
        }
      },
      include: {
        patient: true,
        doctor: true,
        appointment: true
      }
    });
    return prescriptions;
  }
  if (isUserExists.role === Role.PATIENT) {
    const prescriptions = await prisma.prescription.findMany({
      where: {
        patient: {
          email: user?.email
        }
      },
      include: {
        patient: true,
        doctor: true,
        appointment: true
      }
    });
    return prescriptions;
  }
};
var getAllPrescriptions = async () => {
  const result = await prisma.prescription.findMany({
    include: {
      patient: true,
      doctor: true,
      appointment: true
    }
  });
  return result;
};
var updatePrescription = async (user, prescriptionId, payload) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      email: user?.email
    }
  });
  if (!isUserExists) {
    throw new AppError_default(status18.NOT_FOUND, "User not found");
  }
  const prescriptionData = await prisma.prescription.findUniqueOrThrow({
    where: {
      id: prescriptionId
    },
    include: {
      doctor: true,
      patient: true,
      appointment: {
        include: {
          schedule: true
        }
      }
    }
  });
  if (!(user?.email === prescriptionData.doctor.email)) {
    throw new AppError_default(status18.BAD_REQUEST, "This is not your prescription!");
  }
  const updatedInstructions = payload.instructions || prescriptionData.instructions;
  const updatedFollowUpDate = payload.followUpDate ? new Date(payload.followUpDate) : prescriptionData.followUpDate;
  const pdfBuffer = await generatePrescriptionPDF({
    doctorName: prescriptionData.doctor.name,
    doctorEmail: prescriptionData.doctor.email,
    patientName: prescriptionData.patient.name,
    patientEmail: prescriptionData.patient.email,
    appointmentDate: prescriptionData.appointment.schedule.startDateTime,
    instructions: updatedInstructions,
    followUpDate: updatedFollowUpDate,
    prescriptionId: prescriptionData.id,
    createdAt: prescriptionData.createdAt
  });
  const fileName = `prescription-updated-${Date.now()}.pdf`;
  const uploadedFile = await uploadFileToCloudinary(pdfBuffer, fileName);
  const newPdfUrl = uploadedFile.secure_url;
  if (prescriptionData.pdfUrl) {
    try {
      await deleteFileFromCloudinary(prescriptionData.pdfUrl);
    } catch (deleteError) {
      console.error("Failed to delete old PDF from Cloudinary:", deleteError);
    }
  }
  const result = await prisma.prescription.update({
    where: {
      id: prescriptionId
    },
    data: {
      instructions: updatedInstructions,
      followUpDate: updatedFollowUpDate,
      pdfUrl: newPdfUrl
    },
    include: {
      patient: true,
      doctor: true,
      appointment: {
        include: {
          schedule: true
        }
      }
    }
  });
  try {
    await sendEmail({
      to: result.patient.email,
      subject: `Your Prescription has been Updated by ${result.doctor.name}`,
      templateName: "prescription",
      templateData: {
        patientName: result.patient.name,
        doctorName: result.doctor.name,
        specialization: "Healthcare Provider",
        prescriptionId: result.id,
        appointmentDate: new Date(result.appointment.schedule.startDateTime).toLocaleString(),
        issuedDate: new Date(result.createdAt).toLocaleDateString(),
        followUpDate: new Date(result.followUpDate).toLocaleDateString(),
        instructions: result.instructions,
        pdfUrl: newPdfUrl
      },
      attachments: [
        {
          filename: `Prescription-${result.id}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf"
        }
      ]
    });
  } catch (emailError) {
    console.error("Failed to send updated prescription email:", emailError);
  }
  return result;
};
var deletePrescription = async (user, prescriptionId) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      email: user?.email
    }
  });
  if (!isUserExists) {
    throw new AppError_default(status18.NOT_FOUND, "User not found");
  }
  const prescriptionData = await prisma.prescription.findUniqueOrThrow({
    where: {
      id: prescriptionId
    },
    include: {
      doctor: true
    }
  });
  if (!(user?.email === prescriptionData.doctor.email)) {
    throw new AppError_default(status18.BAD_REQUEST, "This is not your prescription!");
  }
  if (prescriptionData.pdfUrl) {
    try {
      await deleteFileFromCloudinary(prescriptionData.pdfUrl);
    } catch (deleteError) {
      console.error("Failed to delete PDF from Cloudinary:", deleteError);
    }
  }
  await prisma.prescription.delete({
    where: {
      id: prescriptionId
    }
  });
};
var PrescriptionService = {
  givePrescription,
  myPrescriptions,
  getAllPrescriptions,
  updatePrescription,
  deletePrescription
};

// src/app/module/prescription/prescription.controller.ts
var givePrescription2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const user = req.user;
  const result = await PrescriptionService.givePrescription(user, payload);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Prescription created successfully",
    data: result
  });
});
var myPrescriptions2 = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await PrescriptionService.myPrescriptions(user);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Prescription fetched successfully",
    data: result
  });
});
var getAllPrescriptions2 = catchAsync(async (req, res) => {
  const result = await PrescriptionService.getAllPrescriptions();
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Prescriptions retrieval successfully",
    data: result
  });
});
var updatePrescription2 = catchAsync(async (req, res) => {
  const user = req.user;
  const prescriptionId = req.params.id;
  const payload = req.body;
  const result = await PrescriptionService.updatePrescription(user, prescriptionId, payload);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Prescription updated successfully",
    data: result
  });
});
var deletePrescription2 = catchAsync(async (req, res) => {
  const user = req.user;
  const prescriptionId = req.params.id;
  await PrescriptionService.deletePrescription(user, prescriptionId);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Prescription deleted successfully"
  });
});
var PrescriptionController = {
  givePrescription: givePrescription2,
  myPrescriptions: myPrescriptions2,
  getAllPrescriptions: getAllPrescriptions2,
  updatePrescription: updatePrescription2,
  deletePrescription: deletePrescription2
};

// src/app/module/prescription/prescription.validation.ts
import { z as z7 } from "zod";
var createPrescriptionZodSchema = z7.object({
  appointmentId: z7.string("Appointment ID is required"),
  instructions: z7.string("Instructions is required").min(1, "Instructions cannot be empty"),
  followUpDate: z7.string("Follow-up date must be a valid date").optional()
});
var updatePrescriptionZodSchema = z7.object({
  instructions: z7.string("Instructions is required").min(1, "Instructions cannot be empty").optional(),
  followUpDate: z7.string("Follow-up date must be a valid date").optional()
});
var PrescriptionValidation = {
  createPrescriptionZodSchema,
  updatePrescriptionZodSchema
};

// src/app/module/prescription/prescription.route.ts
var router10 = express.Router();
router10.get(
  "/",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  PrescriptionController.getAllPrescriptions
);
router10.get(
  "/my-prescriptions",
  checkAuth(Role.PATIENT, Role.DOCTOR),
  PrescriptionController.myPrescriptions
);
router10.post(
  "/",
  checkAuth(Role.DOCTOR),
  validateRequest(PrescriptionValidation.createPrescriptionZodSchema),
  PrescriptionController.givePrescription
);
router10.patch(
  "/:id",
  checkAuth(Role.DOCTOR),
  validateRequest(PrescriptionValidation.updatePrescriptionZodSchema),
  PrescriptionController.updatePrescription
);
router10.delete(
  "/:id",
  checkAuth(Role.DOCTOR),
  PrescriptionController.deletePrescription
);
var PrescriptionRoutes = router10;

// src/app/module/review/review.route.ts
import express2 from "express";

// src/app/module/review/review.controller.ts
import httpStatus2 from "http-status";

// src/app/module/review/review.service.ts
import status19 from "http-status";
var giveReview = async (user, payload) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email
    }
  });
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId
    }
  });
  if (appointmentData.paymentStatus !== PaymentStatus.PAID) {
    throw new AppError_default(status19.BAD_REQUEST, "You can only review after payment is done");
  }
  if (appointmentData.patientId !== patientData.id) {
    throw new AppError_default(status19.BAD_REQUEST, "You can only review for your own appointments");
  }
  const isReviewed = await prisma.review.findFirst({
    where: {
      appointmentId: payload.appointmentId
    }
  });
  if (isReviewed) {
    throw new AppError_default(
      status19.BAD_REQUEST,
      "You have already reviewed for this appointment. You can update your review instead."
    );
  }
  const result = await prisma.$transaction(async (tx) => {
    const review = await tx.review.create({
      data: {
        ...payload,
        patientId: appointmentData.patientId,
        doctorId: appointmentData.doctorId
      }
    });
    const averageRating = await tx.review.aggregate({
      where: {
        doctorId: appointmentData.doctorId
      },
      _avg: {
        rating: true
      }
    });
    await tx.doctor.update({
      where: {
        id: appointmentData.doctorId
      },
      data: {
        averageRating: averageRating._avg.rating
      }
    });
    return review;
  });
  return result;
};
var getAllReviews = async () => {
  const reviews = await prisma.review.findMany({
    include: {
      doctor: true,
      patient: true,
      appointment: true
    }
  });
  return reviews;
};
var myReviews = async (user) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: user?.email
    }
  });
  if (!isUserExist) {
    throw new AppError_default(status19.BAD_REQUEST, "Only patients can view their reviews");
  }
  if (isUserExist.role === Role.DOCTOR) {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
      where: {
        email: user?.email
      }
    });
    return await prisma.review.findMany({
      where: {
        doctorId: doctorData.id
      },
      include: {
        patient: true,
        appointment: true
      }
    });
  }
  if (isUserExist.role === Role.PATIENT) {
    const patientData = await prisma.patient.findUniqueOrThrow({
      where: {
        email: user?.email
      }
    });
    return await prisma.review.findMany({
      where: {
        patientId: patientData.id
      },
      include: {
        doctor: true,
        appointment: true
      }
    });
  }
};
var updateReview = async (user, reviewId, payload) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email
    }
  });
  const reviewData = await prisma.review.findUniqueOrThrow({
    where: {
      id: reviewId
    }
  });
  if (!(patientData.id === reviewData.patientId)) {
    throw new AppError_default(status19.BAD_REQUEST, "This is not your review!");
  }
  const result = await prisma.$transaction(async (tx) => {
    const updatedReview = await tx.review.update({
      where: {
        id: reviewId
      },
      data: {
        ...payload
      }
    });
    const averageRating = await tx.review.aggregate({
      where: {
        doctorId: reviewData.doctorId
      },
      _avg: {
        rating: true
      }
    });
    await tx.doctor.update({
      where: {
        id: updatedReview.doctorId
      },
      data: {
        averageRating: averageRating._avg.rating
      }
    });
    return updatedReview;
  });
  return result;
};
var deleteReview = async (user, reviewId) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email
    }
  });
  const reviewData = await prisma.review.findUniqueOrThrow({
    where: {
      id: reviewId
    }
  });
  if (!(patientData.id === reviewData.patientId)) {
    throw new AppError_default(status19.BAD_REQUEST, "This is not your review!");
  }
  const result = await prisma.$transaction(async (tx) => {
    const deletedReview = await tx.review.delete({
      where: {
        id: reviewId
      }
    });
    const averageRating = await tx.review.aggregate({
      where: {
        doctorId: deletedReview.doctorId
      },
      _avg: {
        rating: true
      }
    });
    await tx.doctor.update({
      where: {
        id: deletedReview.doctorId
      },
      data: {
        averageRating: averageRating._avg.rating
      }
    });
    return deletedReview;
  });
  return result;
};
var ReviewService = {
  giveReview,
  getAllReviews,
  myReviews,
  updateReview,
  deleteReview
};

// src/app/module/review/review.controller.ts
var giveReview2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const user = req.user;
  const result = await ReviewService.giveReview(user, payload);
  sendResponse(res, {
    httpStatusCode: httpStatus2.OK,
    success: true,
    message: "Review created successfully",
    data: result
  });
});
var getAllReviews2 = catchAsync(async (req, res) => {
  const result = await ReviewService.getAllReviews();
  sendResponse(res, {
    httpStatusCode: httpStatus2.OK,
    success: true,
    message: "Reviews retrieval successfully",
    data: result
  });
});
var myReviews2 = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await ReviewService.myReviews(user);
  sendResponse(res, {
    httpStatusCode: httpStatus2.OK,
    success: true,
    message: "Reviews retrieval successfully",
    data: result
  });
});
var updateReview2 = catchAsync(async (req, res) => {
  const user = req.user;
  const reviewId = req.params.id;
  const payload = req.body;
  const result = await ReviewService.updateReview(user, reviewId, payload);
  sendResponse(res, {
    httpStatusCode: httpStatus2.OK,
    success: true,
    message: "Review updated successfully",
    data: result
  });
});
var deleteReview2 = catchAsync(async (req, res) => {
  const user = req.user;
  const reviewId = req.params.id;
  const result = await ReviewService.deleteReview(user, reviewId);
  sendResponse(res, {
    httpStatusCode: httpStatus2.OK,
    success: true,
    message: "Review deleted successfully",
    data: result
  });
});
var ReviewController = {
  giveReview: giveReview2,
  getAllReviews: getAllReviews2,
  myReviews: myReviews2,
  updateReview: updateReview2,
  deleteReview: deleteReview2
};

// src/app/module/review/review.validation.ts
import { z as z8 } from "zod";
var createReviewZodSchema = z8.object({
  appointmentId: z8.string("Appointment ID is required"),
  rating: z8.number("Rating is required").min(1, "Rating must be at least 1").max(5, "Rating cannot be more than 5"),
  comment: z8.string("Comment is required").min(1, "Comment cannot be empty")
});
var updateReviewZodSchema = z8.object({
  rating: z8.number("Rating is required").min(1, "Rating must be at least 1").max(5, "Rating cannot be more than 5").optional(),
  comment: z8.string("Comment is required").min(1, "Comment cannot be empty").optional()
});
var ReviewValidation = {
  createReviewZodSchema,
  updateReviewZodSchema
};

// src/app/module/review/review.route.ts
var router11 = express2.Router();
router11.get("/", ReviewController.getAllReviews);
router11.post(
  "/",
  checkAuth(Role.PATIENT),
  validateRequest(ReviewValidation.createReviewZodSchema),
  ReviewController.giveReview
);
router11.get("/my-reviews", checkAuth(Role.PATIENT, Role.DOCTOR), ReviewController.myReviews);
router11.patch("/:id", checkAuth(Role.PATIENT), validateRequest(ReviewValidation.updateReviewZodSchema), ReviewController.updateReview);
router11.delete("/:id", checkAuth(Role.PATIENT), ReviewController.deleteReview);
var ReviewRoutes = router11;

// src/app/module/stats/stats.route.ts
import express3 from "express";

// src/generated/prisma/internal/prismaNamespaceBrowser.ts
import * as runtime3 from "@prisma/client/runtime/index-browser";
var NullTypes4 = {
  DbNull: runtime3.NullTypes.DbNull,
  JsonNull: runtime3.NullTypes.JsonNull,
  AnyNull: runtime3.NullTypes.AnyNull
};
var TransactionIsolationLevel2 = runtime3.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});

// src/app/module/stats/stats.controller.ts
import status21 from "http-status";

// src/app/module/stats/stats.service.ts
import status20 from "http-status";
var getDashboardStatsData = async (user) => {
  let statsData;
  switch (user.role) {
    case Role.SUPER_ADMIN:
      statsData = getSuperAdminStatsData();
      break;
    case Role.ADMIN:
      statsData = getAdminStatsData();
      break;
    case Role.DOCTOR:
      statsData = getDoctorStatsData(user);
      break;
    case Role.PATIENT:
      statsData = getPatientStatsData(user);
      break;
    default:
      throw new AppError_default(status20.BAD_REQUEST, "Invalid user role");
  }
  return statsData;
};
var getSuperAdminStatsData = async () => {
  const appointmentCount = await prisma.appointment.count();
  const doctorCount = await prisma.doctor.count();
  const patientCount = await prisma.patient.count();
  const adminCount = await prisma.admin.count();
  const superAdminCount = await prisma.admin.count({
    where: { user: { role: Role.SUPER_ADMIN } }
  });
  const paymentCount = await prisma.payment.count();
  const userCount = await prisma.user.count();
  const totalRevenue = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: { status: PaymentStatus.PAID }
  });
  const pieChartData = await getPieChartData();
  const barChartData = await getBarChartData();
  return {
    appointmentCount,
    doctorCount,
    patientCount,
    adminCount,
    superAdminCount,
    paymentCount,
    userCount,
    totalRevenue: totalRevenue._sum.amount || 0,
    pieChartData,
    barChartData
  };
};
var getAdminStatsData = async () => {
  const appointmentCount = await prisma.appointment.count();
  const doctorCount = await prisma.doctor.count();
  const patientCount = await prisma.patient.count();
  const adminCount = await prisma.admin.count();
  const paymentCount = await prisma.payment.count();
  const userCount = await prisma.user.count();
  const totalRevenue = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: { status: PaymentStatus.PAID }
  });
  const pieChartData = await getPieChartData();
  const barChartData = await getBarChartData();
  return {
    appointmentCount,
    doctorCount,
    patientCount,
    adminCount,
    paymentCount,
    userCount,
    totalRevenue: totalRevenue._sum.amount || 0,
    pieChartData,
    barChartData
  };
};
var getDoctorStatsData = async (user) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: { email: user.email }
  });
  const reviewCount = await prisma.review.count({
    where: { doctorId: doctorData.id }
  });
  const patientCount = await prisma.appointment.groupBy({
    by: ["patientId"],
    _count: { id: true },
    where: { doctorId: doctorData.id }
  });
  const appointmentCount = await prisma.appointment.count({
    where: { doctorId: doctorData.id }
  });
  const totalRevenue = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: {
      appointment: { doctorId: doctorData.id },
      status: PaymentStatus.PAID
    }
  });
  const appointmentStatusDistribution = await prisma.appointment.groupBy({
    by: ["status"],
    _count: { id: true },
    where: { doctorId: doctorData.id }
  });
  const formattedAppointmentStatusDistribution = appointmentStatusDistribution.map(({ _count, status: status27 }) => ({
    status: status27,
    count: _count.id
  }));
  return {
    reviewCount,
    patientCount: patientCount.length,
    appointmentCount,
    totalRevenue: totalRevenue._sum.amount || 0,
    appointmentStatusDistribution: formattedAppointmentStatusDistribution
  };
};
var getPatientStatsData = async (user) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: { email: user.email }
  });
  const appointmentCount = await prisma.appointment.count({
    where: { patientId: patientData.id }
  });
  const reviewCount = await prisma.review.count({
    where: { patientId: patientData.id }
  });
  const appointmentStatusDistribution = await prisma.appointment.groupBy({
    by: ["status"],
    _count: { id: true },
    where: { patientId: patientData.id }
  });
  const formattedAppointmentStatusDistribution = appointmentStatusDistribution.map(({ _count, status: status27 }) => ({
    status: status27,
    count: _count.id
  }));
  return {
    reviewCount,
    appointmentCount,
    appointmentStatusDistribution: formattedAppointmentStatusDistribution
  };
};
var getPieChartData = async () => {
  const appointmentStatusDistribution = await prisma.appointment.groupBy({
    by: ["status"],
    _count: { id: true }
  });
  const formattedAppointmentStatusDistribution = appointmentStatusDistribution.map(({ _count, status: status27 }) => ({
    status: status27,
    count: _count.id
  }));
  return formattedAppointmentStatusDistribution;
};
var getBarChartData = async () => {
  const appointmentCountByMonth = await prisma.$queryRaw`
    SELECT DATE_TRUNC('month', "createdAt") AS month, 
    CAST(COUNT(*) AS INTEGER) AS count
    FROM "appointments"
    GROUP BY month
    ORDER BY month ASC;
  `;
  return appointmentCountByMonth;
};
var StatsService = {
  getDashboardStatsData
};

// src/app/module/stats/stats.controller.ts
var getDashboardStatsData2 = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await StatsService.getDashboardStatsData(user);
  sendResponse(res, {
    httpStatusCode: status21.OK,
    success: true,
    message: "Stats data retrieved successfully!",
    data: result
  });
});
var StatsController = {
  getDashboardStatsData: getDashboardStatsData2
};

// src/app/module/stats/stats.route.ts
var router12 = express3.Router();
router12.get(
  "/",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR, Role.PATIENT),
  StatsController.getDashboardStatsData
);
var StatsRoutes = router12;

// src/app/module/payment/payment.route.ts
import { Router as Router10 } from "express";
var router13 = Router10();
var PaymentRoutes = router13;

// src/app/routes/index.ts
var router14 = Router11();
router14.use("/auth", AuthRoutes);
router14.use("/specialties", SpecialtyRoutes);
router14.use("/users", UserRoutes);
router14.use("/patients", PatientRoutes);
router14.use("/doctors", DoctorRoutes);
router14.use("/admins", AdminRoutes);
router14.use("/schedules", scheduleRoutes);
router14.use("/doctor-schedules", DoctorScheduleRoutes);
router14.use("/appointments", AppointmentRoutes);
router14.use("/prescriptions", PrescriptionRoutes);
router14.use("/reviews", ReviewRoutes);
router14.use("/stats", StatsRoutes);
router14.use("/payments", PaymentRoutes);
var IndexRoutes = router14;

// src/app/middleware/globalErrorHandler.ts
import status24 from "http-status";
import z9 from "zod";

// src/app/errorHelpers/handleZodError.ts
import status22 from "http-status";
var handleZodError = (err) => {
  const errorSources = [];
  const statusCode = status22.BAD_REQUEST;
  const message = "Zod Validation Error";
  err.issues.forEach((issue) => {
    errorSources.push({
      path: issue.path.join(" => "),
      message: issue.message
    });
  });
  return {
    success: false,
    message,
    errorSources,
    statusCode
  };
};

// src/app/utils/deleteUploadedFilesFromGlobalErrorHandler.ts
var deleteUploadedFilesFromGlobalErrorHandler = async (req) => {
  try {
    const filesToDelete = [];
    if (req.file && req.file?.path) {
      filesToDelete.push(req.file.path);
    } else if (req.files && typeof req.files === "object" && !Array.isArray(req.files)) {
      Object.values(req.files).forEach((fileArray) => {
        if (Array.isArray(fileArray)) {
          fileArray.forEach((file) => {
            if (file?.path) {
              filesToDelete.push(file.path);
            }
          });
        }
      });
    } else if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      req.files.forEach((file) => {
        if (file?.path) {
          filesToDelete.push(file.path);
        }
      });
    }
    if (filesToDelete.length > 0) {
      await Promise.all(filesToDelete.map((url) => deleteFileFromCloudinary(url)));
      console.log(
        `Deleted ${filesToDelete.length} uploaded file(s) from cloudinary due to an error during request processing.
`
      );
    }
  } catch (error) {
    console.error("Error deleting uploaded files from Global Error Handler", error);
  }
};

// src/app/errorHelpers/handlePrismaErrors.ts
import status23 from "http-status";
var getStatusCodeFromPrismaError = (errorCode) => {
  if (errorCode === "P2002") return status23.CONFLICT;
  if (["P2025", "P2001", "P2015", "P2018"].includes(errorCode)) {
    return status23.NOT_FOUND;
  }
  if (["P1000", "P6002"].includes(errorCode)) return status23.UNAUTHORIZED;
  if (["P1010", "P6010"].includes(errorCode)) return status23.FORBIDDEN;
  if (errorCode === "P6003") return status23.PAYMENT_REQUIRED;
  if (["P1008", "P2004", "P6004"].includes(errorCode)) {
    return status23.GATEWAY_TIMEOUT;
  }
  if (errorCode === "P5011") return status23.TOO_MANY_REQUESTS;
  if (errorCode === "P6009") return status23.REQUEST_ENTITY_TOO_LARGE || 413;
  if (errorCode.startsWith("P1") || ["P2024", "P3037", "P6008"].includes(errorCode)) {
    return status23.SERVICE_UNAVAILABLE;
  }
  if (errorCode.startsWith("P2")) return status23.BAD_REQUEST;
  if (errorCode.startsWith("P3") || errorCode.startsWith("P4")) {
    return status23.INTERNAL_SERVER_ERROR;
  }
  return status23.INTERNAL_SERVER_ERROR;
};
var formatErrorMeta = (meta) => {
  if (!meta) return "";
  const parts = [];
  if (meta.target) {
    parts.push(`Field(s): ${String(meta.target)}`);
  }
  if (meta.field_name) {
    parts.push(`Field: ${String(meta.field_name)}`);
  }
  if (meta.column_name) {
    parts.push(`Column: ${String(meta.column_name)}`);
  }
  if (meta.table) {
    parts.push(`Table: ${String(meta.table)}`);
  }
  if (meta.model_name) {
    parts.push(`Model: ${String(meta.model_name)}`);
  }
  if (meta.relation_name) {
    parts.push(`Relation: ${String(meta.relation_name)}`);
  }
  if (meta.constraint_name) {
    parts.push(`Constraint: ${String(meta.constraint_name)}`);
  }
  if (meta.database_error) {
    parts.push(`Database Error: ${String(meta.database_error)}`);
  }
  return parts.length > 0 ? parts.join(" |") : "";
};
var handlePrismaClientKnownRequestError = (error) => {
  const statusCode = getStatusCodeFromPrismaError(error.code);
  const metaInfo = formatErrorMeta(error.meta);
  let cleanMessage = error.message;
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage = lines[0] || "An error occurred with the database operation. Please try again.";
  const errorSources = [
    {
      path: error.code,
      message: metaInfo ? `${mainMessage} | ${metaInfo}` : mainMessage
    }
  ];
  if (error.meta?.cause) {
    errorSources.push({
      path: "cause",
      message: String(error.meta.cause)
    });
  }
  return {
    statusCode,
    success: false,
    message: `Prisma Client Known Request Error: ${mainMessage}`,
    errorSources
  };
};
var handlePrismaClientUnknownRequestError = (error) => {
  let cleanMessage = error.message;
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage = lines[0] || "An error occurred with the database operation. Please try again.";
  const errorSources = [
    {
      path: "Unknown Prisma Error",
      message: mainMessage
    }
  ];
  return {
    statusCode: status23.INTERNAL_SERVER_ERROR,
    success: false,
    message: `Prisma Client Unknown Request Error: ${mainMessage}`,
    errorSources
  };
};
var handlePrismaClientValidationError = (error) => {
  let cleanMessage = error.message;
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const errorSources = [];
  const fieldMatch = cleanMessage.match(/Argument `(\w+)`/i);
  const fieldName = fieldMatch ? fieldMatch[1] : "Unknown Field";
  const mainMessage = lines.find((line) => !line.includes("Argument") && !line.includes("\u2192") && line.length > 10) || lines[0] || "Invalid query parameters provided to the database operation.";
  errorSources.push({
    path: fieldName,
    message: mainMessage
  });
  return {
    success: false,
    statusCode: status23.BAD_REQUEST,
    message: `Prisma Client Validation Error: ${mainMessage}`,
    errorSources
  };
};
var handlePrismaClientInitializationError = (error) => {
  const statusCode = error.errorCode ? getStatusCodeFromPrismaError(error.errorCode) : status23.SERVICE_UNAVAILABLE;
  const cleanMessage = error.message;
  cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage = lines[0] || "An error occurred while initializing the Prisma client. Please try again.";
  const errorSources = [
    {
      path: error.errorCode || "Prisma Client Initialization Error",
      message: mainMessage
    }
  ];
  return {
    success: false,
    statusCode,
    message: `Prisma Client Initialization Error: ${mainMessage}`,
    errorSources
  };
};
var handlerPrismaClientRustPanicError = () => {
  const errorSources = [
    {
      path: "Rust Engine Crashed",
      message: "The database engine encountered a fatal error and crashed. This is usually due to an internal bug in the Prisma engine or an unexpected edge case in the database operation. Please check the Prisma logs for more details and consider reporting this issue to the Prisma team if it persists."
    }
  ];
  return {
    success: false,
    statusCode: status23.INTERNAL_SERVER_ERROR,
    message: "Prisma Client Rust Panic Error: The database engine crashed due to a fatal error.",
    errorSources
  };
};

// src/app/middleware/globalErrorHandler.ts
var globalErrorHandler = async (err, req, res, next) => {
  if (envVars.NODE_ENV === "development") {
    console.log("Error from Global Error Handler", err);
  }
  await deleteUploadedFilesFromGlobalErrorHandler(req);
  let errorSources = [];
  let statusCode = status24.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  let stack = void 0;
  if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    const simplifiedError = handlePrismaClientKnownRequestError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    const simplifiedError = handlePrismaClientUnknownRequestError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    const simplifiedError = handlePrismaClientValidationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientRustPanicError) {
    const simplifiedError = handlerPrismaClientRustPanicError();
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    const simplifiedError = handlePrismaClientInitializationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof z9.ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof AppError_default) {
    statusCode = err.statusCode;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message
      }
    ];
  } else if (err instanceof Error) {
    statusCode = status24.INTERNAL_SERVER_ERROR;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message
      }
    ];
  }
  const errorResponse = {
    success: false,
    message,
    errorSources,
    stack: envVars.NODE_ENV === "development" ? stack : void 0,
    error: envVars.NODE_ENV === "development" ? err.message : void 0
  };
  res.status(statusCode).json(errorResponse);
};

// src/app/middleware/notFound.ts
import status25 from "http-status";
var notFound = (req, res) => {
  res.status(status25.NOT_FOUND).json({
    success: false,
    message: `Route ${req.originalUrl} Not Found`
  });
};

// src/app.ts
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import path3 from "path";
import cors from "cors";
import qs from "qs";

// src/app/module/payment/payment.controller.ts
import status26 from "http-status";

// src/app/module/payment/payment.utils.ts
import PDFDocument2 from "pdfkit";
var generateInvoicePdf = async (data) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument2({
        size: "A4",
        margin: 50
      });
      const chunks = [];
      doc.on("data", (chunk) => {
        chunks.push(chunk);
      });
      doc.on("end", () => {
        resolve(Buffer.concat(chunks));
      });
      doc.on("error", (error) => {
        reject(error);
      });
      doc.fontSize(24).font("Helvetica-Bold").text("INVOICE", {
        align: "center"
      });
      doc.moveDown(0.5);
      doc.fontSize(10).font("Helvetica").text("GESUNDHEIT-IO", {
        align: "center"
      });
      doc.text("Your Health, Our Priority", { align: "center" });
      doc.moveDown(1);
      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(1);
      doc.fontSize(11).font("Helvetica-Bold").text("Invoice Information");
      doc.fontSize(10).font("Helvetica").text(`Invoice ID: ${data.invoiceId}`).text(`Payment Date: ${new Date(data.paymentDate).toLocaleDateString()}`).text(`Transaction ID: ${data.transactionId}`);
      doc.moveDown(0.8);
      doc.fontSize(11).font("Helvetica-Bold").text("Patient Information");
      doc.fontSize(10).font("Helvetica").text(`Name: ${data.patientName}`).text(`Email: ${data.patientEmail}`);
      doc.moveDown(0.8);
      doc.fontSize(11).font("Helvetica-Bold").text("Doctor Information");
      doc.fontSize(10).font("Helvetica").text(`Name: ${data.doctorName}`);
      doc.moveDown(0.8);
      doc.fontSize(11).font("Helvetica-Bold").text("Appointment Details");
      doc.fontSize(10).font("Helvetica").text(`Appointment Date: ${new Date(data.appointmentDate).toLocaleDateString()}`);
      doc.moveDown(1);
      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(1);
      const tableTop = doc.y;
      const col1X = 50;
      const col2X = 450;
      doc.fontSize(11).font("Helvetica-Bold").text("Payment Summary", col1X, tableTop);
      doc.moveDown(0.8);
      const headerY = doc.y;
      doc.fontSize(10).font("Helvetica-Bold");
      doc.text("Description", col1X, headerY);
      doc.text("Amount", col2X, headerY, { align: "right" });
      doc.moveTo(col1X, doc.y).lineTo(col2X + 80, doc.y).stroke();
      doc.moveDown(0.5);
      const amountY = doc.y;
      doc.fontSize(10).font("Helvetica");
      doc.text("Consultation Fee", col1X, amountY);
      doc.text(`${data.amount.toFixed(2)} EURO`, col2X, amountY, { align: "right" });
      doc.moveDown(0.8);
      const totalY = doc.y;
      doc.fontSize(11).font("Helvetica-Bold");
      doc.text("Total Amount", col1X, totalY);
      doc.text(`${data.amount.toFixed(2)} EURO`, col2X, totalY, { align: "right" });
      doc.moveTo(col1X, doc.y).lineTo(col2X + 80, doc.y).stroke();
      doc.moveDown(1.5);
      doc.fontSize(9).font("Helvetica").text("Thank you for choosing GESUNDHEIT-IO. This is an electronically generated invoice.", {
        align: "center"
      });
      doc.text("If you have any questions, please contact us at support@gesundheit-io.com", {
        align: "center"
      });
      doc.text("Payment processed securely through Stripe", {
        align: "center"
      });
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

// src/app/module/payment/payment.service.ts
var handlerStripeWebhookEvent = async (event) => {
  const existingPayment = await prisma.payment.findFirst({
    where: {
      stripeEventId: event.id
    }
  });
  if (existingPayment) {
    console.log(`Event ${event.id} already processed. Skipping`);
    return { message: `Event ${event.id} already processed. Skipping` };
  }
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const appointmentId = session.metadata?.appointmentId;
      const paymentId = session.metadata?.paymentId;
      if (!appointmentId || !paymentId) {
        console.error("\u26A0\uFE0F Missing metadata in webhook event");
        return { message: "Missing metadata" };
      }
      const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: {
          patient: true,
          doctor: true,
          schedule: true,
          payment: true
        }
      });
      if (!appointment) {
        console.error(`\u26A0\uFE0F Appointment ${appointmentId} not found. Payment may be for expired appointment.`);
        return { message: "Appointment not found" };
      }
      let pdfBuffer = null;
      const result = await prisma.$transaction(async (tx) => {
        const updatedAppointment = await tx.appointment.update({
          where: {
            id: appointmentId
          },
          data: {
            paymentStatus: session.payment_status === "paid" ? PaymentStatus.PAID : PaymentStatus.UNPAID
          }
        });
        let invoiceUrl = null;
        if (session.payment_status === "paid") {
          try {
            pdfBuffer = await generateInvoicePdf({
              invoiceId: appointment.payment?.id || paymentId,
              patientName: appointment.patient.name,
              patientEmail: appointment.patient.email,
              doctorName: appointment.doctor.name,
              appointmentDate: appointment.schedule.startDateTime.toString(),
              amount: appointment.payment?.amount || 0,
              transactionId: appointment.payment?.transactionId || "",
              paymentDate: (/* @__PURE__ */ new Date()).toISOString()
            });
            const cloudinaryResponse = await uploadFileToCloudinary(
              pdfBuffer,
              `ph-healthcare/invoices/invoice-${paymentId}-${Date.now()}.pdf`
            );
            invoiceUrl = cloudinaryResponse?.secure_url;
            console.log(`\u2705 Invoice PDF generated and uploaded for payment ${paymentId}`);
          } catch (pdfError) {
            console.error("\u274C Error generating/uploading invoice PDF:", pdfError);
          }
        }
        const updatedPayment = await tx.payment.update({
          where: {
            id: paymentId
          },
          data: {
            status: session.payment_status === "paid" ? PaymentStatus.PAID : PaymentStatus.UNPAID,
            paymentGatewayData: session,
            invoiceUrl,
            // Store invoice URL
            stripeEventId: event.id
            // Store event ID for idempotency
          }
        });
        return { updatedAppointment, updatedPayment, invoiceUrl };
      });
      if (session.payment_status === "paid" && result.invoiceUrl) {
        try {
          await sendEmail({
            to: appointment.patient.email,
            subject: `Payment Confirmation & Invoice - Appointment with ${appointment.doctor.name}`,
            templateName: "invoice",
            templateData: {
              patientName: appointment.patient.name,
              invoiceId: appointment.payment?.id || paymentId,
              transactionId: appointment.payment?.transactionId || "",
              paymentDate: (/* @__PURE__ */ new Date()).toLocaleDateString(),
              doctorName: appointment.doctor.name,
              appointmentDate: new Date(appointment.schedule.startDateTime).toLocaleDateString(),
              amount: appointment.payment?.amount || 0,
              invoiceUrl: result.invoiceUrl
            },
            attachments: [
              {
                filename: `Invoice-${paymentId}.pdf`,
                content: pdfBuffer || Buffer.from(""),
                // Attach PDF if generated, else empty buffer
                contentType: "application/pdf"
              }
            ]
          });
          console.log(`\u2705 Invoice email sent to ${appointment.patient.email}`);
        } catch (emailError) {
          console.error("\u274C Error sending invoice email:", emailError);
        }
      }
      console.log(`\u2705 Payment ${session.payment_status} for appointment ${appointmentId}`);
      break;
    }
    case "checkout.session.expired": {
      const session = event.data.object;
      console.log(`Checkout session ${session.id} expired. Marking associated payment as failed.`);
      break;
    }
    case "payment_intent.payment_failed": {
      const session = event.data.object;
      console.log(`Payment intent ${session.id} failed. Marking associated payment as failed.`);
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  return { message: `Webhook Event ${event.id} processed successfully` };
};
var PaymentService = {
  handlerStripeWebhookEvent
};

// src/app/module/payment/payment.controller.ts
var handleStripeWebhookEvent = catchAsync(async (req, res) => {
  const signature = req.headers["stripe-signature"];
  const webhookSecret = envVars.STRIPE.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) {
    console.error("Missing Stripe signature or webhook secret");
    return res.status(status26.BAD_REQUEST).json({ message: "Missing Stripe signature or webhook secret" });
  }
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (error) {
    console.error("Error processing Stripe webhook:", error);
    return res.status(status26.BAD_REQUEST).json({ message: "Error processing Stripe webhook" });
  }
  try {
    const result = await PaymentService.handlerStripeWebhookEvent(event);
    sendResponse(res, {
      httpStatusCode: status26.OK,
      success: true,
      message: "Stripe webhook event processed successfully",
      data: result
    });
  } catch (error) {
    console.error("Error handling Stripe webhook event:", error);
    sendResponse(res, {
      httpStatusCode: status26.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Error handling Stripe webhook event"
    });
  }
});
var PaymentController = {
  handleStripeWebhookEvent
};

// src/app.ts
import cron from "node-cron";
var app = express4();
app.set("query parser", (str) => qs.parse(str));
app.set("view engine", "ejs");
app.set("views", path3.resolve(process.cwd(), `src/app/templates/`));
app.post(
  "/webhook",
  express4.raw({ type: "application/json" }),
  PaymentController.handleStripeWebhookEvent
);
app.use(
  cors({
    origin: [
      envVars.FRONTEND_URL,
      envVars.BETTER_AUTH_URL,
      "http://localhost:3000",
      "http://localhost:5000"
    ],
    credentials: true,
    // Allow cookies to be sent in cross-origin requests
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"]
    // Allowed headers
  })
);
app.use("/api/auth", toNodeHandler(auth));
app.set("view engine", "ejs");
app.set("views", path3.resolve(process.cwd(), `src/app/templates/`));
app.use(
  cors({
    origin: [
      envVars.FRONTEND_URL,
      envVars.BETTER_AUTH_URL,
      "http://localhost:3000",
      "http://localhost:5000"
    ],
    credentials: true,
    // Allow cookies to be sent in cross-origin requests
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"]
    // Allowed headers
  })
);
app.use("/api/auth", toNodeHandler(auth));
app.use(express4.urlencoded({ extended: true }));
app.use(express4.json());
app.use(cookieParser());
cron.schedule("*/25 * * * *", async () => {
  try {
    console.log("Running cron job to cancel unpaid appointments...");
    await AppointmentService.cancelUnpaidAppointments();
  } catch (error) {
    console.error(
      "Error occurred while canceling unpaid appointments:",
      error.message
    );
  }
});
app.use("/api/v1", IndexRoutes);
app.get("/", (req, res) => {
  res.send("Hello, TypeScript + Express!");
});
app.get("/db-test", async (req, res) => {
  const specialty = await prisma.specialty.create({
    data: {
      title: "Cardiology"
    }
  });
  res.status(201).json({
    success: true,
    message: "API is working",
    data: specialty
  });
});
app.use(globalErrorHandler);
app.use(notFound);
var app_default = app;

// src/index.ts
var index_default = app_default;
export {
  index_default as default
};
