import { EMAIL_TEMPLATE_EVENTS, type LocalizedEmailValue } from "./template-registry.types";

export const EMAIL_TEMPLATE_NAMES: Record<
  keyof typeof EMAIL_TEMPLATE_EVENTS,
  LocalizedEmailValue<string>
> = {
  WELCOME: {
    // English fallback until this optional feature is translated into Thai.
    th: "Welcome",
    en: "Welcome",
    pl: "Powitanie",
    de: "Willkommen",
    lt: "Sveiki atvykę",
    cs: "Uvítání",
    es: "Bienvenida",
    fr: "Bienvenue",
  },
  PASSWORD_RECOVERY: {
    // English fallback until this optional feature is translated into Thai.
    th: "Password recovery",
    en: "Password recovery",
    pl: "Odzyskiwanie hasła",
    de: "Passwortwiederherstellung",
    lt: "Slaptažodžio atkūrimas",
    cs: "Obnovení hesla",
    es: "Recuperación de contraseña",
    fr: "Récupération du mot de passe",
  },
  PASSWORD_REMINDER: {
    // English fallback until this optional feature is translated into Thai.
    th: "Password creation reminder",
    en: "Password creation reminder",
    pl: "Przypomnienie o utworzeniu hasła",
    de: "Erinnerung zur Passworterstellung",
    lt: "Priminimas sukurti slaptažodį",
    cs: "Připomenutí vytvoření hesla",
    es: "Recordatorio para crear la contraseña",
    fr: "Rappel de création du mot de passe",
  },
  USER_INVITE: {
    // English fallback until this optional feature is translated into Thai.
    th: "User invitation",
    en: "User invitation",
    pl: "Zaproszenie użytkownika",
    de: "Benutzereinladung",
    lt: "Naudotojo kvietimas",
    cs: "Pozvánka uživatele",
    es: "Invitación de usuario",
    fr: "Invitation d’un utilisateur",
  },
  USER_FIRST_LOGIN: {
    // English fallback until this optional feature is translated into Thai.
    th: "First login",
    en: "First login",
    pl: "Pierwsze logowanie",
    de: "Erste Anmeldung",
    lt: "Pirmasis prisijungimas",
    cs: "První přihlášení",
    es: "Primer inicio de sesión",
    fr: "Première connexion",
  },
  USER_ASSIGNED_TO_COURSE: {
    // English fallback until this optional feature is translated into Thai.
    th: "Course assignment",
    en: "Course assignment",
    pl: "Przypisanie do kursu",
    de: "Kurszuweisung",
    lt: "Priskyrimas kursui",
    cs: "Přiřazení ke kurzu",
    es: "Asignación a un curso",
    fr: "Affectation à un cours",
  },
  USER_SHORT_INACTIVITY: {
    // English fallback until this optional feature is translated into Thai.
    th: "Short inactivity reminder",
    en: "Short inactivity reminder",
    pl: "Przypomnienie o krótkiej nieaktywności",
    de: "Erinnerung bei kurzer Inaktivität",
    lt: "Trumpo neaktyvumo priminimas",
    cs: "Připomenutí krátké neaktivity",
    es: "Recordatorio de inactividad breve",
    fr: "Rappel d’inactivité courte",
  },
  USER_LONG_INACTIVITY: {
    // English fallback until this optional feature is translated into Thai.
    th: "Long inactivity reminder",
    en: "Long inactivity reminder",
    pl: "Przypomnienie o długiej nieaktywności",
    de: "Erinnerung bei längerer Inaktivität",
    lt: "Ilgo neaktyvumo priminimas",
    cs: "Připomenutí dlouhé neaktivity",
    es: "Recordatorio de inactividad prolongada",
    fr: "Rappel d’inactivité prolongée",
  },
  USER_FINISHED_CHAPTER: {
    // English fallback until this optional feature is translated into Thai.
    th: "Chapter completion",
    en: "Chapter completion",
    pl: "Ukończenie rozdziału",
    de: "Kapitelabschluss",
    lt: "Skyriaus užbaigimas",
    cs: "Dokončení kapitoly",
    es: "Finalización del capítulo",
    fr: "Achèvement du chapitre",
  },
  USER_FINISHED_COURSE: {
    // English fallback until this optional feature is translated into Thai.
    th: "Course completion",
    en: "Course completion",
    pl: "Ukończenie kursu",
    de: "Kursabschluss",
    lt: "Kurso užbaigimas",
    cs: "Dokončení kurzu",
    es: "Finalización del curso",
    fr: "Achèvement du cours",
  },
  CERTIFICATE_EXPIRATION_WARNING: {
    // English fallback until this optional feature is translated into Thai.
    th: "Certificate expiration warning",
    en: "Certificate expiration warning",
    pl: "Ostrzeżenie o wygaśnięciu certyfikatu",
    de: "Warnung vor Zertifikatsablauf",
    lt: "Įspėjimas apie sertifikato galiojimo pabaigą",
    cs: "Upozornění na vypršení certifikátu",
    es: "Aviso de caducidad del certificado",
    fr: "Avertissement d’expiration du certificat",
  },
  CERTIFICATE_EXPIRED: {
    // English fallback until this optional feature is translated into Thai.
    th: "Certificate expired",
    en: "Certificate expired",
    pl: "Certyfikat wygasł",
    de: "Zertifikat abgelaufen",
    lt: "Sertifikato galiojimas baigėsi",
    cs: "Platnost certifikátu vypršela",
    es: "Certificado caducado",
    fr: "Certificat expiré",
  },
  ADMIN_NEW_USER: {
    // English fallback until this optional feature is translated into Thai.
    th: "New user notification",
    en: "New user notification",
    pl: "Powiadomienie o nowym użytkowniku",
    de: "Benachrichtigung über neuen Benutzer",
    lt: "Pranešimas apie naują naudotoją",
    cs: "Oznámení o novém uživateli",
    es: "Notificación de nuevo usuario",
    fr: "Notification de nouvel utilisateur",
  },
  ADMIN_FINISHED_COURSE: {
    // English fallback until this optional feature is translated into Thai.
    th: "Admin course completion notification",
    en: "Admin course completion notification",
    pl: "Powiadomienie administratora o ukończeniu kursu",
    de: "Administratorbenachrichtigung zum Kursabschluss",
    lt: "Pranešimas administratoriui apie kurso užbaigimą",
    cs: "Oznámení správci o dokončení kurzu",
    es: "Notificación al administrador sobre la finalización del curso",
    fr: "Notification à l’administrateur de l’achèvement du cours",
  },
  ADMIN_OVERDUE_COURSES: {
    // English fallback until this optional feature is translated into Thai.
    th: "Overdue courses notification",
    en: "Overdue courses notification",
    pl: "Powiadomienie o zaległych kursach",
    de: "Benachrichtigung über überfällige Kurse",
    lt: "Pranešimas apie vėluojančius kursus",
    cs: "Oznámení o kurzech po termínu",
    es: "Notificación de cursos vencidos",
    fr: "Notification de cours en retard",
  },
  COURSE_DUE_DATE_REMINDER: {
    // English fallback until this optional feature is translated into Thai.
    th: "Course due-date reminder",
    en: "Course due-date reminder",
    pl: "Przypomnienie o terminie kursu",
    de: "Erinnerung an den Kurstermin",
    lt: "Kurso termino priminimas",
    cs: "Připomenutí termínu kurzu",
    es: "Recordatorio de fecha límite del curso",
    fr: "Rappel de l’échéance du cours",
  },
  MAGIC_LINK: {
    // English fallback until this optional feature is translated into Thai.
    th: "Magic link",
    en: "Magic link",
    pl: "Link do logowania",
    de: "Anmeldelink",
    lt: "Prisijungimo nuoroda",
    cs: "Přihlašovací odkaz",
    es: "Enlace de acceso",
    fr: "Lien de connexion",
  },
  COURSE_CHAT_MENTION: {
    // English fallback until this optional feature is translated into Thai.
    th: "Course chat mention",
    en: "Course chat mention",
    pl: "Wzmianka na czacie kursu",
    de: "Erwähnung im Kurschat",
    lt: "Paminėjimas kurso pokalbyje",
    cs: "Zmínka v chatu kurzu",
    es: "Mención en el chat del curso",
    fr: "Mention dans le chat du cours",
  },
  ANNOUNCEMENT: {
    // English fallback until this optional feature is translated into Thai.
    th: "Announcement",
    en: "Announcement",
    pl: "Ogłoszenie",
    de: "Ankündigung",
    lt: "Pranešimas",
    cs: "Oznámení",
    es: "Anuncio",
    fr: "Annonce",
  },
  LIVE_TRAINING_STARTED: {
    // English fallback until this optional feature is translated into Thai.
    th: "Live training started",
    en: "Live training started",
    pl: "Szkolenie na żywo rozpoczęte",
    de: "Live-Schulung gestartet",
    lt: "Tiesioginiai mokymai prasidėjo",
    cs: "Živé školení začalo",
    es: "Formación en directo iniciada",
    fr: "Formation en direct commencée",
  },
  LIVE_TRAINING_REMINDER: {
    // English fallback until this optional feature is translated into Thai.
    th: "Live training reminder",
    en: "Live training reminder",
    pl: "Przypomnienie o szkoleniu na żywo",
    de: "Erinnerung an die Live-Schulung",
    lt: "Tiesioginių mokymų priminimas",
    cs: "Připomenutí živého školení",
    es: "Recordatorio de formación en directo",
    fr: "Rappel de formation en direct",
  },
  LIVE_TRAINING_ENDED: {
    // English fallback until this optional feature is translated into Thai.
    th: "Live training ended",
    en: "Live training ended",
    pl: "Szkolenie na żywo zakończone",
    de: "Live-Schulung beendet",
    lt: "Tiesioginiai mokymai baigėsi",
    cs: "Živé školení skončilo",
    es: "Formación en directo finalizada",
    fr: "Formation en direct terminée",
  },
};
