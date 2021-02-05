import React from "react";
import { PresentationFile20 as PresentationFile } from "@carbon/icons-react";
import { UserSpeaker20 as UserSpeaker } from "@carbon/icons-react";
import { Notebook20 as Notebook } from "@carbon/icons-react";
import { RequestQuote20 as RequestQuote } from "@carbon/icons-react";
import { Microphone20 as Microphone } from "@carbon/icons-react";
import { EventsAlt20 as EventsAlt } from "@carbon/icons-react";

const typeIcons = {
  blog: <RequestQuote />,
  talk: <PresentationFile />,
  media: <UserSpeaker />,
  book: <Notebook />,
  podcast: <Microphone />,
  webinar: <EventsAlt />
};

export function plural(type) {
  let plural = type + "s";

  // Handle special cases
  if (plural === "medias") {
    plural = type;
  }
  return plural;
}

export function icon(type) {
  return typeIcons[type];
}
