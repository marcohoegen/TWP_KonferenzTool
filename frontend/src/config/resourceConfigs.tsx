// Resource configuration for CRUD operations
import {
  useAdminAdminControllerFindAll,
  useAdminAdminControllerCreate,
  useAdminAdminControllerUpdate,
  useAdminAdminControllerRemove,
} from "../api/generate/hooks/AdminService.hooks";
import {
  useConferenceConferenceControllerFindAll,
  useConferenceConferenceControllerCreate,
  useConferenceConferenceControllerUpdate,
  useConferenceConferenceControllerRemove,
} from "../api/generate/hooks/ConferenceService.hooks";
import {
  usePresentationPresentationControllerFindAll,
  usePresentationPresentationControllerCreate,
  usePresentationPresentationControllerUpdate,
  usePresentationPresentationControllerRemove,
} from "../api/generate/hooks/PresentationService.hooks";
import {
  useRatingRatingControllerFindAll,
  useRatingRatingControllerCreate,
  useRatingRatingControllerUpdate,
  useRatingRatingControllerRemove,
} from "../api/generate/hooks/RatingService.hooks";
import {
  useUserUserControllerFindAll,
  useUserUserControllerCreate,
  useUserUserControllerUpdate,
  useUserUserControllerRemove,
} from "../api/generate/hooks/UserService.hooks";

export interface ResourceField {
  key: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "date"
    | "textarea"
    | "numberArray"
    | "select";
  placeholder?: string;
  options?: { value: string | number; label: string }[];
  required?: boolean;
}

export interface ResourceConfig {
  title: string;
  fields: ResourceField[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useFindAll: () => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useCreate: () => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useUpdate: () => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useRemove: () => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getCardTitle?: (item: any) => string;
}

export const adminConfig: ResourceConfig = {
  title: "Admin-Verwaltung",
  fields: [
    { key: "name", label: "Name", type: "text", required: true },
    { key: "email", label: "E-Mail", type: "email", required: true },
    { key: "password", label: "Passwort", type: "password", required: true },
  ],
  useFindAll: useAdminAdminControllerFindAll,
  useCreate: useAdminAdminControllerCreate,
  useUpdate: useAdminAdminControllerUpdate,
  useRemove: useAdminAdminControllerRemove,
  getCardTitle: (item) => item.name,
};

export const conferenceConfig: ResourceConfig = {
  title: "Konferenz-Verwaltung",
  fields: [
    { key: "name", label: "Konferenzname", type: "text", required: true },
    { key: "location", label: "Ort", type: "text", required: true },
    { key: "startDate", label: "Startdatum", type: "date", required: true },
    { key: "endDate", label: "Enddatum", type: "date", required: true },
  ],
  useFindAll: useConferenceConferenceControllerFindAll,
  useCreate: useConferenceConferenceControllerCreate,
  useUpdate: useConferenceConferenceControllerUpdate,
  useRemove: useConferenceConferenceControllerRemove,
  getCardTitle: (item) => item.name,
};

export const presentationConfig: ResourceConfig = {
  title: "Präsentations-Verwaltung",
  fields: [
    { key: "title", label: "Titel", type: "text", required: true },
    {
      key: "agendaPosition",
      label: "Agenda Position",
      type: "number",
      required: true,
    },
    {
      key: "conferenceId",
      label: "Konferenz ID",
      type: "number",
      required: true,
    },
    {
      key: "presenterIds",
      label: "Presenter ID",
      type: "numberArray",
      required: true,
    },
  ],
  useFindAll: usePresentationPresentationControllerFindAll,
  useCreate: usePresentationPresentationControllerCreate,
  useUpdate: usePresentationPresentationControllerUpdate,
  useRemove: usePresentationPresentationControllerRemove,
  getCardTitle: (item) => item.title,
};

export const ratingConfig: ResourceConfig = {
  title: "Bewertungs-Verwaltung",
  fields: [
    {
      key: "contentsRating",
      label: "Bewertung Inhalt (1-10)",
      type: "number",
      required: true,
    },
    {
      key: "styleRating",
      label: "Bewertung Style (1-10)",
      type: "number",
      required: true,
    },
    {
      key: "slidesRating",
      label: "Bewertung Slides (1-10)",
      type: "number",
      required: true,
    },
    { key: "userId", label: "Benutzer ID", type: "number", required: true },
    {
      key: "presentationId",
      label: "Präsentations ID",
      type: "number",
      required: true,
    },
  ],
  useFindAll: useRatingRatingControllerFindAll,
  useCreate: useRatingRatingControllerCreate,
  useUpdate: useRatingRatingControllerUpdate,
  useRemove: useRatingRatingControllerRemove,
  getCardTitle: (item) => `Bewertung #${item.id}`,
};

export const userConfig: ResourceConfig = {
  title: "Benutzer-Verwaltung",
  fields: [
    { key: "email", label: "E-Mail", type: "email", required: true },
    { key: "code", label: "Code", type: "text", required: true },
    {
      key: "conferenceId",
      label: "Konferenz ID",
      type: "number",
      required: true,
    },
  ],
  useFindAll: useUserUserControllerFindAll,
  useCreate: useUserUserControllerCreate,
  useUpdate: useUserUserControllerUpdate,
  useRemove: useUserUserControllerRemove,
  getCardTitle: (item) => item.email,
};
